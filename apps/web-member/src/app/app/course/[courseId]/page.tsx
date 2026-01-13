"use client";

import { RequireMember } from "../../../../components/member/RequireMember";
import { useCallback, useEffect, useState } from "react";
import {
  completeLesson,
  getMemberCourse,
  getMemberGamification,
  type MemberCourseDetail,
  type MemberGamification,
} from "../../../../lib/api";
import { GamificationSummary } from "@/components/gamification/GamificationSummary";

type Props = {
  params: { courseId: string };
};

export default function CoursePage({ params }: Props) {
  const [data, setData] = useState<MemberCourseDetail | null>(null);
  const [gamification, setGamification] = useState<MemberGamification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLesson, setActionLesson] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    const result = await getMemberCourse(params.courseId);
    setData(result);
  }, [params.courseId]);

  const loadGamification = useCallback(async () => {
    const res = await getMemberGamification();
    setGamification(res);
  }, []);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        await Promise.all([loadCourse(), loadGamification()]);
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar o curso");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [loadCourse, loadGamification]);

  const handleComplete = useCallback(
    async (lessonId: number) => {
      setActionLesson(lessonId);
      setActionError(null);
      const prevXp = gamification?.xp_total ?? null;
      try {
        const result = await completeLesson(lessonId);
        setGamification(result.xp);
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            lessons: prev.lessons.map((lesson) => {
              const idNum = Number(lesson.lessonId);
              if (idNum === lessonId) {
                return { ...lesson, status: "completed", progress_percent: 100 };
              }
              return lesson;
            }),
          };
        });
        if (prevXp !== null) {
          const delta = result.xp.xp_total - prevXp;
          if (delta !== 0) {
            setFeedback(`+${delta} XP ${result.xp.level ? `· Nível ${result.xp.level}` : ""}`);
          } else {
            setFeedback("XP já contabilizado para esta aula");
          }
        } else {
          setFeedback("Progresso atualizado");
        }
        setTimeout(() => setFeedback(null), 4000);
      } catch (err: any) {
        setActionError(err?.message || "Falha ao concluir a aula");
      } finally {
        setActionLesson(null);
      }
    },
    [gamification?.xp_total],
  );

  return (
    <RequireMember>
      <div className="space-y-4">
        {loading && <div className="text-sm text-gray-600">Carregando curso…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {actionError && <div className="text-sm text-red-600">{actionError}</div>}

        {gamification && <GamificationSummary stats={gamification} title="Seu progresso" />}
        {feedback && <div className="rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">{feedback}</div>}

        {data && (
          <>
            <div>
              <h1 className="text-2xl font-semibold">{data.course.title}</h1>
              <p className="text-sm text-gray-700">{data.course.description}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Aulas</h2>
              <ul className="space-y-2">
                {data.lessons.map((lesson) => (
                  <li key={lesson.lessonId} className="rounded border border-gray-200 bg-white p-3">
                    <div className="font-semibold">
                      {lesson.position}. {lesson.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Status: {lesson.status} — Progresso: {lesson.progress_percent}%
                    </div>
                    {lesson.status !== "completed" && (
                      <button
                        className="mt-2 rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
                        onClick={() => void handleComplete(lesson.lessonId)}
                        disabled={actionLesson === lesson.lessonId}
                      >
                        {actionLesson === lesson.lessonId ? "Concluindo..." : "Concluir"}
                      </button>
                    )}
                    {lesson.status === "completed" && (
                      <div className="mt-2 text-sm text-green-700">Aula concluída</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </RequireMember>
  );
}
