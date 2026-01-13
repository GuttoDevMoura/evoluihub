-- Email outbox for relay
CREATE TABLE IF NOT EXISTS email_outbox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  template_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT,
  provider_message_id TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_outbox_status_scheduled_idx
  ON email_outbox (status, scheduled_at);

CREATE INDEX IF NOT EXISTS email_outbox_tenant_created_idx
  ON email_outbox (tenant_id, created_at);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_email_outbox'
  ) THEN
    CREATE TRIGGER set_timestamp_email_outbox
    BEFORE UPDATE ON email_outbox
    FOR EACH ROW
    EXECUTE FUNCTION set_timestamp();
  END IF;
END $$;
