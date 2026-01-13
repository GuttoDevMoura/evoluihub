-- Member-facing course structures

CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_tenant_idx ON courses (tenant_id);

CREATE TABLE IF NOT EXISTS course_lessons (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INT NOT NULL DEFAULT 1,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, course_id, position)
);

CREATE INDEX IF NOT EXISTS course_lessons_course_idx ON course_lessons (tenant_id, course_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    CREATE TABLE enrollments (
      id BIGSERIAL PRIMARY KEY,
      tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'active',
      enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (tenant_id, user_id, course_id)
    );
  END IF;
END
$$;

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS course_id BIGINT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE enrollments ALTER COLUMN member_id DROP NOT NULL;
ALTER TABLE enrollments ALTER COLUMN product_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_course_fk'
  ) THEN
    ALTER TABLE enrollments
      ADD CONSTRAINT enrollments_course_fk FOREIGN KEY (course_id)
      REFERENCES courses(id) ON DELETE CASCADE;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_course_user_idx ON enrollments (tenant_id, user_id, course_id);
CREATE INDEX IF NOT EXISTS enrollments_user_idx ON enrollments (tenant_id, user_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'started',
  progress_percent INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_course_idx ON lesson_progress (tenant_id, user_id, course_id);

CREATE TABLE IF NOT EXISTS member_xp (
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  xp_total INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, user_id)
);
