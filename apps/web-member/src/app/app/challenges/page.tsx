"use client";

import { useEffect, useState } from "react";
import { RequireMember } from "@/components/member/RequireMember";
import { getMemberChallenges, type MemberChallenge } from "@/lib/api";

export default function ChallengesPage() {
  const [items, setItems] = useState<MemberChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getMemberChallenges();
        setItems(res);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar desafios");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <RequireMember>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Desafios</h1>
        {loading && <div className="text-sm text-gray-600">Carregando desafios…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="space-y-3">
          {items.map((item) => {
            const percent =
              item.target > 0 ? Math.min(100, Math.floor((item.progress / item.target) * 100)) : 0;
            return (
              <div key={item.code} className="rounded border border-gray-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{item.name}</div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">{item.kind}</span>
                </div>
                <div className="text-sm text-gray-700">{item.description}</div>
                <div className="text-xs text-gray-600">
                  Progresso: {item.progress}/{item.target} · Status: {item.status}
                </div>
                <div className="h-2 w-full rounded bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RequireMember>
  );
}
