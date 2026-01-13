"use client";

import { RequireMember } from "../../../components/member/RequireMember";
import { useEffect, useState } from "react";
import { getMemberCourses, type MemberCourse } from "../../../lib/api";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MemberCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMemberCourses();
        setCourses(data);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar cursos");
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
          <h1 className="text-2xl font-semibold">Meus Cursos</h1>
          <p className="text-sm opacity-80">Cursos em que você está matriculado.</p>
        </div>

        {loading && <div className="text-sm text-gray-600">Carregando cursos…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <ul className="space-y-3">
            {courses.map((c) => (
              <li key={c.courseId} className="rounded border border-gray-200 bg-white p-4">
                <div className="font-semibold text-lg">{c.title}</div>
                <p className="text-sm text-gray-600">{c.description}</p>
                <p className="text-sm text-gray-700 mt-1">
                  Progresso: {c.progress.percent}% ({c.progress.completedLessons}/
                  {c.progress.totalLessons} aulas)
                </p>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="text-sm text-gray-600">Nenhum curso encontrado.</li>
            )}
          </ul>
        )}
      </div>
    </RequireMember>
  );
}
