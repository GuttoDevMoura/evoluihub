"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function EnrollmentsPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="enrollments.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Matrículas</h1>
          <p className="mt-2 text-sm opacity-80">Em construção — EvoluiHub Admin</p>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
