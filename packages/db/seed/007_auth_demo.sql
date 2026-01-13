-- Auth demo users for tenant {{TENANT_ID}}

WITH admin_row AS (
  INSERT INTO app_users (tenant_id, email, name, status)
  VALUES ({{TENANT_ID}}, 'admin@evoluihub.local', 'Admin Demo', 'active')
  ON CONFLICT (tenant_id, email) DO NOTHING
  RETURNING id
),
admin_id AS (
  SELECT id FROM admin_row
  UNION ALL
  SELECT id FROM app_users WHERE tenant_id = {{TENANT_ID}} AND email = 'admin@evoluihub.local' LIMIT 1
),
member_row AS (
  INSERT INTO app_users (tenant_id, email, name, status)
  VALUES ({{TENANT_ID}}, 'member@evoluihub.local', 'Member Demo', 'active')
  ON CONFLICT (tenant_id, email) DO NOTHING
  RETURNING id
),
member_id AS (
  SELECT id FROM member_row
  UNION ALL
  SELECT id FROM app_users WHERE tenant_id = {{TENANT_ID}} AND email = 'member@evoluihub.local' LIMIT 1
)
INSERT INTO app_user_credentials (user_id, password_hash, updated_at)
VALUES
  ((SELECT id FROM admin_id), {{ADMIN_PASSWORD_HASH}}, now()),
  ((SELECT id FROM member_id), {{MEMBER_PASSWORD_HASH}}, now())
ON CONFLICT (user_id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now();
