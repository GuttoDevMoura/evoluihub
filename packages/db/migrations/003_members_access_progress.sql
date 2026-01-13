-- Members, access control, progress tracking

CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT,
  email TEXT,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS members_email_unique ON members (tenant_id, email);
CREATE INDEX IF NOT EXISTS members_status_idx ON members (tenant_id, status);

CREATE TABLE IF NOT EXISTS access_groups (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS access_groups_slug_unique ON access_groups (tenant_id, slug);

CREATE TABLE IF NOT EXISTS access_group_products (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  access_group_id BIGINT NOT NULL REFERENCES access_groups(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS access_group_products_unique ON access_group_products (access_group_id, product_id);
CREATE INDEX IF NOT EXISTS access_group_products_tenant_idx ON access_group_products (tenant_id);

CREATE TABLE IF NOT EXISTS access_group_members (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  access_group_id BIGINT NOT NULL REFERENCES access_groups(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS access_group_members_unique ON access_group_members (access_group_id, member_id);
CREATE INDEX IF NOT EXISTS access_group_members_tenant_idx ON access_group_members (tenant_id);

CREATE TABLE IF NOT EXISTS cohorts (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS cohorts_name_unique ON cohorts (tenant_id, name);

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cohort_id BIGINT REFERENCES cohorts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_unique ON enrollments (member_id, product_id);
CREATE INDEX IF NOT EXISTS enrollments_tenant_status_idx ON enrollments (tenant_id, status);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_unique ON lesson_progress (member_id, lesson_id);
CREATE INDEX IF NOT EXISTS lesson_progress_tenant_status_idx ON lesson_progress (tenant_id, status);

CREATE TABLE IF NOT EXISTS product_progress (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_progress_unique ON product_progress (member_id, product_id);
CREATE INDEX IF NOT EXISTS product_progress_tenant_status_idx ON product_progress (tenant_id, status);
