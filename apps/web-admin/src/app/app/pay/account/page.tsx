"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function PayAccountPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="pay.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Financeiro · Conta</h1>
          <p className="mt-2 text-sm opacity-80">Em construção — EvoluiHub Admin</p>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
