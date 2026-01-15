import { User } from "@prisma/client";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IFaceRecognitionService } from "../interfaces/IFaceRecognitionService";
import {
  ValidationException,
  NotFoundException,
  ConflictException,
} from "../exceptions/AppException";

/**
 * Auth Service Implementation
 * Service Pattern - Business logic cho authentication
 */
export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private faceRecognitionService: IFaceRecognitionService
  ) {}

  async enroll(data: {
    email: string;
    faceId?: string;
    faceDescriptor: string;
  }): Promise<User> {
    // Validation
    if (!data.email) {
      throw new ValidationException("Email là bắt buộc");
    }

    if (!data.faceId && !data.faceDescriptor) {
      throw new ValidationException(
        "faceId hoặc faceDescriptor là bắt buộc"
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("Email đã được đăng ký");
    }

    // Tạo faceId nếu không có
    const finalFaceId =
      data.faceId ||
      `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Kiểm tra faceId đã tồn tại chưa
    const existingFaceId = await this.userRepository.findByFaceId(finalFaceId);
    if (existingFaceId) {
      throw new ConflictException("Khuôn mặt này đã được đăng ký");
    }

    // Tạo user mới
    return await this.userRepository.create({
      email: data.email,
      faceId: finalFaceId,
      faceDescriptor: data.faceDescriptor || null,
    });
  }

  async loginWithFaceId(faceId: string): Promise<User> {
    if (!faceId) {
      throw new ValidationException("faceId là bắt buộc");
    }

    const user = await this.userRepository.findByFaceId(faceId);
    if (!user) {
      throw new NotFoundException(
        "Không tìm thấy người dùng với khuôn mặt này"
      );
    }

    return user;
  }

  async loginWithFaceDescriptor(faceDescriptor: string): Promise<User> {
    if (!faceDescriptor) {
      throw new ValidationException("faceDescriptor là bắt buộc");
    }

    // Lấy tất cả users có faceDescriptor
    const users = await this.userRepository.findAllWithFaceDescriptor();

    // Parse current descriptor
    let currentDescriptor: Float32Array;
    try {
      currentDescriptor = new Float32Array(JSON.parse(faceDescriptor));
    } catch (error) {
      throw new ValidationException("faceDescriptor không hợp lệ");
    }

    // So sánh với từng user
    for (const user of users) {
      if (!user.faceDescriptor) continue;

      try {
        const userDescriptor =
          this.faceRecognitionService.stringToDescriptor(user.faceDescriptor);
        const isMatch = this.faceRecognitionService.isMatch(
          currentDescriptor,
          userDescriptor
        );

        if (isMatch) {
          return user;
        }
      } catch (error) {
        // Skip user nếu descriptor không hợp lệ
        console.error(
          `Error comparing descriptor for user ${user.id}:`,
          error
        );
        continue;
      }
    }

    throw new NotFoundException(
      "Không tìm thấy người dùng với khuôn mặt này"
    );
  }
}
