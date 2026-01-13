"use client";

import { useAdminSession } from "./AdminSessionProvider";
import { useRouter } from "next/navigation";
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, session, error, refresh } = useAdminSession();
  const router = useRouter();

  if (loading) {
    return <div className="p-4 text-sm text-gray-600">Carregando sessão…</div>;
  }

  if (error || !session) {
    if (!DEV_MODE) {
      router.push("/login");
      return null;
    }
    return (
      <div className="p-4 space-y-2">
        <div className="font-semibold">Sessão indisponível</div>
        <p className="text-sm text-gray-600">{error || "Não foi possível carregar a sessão."}</p>
        <button
          onClick={() => refresh()}
          className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
          type="button"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
