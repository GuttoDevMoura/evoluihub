"use client";

import { RequireMember } from "../../../components/member/RequireMember";
import { useEffect, useState } from "react";
import { getMemberProgress, type MemberProgress } from "@/lib/api";

export default function ProgressPage() {
  const [data, setData] = useState<MemberProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMemberProgress();
        setData(res);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar progresso");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <RequireMember>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Progresso</h1>
          <p className="text-sm opacity-80">Seu andamento nos cursos.</p>
        </div>
        {loading && <div className="text-sm text-gray-600">Carregando progresso…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {data && (
          <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-700 space-y-2">
            <div className="font-semibold">Resumo</div>
            <div>
              Aulas concluídas: {data.totals.completedLessons} / {data.totals.totalLessons} · {data.totals.percent}%
            </div>
            <div>Cursos ativos: {data.totals.courses}</div>
          </div>
        )}

        {data && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-800">Cursos</div>
            {data.courses.length === 0 && (
              <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-700">
                Você ainda não iniciou cursos.
              </div>
            )}
            {data.courses.map((c) => (
              <div key={c.courseId} className="rounded border border-gray-200 bg-white p-4 space-y-1">
                <div className="font-semibold text-gray-900">
                  {c.title || `Curso #${c.courseId}`}
                </div>
                <div className="text-sm text-gray-700">
                  Progresso: {c.completedLessons}/{c.totalLessons} · {c.percent}%
                </div>
                <div className="h-2 w-full rounded bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireMember>
  );
}
