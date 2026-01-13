"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function PayTransactionsPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="pay.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Financeiro · Transações</h1>
          <p className="mt-2 text-sm text-gray-600">
            Schema de financeiro/transações ainda não implementado — aguardando etapa futura. Nenhum dado será carregado
            até que o backend seja modelado.
          </p>
          <div className="mt-4 rounded border border-gray-200 bg-white p-4 text-sm text-gray-700">
            Empty state real: esta lista exibirá pagamentos e status assim que os endpoints forem criados.
          </div>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
