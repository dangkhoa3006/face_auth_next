-- Script để cấp quyền cho user faceuser
-- Chạy script này với user postgres (superuser)
-- 
-- Cách 1: Với sudo (nếu có quyền)
-- sudo -u postgres psql -d face_auth_db -f scripts/grant-permissions-to-faceuser.sql
--
-- Cách 2: Kết nối trực tiếp (nếu có password postgres)
-- psql -U postgres -d face_auth_db -f scripts/grant-permissions-to-faceuser.sql
--
-- Cách 3: Kết nối và chạy từng lệnh
-- psql -U postgres -d face_auth_db
-- Sau đó copy/paste các lệnh dưới đây

-- Cấp quyền OWNER cho bảng User
ALTER TABLE "User" OWNER TO faceuser;

-- Cấp quyền đầy đủ cho tất cả tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO faceuser;

-- Cấp quyền cho sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO faceuser;

-- Cấp quyền cho schema
GRANT USAGE ON SCHEMA public TO faceuser;
GRANT CREATE ON SCHEMA public TO faceuser;

-- Cấp quyền mặc định cho các bảng/sequences tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO faceuser;

-- Kiểm tra quyền
SELECT 
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'User';
