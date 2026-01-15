/**
 * Base Exception class
 * Custom Exception Pattern - Centralized error handling
 */
export class AppException extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Exception
 */
export class ValidationException extends AppException {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

/**
 * Not Found Exception
 */
export class NotFoundException extends AppException {
  constructor(message: string = "Không tìm thấy tài nguyên") {
    super(message, 404, "NOT_FOUND");
  }
}

/**
 * Conflict Exception (duplicate data)
 */
export class ConflictException extends AppException {
  constructor(message: string, details?: any) {
    super(message, 409, "CONFLICT", details);
  }
}

/**
 * Database Exception
 */
export class DatabaseException extends AppException {
  constructor(message: string, details?: any) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

/**
 * Unauthorized Exception (authentication failed)
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = "Không có quyền truy cập", details?: any) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}
