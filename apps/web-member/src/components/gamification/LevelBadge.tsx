"use client";

type LevelBadgeProps = {
  level: number;
};

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
      <span className="h-2 w-2 rounded-full bg-blue-500" />
      Nível {level}
    </div>
  );
}
