-- Demo data for member area
-- Uses placeholders: {{TENANT_ID}}

WITH course_row AS (
  INSERT INTO courses (tenant_id, title, description, status)
  VALUES ({{TENANT_ID}}, 'Curso Demo', 'Curso de demonstração', 'published')
  ON CONFLICT DO NOTHING
  RETURNING id
),
course_id AS (
  SELECT id FROM course_row
  UNION ALL
  SELECT id FROM courses WHERE tenant_id = {{TENANT_ID}} AND title = 'Curso Demo' LIMIT 1
),
lesson1 AS (
  INSERT INTO course_lessons (tenant_id, course_id, title, position, content)
  SELECT {{TENANT_ID}}, id, 'Aula 1: Introdução', 1, 'Introdução ao curso' FROM course_id
  ON CONFLICT (tenant_id, course_id, position) DO NOTHING
  RETURNING id
),
lesson1_id AS (
  SELECT id FROM lesson1
  UNION ALL
  SELECT id FROM course_lessons WHERE tenant_id = {{TENANT_ID}} AND position = 1 AND course_id = (SELECT id FROM course_id) LIMIT 1
),
lesson2 AS (
  INSERT INTO course_lessons (tenant_id, course_id, title, position, content)
  SELECT {{TENANT_ID}}, id, 'Aula 2: Fundamentos', 2, 'Fundamentos principais' FROM course_id
  ON CONFLICT (tenant_id, course_id, position) DO NOTHING
  RETURNING id
),
lesson2_id AS (
  SELECT id FROM lesson2
  UNION ALL
  SELECT id FROM course_lessons WHERE tenant_id = {{TENANT_ID}} AND position = 2 AND course_id = (SELECT id FROM course_id) LIMIT 1
),
lesson3 AS (
  INSERT INTO course_lessons (tenant_id, course_id, title, position, content)
  SELECT {{TENANT_ID}}, id, 'Aula 3: Prática', 3, 'Mãos na massa' FROM course_id
  ON CONFLICT (tenant_id, course_id, position) DO NOTHING
  RETURNING id
),
lesson3_id AS (
  SELECT id FROM lesson3
  UNION ALL
  SELECT id FROM course_lessons WHERE tenant_id = {{TENANT_ID}} AND position = 3 AND course_id = (SELECT id FROM course_id) LIMIT 1
),
enroll AS (
  INSERT INTO enrollments (tenant_id, user_id, course_id, status)
  SELECT {{TENANT_ID}}, 'member-demo', (SELECT id FROM course_id), 'active'
  ON CONFLICT (tenant_id, user_id, course_id) DO NOTHING
  RETURNING id
),
progress1 AS (
  INSERT INTO lesson_progress (tenant_id, user_id, course_id, lesson_id, status, progress_percent)
  SELECT {{TENANT_ID}}, 'member-demo', (SELECT id FROM course_id), (SELECT id FROM lesson1_id), 'completed', 100
  ON CONFLICT (tenant_id, user_id, lesson_id) DO UPDATE SET status = EXCLUDED.status, progress_percent = EXCLUDED.progress_percent, updated_at = NOW()
),
progress2 AS (
  INSERT INTO lesson_progress (tenant_id, user_id, course_id, lesson_id, status, progress_percent)
  SELECT {{TENANT_ID}}, 'member-demo', (SELECT id FROM course_id), (SELECT id FROM lesson2_id), 'started', 40
  ON CONFLICT (tenant_id, user_id, lesson_id) DO UPDATE SET status = EXCLUDED.status, progress_percent = EXCLUDED.progress_percent, updated_at = NOW()
)
INSERT INTO member_xp (tenant_id, user_id, xp_total, updated_at)
VALUES ({{TENANT_ID}}, 'member-demo', 250, NOW())
ON CONFLICT (tenant_id, user_id) DO UPDATE SET xp_total = EXCLUDED.xp_total, updated_at = EXCLUDED.updated_at;
