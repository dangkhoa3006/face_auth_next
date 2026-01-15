import { User } from "@prisma/client";

/**
 * Interface cho Auth Service
 * Service Pattern - Business logic cho authentication
 */
export interface IAuthService {
  /**
   * Đăng ký user mới với thông tin đầy đủ (name, email, sdt, password, avatar)
   */
  register(data: {
    name: string;
    email: string;
    sdt: string;
    password: string;
    avatar?: string;
    faceId?: string;
    faceDescriptor?: string;
  }): Promise<User>;

  /**
   * Đăng ký user mới với face descriptor (legacy - giữ lại để backward compatibility)
   * @deprecated Sử dụng register thay thế
   */
  enroll(data: {
    email: string;
    faceId?: string;
    faceDescriptor: string;
  }): Promise<User>;

  /**
   * Đăng nhập bằng email và password
   */
  loginWithEmailPassword(email: string, password: string): Promise<User>;

  /**
   * Đăng nhập bằng faceId (từ FaceIO)
   */
  loginWithFaceId(faceId: string): Promise<User>;

  /**
   * Đăng nhập bằng face descriptor (từ face-api.js)
   */
  loginWithFaceDescriptor(faceDescriptor: string): Promise<User>;
}
