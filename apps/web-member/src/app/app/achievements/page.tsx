"use client";

import { useEffect, useState } from "react";
import { RequireMember } from "@/components/member/RequireMember";
import { getMemberAchievements, type MemberAchievement } from "@/lib/api";

export default function AchievementsPage() {
  const [items, setItems] = useState<MemberAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getMemberAchievements();
        setItems(res);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar conquistas");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <RequireMember>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Conquistas</h1>
        {loading && <div className="text-sm text-gray-600">Carregando conquistas…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const unlocked = !!item.awarded;
            return (
              <div
                key={item.code}
                className={`rounded border p-3 ${unlocked ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{item.name}</div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">{item.icon ?? "badge"}</span>
                </div>
                <div className="text-sm text-gray-700">{item.description}</div>
                <div className={`mt-2 text-xs font-semibold ${unlocked ? "text-green-700" : "text-gray-500"}`}>
                  {unlocked ? "Desbloqueado" : "Bloqueado"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RequireMember>
  );
}
