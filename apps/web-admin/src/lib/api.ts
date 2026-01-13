const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
const DEV_USER_ID = process.env.NEXT_PUBLIC_DEV_USER_ID || 'admin-root';
const DEV_TENANT_SLUG = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || 'demo';

export type AdminSession = {
  tenant: { id: string; slug: string; name: string; status: string };
  userId: string | number;
  user?: { id: string | number; email: string | null; name: string | null };
  isPlatformAdmin: boolean;
  roles: string[];
  permissions: string[];
};

export type EmailTemplateSummary = { name: string; subject: string; status: string };
export type EmailTemplateDetail = {
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  status: string;
};

export type EmailOutboxItem = {
  id: number;
  tenant_id: number | null;
  template_name: string | null;
  to_email: string;
  subject: string;
  status: string;
  attempts: number;
  last_error: string | null;
  provider_message_id: string | null;
  created_at: string;
  sent_at: string | null;
};

export type EmailConfig = {
  fromEmail: string | null;
  fromName: string | null;
  relayConfigured: boolean;
};

export type PlatformUser = {
  tenantUserId: number;
  tenantId: number;
  tenantSlug: string;
  appUserId: number | null;
  email: string;
  status: string;
  roles: string[];
};

export type PlatformRole = {
  roleId: number;
  roleSlug: string;
  roleName: string;
  permissions: { code: string; description: string }[];
};

export type PermissionCatalog = { code: string; description: string }[];

export type AdminLesson = {
  id: number;
  title: string;
  position: number;
  content: string | null;
};

export type AdminCourse = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  totalLessons?: number;
  lessons?: AdminLesson[];
};

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  if (DEV_MODE) {
    headers['X-User-Id'] = DEV_USER_ID;
    headers['X-Tenant-Slug'] = DEV_TENANT_SLUG;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-store',
    credentials: DEV_MODE ? 'omit' : 'include',
    ...init,
    headers,
  });

  if (res.status === 401) {
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchPublic<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getAdminMe(): Promise<AdminSession> {
  return fetchApi<AdminSession>('/api/v1/admin/me');
}

export async function login(email: string, password: string, tenantSlug?: string) {
  return fetchApi<{ user: any; tenant: any }>('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tenantSlug }),
    credentials: 'include',
  });
}

export async function logout() {
  return fetchApi<{ ok: boolean }>('/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getEmailConfig() {
  return fetchApi<EmailConfig>('/api/v1/platform/email/config');
}

export async function getEmailTemplates() {
  return fetchApi<EmailTemplateSummary[]>('/api/v1/platform/email/templates');
}

export async function getEmailTemplate(name: string) {
  return fetchApi<EmailTemplateDetail>(`/api/v1/platform/email/templates/${name}`);
}

export async function updateEmailTemplate(
  name: string,
  payload: Partial<Pick<EmailTemplateDetail, 'subject' | 'body_html' | 'body_text' | 'status'>>,
) {
  return fetchApi<{ ok: boolean }>(`/api/v1/platform/email/templates/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getEmailOutbox(status?: string, limit = 50) {
  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (limit) qs.set('limit', String(limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return fetchApi<EmailOutboxItem[]>(`/api/v1/platform/email/outbox${query}`);
}

export async function inviteUser(payload: {
  tenantSlug: string;
  email: string;
  name?: string;
  role?: string;
}) {
  return fetchApi<{ appUserId: number; tenantUserId: number; role: string; emailOutboxId: number }>(
    '/api/v1/platform/users/invite',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
}

export async function requestPasswordReset(email: string, tenantSlug: string) {
  return fetchPublic<{ ok: boolean; debugToken?: string }>('/api/v1/auth/password/request-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, tenantSlug }),
  });
}

export async function confirmPasswordReset(tenantSlug: string, token: string, newPassword: string) {
  return fetchPublic<{ ok: boolean }>('/api/v1/auth/password/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantSlug, token, newPassword }),
  });
}

export async function getPlatformUsers(tenantSlug: string) {
  const qs = new URLSearchParams({ tenant: tenantSlug });
  return fetchApi<PlatformUser[]>(`/api/v1/platform/users?${qs.toString()}`);
}

export async function getPlatformRoles(tenantSlug: string) {
  const qs = new URLSearchParams({ tenant: tenantSlug });
  return fetchApi<PlatformRole[]>(`/api/v1/platform/roles?${qs.toString()}`);
}

export async function getPlatformPermissions() {
  return fetchApi<PermissionCatalog>('/api/v1/platform/permissions');
}

export async function assignUserRole(tenantUserId: number, roleSlug: string) {
  return fetchApi<{ roles: string[] }>(`/api/v1/platform/users/${tenantUserId}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roleSlug }),
  });
}

// Admin courses/lessons
export async function listCourses(): Promise<AdminCourse[]> {
  return fetchApi<AdminCourse[]>('/api/v1/admin/courses');
}

export async function getCourseDetail(courseId: number): Promise<AdminCourse> {
  return fetchApi<AdminCourse>(`/api/v1/admin/courses/${courseId}`);
}

export async function createCourse(payload: {
  title: string;
  description?: string;
  status?: string;
}): Promise<AdminCourse> {
  return fetchApi<AdminCourse>('/api/v1/admin/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(
  courseId: number,
  payload: Partial<Pick<AdminCourse, 'title' | 'description' | 'status'>>,
): Promise<AdminCourse> {
  return fetchApi<AdminCourse>(`/api/v1/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(courseId: number) {
  return fetchApi<{ ok: boolean }>(`/api/v1/admin/courses/${courseId}`, {
    method: 'DELETE',
  });
}

export async function createLesson(
  courseId: number,
  payload: { title: string; content?: string; position?: number },
): Promise<AdminCourse> {
  return fetchApi<AdminCourse>(`/api/v1/admin/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateLesson(
  courseId: number,
  lessonId: number,
  payload: Partial<{ title: string; content: string; position: number }>,
): Promise<AdminCourse> {
  return fetchApi<AdminCourse>(`/api/v1/admin/courses/${courseId}/lessons/${lessonId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteLesson(courseId: number, lessonId: number): Promise<AdminCourse | { ok: boolean }> {
  return fetchApi<AdminCourse | { ok: boolean }>(
    `/api/v1/admin/courses/${courseId}/lessons/${lessonId}`,
    {
      method: 'DELETE',
    },
  );
}
