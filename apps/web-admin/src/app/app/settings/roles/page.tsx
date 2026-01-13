"use client";

import { useEffect, useState } from "react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { getPlatformRoles, getPlatformPermissions, type PlatformRole, type PermissionCatalog } from "@/lib/api";

export default function SettingsRolesPage() {
  const { session } = useAdminSession();
  const tenantSlug = session?.tenant.slug || "demo";
  const [roles, setRoles] = useState<PlatformRole[]>([]);
  const [catalog, setCatalog] = useState<PermissionCatalog>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [r, p] = await Promise.all([getPlatformRoles(tenantSlug), getPlatformPermissions()]);
        setRoles(r);
        setCatalog(p);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar roles");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [tenantSlug]);

  return (
    <RequireAdmin>
      <RequirePermission permissionKey="users.roles">
        <div className="space-y-4 p-6">
          <div>
            <h1 className="text-2xl font-semibold">Configurações · Papéis & Permissões</h1>
            <p className="text-sm text-gray-600">Leitura das roles e permissões do tenant {tenantSlug}.</p>
          </div>
          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          {loading && <div className="text-sm text-gray-600">Carregando roles…</div>}
          {!loading && (
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.roleId} className="rounded border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{role.roleName}</div>
                      <div className="text-xs text-gray-600">{role.roleSlug}</div>
                    </div>
                    <button
                      className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-500"
                      disabled
                      title="Edição em breve"
                    >
                      Editar (em breve)
                    </button>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Permissões</div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length ? (
                      role.permissions.map((p) => (
                        <span key={p.code} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                          {p.code}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-600">Nenhuma permissão associada.</span>
                    )}
                  </div>
                </div>
              ))}
              {!roles.length && (
                <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-700">
                  Nenhuma role encontrada para este tenant.
                </div>
              )}
            </div>
          )}
          {!loading && catalog.length > 0 && (
            <div className="rounded border border-gray-200 bg-white p-4 space-y-2">
              <div className="text-sm font-semibold text-gray-900">Catálogo de permissões</div>
              <div className="flex flex-wrap gap-2">
                {catalog.map((p) => (
                  <span key={p.code} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-800">
                    {p.code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
