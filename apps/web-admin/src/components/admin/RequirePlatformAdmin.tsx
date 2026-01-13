"use client";

import { useAdminSession } from "./AdminSessionProvider";

export function RequirePlatformAdmin({ children }: { children: React.ReactNode }) {
  const { session, loading, error } = useAdminSession();

  if (loading) {
    return <div className="p-4 text-sm text-gray-600">Carregando sessão…</div>;
  }
  if (error || !session) {
    return (
      <div className="p-4 text-sm text-red-600">
        Sessão inválida. {error || "Faça login novamente."}
      </div>
    );
  }
  if (!session.isPlatformAdmin) {
    return <div className="p-4 text-sm text-red-600">Acesso restrito a administradores da plataforma.</div>;
  }
  return <>{children}</>;
}
