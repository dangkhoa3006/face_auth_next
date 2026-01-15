#!/bin/bash

# Script để setup database và cấp quyền cho user faceuser
# Chạy: bash setup_db.sh

echo "🔧 Đang setup database..."

# Cấp quyền cho user faceuser
sudo -u postgres psql -d face_auth_db << EOF
-- Cấp quyền CREATE và USAGE trên schema public
GRANT CREATE ON SCHEMA public TO faceuser;
GRANT USAGE ON SCHEMA public TO faceuser;

-- Cấp quyền trên tất cả các bảng hiện tại và tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO faceuser;

-- Tạo bảng User nếu chưa có
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

SELECT '✅ Database setup completed successfully!' AS message;
EOF

echo ""
echo "✅ Hoàn thành! Bây giờ bạn có thể chạy: npm run dev"
