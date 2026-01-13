import { Pool } from 'pg';
import { pool } from './db';
import { processOutboxOnce } from './emailOutbox';

type TemplateRecord = {
  subject: string;
  body_html: string;
  body_text?: string | null;
  status?: string | null;
};

export function renderTemplate(str: string, vars: Record<string, string | number | null | undefined>) {
  return (str || '').replace(/\{(\w+)\}/g, (_match, key) => {
    const val = vars[key];
    return val === undefined || val === null ? '' : String(val);
  });
}

export async function getTemplate(
  tenantId: number,
  name: string,
  client: Pool | typeof pool = pool,
): Promise<TemplateRecord | null> {
  const res = await client.query(
    `
      SELECT subject, body AS body_html, metadata
      FROM message_templates
      WHERE tenant_id = $1 AND name = $2 AND channel = 'email'
      ORDER BY id DESC
      LIMIT 1
    `,
    [tenantId, name],
  );
  if (!res.rowCount) return null;
  const row = res.rows[0];
  const meta = row.metadata || {};
  return {
    subject: row.subject || '',
    body_html: row.body_html || '',
    body_text: meta.body_text || meta.bodyText || null,
    status: meta.status || null,
  };
}

type EnqueueParams = {
  tenantId: number;
  toEmail: string;
  toName?: string | null;
  templateName: string;
  vars: Record<string, any>;
  scheduledAt?: Date;
};

export async function enqueueEmailFromTemplate(params: EnqueueParams) {
  const template = await getTemplate(params.tenantId, params.templateName);
  if (!template) {
    throw new Error(`template_not_found:${params.templateName}`);
  }
  const subject = renderTemplate(template.subject, params.vars);
  const html = renderTemplate(template.body_html, params.vars);
  const text = template.body_text ? renderTemplate(template.body_text, params.vars) : null;

  const res = await pool.query(
    `
      INSERT INTO email_outbox (tenant_id, template_name, to_email, to_name, subject, body_html, body_text, status, scheduled_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', COALESCE($8, now()))
      RETURNING id
    `,
    [
      params.tenantId,
      params.templateName,
      params.toEmail,
      params.toName || null,
      subject,
      html,
      text,
      params.scheduledAt || null,
    ],
  );
  return Number(res.rows[0].id);
}

export async function sendTemplatedEmailNow(params: EnqueueParams) {
  const id = await enqueueEmailFromTemplate(params);
  await processOutboxOnce(1);
  return id;
}
