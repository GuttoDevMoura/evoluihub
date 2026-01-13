-- Achievements catalogue per tenant
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  kind TEXT NOT NULL,
  threshold INT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, code)
);

-- Member achievements granted
CREATE TABLE IF NOT EXISTS member_achievements (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, user_id, achievement_id)
);
CREATE INDEX IF NOT EXISTS member_achievements_tenant_user_idx
  ON member_achievements (tenant_id, user_id);

-- Challenges configuration
CREATE TABLE IF NOT EXISTS challenges (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  kind TEXT NOT NULL,
  target INT NOT NULL,
  start_at TIMESTAMPTZ DEFAULT now(),
  end_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE (tenant_id, code)
);

-- Member challenge progress
CREATE TABLE IF NOT EXISTS member_challenges (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, user_id, challenge_id)
);
CREATE INDEX IF NOT EXISTS member_challenges_tenant_user_idx
  ON member_challenges (tenant_id, user_id);

-- Daily activity for streaks
CREATE TABLE IF NOT EXISTS member_daily_activity (
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  activity_date DATE NOT NULL,
  completed_lessons INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id, activity_date)
);
CREATE INDEX IF NOT EXISTS member_daily_activity_tenant_user_idx
  ON member_daily_activity (tenant_id, user_id);
