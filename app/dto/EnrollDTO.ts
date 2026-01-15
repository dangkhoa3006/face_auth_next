/**
 * Data Transfer Object cho Enroll Request
 * DTO Pattern - Tách biệt data structure từ API layer
 */
export interface EnrollDTO {
  email: string;
  faceId?: string;
  faceDescriptor?: string;
}

/**
 * Response DTO cho Enroll
 */
export interface EnrollResponseDTO {
  message: string;
  user: {
    id: string;
    email: string;
    faceId: string;
    createdAt: Date;
  };
}
