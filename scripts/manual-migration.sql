-- Migration SQL thủ công để thêm các trường mới
-- Chạy script này với user có quyền (postgres hoặc faceuser nếu đã có quyền)
--
-- Cách chạy:
-- psql -U postgres -d face_auth_db -f scripts/manual-migration.sql
-- Hoặc
-- psql -U faceuser -d face_auth_db -h localhost -f scripts/manual-migration.sql

BEGIN;

-- Thêm các cột mới với default values
ALTER TABLE "User" 
  ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sdt" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL DEFAULT '$2a$10$default',
  ADD COLUMN IF NOT EXISTS "avatar" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Thêm unique constraint cho sdt (nếu chưa có)
-- Lưu ý: Có thể fail nếu đã có duplicate sdt values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'User_sdt_key'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_sdt_key" UNIQUE ("sdt");
    END IF;
END $$;

-- Cập nhật dữ liệu hiện có (nếu có)
UPDATE "User" 
SET 
  "name" = COALESCE(NULLIF("name", ''), SPLIT_PART("email", '@', 1)),
  "sdt" = COALESCE(NULLIF("sdt", ''), 'temp_' || SUBSTRING("id", 1, 8)),
  "password" = COALESCE(
    NULLIF("password", '$2a$10$default'),
    '$2a$10$default'
  ),
  "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP)
WHERE "name" = '' OR "sdt" = '' OR "password" = '$2a$10$default';

COMMIT;

-- Kiểm tra kết quả
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;
