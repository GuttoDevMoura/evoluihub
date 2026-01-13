-- Gamification tables

CREATE TABLE IF NOT EXISTS gamification_levels (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  level INT NOT NULL,
  xp_required INT NOT NULL,
  rewards JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS gamification_levels_unique ON gamification_levels (tenant_id, level);

CREATE TABLE IF NOT EXISTS gamification_profiles (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  level_id BIGINT REFERENCES gamification_levels(id) ON DELETE SET NULL,
  xp INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS gamification_profiles_unique ON gamification_profiles (tenant_id, member_id);

CREATE TABLE IF NOT EXISTS gamification_ledger (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  reason TEXT,
  source TEXT,
  ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gamification_ledger_member_idx ON gamification_ledger (tenant_id, member_id);

CREATE TABLE IF NOT EXISTS gamification_rules (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS gamification_rules_unique ON gamification_rules (tenant_id, name);

CREATE TABLE IF NOT EXISTS badges (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS badges_unique ON badges (tenant_id, slug);

CREATE TABLE IF NOT EXISTS challenges (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  reward_points INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS challenges_unique ON challenges (tenant_id, name);
