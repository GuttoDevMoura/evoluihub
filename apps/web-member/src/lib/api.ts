const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID || "member-demo";
const DEV_TENANT_SLUG = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || "demo";

function apiHeadersDev() {
  return {
    "X-User-Id": DEV_USER_ID,
    "X-Tenant-Slug": DEV_TENANT_SLUG,
  };
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (DEV_MODE) {
    Object.assign(headers, apiHeadersDev());
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    credentials: DEV_MODE ? "omit" : "include",
    ...init,
    headers,
  });
  if (res.status === 401) {
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type MemberMe = {
  tenant: { id: string; slug: string; name: string; status: string };
  user: { id: string | number; email: string | null; name: string | null };
  isPlatformAdmin?: boolean;
  roles?: string[];
  permissions?: string[];
};

export type MemberCourse = {
  courseId: number;
  title: string;
  description: string | null;
  status: string;
  progress: { completedLessons: number; totalLessons: number; percent: number };
};

export type MemberCourseDetail = {
  course: { id: number; title: string; description: string | null; status: string };
  lessons: { lessonId: number; title: string; position: number; status: string; progress_percent: number }[];
};

export type MemberGamification = {
  xp_total: number;
  level: number;
  next_level: number;
  xp_next: number;
  xp_remaining: number;
};

export type CompleteLessonResponse = {
  lessonId: number;
  courseId: number;
  lessonStatus: string;
  courseProgress: { completedLessons: number; totalLessons: number; percent: number };
  xp: MemberGamification;
};

export type MemberAchievement = {
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  awarded: boolean;
  awarded_at?: string | null;
};

export type MemberChallenge = {
  code: string;
  name: string;
  description: string | null;
  kind: string;
  target: number;
  progress: number;
  status: string;
};

export type MemberLeaderboardEntry = {
  user_id: string;
  xp_total: number;
  level: number;
  position: number;
};

export type MemberProgress = {
  courses: {
    courseId: number;
    title: string | null;
    completedLessons: number;
    totalLessons: number;
    percent: number;
  }[];
  totals: {
    courses: number;
    completedLessons: number;
    totalLessons: number;
    percent: number;
  };
};

export async function getMemberMe() {
  return fetchJson<MemberMe>("/api/v1/auth/me");
}

export async function getMemberCourses() {
  return fetchJson<MemberCourse[]>("/api/v1/member/courses");
}

export async function getMemberCourse(courseId: string | number) {
  return fetchJson<MemberCourseDetail>(`/api/v1/member/courses/${courseId}`);
}

export async function getMemberGamification() {
  return fetchJson<MemberGamification>("/api/v1/member/gamification");
}

export async function completeLesson(lessonId: string | number) {
  return fetchJson<CompleteLessonResponse>(`/api/v1/member/lessons/${lessonId}/complete`, {
    method: "POST",
  });
}

export async function getMemberAchievements() {
  return fetchJson<MemberAchievement[]>("/api/v1/member/achievements");
}

export async function getMemberChallenges() {
  return fetchJson<MemberChallenge[]>("/api/v1/member/challenges");
}

export async function getMemberLeaderboard(limit = 10) {
  return fetchJson<MemberLeaderboardEntry[]>(`/api/v1/member/leaderboard?limit=${limit}`);
}

export async function getMemberProgress() {
  return fetchJson<MemberProgress>("/api/v1/member/progress");
}

export async function login(email: string, password: string, tenantSlug?: string) {
  return fetchJson<{ user: any; tenant: any }>("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, tenantSlug }),
    credentials: "include",
  });
}

export async function logout() {
  return fetchJson<{ ok: boolean }>("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export { BASE_URL, apiHeadersDev, DEV_MODE };
