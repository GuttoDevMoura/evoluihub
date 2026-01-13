import { request } from 'undici';

type SendEmailInput = {
  to: { email: string; name?: string | null };
  subject: string;
  html: string;
  text?: string | null;
  headers?: Record<string, string>;
};

export async function sendEmailViaRelay(input: SendEmailInput) {
  const relayUrl = process.env.EMAIL_RELAY_URL;
  const apiKey = process.env.EMAIL_RELAY_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_EMAIL || 'evoluihub@example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'EvoluiHub';

  if (!relayUrl) {
    throw new Error('EMAIL_RELAY_URL is not configured');
  }

  const payload = {
    from: { email: fromEmail, name: fromName },
    to: [{ email: input.to.email, name: input.to.name || undefined }],
    subject: input.subject,
    html: input.html,
    text: input.text || undefined,
  };

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...(input.headers || {}),
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const resp = await request(relayUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    bodyTimeout: 15000,
  });

  if (resp.statusCode >= 400) {
    const body = await resp.body.text();
    throw new Error(`Relay error ${resp.statusCode}: ${body}`);
  }

  try {
    const json = (await resp.body.json()) as Record<string, any>;
    return { providerMessageId: (json && (json.id || json.messageId)) || null };
  } catch {
    return { providerMessageId: null };
  }
}
