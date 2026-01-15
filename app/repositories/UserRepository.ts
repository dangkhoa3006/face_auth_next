import { User, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import { DatabaseException, NotFoundException } from "../exceptions/AppException";

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
    email: string;
    faceId: string;
    faceDescriptor?: string | null;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          faceId: data.faceId,
          faceDescriptor: data.faceDescriptor || null,
        },
      });
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0] || "field";
        throw new ConflictException(
          `${field === "email" ? "Email" : "FaceId"} đã tồn tại`,
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
