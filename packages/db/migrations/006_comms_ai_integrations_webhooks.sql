-- Communications, AI, integrations, webhooks

CREATE TABLE IF NOT EXISTS message_templates (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS message_templates_unique ON message_templates (tenant_id, name, channel);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS notification_preferences_unique ON notification_preferences (tenant_id, member_id, channel);

CREATE TABLE IF NOT EXISTS inapp_notifications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS inapp_notifications_status_idx ON inapp_notifications (tenant_id, member_id, status);

CREATE TABLE IF NOT EXISTS message_outbox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  template_id BIGINT REFERENCES message_templates(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INT NOT NULL DEFAULT 0,
  ref_id TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS message_outbox_status_idx ON message_outbox (tenant_id, status, scheduled_at);
CREATE UNIQUE INDEX IF NOT EXISTS message_outbox_ref_unique ON message_outbox (tenant_id, channel, ref_id) WHERE ref_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS campaigns (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  template_id BIGINT REFERENCES message_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns (tenant_id, status);

CREATE TABLE IF NOT EXISTS campaign_runs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS campaign_runs_status_idx ON campaign_runs (tenant_id, status);

CREATE TABLE IF NOT EXISTS ai_agents (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_agents_name_unique ON ai_agents (tenant_id, name);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id BIGINT REFERENCES ai_agents(id) ON DELETE SET NULL,
  member_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_conversations_agent_idx ON ai_conversations (tenant_id, agent_id);

CREATE TABLE IF NOT EXISTS ai_messages (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id BIGINT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_messages_conversation_idx ON ai_messages (conversation_id);

CREATE TABLE IF NOT EXISTS integrations (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS integrations_unique ON integrations (tenant_id, provider);

CREATE TABLE IF NOT EXISTS integration_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  integration_id BIGINT REFERENCES integrations(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS integration_logs_level_idx ON integration_logs (tenant_id, level);

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS webhook_endpoints_unique ON webhook_endpoints (tenant_id, url);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  endpoint_id BIGINT NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INT NOT NULL DEFAULT 0,
  last_error TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS webhook_deliveries_status_idx ON webhook_deliveries (tenant_id, status);
