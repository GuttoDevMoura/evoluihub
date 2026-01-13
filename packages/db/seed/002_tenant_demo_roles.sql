-- Seed tenant roles and role_permissions for a demo tenant
-- Requires TENANT_ID and ADMIN_USER_ID env vars (handled by seed runner replacements)

INSERT INTO tenants (id, name, slug, status)
VALUES ({{TENANT_ID}}, 'Demo Tenant', 'demo', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (tenant_id, name, slug, description, is_default)
VALUES
  ({{TENANT_ID}}, 'Admin', 'admin', 'Administrador com acesso completo', FALSE),
  ({{TENANT_ID}}, 'Manager', 'manager', 'Gestor com poderes amplos', FALSE),
  ({{TENANT_ID}}, 'Editor', 'editor', 'Responsável por conteúdo', FALSE),
  ({{TENANT_ID}}, 'Support', 'support', 'Atendimento e suporte', FALSE),
  ({{TENANT_ID}}, 'Viewer', 'viewer', 'Somente leitura', FALSE)
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Platform admin (global)
INSERT INTO platform_admins (user_id)
VALUES ({{ADMIN_USER_ID}})
ON CONFLICT (user_id) DO NOTHING;

-- Admin: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON 1=1
WHERE r.slug = 'admin' AND r.tenant_id = {{TENANT_ID}}
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.read',
  'products.read', 'products.write',
  'content.read', 'content.write',
  'media.read', 'media.write',
  'member_areas.read', 'member_areas.write',
  'community.read', 'community.write', 'community.moderate',
  'members.read', 'members.write',
  'access_groups.read', 'access_groups.write',
  'cohorts.read', 'cohorts.write',
  'enrollments.read', 'enrollments.write',
  'progress.read',
  'reports.read', 'reports.export',
  'pay.read', 'pay.refund',
  'gamification.read', 'gamification.write',
  'comms.read', 'comms.write',
  'integrations.read', 'integrations.write',
  'webhooks.read', 'webhooks.write',
  'ai.read', 'ai.write',
  'settings.read'
)
WHERE r.slug = 'manager' AND r.tenant_id = {{TENANT_ID}}
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Editor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.read',
  'products.read', 'products.write',
  'content.read', 'content.write',
  'media.read', 'media.write',
  'member_areas.read', 'member_areas.write',
  'community.read', 'community.write',
  'reports.read'
)
WHERE r.slug = 'editor' AND r.tenant_id = {{TENANT_ID}}
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Support permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.read',
  'members.read', 'members.write',
  'access_groups.read', 'access_groups.write',
  'enrollments.read', 'enrollments.write',
  'progress.read',
  'reports.read',
  'comms.read'
)
WHERE r.slug = 'support' AND r.tenant_id = {{TENANT_ID}}
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Viewer permissions (read-only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'dashboard.read',
  'products.read',
  'content.read',
  'media.read',
  'member_areas.read',
  'community.read',
  'members.read',
  'access_groups.read',
  'cohorts.read',
  'enrollments.read',
  'progress.read',
  'reports.read',
  'pay.read',
  'gamification.read',
  'integrations.read',
  'webhooks.read',
  'ai.read',
  'settings.read'
)
WHERE r.slug = 'viewer' AND r.tenant_id = {{TENANT_ID}}
ON CONFLICT (role_id, permission_id) DO NOTHING;
