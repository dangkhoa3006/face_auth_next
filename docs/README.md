# Face Auth - Đăng nhập bằng khuôn mặt với Next.js + Prisma

Dự án đăng nhập bằng khuôn mặt sử dụng Next.js, Prisma ORM, PostgreSQL và **face-api.js** (miễn phí, không cần đăng ký).

## 🚀 Tính năng

- ✅ Đăng ký khuôn mặt với **face-api.js** (miễn phí, mã nguồn mở)
- ✅ Đăng nhập bằng khuôn mặt
- ✅ Đăng nhập bằng email/password (đang phát triển)
- ✅ UI hiện đại với Tailwind CSS
- ✅ Dark mode support
- ✅ Component-based architecture
- ✅ **Không cần đăng ký dịch vụ bên ngoài** - Chạy hoàn toàn trên browser

## 📋 Yêu cầu

- Node.js 18+ 
- PostgreSQL đã được cài đặt và chạy
- **Không cần API key hoặc đăng ký dịch vụ nào!** 🎉

## 🛠️ Cài đặt

### 1. Clone và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Database

Tạo file `.env` trong thư mục root với nội dung:

```env
DATABASE_URL="postgresql://faceuser:Khoanguyen3006@localhost:5432/face_auth_db"
```

**Lưu ý:** Không cần `NEXT_PUBLIC_FACEIO_APP_ID` nữa! face-api.js hoạt động hoàn toàn miễn phí, không cần API key.

### 3. Setup Prisma Database

```bash
# Tạo migration và sync database
npx prisma migrate dev --name init

# Hoặc nếu database đã có schema
npx prisma generate
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc Project

```
face_auth/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── enroll/route.ts    # API đăng ký khuôn mặt
│   │       └── login/route.ts     # API đăng nhập bằng khuôn mặt
│   ├── components/
│   │   ├── FaceLoginButton.tsx   # Component nút Face ID
│   │   ├── LoginForm.tsx          # Component form đăng nhập
│   │   ├── LoginFooter.tsx        # Component footer
│   │   ├── LoginHeader.tsx        # Component header
│   │   ├── LoginLayout.tsx        # Layout chính của trang login
│   │   └── VisualSection.tsx      # Component phần hình ảnh bên trái
│   ├── lib/
│   │   └── prisma.ts              # Prisma Client instance
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Trang chủ (login page)
│   └── globals.css                # Global styles
├── prisma/
│   └── schema.prisma              # Prisma schema
└── .env                           # Environment variables
```

## 🧩 Components

### VisualSection
Component hiển thị phần hình ảnh và branding bên trái màn hình.

### LoginHeader
Component hiển thị logo và tiêu đề trang đăng nhập.

### FaceLoginButton
Component xử lý đăng nhập/đăng ký bằng FaceIO:
- Props: `onEnroll`, `onLogin`, `mode` ("login" | "enroll")
- Tự động load FaceIO library khi component mount
- Xử lý các lỗi từ FaceIO (permission denied, user cancelled, etc.)

### LoginForm
Component form đăng nhập bằng email/password:
- Props: `onSubmit`, `loading`
- Có tính năng show/hide password
- Checkbox "Remember this device"

### LoginFooter
Component footer với links và thông tin đăng ký.

### LoginLayout
Layout chính kết hợp tất cả các component trên và xử lý logic:
- Gọi API enroll khi đăng ký khuôn mặt
- Gọi API login khi đăng nhập bằng khuôn mặt
- Xử lý form submit (email/password)

## 🔌 API Routes

### POST `/api/auth/enroll`
Đăng ký khuôn mặt mới.

**Request body:**
```json
{
  "email": "user@example.com",
  "faceId": "facial_id_from_faceio"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "faceId": "...",
    "createdAt": "..."
  }
}
```

### POST `/api/auth/login`
Đăng nhập bằng khuôn mặt.

**Request body:**
```json
{
  "faceId": "facial_id_from_faceio"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "faceId": "...",
    "createdAt": "..."
  }
}
```

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  faceId    String   @unique
  createdAt DateTime @default(now())
}
```

## 🔐 Bảo mật

- Không lưu ảnh gốc, chỉ lưu `faceId` (nhận dạng) từ FaceIO
- Cần HTTPS để trình duyệt cho phép truy cập camera
- FaceIO xử lý tất cả logic nhận diện khuôn mặt

## 📝 Lưu ý

1. **FaceIO Setup:** Bạn cần tạo account tại [FaceIO](https://faceio.net/) và lấy App Public ID
2. **HTTPS:** FaceIO yêu cầu HTTPS để hoạt động (trong production)
3. **Camera Permission:** Người dùng cần cấp quyền truy cập camera
4. **Database:** Đảm bảo PostgreSQL đang chạy và database đã được tạo

## 🚧 Tính năng đang phát triển

- [ ] Đăng nhập bằng email/password (backend)
- [ ] JWT authentication
- [ ] Session management
- [ ] User profile page
- [ ] Đăng ký tài khoản mới

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [FaceIO Documentation](https://faceio.net/integration-guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
