# Hướng dẫn Migration - JWT Authentication

## Tổng quan

Đã cập nhật hệ thống authentication để sử dụng JWT với các tính năng:

- Đăng ký với thông tin đầy đủ: name, email, sdt, password, avatar
- Validation password: tối thiểu 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
- Đăng nhập bằng email/password hoặc face recognition
- JWT token được trả về sau khi đăng nhập/đăng ký thành công

## Các bước Migration

### 1. Cài đặt dependencies

Các thư viện đã được cài đặt:
- `jsonwebtoken` - Tạo và verify JWT tokens
- `bcryptjs` - Hash passwords
- `@types/jsonwebtoken` và `@types/bcryptjs` - TypeScript types

### 2. Chạy Prisma Migration

```bash
# Generate Prisma Client với schema mới
npm run prisma:generate

# Tạo migration
npx prisma migrate dev --name add_jwt_auth_fields

# Hoặc nếu đã có database, có thể cần reset (CẨN THẬN - sẽ mất dữ liệu)
# npx prisma migrate reset
```

### 3. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**LƯU Ý:** Thay đổi `JWT_SECRET` thành một secret key mạnh trong production!

### 4. Cấu trúc Database mới

Schema đã được cập nhật với các trường mới:

```prisma
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  sdt           String   @unique
  password      String   // Đã hash bằng bcrypt
  avatar        String?
  faceId        String?  @unique
  faceDescriptor String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## API Endpoints mới

### POST `/api/auth/register`

Đăng ký user mới với thông tin đầy đủ.

**Request:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "sdt": "0123456789",
  "password": "Password123!",
  "avatar": "https://example.com/avatar.jpg" // Optional
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "sdt": "0123456789",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "..."
  }
}
```

### POST `/api/auth/login`

Đăng nhập bằng email/password hoặc face recognition.

**Request (Email/Password):**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Request (Face Recognition):**
```json
{
  "faceDescriptor": "[...]"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "sdt": "0123456789",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "..."
  }
}
```

## Password Requirements

Mật khẩu phải đáp ứng các yêu cầu sau:
- Tối thiểu 8 ký tự
- Ít nhất 1 chữ hoa (A-Z)
- Ít nhất 1 chữ thường (a-z)
- Ít nhất 1 số (0-9)
- Ít nhất 1 ký tự đặc biệt (!@#$%^&*()_+-=[]{}|;':"\\,.<>/?)

## Sử dụng JWT Token

Sau khi đăng nhập/đăng ký thành công, token được lưu trong `localStorage`:

```javascript
// Lưu token
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

// Sử dụng token trong các request tiếp theo
const token = localStorage.getItem("token");
fetch("/api/protected", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

## Backward Compatibility

API `/api/auth/enroll` vẫn được giữ lại để backward compatibility, nhưng khuyến nghị sử dụng `/api/auth/register` mới.

## Lưu ý quan trọng

1. **JWT_SECRET**: Phải thay đổi trong production environment
2. **Password Hashing**: Tất cả passwords đều được hash bằng bcrypt với salt rounds = 10
3. **Token Expiration**: Mặc định là 7 ngày, có thể cấu hình qua `JWT_EXPIRES_IN`
4. **Database Migration**: Nếu đã có dữ liệu, cần migrate cẩn thận để không mất dữ liệu
