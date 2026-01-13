-- Password reset tokens for invites/reset flows
CREATE TABLE IF NOT EXISTS app_password_resets (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  app_user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS app_password_resets_tenant_user_idx
  ON app_password_resets (tenant_id, app_user_id);
