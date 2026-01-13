-- Link demo app users to tenant roles
-- Requires {{TENANT_ID}} placeholder

WITH admin_user AS (
  SELECT id FROM app_users WHERE tenant_id = {{TENANT_ID}} AND email = 'admin@evoluihub.local' LIMIT 1
),
member_user AS (
  SELECT id FROM app_users WHERE tenant_id = {{TENANT_ID}} AND email = 'member@evoluihub.local' LIMIT 1
),
tenant_admin AS (
  INSERT INTO tenant_users (tenant_id, app_user_id, user_id, email, status)
  SELECT {{TENANT_ID}}, (SELECT id FROM admin_user), 'admin-root', 'admin@evoluihub.local', 'active'
  WHERE (SELECT id FROM admin_user) IS NOT NULL
  ON CONFLICT (tenant_id, app_user_id) DO NOTHING
  RETURNING id
),
tenant_admin_id AS (
  SELECT id FROM tenant_admin
  UNION ALL
  SELECT id FROM tenant_users WHERE tenant_id = {{TENANT_ID}} AND app_user_id = (SELECT id FROM admin_user) LIMIT 1
),
tenant_member AS (
  INSERT INTO tenant_users (tenant_id, app_user_id, user_id, email, status)
  SELECT {{TENANT_ID}}, (SELECT id FROM member_user), 'member-demo', 'member@evoluihub.local', 'active'
  WHERE (SELECT id FROM member_user) IS NOT NULL
  ON CONFLICT (tenant_id, app_user_id) DO NOTHING
  RETURNING id
),
tenant_member_id AS (
  SELECT id FROM tenant_member
  UNION ALL
  SELECT id FROM tenant_users WHERE tenant_id = {{TENANT_ID}} AND app_user_id = (SELECT id FROM member_user) LIMIT 1
),
admin_role AS (
  SELECT id FROM roles WHERE tenant_id = {{TENANT_ID}} AND slug = 'admin' LIMIT 1
),
manager_role AS (
  SELECT id FROM roles WHERE tenant_id = {{TENANT_ID}} AND slug = 'manager' LIMIT 1
),
viewer_role AS (
  SELECT id FROM roles WHERE tenant_id = {{TENANT_ID}} AND slug = 'viewer' LIMIT 1
)
INSERT INTO user_roles (tenant_id, tenant_user_id, role_id, created_at)
VALUES
  ({{TENANT_ID}}, (SELECT id FROM tenant_admin_id), COALESCE((SELECT id FROM admin_role), (SELECT id FROM manager_role)), now()),
  ({{TENANT_ID}}, (SELECT id FROM tenant_member_id), (SELECT id FROM viewer_role), now())
ON CONFLICT (tenant_id, tenant_user_id, role_id) DO NOTHING;
