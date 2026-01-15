import { NextResponse } from "next/server";
import { AppException } from "../exceptions/AppException";

/**
 * Error Handler Middleware
 * Centralized error handling pattern
 */
export function handleError(error: unknown): NextResponse {
  console.error("[ERROR HANDLER]", error);

  // Nếu là AppException (custom exception)
  if (error instanceof AppException) {
    // Luôn trả về details nếu có code đặc biệt cần xử lý ở frontend
    const shouldIncludeDetails = 
      process.env.NODE_ENV === "development" || 
      error.code === "FACE_ALREADY_EXISTS" ||
      (error.details && (error.details as any).redirectToLogin);
    
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: shouldIncludeDetails ? error.details : undefined,
      },
      { status: error.statusCode }
    );
  }

  // Nếu là Error thông thường
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || "Đã xảy ra lỗi không xác định",
        code: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? { stack: error.stack }
            : undefined,
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      error: "Đã xảy ra lỗi không xác định",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

/**
 * Async handler wrapper để tự động catch errors
 */
export function asyncHandler(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch(handleError);
}
