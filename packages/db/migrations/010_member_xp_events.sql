-- member_xp_events: track XP grants idempotently
CREATE TABLE IF NOT EXISTS member_xp_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL, -- lesson_completed | course_completed
  ref_id TEXT NOT NULL,
  xp_delta INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS member_xp_events_unique
  ON member_xp_events (tenant_id, user_id, kind, ref_id);

CREATE INDEX IF NOT EXISTS member_xp_events_tenant_user_idx
  ON member_xp_events (tenant_id, user_id);
