-- Add app_user_id linkage to platform_admins
ALTER TABLE platform_admins
  ADD COLUMN IF NOT EXISTS app_user_id BIGINT REFERENCES app_users(id) ON DELETE CASCADE;

-- Try to map existing rows by email
UPDATE platform_admins pa
SET app_user_id = au.id
FROM app_users au
WHERE pa.app_user_id IS NULL
  AND pa.user_id = au.email;

-- Fallback: map legacy admin-root to demo admin email if present
UPDATE platform_admins pa
SET app_user_id = au.id
FROM app_users au
WHERE pa.app_user_id IS NULL
  AND pa.user_id = 'admin-root'
  AND au.email = 'admin@evoluihub.local';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'platform_admins_app_user_unique'
      AND conrelid = 'platform_admins'::regclass
  ) THEN
    ALTER TABLE platform_admins
      ADD CONSTRAINT platform_admins_app_user_unique UNIQUE (app_user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS platform_admins_app_user_idx
  ON platform_admins (app_user_id);
