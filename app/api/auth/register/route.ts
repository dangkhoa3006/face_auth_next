import { NextRequest, NextResponse } from "next/server";
import { serviceProvider } from "@/app/providers/ServiceProvider";
import { handleError } from "@/app/middleware/errorHandler";
import { RegisterDTO, RegisterResponseDTO } from "@/app/dto/EnrollDTO";
import { JwtService } from "@/app/services/JwtService";

/**
 * POST /api/auth/register
 * Đăng ký user mới với thông tin đầy đủ (name, email, sdt, password, avatar)
 * 
 * Sử dụng Service Provider Pattern và Repository Pattern
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: RegisterDTO;
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
    const jwtService = new JwtService();

    // Gọi service để register user
    const user = await authService.register({
      name: body.name,
      email: body.email,
      sdt: body.sdt,
      password: body.password,
      avatar: body.avatar,
      faceId: body.faceId,
      faceDescriptor: body.faceDescriptor,
    });

    // Tạo JWT token
    const token = jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Tạo response DTO
    const response: RegisterResponseDTO = {
      message: "Đăng ký thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sdt: user.sdt,
        avatar: user.avatar || undefined,
        createdAt: user.createdAt,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
