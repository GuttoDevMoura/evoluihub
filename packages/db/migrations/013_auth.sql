-- Authentication core tables

CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS app_user_credentials (
  user_id BIGINT PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_refresh_sessions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  user_agent TEXT,
  ip TEXT,
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_refresh_sessions_tenant_user_idx
  ON app_refresh_sessions (tenant_id, user_id);

CREATE INDEX IF NOT EXISTS app_refresh_sessions_token_hash_idx
  ON app_refresh_sessions (refresh_token_hash);
