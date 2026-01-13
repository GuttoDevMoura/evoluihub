"use client";

import { RequireMember } from "../../../components/member/RequireMember";
import { useCallback, useEffect, useState } from "react";
import { getMemberGamification, type MemberGamification } from "../../../lib/api";
import { GamificationSummary } from "@/components/gamification/GamificationSummary";

export default function GamificationPage() {
  const [data, setData] = useState<MemberGamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getMemberGamification();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Falha ao carregar gamificação");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <RequireMember>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Gamificação</h1>
        <button
          className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => void load()}
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
        {loading && <div className="text-sm text-gray-600">Carregando gamificação…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {data && <GamificationSummary stats={data} />}
      </div>
    </RequireMember>
  );
}
