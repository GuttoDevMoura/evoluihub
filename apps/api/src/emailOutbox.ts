import { pool } from './db';
import { sendEmailViaRelay } from './relay/mailer';

type OutboxRow = {
  id: number;
  tenant_id: number | null;
  template_name?: string | null;
  to_email: string;
  to_name: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  attempts: number;
};

export async function fetchPending(limit = 10): Promise<OutboxRow[]> {
  const res = await pool.query(
    `
      SELECT id, tenant_id, template_name, to_email, to_name, subject, body_html, body_text, attempts
      FROM email_outbox
      WHERE status = 'pending' AND scheduled_at <= now()
      ORDER BY scheduled_at ASC
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    `,
    [limit],
  );
  return res.rows.map((r) => ({
    id: Number(r.id),
    tenant_id: r.tenant_id ? Number(r.tenant_id) : null,
    template_name: r.template_name || null,
    to_email: r.to_email,
    to_name: r.to_name,
    subject: r.subject,
    body_html: r.body_html,
    body_text: r.body_text,
    attempts: Number(r.attempts),
  }));
}

export async function markStatus(
  id: number,
  status: 'sending' | 'sent' | 'failed' | 'pending',
  opts?: { providerMessageId?: string | null; lastError?: string | null; attemptsDelta?: number },
) {
  await pool.query(
    `
      UPDATE email_outbox
      SET status = $2,
          provider_message_id = COALESCE($3, provider_message_id),
          last_error = $4,
          attempts = attempts + COALESCE($5, 0),
          sent_at = CASE WHEN $2 = 'sent' THEN now() ELSE sent_at END,
          updated_at = now()
      WHERE id = $1
    `,
    [id, status, opts?.providerMessageId ?? null, opts?.lastError ?? null, opts?.attemptsDelta ?? 0],
  );
}

export async function processOutboxOnce(limit = 10) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const pendingRes = await client.query(
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
    const jobs = pendingRes.rows.map((r) => ({
      id: Number(r.id),
      tenant_id: r.tenant_id ? Number(r.tenant_id) : null,
      to_email: r.to_email,
      to_name: r.to_name,
      subject: r.subject,
      body_html: r.body_html,
      body_text: r.body_text,
      attempts: Number(r.attempts),
    }));

    for (const job of jobs) {
      await client.query('UPDATE email_outbox SET status = $2, attempts = attempts + 1 WHERE id = $1', [
        job.id,
        'sending',
      ]);
    }
    await client.query('COMMIT');

    for (const job of jobs) {
      try {
        const result = await sendEmailViaRelay({
          to: { email: job.to_email, name: job.to_name },
          subject: job.subject,
          html: job.body_html,
          text: job.body_text || undefined,
        });
        await markStatus(job.id, 'sent', { providerMessageId: result.providerMessageId || null });
      } catch (err: any) {
        await markStatus(job.id, 'failed', {
          lastError: err?.message || 'relay_error',
          attemptsDelta: 0,
        });
      }
    }
    return jobs.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
