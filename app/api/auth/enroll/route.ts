import { NextRequest, NextResponse } from "next/server";
import { serviceProvider } from "@/app/providers/ServiceProvider";
import { handleError } from "@/app/middleware/errorHandler";
import { EnrollDTO, EnrollResponseDTO } from "@/app/dto/EnrollDTO";

/**
 * POST /api/auth/enroll
 * Đăng ký user mới với face descriptor
 * 
 * Sử dụng Service Provider Pattern và Repository Pattern
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: EnrollDTO;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    // Get Auth Service từ Service Provider
    const authService = serviceProvider.getAuthService();

    // Gọi service để enroll user
    const user = await authService.enroll({
      email: body.email,
      faceId: body.faceId,
      faceDescriptor: body.faceDescriptor || "",
    });

    // Tạo response DTO
    const response: EnrollResponseDTO = {
      message: "Đăng ký thành công",
      user: {
        id: user.id,
        email: user.email,
        faceId: user.faceId,
        createdAt: user.createdAt,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
