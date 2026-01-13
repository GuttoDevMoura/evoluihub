"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function AiSettingsPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="ai.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">IA · Configurações</h1>
          <p className="mt-2 text-sm opacity-80">Em construção — EvoluiHub Admin</p>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
