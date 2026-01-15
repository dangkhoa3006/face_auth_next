# Face Auth - Đăng nhập bằng khuôn mặt với Next.js + Prisma

Dự án đăng nhập bằng khuôn mặt sử dụng Next.js, Prisma ORM, PostgreSQL và **face-api.js** (miễn phí, không cần đăng ký).

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Setup database (xem docs/SETUP_DATABASE.md)
# Tạo file .env với DATABASE_URL

# Generate Prisma client
npx prisma generate

# Chạy development server
npm run dev
```

## 📚 Tài liệu

Tất cả tài liệu chi tiết được đặt trong thư mục [`docs/`](./docs/):

👉 **[Xem tất cả tài liệu](./docs/INDEX.md)** - Danh sách đầy đủ và hướng dẫn điều hướng

### Tài liệu chính:

- **[README.md](./docs/README.md)** - Hướng dẫn đầy đủ về dự án
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Kiến trúc và Design Patterns
- **[STRUCTURE.md](./docs/STRUCTURE.md)** - Cấu trúc dự án (Quick Reference)
- **[QUICK_SETUP.md](./docs/QUICK_SETUP.md)** - Hướng dẫn setup nhanh
- **[SETUP_DATABASE.md](./docs/SETUP_DATABASE.md)** - Hướng dẫn setup database
- **[FACE_API_SETUP.md](./docs/FACE_API_SETUP.md)** - Hướng dẫn setup Face API

## 🏗️ Kiến trúc

Dự án được xây dựng với:
- **Service Provider Pattern** - Dependency Injection
- **Repository Pattern** - Data Access Layer
- **Service Pattern** - Business Logic Layer
- **DTO Pattern** - Data Transfer Objects
- **Custom Exception Pattern** - Error Handling

Xem chi tiết: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 📁 Cấu trúc dự án

```
app/
├── api/              # API Routes
├── services/         # Business Logic
├── repositories/     # Data Access
├── providers/        # Dependency Injection
├── interfaces/       # Contracts
├── dto/             # Data Transfer Objects
├── exceptions/       # Custom Exceptions
└── middleware/       # Middleware & Utilities
```

Xem chi tiết: [docs/STRUCTURE.md](./docs/STRUCTURE.md)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Database**: PostgreSQL
- **ORM**: Prisma 7.x
- **Face Recognition**: face-api.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run database migrations
```

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT
# face_auth_next
