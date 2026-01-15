import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IFaceRecognitionService } from "../interfaces/IFaceRecognitionService";
import {
  ValidationException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "../exceptions/AppException";
import { validatePassword } from "../lib/passwordValidation";

/**
 * Auth Service Implementation
 * Service Pattern - Business logic cho authentication
 */
export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private faceRecognitionService: IFaceRecognitionService
  ) {}

  /**
   * Đăng ký user mới với thông tin đầy đủ
   */
  async register(data: {
    name: string;
    email: string;
    sdt: string;
    password: string;
    avatar?: string;
    faceId?: string;
    faceDescriptor?: string;
  }): Promise<User> {
    // Validation
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationException("Tên là bắt buộc");
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationException("Email không hợp lệ");
    }

    if (!data.sdt || data.sdt.trim().length === 0) {
      throw new ValidationException("Số điện thoại là bắt buộc");
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw new ValidationException(
        passwordValidation.errors.join(". ")
      );
    }

    // Yêu cầu faceDescriptor bắt buộc
    if (!data.faceDescriptor) {
      throw new ValidationException("Vui lòng quét khuôn mặt trước khi đăng ký");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("Email đã được đăng ký");
    }

    // Kiểm tra khuôn mặt đã tồn tại chưa (nếu có faceDescriptor)
    if (data.faceDescriptor) {
      try {
        // Parse current descriptor
        const currentDescriptor = new Float32Array(JSON.parse(data.faceDescriptor));
        
        // Lấy tất cả users có faceDescriptor
        const usersWithFace = await this.userRepository.findAllWithFaceDescriptor();
        
        // So sánh với từng user
        for (const user of usersWithFace) {
          if (!user.faceDescriptor) continue;
          
          try {
            const userDescriptor =
              this.faceRecognitionService.stringToDescriptor(user.faceDescriptor);
            const isMatch = this.faceRecognitionService.isMatch(
              currentDescriptor,
              userDescriptor
            );
            
            if (isMatch) {
              // Khuôn mặt đã tồn tại - báo cần đăng nhập
              throw new ConflictException(
                "Khuôn mặt này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký.",
                { 
                  code: "FACE_ALREADY_EXISTS",
                  existingUserEmail: user.email,
                  redirectToLogin: true 
                }
              );
            }
          } catch (error) {
            // Nếu là ConflictException với redirectToLogin, throw lại
            if (error instanceof ConflictException && (error.details as any)?.redirectToLogin) {
              throw error;
            }
            // Skip user nếu descriptor không hợp lệ
            console.error(
              `Error comparing descriptor for user ${user.id}:`,
              error
            );
            continue;
          }
        }
      } catch (error) {
        // Nếu là ConflictException với redirectToLogin, throw lại
        if (error instanceof ConflictException && (error.details as any)?.redirectToLogin) {
          throw error;
        }
        // Nếu lỗi parse descriptor, tiếp tục đăng ký bình thường
        console.error("Error checking face descriptor:", error);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Tạo faceId nếu có faceDescriptor hoặc faceId
    let finalFaceId: string | null = data.faceId || null;
    if (!finalFaceId && data.faceDescriptor) {
      finalFaceId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Kiểm tra faceId đã tồn tại chưa (nếu có)
    if (finalFaceId) {
      const existingFaceId = await this.userRepository.findByFaceId(finalFaceId);
      if (existingFaceId) {
        throw new ConflictException("Khuôn mặt này đã được đăng ký");
      }
    }

    // Tạo user mới
    return await this.userRepository.create({
      name: data.name,
      email: data.email,
      sdt: data.sdt,
      password: hashedPassword,
      avatar: data.avatar || null,
      faceId: finalFaceId,
      faceDescriptor: data.faceDescriptor || null,
    });
  }

  /**
   * Legacy enroll method - giữ lại để backward compatibility
   * @deprecated Sử dụng register thay thế
   */
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

    // Kiểm tra khuôn mặt đã tồn tại chưa (nếu có faceDescriptor)
    if (data.faceDescriptor) {
      try {
        // Parse current descriptor
        const currentDescriptor = new Float32Array(JSON.parse(data.faceDescriptor));
        
        // Lấy tất cả users có faceDescriptor
        const usersWithFace = await this.userRepository.findAllWithFaceDescriptor();
        
        // So sánh với từng user
        for (const user of usersWithFace) {
          if (!user.faceDescriptor) continue;
          
          try {
            const userDescriptor =
              this.faceRecognitionService.stringToDescriptor(user.faceDescriptor);
            const isMatch = this.faceRecognitionService.isMatch(
              currentDescriptor,
              userDescriptor
            );
            
            if (isMatch) {
              // Khuôn mặt đã tồn tại - báo cần đăng nhập
              throw new ConflictException(
                "Khuôn mặt này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký.",
                { 
                  code: "FACE_ALREADY_EXISTS",
                  existingUserEmail: user.email,
                  redirectToLogin: true 
                }
              );
            }
          } catch (error) {
            // Nếu là ConflictException với redirectToLogin, throw lại
            if (error instanceof ConflictException && (error.details as any)?.redirectToLogin) {
              throw error;
            }
            // Skip user nếu descriptor không hợp lệ
            console.error(
              `Error comparing descriptor for user ${user.id}:`,
              error
            );
            continue;
          }
        }
      } catch (error) {
        // Nếu là ConflictException với redirectToLogin, throw lại
        if (error instanceof ConflictException && (error.details as any)?.redirectToLogin) {
          throw error;
        }
        // Nếu lỗi parse descriptor, tiếp tục đăng ký bình thường
        console.error("Error checking face descriptor:", error);
      }
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

    // Tạo user mới với password mặc định (không an toàn - chỉ để backward compatibility)
    const defaultPassword = await bcrypt.hash("default_password", 10);
    return await this.userRepository.create({
      name: data.email.split("@")[0], // Dùng email prefix làm tên mặc định
      email: data.email,
      sdt: "", // Số điện thoại trống
      password: defaultPassword,
      avatar: null,
      faceId: finalFaceId,
      faceDescriptor: data.faceDescriptor || null,
    });
  }

  /**
   * Đăng nhập bằng email và password
   */
  async loginWithEmailPassword(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new ValidationException("Email và password là bắt buộc");
    }

    // Tìm user theo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email hoặc password không đúng");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email hoặc password không đúng");
    }

    return user;
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
