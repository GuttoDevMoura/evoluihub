-- Gamification levels 1..100 for the demo tenant

INSERT INTO gamification_levels (tenant_id, level, xp_required, rewards)
SELECT
  {{TENANT_ID}} AS tenant_id,
  lvl AS level,
  (lvl * lvl * 100) AS xp_required,
  '{}'::jsonb AS rewards
FROM generate_series(1, 100) AS lvl
ON CONFLICT (tenant_id, level) DO NOTHING;
