import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import { UserRepository } from "../repositories/UserRepository";
import { FaceRecognitionService } from "../services/FaceRecognitionService";
import { AuthService } from "../services/AuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IFaceRecognitionService } from "../interfaces/IFaceRecognitionService";
import { IAuthService } from "../interfaces/IAuthService";

/**
 * Service Provider
 * Dependency Injection Pattern - Centralized service container
 */
class ServiceProvider {
  private static instance: ServiceProvider;
  private _userRepository: IUserRepository | null = null;
  private _faceRecognitionService: IFaceRecognitionService | null = null;
  private _authService: IAuthService | null = null;

  private constructor() {}

  static getInstance(): ServiceProvider {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }

  /**
   * Get User Repository (Singleton)
   */
  getUserRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(prisma);
    }
    return this._userRepository;
  }

  /**
   * Get Face Recognition Service (Singleton)
   */
  getFaceRecognitionService(): IFaceRecognitionService {
    if (!this._faceRecognitionService) {
      this._faceRecognitionService = new FaceRecognitionService();
    }
    return this._faceRecognitionService;
  }

  /**
   * Get Auth Service (Singleton)
   */
  getAuthService(): IAuthService {
    if (!this._authService) {
      this._authService = new AuthService(
        this.getUserRepository(),
        this.getFaceRecognitionService()
      );
    }
    return this._authService;
  }

  /**
   * Reset all services (useful for testing)
   */
  reset(): void {
    this._userRepository = null;
    this._faceRecognitionService = null;
    this._authService = null;
  }
}

// Export singleton instance
export const serviceProvider = ServiceProvider.getInstance();

// Export types for convenience
export type { IUserRepository, IFaceRecognitionService, IAuthService };
