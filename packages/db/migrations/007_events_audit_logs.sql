-- Events and logging

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  ref_id TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_tenant_idx ON events (tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS events_ref_unique ON events (event_name, ref_id) WHERE ref_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs (tenant_id, entity_type, entity_id);

CREATE TABLE IF NOT EXISTS app_error_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT REFERENCES tenants(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_error_logs_service_idx ON app_error_logs (tenant_id, service);
