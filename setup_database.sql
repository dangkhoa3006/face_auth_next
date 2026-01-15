-- Script để cấp quyền cho user faceuser và tạo bảng User

-- Kết nối với database face_auth_db với user postgres (superuser)
-- Chạy: psql -U postgres -d face_auth_db -f setup_database.sql

-- Cấp quyền CREATE và USAGE trên schema public
GRANT CREATE ON SCHEMA public TO faceuser;
GRANT USAGE ON SCHEMA public TO faceuser;

-- Cấp quyền trên tất cả các bảng hiện tại và tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO faceuser;

-- Nếu bảng User chưa tồn tại, tạo bảng
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faceId" TEXT NOT NULL,
    "faceDescriptor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tạo unique constraint cho email và faceId
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_faceId_key" ON "User"("faceId");

-- Cấp quyền trên bảng User
GRANT ALL ON TABLE "User" TO faceuser;

-- Hiển thị thông báo thành công
SELECT 'Database setup completed successfully!' AS message;
