"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function MembersPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="members.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Membros</h1>
          <p className="mt-2 text-sm opacity-80">Em construção — EvoluiHub Admin</p>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
