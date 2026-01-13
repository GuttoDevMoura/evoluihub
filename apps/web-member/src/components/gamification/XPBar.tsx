"use client";

type XPBarProps = {
  xp_total: number;
  xp_next: number;
  xp_remaining: number;
};

export function XPBar({ xp_total, xp_next, xp_remaining }: XPBarProps) {
  const target = xp_next > 0 ? xp_next : xp_total || 1;
  const earned = Math.max(0, Math.min(xp_total, target));
  const percent = Math.min(100, Math.max(0, Math.floor((earned / target) * 100)));

  return (
    <div className="space-y-1 rounded border border-gray-200 bg-white p-3">
      <div className="flex justify-between text-xs text-gray-600">
        <span>XP atual: {xp_total}</span>
        <span>Próximo nível em: {xp_remaining} XP</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width]"
          style={{ width: `${percent}%` }}
          aria-label={`Progresso de XP ${percent}%`}
        />
      </div>
      <div className="text-xs text-gray-700">Meta: {xp_next} XP</div>
    </div>
  );
}
