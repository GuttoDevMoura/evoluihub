"use client";

import { useEffect, useState } from "react";
import { RequireMember } from "@/components/member/RequireMember";
import { getMemberLeaderboard, type MemberLeaderboardEntry } from "@/lib/api";

export default function LeaderboardPage() {
  const [items, setItems] = useState<MemberLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getMemberLeaderboard(10);
        setItems(res);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar ranking");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <RequireMember>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Ranking</h1>
        {loading && <div className="text-sm text-gray-600">Carregando ranking…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {items.map((item) => (
            <div key={item.user_id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-50 text-center text-sm font-semibold text-blue-700 leading-8">
                  {item.position}
                </div>
                <div>
                  <div className="font-semibold">{item.user_id}</div>
                  <div className="text-xs text-gray-600">Nível {item.level}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800">{item.xp_total} XP</div>
            </div>
          ))}
        </div>
      </div>
    </RequireMember>
  );
}
