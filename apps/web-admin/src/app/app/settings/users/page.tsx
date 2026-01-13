"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import {
  assignUserRole,
  getPlatformRoles,
  getPlatformUsers,
  type PlatformRole,
  type PlatformUser,
} from "@/lib/api";

export default function SettingsUsersPage() {
  const { session } = useAdminSession();
  const tenantSlug = session?.tenant.slug || "demo";
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [roles, setRoles] = useState<PlatformRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<Record<number, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(session?.user?.name || "");
  const [profileEmail, setProfileEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const load = async () => {
    if (!tenantSlug) return;
    setLoading(true);
    setError(null);
    try {
      const [u, r] = await Promise.all([getPlatformUsers(tenantSlug), getPlatformRoles(tenantSlug)]);
      setUsers(u);
      setRoles(r);
    } catch (err: any) {
      setError(err?.message || "Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [tenantSlug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#profile") {
      profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const rolesBySlug = useMemo(() => new Set(roles.map((r) => r.roleSlug)), [roles]);
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAssign = async (tenantUserId: number) => {
    const roleSlug = selectedRole[tenantUserId];
    if (!roleSlug) return;
    setSaving(tenantUserId);
    setError(null);
    try {
      await assignUserRole(tenantUserId, roleSlug);
      await load();
    } catch (err: any) {
      setError(err?.message || "Falha ao atribuir role");
    } finally {
      setSaving(null);
    }
  };

  return (
    <RequireAdmin>
      <RequirePermission permissionKey="users.invite">
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Configurações · Usuários</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie usuários do tenant {tenantSlug}. RBAC real (roles/permissões).
            </p>
          </div>

          <div ref={profileRef} id="profile" className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Meu perfil</h2>
            <p className="text-sm text-gray-600">Ajuste suas informações básicas e foto de perfil (somente visual).</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Preview avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">Sem foto</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-fit">
                  <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                  Alterar foto
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700" htmlFor="profile-name">
                      Nome
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700" htmlFor="profile-email">
                      E-mail
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  Salvamento real do perfil será implementado em etapa posterior.
                </div>
              </div>
            </div>
          </div>

          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          {loading && <div className="text-sm text-gray-600">Carregando usuários…</div>}
          {!loading && (
            <div className="overflow-auto rounded border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-3 py-2">E-mail</th>
                    <th className="px-3 py-2">Roles</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 w-64">Adicionar role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.tenantUserId} className="border-t border-gray-100">
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2">{user.roles.length ? user.roles.join(", ") : "—"}</td>
                      <td className="px-3 py-2">{user.status}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded border border-gray-300 px-3 py-2 text-sm"
                            value={selectedRole[user.tenantUserId] || ""}
                            onChange={(e) =>
                              setSelectedRole((prev) => ({ ...prev, [user.tenantUserId]: e.target.value }))
                            }
                          >
                            <option value="">Selecionar</option>
                            {roles.map((r) => (
                              <option key={r.roleId} value={r.roleSlug}>
                                {r.roleSlug}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => void handleAssign(user.tenantUserId)}
                            disabled={!rolesBySlug.size || !selectedRole[user.tenantUserId] || saving === user.tenantUserId}
                            className="rounded bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {saving === user.tenantUserId ? "Salvando…" : "Adicionar role"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td className="px-3 py-4 text-sm text-gray-600" colSpan={4}>
                        Nenhum usuário encontrado para este tenant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
