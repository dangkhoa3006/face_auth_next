# ⚡ Quick Setup Database

## Vấn đề

User `faceuser` không có quyền tạo bảng trong PostgreSQL.

## Giải pháp nhanh

Chạy script setup:

```bash
bash setup_db.sh
```

Script này sẽ:
1. Cấp quyền CREATE và USAGE cho user `faceuser`
2. Tạo bảng `User` với đầy đủ fields
3. Tạo các unique indexes
4. Cấp quyền trên bảng cho `faceuser`

**Lưu ý:** Bạn sẽ cần nhập password sudo khi chạy script.

## Hoặc chạy thủ công

Nếu script không chạy được, bạn có thể chạy từng lệnh:

```bash
# Đăng nhập với user postgres
sudo -u postgres psql -d face_auth_db
```

Sau đó copy/paste:

```sql
GRANT CREATE ON SCHEMA public TO faceuser;
GRANT USAGE ON SCHEMA public TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO faceuser;

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faceId" TEXT NOT NULL,
    "faceDescriptor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_faceId_key" ON "User"("faceId");

GRANT ALL ON TABLE "User" TO faceuser;
```

Thoát: `\q`

## Kiểm tra

Sau khi setup, kiểm tra bảng đã được tạo:

```bash
PGPASSWORD=Khoanguyen3006 psql -h localhost -U faceuser -d face_auth_db -c "\dt"
```

Nếu thấy bảng `User`, nghĩa là thành công! ✅

## Chạy project

```bash
npm run dev
```

Mở http://localhost:3000 và test!
