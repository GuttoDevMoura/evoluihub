import { Pool } from 'pg';
import { request } from 'undici';

type OutboxRow = {
  id: number;
  tenant_id: number | null;
  to_email: string;
  to_name: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  attempts: number;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const RELAY_URL = process.env.EMAIL_RELAY_URL || '';
const RELAY_API_KEY = process.env.EMAIL_RELAY_API_KEY || '';
const FROM_EMAIL = process.env.EMAIL_FROM_EMAIL || 'evoluihub@example.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'EvoluiHub';
const LOOP_INTERVAL_MS = Number(process.env.WORKER_OUTBOX_INTERVAL_MS) || 10000;
const BATCH_SIZE = Number(process.env.WORKER_OUTBOX_BATCH) || 10;

async function recycleStuckSending() {
  await pool.query(
    `
      UPDATE email_outbox
      SET status = 'pending', updated_at = now()
      WHERE status = 'sending' AND updated_at < now() - interval '10 minutes'
    `,
  );
}

async function fetchPending(limit = BATCH_SIZE): Promise<OutboxRow[]> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(
      `
        SELECT id, tenant_id, to_email, to_name, subject, body_html, body_text, attempts
        FROM email_outbox
        WHERE status = 'pending' AND scheduled_at <= now()
        ORDER BY scheduled_at ASC
        LIMIT $1
        FOR UPDATE SKIP LOCKED
      `,
      [limit],
    );
    const jobs = res.rows.map(
      (r: any): OutboxRow => ({
        id: Number(r.id),
        tenant_id: r.tenant_id ? Number(r.tenant_id) : null,
        to_email: r.to_email,
        to_name: r.to_name,
        subject: r.subject,
        body_html: r.body_html,
        body_text: r.body_text,
        attempts: Number(r.attempts),
      }),
    );

    for (const job of jobs) {
      await client.query(
        `UPDATE email_outbox SET status = $2, attempts = attempts + 1, updated_at = now() WHERE id = $1`,
        [job.id, 'sending'],
      );
    }
    await client.query('COMMIT');
    return jobs;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function markStatus(
  id: number,
  status: 'sent' | 'failed',
  opts?: { providerMessageId?: string | null; lastError?: string | null },
) {
  await pool.query(
    `
      UPDATE email_outbox
      SET status = $2,
          provider_message_id = COALESCE($3, provider_message_id),
          last_error = $4,
          sent_at = CASE WHEN $2 = 'sent' THEN now() ELSE sent_at END,
          updated_at = now()
      WHERE id = $1
    `,
    [id, status, opts?.providerMessageId || null, opts?.lastError || null],
  );
}

async function sendEmail(job: OutboxRow) {
  if (!RELAY_URL) {
    throw new Error('EMAIL_RELAY_URL is not configured');
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (RELAY_API_KEY) {
    headers.Authorization = `Bearer ${RELAY_API_KEY}`;
  }
  const body = {
    from: { email: FROM_EMAIL, name: FROM_NAME },
    to: [{ email: job.to_email, name: job.to_name || undefined }],
    subject: job.subject,
    html: job.body_html,
    text: job.body_text || undefined,
  };

  const res = await request(RELAY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    throwOnError: false,
  });

  if (res.statusCode >= 200 && res.statusCode < 300) {
    try {
      const data = (await res.body.json()) as { id?: string; messageId?: string };
      return data.id || data.messageId || null;
    } catch {
      return null;
    }
  }

  const text = await res.body.text();
  throw new Error(text || `Relay error ${res.statusCode}`);
}

async function processLoop() {
  try {
    await recycleStuckSending();
    const jobs = await fetchPending();
    if (!jobs.length) {
      return;
    }
    let sent = 0;
    let failed = 0;
    for (const job of jobs) {
      try {
        const providerId = await sendEmail(job);
        await markStatus(job.id, 'sent', { providerMessageId: providerId });
        sent += 1;
      } catch (err: any) {
        await markStatus(job.id, 'failed', { lastError: err?.message || 'relay_error' });
        failed += 1;
      }
    }
    console.log(
      `[worker] outbox cycle processed=${jobs.length} sent=${sent} failed=${failed} interval=${LOOP_INTERVAL_MS}ms`,
    );
  } catch (err) {
    console.error('[worker] loop error', err);
  }
}

console.log('[worker] starting email outbox processor');
processLoop();
const timer = setInterval(processLoop, LOOP_INTERVAL_MS);

process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  clearInterval(timer);
  await pool.end();
  process.exit(0);
});

process.once('unhandledRejection', (err) => {
  console.error('[worker] unhandled rejection', err);
  process.exit(1);
});

process.once('uncaughtException', (err) => {
  console.error('[worker] uncaught exception', err);
  process.exit(1);
});
