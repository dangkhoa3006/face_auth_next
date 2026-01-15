import { User, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  DatabaseException,
  NotFoundException,
  ConflictException,
} from "../exceptions/AppException";

/**
 * User Repository Implementation
 * Repository Pattern - Encapsulates data access logic
 */
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error: any) {
      throw new DatabaseException(
        `Lỗi khi tìm user theo email: ${error.message}`,
        error
      );
    }
  }

  async findByFaceId(faceId: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { faceId },
      });
    } catch (error: any) {
      throw new DatabaseException(
        `Lỗi khi tìm user theo faceId: ${error.message}`,
        error
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error: any) {
      throw new DatabaseException(
        `Lỗi khi tìm user theo ID: ${error.message}`,
        error
      );
    }
  }

  async findAllWithFaceDescriptor(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: { faceDescriptor: { not: null } },
      });
    } catch (error: any) {
      throw new DatabaseException(
        `Lỗi khi lấy danh sách users: ${error.message}`,
        error
      );
    }
  }

  async create(data: {
    name: string;
    email: string;
    sdt: string;
    password: string;
    avatar?: string | null;
    faceId?: string | null;
    faceDescriptor?: string | null;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          sdt: data.sdt,
          password: data.password,
          avatar: data.avatar || null,
          faceId: data.faceId || null,
          faceDescriptor: data.faceDescriptor || null,
        },
      });
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0] || "field";
        const fieldNames: Record<string, string> = {
          email: "Email",
          sdt: "Số điện thoại",
          faceId: "FaceId",
        };
        throw new ConflictException(
          `${fieldNames[field] || field} đã tồn tại`,
          { field, code: error.code }
        );
      }
      throw new DatabaseException(
        `Lỗi khi tạo user: ${error.message}`,
        error
      );
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException("User không tồn tại");
      }

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Lỗi khi cập nhật user: ${error.message}`,
        error
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException("User không tồn tại");
      }

      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Lỗi khi xóa user: ${error.message}`,
        error
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error: any) {
      throw new DatabaseException(
        `Lỗi khi lấy danh sách users: ${error.message}`,
        error
      );
    }
  }
}
