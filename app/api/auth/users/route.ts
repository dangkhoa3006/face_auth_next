import { NextResponse } from "next/server";
import { serviceProvider } from "@/app/providers/ServiceProvider";
import { handleError } from "@/app/middleware/errorHandler";

/**
 * GET /api/auth/users
 * Lấy danh sách tất cả users
 * 
 * Sử dụng Service Provider Pattern và Repository Pattern
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Get User Repository từ Service Provider
    const userRepository = serviceProvider.getUserRepository();

    // Lấy tất cả users
    const users = await userRepository.findAll();

    // Format response (ẩn faceDescriptor để bảo mật)
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      faceId: user.faceId,
      hasFaceDescriptor: !!user.faceDescriptor,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    // Trả về empty array thay vì lỗi để không block UI
    console.error("Error fetching users:", error);
    return NextResponse.json({ users: [] }, { status: 200 });
  }
}
