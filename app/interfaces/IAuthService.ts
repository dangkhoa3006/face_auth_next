import { User } from "@prisma/client";

/**
 * Interface cho Auth Service
 * Service Pattern - Business logic cho authentication
 */
export interface IAuthService {
  /**
   * Đăng ký user mới với face descriptor
   */
  enroll(data: {
    email: string;
    faceId?: string;
    faceDescriptor: string;
  }): Promise<User>;

  /**
   * Đăng nhập bằng faceId (từ FaceIO)
   */
  loginWithFaceId(faceId: string): Promise<User>;

  /**
   * Đăng nhập bằng face descriptor (từ face-api.js)
   */
  loginWithFaceDescriptor(faceDescriptor: string): Promise<User>;
}
