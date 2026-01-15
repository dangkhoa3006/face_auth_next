# Hướng dẫn nhanh: Fix Migration Permission

## Vấn đề
User PostgreSQL không có quyền ALTER TABLE để thay đổi schema.

## Giải pháp nhanh

### Bước 1: Cấp quyền cho user faceuser

Chọn một trong các cách sau:

#### Cách 1: Với sudo (nếu có quyền sudo)
```bash
sudo -u postgres psql -d face_auth_db -f scripts/grant-permissions-to-faceuser.sql
```

#### Cách 2: Kết nối với user postgres (nếu có password)
```bash
psql -U postgres -d face_auth_db -f scripts/grant-permissions-to-faceuser.sql
```

Hoặc kết nối và chạy thủ công:
```bash
psql -U postgres -d face_auth_db
```

Sau đó chạy:
```sql
ALTER TABLE "User" OWNER TO faceuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO faceuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO faceuser;
GRANT USAGE ON SCHEMA public TO faceuser;
GRANT CREATE ON SCHEMA public TO faceuser;
```

#### Cách 3: Kết nối với user faceuser (nếu có password)
```bash
psql -U faceuser -d face_auth_db -h localhost
```

Nếu kết nối được, có nghĩa là user đã có quyền. Nếu không, cần chạy Cách 1 hoặc 2.

### Bước 2: Chạy migration

Sau khi cấp quyền xong, chạy:

```bash
npx prisma db push --accept-data-loss
```

### Bước 3: Generate Prisma Client

```bash
npx prisma generate
```

### Bước 4: Cập nhật dữ liệu hiện có (nếu có)

```bash
npx tsx scripts/migrate-existing-users.ts
```

## Kiểm tra

Sau khi hoàn tất, kiểm tra:

```bash
# Kiểm tra schema
npx prisma db pull

# Hoặc kiểm tra trực tiếp
psql -U faceuser -d face_auth_db -h localhost -c "\d \"User\""
```

## Lưu ý

- Nếu không có quyền sudo, bạn cần liên hệ admin để cấp quyền
- Hoặc có thể tạo migration SQL thủ công (xem MIGRATION_TROUBLESHOOTING.md)
