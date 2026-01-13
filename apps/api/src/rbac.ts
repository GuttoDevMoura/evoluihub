import { pool } from './db';

export async function getTenantUserId(
  tenantId: number,
  appUserId: number,
): Promise<number | null> {
  const res = await pool.query(
    `
      SELECT id
      FROM tenant_users
      WHERE tenant_id = $1 AND app_user_id = $2 AND status = 'active'
      LIMIT 1
    `,
    [tenantId, appUserId],
  );
  return res.rows[0]?.id ?? null;
}

export async function getTenantUser(
  tenantId: number,
  appUserId: number,
): Promise<{ id: number; user_id: string | null } | null> {
  const res = await pool.query(
    `
      SELECT id, user_id
      FROM tenant_users
      WHERE tenant_id = $1 AND app_user_id = $2 AND status = 'active'
      LIMIT 1
    `,
    [tenantId, appUserId],
  );
  if (!res.rows[0]) return null;
  return { id: Number(res.rows[0].id), user_id: res.rows[0].user_id };
}

export async function ensureTenantUser(
  tenantId: number,
  appUserId: number,
  email: string,
): Promise<{ id: number; user_id: string }> {
  const res = await pool.query(
    `
      INSERT INTO tenant_users (tenant_id, app_user_id, user_id, email, status)
      VALUES ($1, $2, $3, $3, 'active')
      ON CONFLICT (tenant_id, app_user_id) DO UPDATE SET status = 'active'
      RETURNING id, user_id
    `,
    [tenantId, appUserId, email],
  );
  return { id: Number(res.rows[0].id), user_id: res.rows[0].user_id };
}

export async function getUserRoles(
  tenantId: number,
  tenantUserId: number,
): Promise<{ id: number; name: string; slug: string }[]> {
  const res = await pool.query(
    `
      SELECT r.id, r.name, r.slug
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.tenant_id = $1 AND ur.tenant_user_id = $2
    `,
    [tenantId, tenantUserId],
  );
  return res.rows.map((row) => ({ id: Number(row.id), name: row.name, slug: row.slug }));
}

export async function getUserPermissions(
  tenantId: number,
  roleIds: number[],
): Promise<Set<string>> {
  if (!roleIds.length) return new Set();
  const res = await pool.query(
    `
      SELECT DISTINCT p.code
      FROM role_permissions rp
      JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = ANY($1::bigint[])
    `,
    [roleIds],
  );
  return new Set(res.rows.map((r: { code: string }) => r.code));
}

export async function isPlatformAdmin(appUserId: number | string): Promise<boolean> {
  // Primary: match by app_user_id
  const res = await pool.query(
    `
      SELECT 1
      FROM platform_admins
      WHERE app_user_id = $1
      LIMIT 1
    `,
    [Number(appUserId)],
  );
  if (res.rowCount && res.rowCount > 0) return true;

  // Fallback: match by text user_id when provided as string (legacy)
  const fallbackRes = await pool.query(
    `
      SELECT 1
      FROM platform_admins
      WHERE user_id = $1
      LIMIT 1
    `,
    [String(appUserId)],
  );
  return (fallbackRes.rowCount ?? 0) > 0;
}
