-- Member areas and community

CREATE TABLE IF NOT EXISTS member_areas (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS member_areas_slug_unique ON member_areas (tenant_id, slug);

CREATE TABLE IF NOT EXISTS member_area_products (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_area_id BIGINT NOT NULL REFERENCES member_areas(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS member_area_products_unique ON member_area_products (member_area_id, product_id);
CREATE INDEX IF NOT EXISTS member_area_products_tenant_idx ON member_area_products (tenant_id);

CREATE TABLE IF NOT EXISTS community_spaces (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_area_id BIGINT NOT NULL REFERENCES member_areas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_spaces_slug_unique ON community_spaces (member_area_id, slug);
CREATE INDEX IF NOT EXISTS community_spaces_tenant_idx ON community_spaces (tenant_id);

CREATE TABLE IF NOT EXISTS community_categories (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  space_id BIGINT NOT NULL REFERENCES community_spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_categories_slug_unique ON community_categories (space_id, slug);
CREATE INDEX IF NOT EXISTS community_categories_tenant_idx ON community_categories (tenant_id);

CREATE TABLE IF NOT EXISTS community_posts (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  space_id BIGINT NOT NULL REFERENCES community_spaces(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES community_categories(id) ON DELETE SET NULL,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_posts_tenant_status_idx ON community_posts (tenant_id, status);
CREATE INDEX IF NOT EXISTS community_posts_space_idx ON community_posts (space_id);

CREATE TABLE IF NOT EXISTS community_reactions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_reactions_unique ON community_reactions (post_id, member_id, reaction_type);
CREATE INDEX IF NOT EXISTS community_reactions_tenant_idx ON community_reactions (tenant_id);

CREATE TABLE IF NOT EXISTS community_reports (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_reports_status_idx ON community_reports (tenant_id, status);
