"use client";

import { RequireMember } from "../../../components/member/RequireMember";
import { useCallback, useEffect, useState } from "react";
import { GamificationSummary } from "@/components/gamification/GamificationSummary";
import { getMemberGamification, type MemberGamification } from "@/lib/api";
import { useMemberSession } from "@/components/member/MemberSessionProvider";

export default function HomePage() {
  const { session } = useMemberSession();
  const [stats, setStats] = useState<MemberGamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getMemberGamification();
      setStats(res);
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
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-sm opacity-80">Em construção — EvoluiHub Member</p>
        {session && (
          <div className="rounded border border-gray-200 bg-white p-3 text-sm text-gray-700 space-y-1">
            <div>Logado como: {session.user.email}</div>
            <div>Tenant: {session.tenant.slug}</div>
            <div>Permissões: {session.permissions?.length ?? 0}</div>
          </div>
        )}
        {loading && <div className="text-sm text-gray-600">Carregando gamificação…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {stats && <GamificationSummary stats={stats} title="Seu progresso" />}
      </div>
    </RequireMember>
  );
}
