# 📁 Cấu trúc dự án - Quick Reference

## 🎯 Tổng quan

Dự án được tổ chức theo **Service Provider Pattern** với các design patterns:
- **Repository Pattern** - Data Access Layer
- **Service Pattern** - Business Logic Layer  
- **DTO Pattern** - Data Transfer Objects
- **Custom Exception Pattern** - Error Handling
- **Dependency Injection** - Service Provider

## 📂 Cấu trúc thư mục

```
app/
├── api/                    # 🌐 API Routes (HTTP Layer)
│   └── auth/
│       ├── enroll/route.ts      → Sử dụng AuthService
│       ├── login/route.ts       → Sử dụng AuthService
│       └── users/route.ts       → Sử dụng UserRepository
│
├── services/              # 💼 Business Logic Layer
│   ├── AuthService.ts           → Xử lý authentication logic
│   └── FaceRecognitionService.ts → Xử lý face recognition logic
│
├── repositories/          # 🗄️ Data Access Layer
│   └── UserRepository.ts        → Tương tác với database
│
├── providers/            # 🔌 Dependency Injection Container
│   └── ServiceProvider.ts       → Quản lý tất cả services
│
├── interfaces/           # 📋 Contracts/Interfaces
│   ├── IAuthService.ts
│   ├── IFaceRecognitionService.ts
│   └── IUserRepository.ts
│
├── dto/                  # 📦 Data Transfer Objects
│   ├── EnrollDTO.ts
│   └── LoginDTO.ts
│
├── exceptions/           # ⚠️ Custom Exceptions
│   └── AppException.ts
│
├── middleware/           # 🛡️ Middleware & Utilities
│   └── errorHandler.ts
│
└── lib/                  # 🔧 Utilities & Configs
    ├── prisma.ts
    └── faceRecognition.ts
```

## 🔄 Luồng xử lý

### 1. API Route → Service → Repository

```typescript
// API Route
POST /api/auth/enroll
  ↓
serviceProvider.getAuthService()
  ↓
AuthService.enroll()
  ↓
UserRepository.create()
  ↓
Prisma → Database
```

### 2. Ví dụ code

**API Route:**
```typescript
// app/api/auth/enroll/route.ts
import { serviceProvider } from "@/app/providers/ServiceProvider";
import { handleError } from "@/app/middleware/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authService = serviceProvider.getAuthService();
    const user = await authService.enroll(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

**Service:**
```typescript
// app/services/AuthService.ts
class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private faceRecognitionService: IFaceRecognitionService
  ) {}

  async enroll(data: EnrollData): Promise<User> {
    // Business logic here
    return await this.userRepository.create(data);
  }
}
```

**Repository:**
```typescript
// app/repositories/UserRepository.ts
class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
```

## 🚀 Cách sử dụng

### 1. Lấy Service từ Provider

```typescript
import { serviceProvider } from "@/app/providers/ServiceProvider";

// Lấy Auth Service
const authService = serviceProvider.getAuthService();

// Lấy User Repository
const userRepository = serviceProvider.getUserRepository();

// Lấy Face Recognition Service
const faceService = serviceProvider.getFaceRecognitionService();
```

### 2. Sử dụng trong API Route

```typescript
export async function POST(request: NextRequest) {
  try {
    const authService = serviceProvider.getAuthService();
    const result = await authService.enroll(data);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
```

### 3. Throw Custom Exceptions

```typescript
import { ValidationException, NotFoundException } from "@/app/exceptions";

if (!email) {
  throw new ValidationException("Email là bắt buộc");
}

const user = await repository.findById(id);
if (!user) {
  throw new NotFoundException("User không tồn tại");
}
```

## 📝 Quy tắc

1. **API Routes** chỉ xử lý HTTP request/response, không chứa business logic
2. **Services** chứa business logic, không trực tiếp truy cập database
3. **Repositories** chỉ xử lý data access, không chứa business logic
4. **DTOs** định nghĩa cấu trúc dữ liệu cho API
5. **Exceptions** được throw từ Services, được handle bởi errorHandler middleware

## 🔍 Tìm kiếm

- **Business Logic** → `app/services/`
- **Database Queries** → `app/repositories/`
- **API Endpoints** → `app/api/`
- **Type Definitions** → `app/interfaces/` và `app/dto/`
- **Error Handling** → `app/exceptions/` và `app/middleware/errorHandler.ts`

## 📚 Xem thêm

Chi tiết đầy đủ: [ARCHITECTURE.md](./ARCHITECTURE.md)
