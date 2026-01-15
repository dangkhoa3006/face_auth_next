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
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details:
          process.env.NODE_ENV === "development" ? error.details : undefined,
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
