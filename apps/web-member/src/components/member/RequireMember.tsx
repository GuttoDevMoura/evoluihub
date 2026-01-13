"use client";

import { useMemberSession } from "./MemberSessionProvider";
import { useRouter } from "next/navigation";
import { DEV_MODE } from "@/lib/api";

export function RequireMember({ children }: { children: React.ReactNode }) {
  const { session, loading, error, refresh } = useMemberSession();
  const router = useRouter();

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Carregando sessão…</div>;
  }

  if (error || !session) {
    if (!DEV_MODE) {
      router.push("/login");
      return null;
    }
    return (
      <div className="p-6 space-y-2">
        <h2 className="text-xl font-semibold">Sessão não encontrada</h2>
        <p className="text-sm text-gray-600">
          {error || "Configure NEXT_PUBLIC_DEV_USER_ID e NEXT_PUBLIC_DEV_TENANT_SLUG no .env.local."}
        </p>
        <button
          type="button"
          onClick={() => refresh()}
          className="px-3 py-1 rounded bg-gray-900 text-white text-sm hover:bg-black/80"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
