"use client";

import { XPBar } from "./XPBar";
import { LevelBadge } from "./LevelBadge";
import { type MemberGamification } from "@/lib/api";

type Props = {
  stats: MemberGamification;
  title?: string;
};

export function GamificationSummary({ stats, title }: Props) {
  return (
    <div className="space-y-2 rounded border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-gray-800">{title ?? "Gamificação"}</div>
        <LevelBadge level={stats.level} />
      </div>
      <XPBar xp_total={stats.xp_total} xp_next={stats.xp_next} xp_remaining={stats.xp_remaining} />
      <div className="text-xs text-gray-600">
        Próximo nível: {stats.next_level} · XP total: {stats.xp_total}
      </div>
    </div>
  );
}
