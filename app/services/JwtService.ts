import jwt, { SignOptions } from "jsonwebtoken";

/**
 * JWT Service
 * Xử lý tạo và verify JWT tokens
 */
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    // Lấy secret từ environment variable, mặc định là một secret ngẫu nhiên (chỉ dùng cho dev)
    this.secret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  /**
   * Tạo JWT token cho user
   */
  generateToken(payload: { userId: string; email: string }): string {
    return jwt.sign(
      payload,
      this.secret,
      {
        expiresIn: this.expiresIn,
      } as SignOptions
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.secret) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token mà không verify (dùng để lấy thông tin từ token đã expired)
   */
  decodeToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.decode(token) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
