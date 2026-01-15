# Kiến trúc dự án - Service Provider & Design Patterns

## 📐 Tổng quan

Dự án được thiết kế theo **Service Provider Pattern** và các **Design Patterns** phù hợp để đảm bảo:
- **Separation of Concerns**: Tách biệt rõ ràng giữa các layers
- **Dependency Injection**: Dễ dàng test và maintain
- **Scalability**: Dễ dàng mở rộng và thêm tính năng mới
- **Maintainability**: Code dễ đọc và maintain

## 🏗️ Cấu trúc thư mục

```
app/
├── api/                    # API Routes (HTTP layer)
│   └── auth/
│       ├── enroll/route.ts
│       ├── login/route.ts
│       └── users/route.ts
│
├── components/             # React Components (UI layer)
│   ├── LoginLayout.tsx
│   ├── RegisterLayout.tsx
│   └── ...
│
├── services/              # Business Logic Layer
│   ├── AuthService.ts
│   └── FaceRecognitionService.ts
│
├── repositories/          # Data Access Layer
│   └── UserRepository.ts
│
├── providers/             # Dependency Injection Container
│   └── ServiceProvider.ts
│
├── interfaces/            # Contracts/Interfaces
│   ├── IAuthService.ts
│   ├── IFaceRecognitionService.ts
│   └── IUserRepository.ts
│
├── dto/                   # Data Transfer Objects
│   ├── EnrollDTO.ts
│   └── LoginDTO.ts
│
├── exceptions/            # Custom Exceptions
│   └── AppException.ts
│
├── middleware/            # Middleware & Utilities
│   └── errorHandler.ts
│
└── lib/                   # Utilities & Configs
    ├── prisma.ts
    └── faceRecognition.ts
```

## 🎯 Design Patterns được sử dụng

### 1. **Service Provider Pattern** (Dependency Injection Container)

**File**: `app/providers/ServiceProvider.ts`

Service Provider là một singleton container quản lý tất cả các dependencies và cung cấp chúng cho các components khác.

```typescript
// Sử dụng
import { serviceProvider } from "@/app/providers/ServiceProvider";

const authService = serviceProvider.getAuthService();
const userRepository = serviceProvider.getUserRepository();
```

**Lợi ích:**
- Centralized dependency management
- Singleton pattern cho mỗi service
- Dễ dàng test bằng cách mock
- Loose coupling giữa các components

### 2. **Repository Pattern**

**File**: `app/repositories/UserRepository.ts`

Repository pattern tách biệt data access logic khỏi business logic.

```typescript
// Interface
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByFaceId(faceId: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  // ...
}

// Implementation
class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  // ...
}
```

**Lợi ích:**
- Tách biệt data access logic
- Dễ dàng thay đổi database (chỉ cần implement lại interface)
- Dễ dàng test với mock repository
- Single Responsibility Principle

### 3. **Service Pattern**

**File**: `app/services/AuthService.ts`, `app/services/FaceRecognitionService.ts`

Service pattern chứa business logic, không phụ thuộc trực tiếp vào database.

```typescript
// Interface
interface IAuthService {
  enroll(data: EnrollData): Promise<User>;
  loginWithFaceId(faceId: string): Promise<User>;
  loginWithFaceDescriptor(descriptor: string): Promise<User>;
}

// Implementation
class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private faceRecognitionService: IFaceRecognitionService
  ) {}
  // ...
}
```

**Lợi ích:**
- Business logic tập trung ở một nơi
- Dễ dàng test business logic
- Reusable - có thể sử dụng từ nhiều nơi
- Separation of Concerns

### 4. **DTO Pattern** (Data Transfer Object)

**File**: `app/dto/EnrollDTO.ts`, `app/dto/LoginDTO.ts`

DTO pattern định nghĩa cấu trúc dữ liệu cho request/response.

```typescript
export interface EnrollDTO {
  email: string;
  faceId?: string;
  faceDescriptor?: string;
}

export interface EnrollResponseDTO {
  message: string;
  user: UserInfo;
}
```

**Lợi ích:**
- Type safety
- Validation rõ ràng
- Tách biệt API contract khỏi domain model
- Dễ dàng versioning API

### 5. **Custom Exception Pattern**

**File**: `app/exceptions/AppException.ts`

Custom exception pattern để xử lý lỗi một cách nhất quán.

```typescript
export class AppException extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;
}

export class ValidationException extends AppException {}
export class NotFoundException extends AppException {}
export class ConflictException extends AppException {}
```

**Lợi ích:**
- Centralized error handling
- Consistent error responses
- Dễ dàng debug với error codes
- Type-safe error handling

### 6. **Error Handler Middleware**

**File**: `app/middleware/errorHandler.ts`

Middleware để xử lý errors một cách nhất quán.

```typescript
export function handleError(error: unknown): NextResponse {
  if (error instanceof AppException) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  // ...
}
```

**Lợi ích:**
- Centralized error handling
- Consistent error responses
- Development vs Production error details

## 🔄 Data Flow

```
Client Request
    ↓
API Route (app/api/auth/enroll/route.ts)
    ↓
Service Provider (getAuthService())
    ↓
Auth Service (business logic)
    ↓
User Repository (data access)
    ↓
Prisma Client (database)
    ↓
Database (PostgreSQL)
```

## 📝 Ví dụ sử dụng

### 1. API Route sử dụng Service

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

### 2. Service sử dụng Repository

```typescript
// app/services/AuthService.ts
class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private faceRecognitionService: IFaceRecognitionService
  ) {}

  async enroll(data: EnrollData): Promise<User> {
    // Business logic
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("Email đã tồn tại");
    }
    
    // Create user
    return await this.userRepository.create(data);
  }
}
```

### 3. Repository sử dụng Prisma

```typescript
// app/repositories/UserRepository.ts
class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
```

## 🧪 Testing

Với cấu trúc này, việc test trở nên dễ dàng:

```typescript
// Mock Repository
const mockUserRepository: IUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  // ...
};

// Test Service
const authService = new AuthService(
  mockUserRepository,
  mockFaceRecognitionService
);

// Test
test('should enroll user', async () => {
  mockUserRepository.findByEmail.mockResolvedValue(null);
  mockUserRepository.create.mockResolvedValue(mockUser);
  
  const result = await authService.enroll(enrollData);
  expect(result).toEqual(mockUser);
});
```

## 🚀 Mở rộng

Để thêm tính năng mới:

1. **Thêm Service mới**: Tạo interface và implementation trong `app/services/`
2. **Đăng ký vào ServiceProvider**: Thêm method getter trong `ServiceProvider`
3. **Sử dụng trong API Route**: Import và sử dụng từ ServiceProvider

Ví dụ: Thêm `EmailService` để gửi email

```typescript
// 1. Tạo interface
// app/interfaces/IEmailService.ts
export interface IEmailService {
  sendWelcomeEmail(email: string): Promise<void>;
}

// 2. Implement service
// app/services/EmailService.ts
export class EmailService implements IEmailService {
  async sendWelcomeEmail(email: string): Promise<void> {
    // Implementation
  }
}

// 3. Đăng ký vào ServiceProvider
// app/providers/ServiceProvider.ts
getEmailService(): IEmailService {
  if (!this._emailService) {
    this._emailService = new EmailService();
  }
  return this._emailService;
}

// 4. Sử dụng trong AuthService
// app/services/AuthService.ts
async enroll(data: EnrollData): Promise<User> {
  const user = await this.userRepository.create(data);
  await this.emailService.sendWelcomeEmail(user.email);
  return user;
}
```

## 📚 Tài liệu tham khảo

- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)
- [DTO Pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
