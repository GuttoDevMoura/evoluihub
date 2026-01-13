-- Gamification advanced demo seed
-- Uses placeholder {{TENANT_ID}}

-- Achievements catalogue
INSERT INTO achievements (tenant_id, code, name, description, icon, kind, threshold, status)
VALUES
  ({{TENANT_ID}}, 'FIRST_LESSON', 'Primeira Aula', 'Complete sua primeira aula', 'trophy', 'milestone', 1, 'active'),
  ({{TENANT_ID}}, 'FIRST_COURSE', 'Primeiro Curso', 'Complete seu primeiro curso', 'medal', 'completion', 1, 'active'),
  ({{TENANT_ID}}, 'LESSON_3', 'Trio de Aulas', 'Complete 3 aulas', 'flame', 'milestone', 3, 'active'),
  ({{TENANT_ID}}, 'LESSON_10', 'Maratona 10', 'Complete 10 aulas', 'star', 'milestone', 10, 'active'),
  ({{TENANT_ID}}, 'STREAK_3', 'Streak 3 dias', 'Estude por 3 dias seguidos', 'fire', 'streak', 3, 'active'),
  ({{TENANT_ID}}, 'STREAK_7', 'Streak 7 dias', 'Estude por 7 dias seguidos', 'rocket', 'streak', 7, 'active')
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Challenges catalogue
INSERT INTO challenges (tenant_id, code, name, description, kind, target, status)
VALUES
  ({{TENANT_ID}}, 'WEEK_LESSONS_5', '5 aulas na semana', 'Complete 5 aulas em 7 dias', 'lesson_count', 5, 'active'),
  ({{TENANT_ID}}, 'XP_TARGET_500', 'Meta de XP 500', 'Alcance 500 XP totais', 'xp_target', 500, 'active'),
  ({{TENANT_ID}}, 'COMPLETE_COURSE_1', 'Concluir 1 curso', 'Conclua um curso completo', 'course_complete', 1, 'active')
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Member challenge enrollment (demo user)
INSERT INTO member_challenges (tenant_id, user_id, challenge_id, progress, status)
SELECT {{TENANT_ID}}, 'member-demo', c.id, 0, 'active'
FROM challenges c
WHERE c.tenant_id = {{TENANT_ID}}
ON CONFLICT (tenant_id, user_id, challenge_id) DO NOTHING;
