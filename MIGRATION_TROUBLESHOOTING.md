# Hướng dẫn xử lý lỗi Migration

## Lỗi: "must be owner of table User"

### Nguyên nhân
User PostgreSQL hiện tại không có quyền ALTER TABLE để thay đổi schema.

### Giải pháp

#### Cách 1: Cấp quyền cho user hiện tại (Khuyến nghị)

1. Kết nối với PostgreSQL bằng user có quyền (thường là `postgres`):
```bash
psql -U postgres -d face_auth_db
```

2. Kiểm tra username hiện tại từ DATABASE_URL:
```bash
# Xem file .env để biết username trong DATABASE_URL
# Ví dụ: postgresql://myuser:password@localhost:5432/face_auth_db
# Username là: myuser
```

3. Cấp quyền:
```sql
-- Thay 'your_db_user' bằng username của bạn
ALTER TABLE "User" OWNER TO your_db_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
```

4. Sau đó chạy lại:
```bash
npx prisma db push --accept-data-loss
```

#### Cách 2: Sử dụng user postgres trong DATABASE_URL

Tạm thời thay đổi DATABASE_URL trong `.env` để sử dụng user `postgres`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/face_auth_db"
```

Sau khi migration xong, đổi lại về user ban đầu.

#### Cách 3: Tạo migration SQL thủ công

Nếu không thể cấp quyền, có thể tạo migration SQL thủ công:

```sql
-- Thêm các cột mới với default values
ALTER TABLE "User" 
  ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sdt" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL DEFAULT '$2a$10$default',
  ADD COLUMN IF NOT EXISTS "avatar" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Thêm unique constraint cho sdt (nếu chưa có)
CREATE UNIQUE INDEX IF NOT EXISTS "User_sdt_key" ON "User"("sdt");

-- Cập nhật dữ liệu hiện có
UPDATE "User" 
SET 
  "name" = SPLIT_PART("email", '@', 1),
  "sdt" = 'temp_' || SUBSTRING("id", 1, 8),
  "password" = '$2a$10$default'
WHERE "name" = '' OR "sdt" = '' OR "password" = '$2a$10$default';
```

Sau đó chạy:
```bash
psql -U postgres -d face_auth_db -f migration.sql
npx prisma generate
```

## Lưu ý

- Sau khi migration thành công, chạy script `scripts/migrate-existing-users.ts` để cập nhật dữ liệu hiện có
- Các user cũ sẽ có password mặc định "ChangeMe123!" - cần đổi sau khi đăng nhập
- Số điện thoại tạm thời sẽ có format `temp_xxxxx` - cần cập nhật sau
