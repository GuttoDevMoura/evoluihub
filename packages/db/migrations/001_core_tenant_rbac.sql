-- Core tenant and RBAC

CREATE TABLE IF NOT EXISTS tenants (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS roles_slug_unique ON roles (tenant_id, slug);
CREATE INDEX IF NOT EXISTS roles_tenant_idx ON roles (tenant_id);

CREATE TABLE IF NOT EXISTS tenant_users (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  email TEXT,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS tenant_users_unique_user ON tenant_users (tenant_id, user_id);
CREATE INDEX IF NOT EXISTS tenant_users_status_idx ON tenant_users (tenant_id, status);

CREATE TABLE IF NOT EXISTS platform_admins (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_unique ON role_permissions (role_id, permission_id);

CREATE TABLE IF NOT EXISTS user_roles (
  id BIGSERIAL PRIMARY KEY,
  tenant_user_id BIGINT NOT NULL REFERENCES tenant_users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_roles_unique ON user_roles (tenant_user_id, role_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles (role_id);
