/**
 * Data Transfer Object cho Login Request
 */
export interface LoginDTO {
  faceId?: string;
  faceDescriptor?: string;
}

/**
 * Response DTO cho Login
 */
export interface LoginResponseDTO {
  message: string;
  user: {
    id: string;
    email: string;
    faceId: string;
    createdAt: Date;
  };
}
