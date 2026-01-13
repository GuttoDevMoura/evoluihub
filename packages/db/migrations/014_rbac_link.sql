-- Align tenant RBAC with app_users linkage

-- tenant_users: add app_user_id and unique constraint
ALTER TABLE tenant_users
  ADD COLUMN IF NOT EXISTS app_user_id BIGINT REFERENCES app_users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tenant_users_app_user_unique'
      AND conrelid = 'tenant_users'::regclass
  ) THEN
    ALTER TABLE tenant_users ADD CONSTRAINT tenant_users_app_user_unique UNIQUE (tenant_id, app_user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tenant_users_tenant_app_user_idx
  ON tenant_users (tenant_id, app_user_id);

-- user_roles: add tenant_id and unique constraint including tenant
ALTER TABLE user_roles
  ADD COLUMN IF NOT EXISTS tenant_id INT;

UPDATE user_roles ur
SET tenant_id = tu.tenant_id
FROM tenant_users tu
WHERE tu.id = ur.tenant_user_id
  AND (ur.tenant_id IS NULL OR ur.tenant_id <> tu.tenant_id);

ALTER TABLE user_roles
  ALTER COLUMN tenant_id SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_unique'
      AND conrelid = 'user_roles'::regclass
  ) THEN
    ALTER TABLE user_roles DROP CONSTRAINT user_roles_unique;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_tenant_unique'
      AND conrelid = 'user_roles'::regclass
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_tenant_unique UNIQUE (tenant_id, tenant_user_id, role_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS user_roles_tenant_user_idx
  ON user_roles (tenant_id, tenant_user_id);
