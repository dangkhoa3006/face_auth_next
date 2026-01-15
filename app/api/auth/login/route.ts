import { NextRequest, NextResponse } from "next/server";
import { serviceProvider } from "@/app/providers/ServiceProvider";
import { handleError } from "@/app/middleware/errorHandler";
import { LoginDTO, LoginResponseDTO } from "@/app/dto/LoginDTO";
import { ValidationException } from "@/app/exceptions/AppException";

/**
 * POST /api/auth/login
 * Đăng nhập bằng faceId hoặc faceDescriptor
 * 
 * Sử dụng Service Provider Pattern và Repository Pattern
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: LoginDTO;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    // Validation
    if (!body.faceId && !body.faceDescriptor) {
      throw new ValidationException(
        "faceId hoặc faceDescriptor là bắt buộc"
      );
    }

    // Get Auth Service từ Service Provider
    const authService = serviceProvider.getAuthService();

    // Gọi service để login
    let user;
    if (body.faceId) {
      // Login bằng faceId (từ FaceIO)
      user = await authService.loginWithFaceId(body.faceId);
    } else if (body.faceDescriptor) {
      // Login bằng faceDescriptor (từ face-api.js)
      user = await authService.loginWithFaceDescriptor(body.faceDescriptor);
    } else {
      throw new ValidationException(
        "faceId hoặc faceDescriptor là bắt buộc"
      );
    }

    // Tạo response DTO
    const response: LoginResponseDTO = {
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        email: user.email,
        faceId: user.faceId,
        createdAt: user.createdAt,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
