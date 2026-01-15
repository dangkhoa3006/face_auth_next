import { User } from "@prisma/client";

/**
 * Interface cho User Repository
 * Repository Pattern - Tách biệt data access logic
 */
export interface IUserRepository {
  /**
   * Tìm user theo email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Tìm user theo faceId
   */
  findByFaceId(faceId: string): Promise<User | null>;

  /**
   * Tìm user theo ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Lấy tất cả users có faceDescriptor
   */
  findAllWithFaceDescriptor(): Promise<User[]>;

  /**
   * Tạo user mới
   */
  create(data: {
    name: string;
    email: string;
    sdt: string;
    password: string;
    avatar?: string | null;
    faceId?: string | null;
    faceDescriptor?: string | null;
  }): Promise<User>;

  /**
   * Cập nhật user
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * Xóa user
   */
  delete(id: string): Promise<void>;

  /**
   * Lấy tất cả users
   */
  findAll(): Promise<User[]>;
}
