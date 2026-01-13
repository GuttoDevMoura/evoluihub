-- Align existing challenges table to advanced schema without dropping prior data.

-- Add missing columns if they do not exist.
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS kind TEXT;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS target INT;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ;

-- Populate new columns from existing data when possible.
UPDATE challenges
SET code = COALESCE(code, lower(replace(name, ' ', '_')))
WHERE code IS NULL;

UPDATE challenges
SET kind = COALESCE(kind, 'lesson_count')
WHERE kind IS NULL;

UPDATE challenges
SET target = COALESCE(target, 0)
WHERE target IS NULL;

UPDATE challenges
SET start_at = COALESCE(start_at, starts_at, now())
WHERE start_at IS NULL;

UPDATE challenges
SET end_at = COALESCE(end_at, ends_at)
WHERE end_at IS NULL;

-- Ensure not null where required.
ALTER TABLE challenges ALTER COLUMN code SET NOT NULL;
ALTER TABLE challenges ALTER COLUMN kind SET NOT NULL;
ALTER TABLE challenges ALTER COLUMN target SET NOT NULL;
ALTER TABLE challenges ALTER COLUMN status SET DEFAULT 'active';

-- Add unique constraint on (tenant_id, code) if missing.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'challenges_tenant_code_key'
      AND conrelid = 'public.challenges'::regclass
  ) THEN
    ALTER TABLE challenges ADD CONSTRAINT challenges_tenant_code_key UNIQUE (tenant_id, code);
  END IF;
END $$;
