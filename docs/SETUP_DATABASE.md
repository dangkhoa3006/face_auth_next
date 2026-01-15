# 🔧 Hướng dẫn Setup Database

## Vấn đề

User `faceuser` không có đủ quyền để tạo bảng trong PostgreSQL.

## Giải pháp

### Cách 1: Cấp quyền cho user (Khuyến nghị)

Chạy script SQL với user `postgres` (superuser):

```bash
# Đăng nhập với user postgres
sudo -u postgres psql -d face_auth_db -f setup_database.sql

# Hoặc nếu bạn đã set password cho postgres
psql -U postgres -d face_auth_db -f setup_database.sql
```

### Cách 2: Chạy từng lệnh thủ công

```bash
# Đăng nhập vào PostgreSQL với user postgres
sudo -u postgres psql -d face_auth_db

# Sau đó chạy các lệnh sau:
GRANT CREATE ON SCHEMA public TO faceuser;
GRANT USAGE ON SCHEMA public TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO faceuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO faceuser;

# Thoát: \q
```

### Cách 3: Tạo bảng thủ công bằng SQL

Nếu vẫn không được, bạn có thể tạo bảng thủ công:

```bash
sudo -u postgres psql -d face_auth_db
```

Sau đó chạy:

```sql
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

## Sau khi setup xong

1. Chạy Prisma generate để tạo Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Test kết nối:
   ```bash
   npx prisma db pull
   ```

3. Chạy dev server:
   ```bash
   npm run dev
   ```

## Kiểm tra

Sau khi setup, bạn có thể kiểm tra bằng:

```bash
psql -U faceuser -d face_auth_db -c "\dt"
```

Nếu thấy bảng `User`, nghĩa là đã thành công! ✅
