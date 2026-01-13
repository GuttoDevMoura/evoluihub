-- Learning content: products, modules, lessons, media

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products (tenant_id, slug);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (tenant_id, status);

CREATE TABLE IF NOT EXISTS modules (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  position INT NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS modules_position_unique ON modules (product_id, position);
CREATE INDEX IF NOT EXISTS modules_tenant_idx ON modules (tenant_id);

CREATE TABLE IF NOT EXISTS lessons (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  content JSONB,
  position INT NOT NULL DEFAULT 0,
  duration_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS lessons_position_unique ON lessons (module_id, position);
CREATE INDEX IF NOT EXISTS lessons_tenant_idx ON lessons (tenant_id);

CREATE TABLE IF NOT EXISTS lesson_media (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS lesson_media_unique ON lesson_media (lesson_id, media_type, url);
CREATE INDEX IF NOT EXISTS lesson_media_tenant_idx ON lesson_media (tenant_id);

CREATE TABLE IF NOT EXISTS video_assets (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  duration_seconds INT,
  status TEXT NOT NULL DEFAULT 'processing',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS video_assets_provider_unique ON video_assets (tenant_id, provider, provider_id);
CREATE INDEX IF NOT EXISTS video_assets_lesson_idx ON video_assets (lesson_id);
