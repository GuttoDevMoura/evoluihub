"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

export default function DashboardPage() {
  const { session } = useAdminSession();
  const roles = session?.roles || [];
  const perms = session?.permissions || [];
  return (
    <RequireAdmin>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Admin Dashboard — EvoluiHub</p>
        {session && (
          <div className="rounded border border-gray-200 bg-white p-4 space-y-2">
            <div className="text-sm text-gray-700">
              E-mail: {session.user?.email || session.userId}
            </div>
            <div className="text-sm text-gray-700">Tenant: {session.tenant.slug}</div>
            <div className="text-sm text-gray-700">Platform admin: {session.isPlatformAdmin ? "sim" : "não"}</div>
            <div className="text-sm text-gray-700">Roles: {roles.length ? roles.join(", ") : "nenhum"}</div>
            <div className="text-sm text-gray-700">
              Permissões: {perms.length ? perms.slice(0, 10).join(", ") : "nenhuma"}
              {perms.length > 10 ? ` (+${perms.length - 10})` : ""}
            </div>
          </div>
        )}
      </div>
    </RequireAdmin>
  );
}
