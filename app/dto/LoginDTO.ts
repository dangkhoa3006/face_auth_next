/**
 * Data Transfer Object cho Login Request
 */
export interface LoginDTO {
  // Login bằng email/password
  email?: string;
  password?: string;
  // Login bằng face recognition
  faceId?: string;
  faceDescriptor?: string;
}

/**
 * Response DTO cho Login
 */
export interface LoginResponseDTO {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    sdt: string;
    avatar?: string;
    createdAt: Date;
  };
}
