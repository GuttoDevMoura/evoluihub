"use client";

import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePermission } from "@/components/admin/RequirePermission";

export default function ProductsPage() {
  return (
    <RequireAdmin>
      <RequirePermission permissionKey="products.read">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Schema de produtos/financeiro ainda não implementado — aguardando etapa futura. Nenhum dado será carregado
            até que o backend seja modelado.
          </p>
          <div className="mt-4 rounded border border-gray-200 bg-white p-4 text-sm text-gray-700">
            Empty state real: assim que o schema existir, esta tela listará produtos com preços e acesso.
          </div>
        </div>
      </RequirePermission>
    </RequireAdmin>
  );
}
