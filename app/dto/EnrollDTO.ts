/**
 * Data Transfer Object cho Register Request
 * DTO Pattern - Tách biệt data structure từ API layer
 */
export interface RegisterDTO {
  name: string;
  email: string;
  sdt: string;
  password: string;
  avatar?: string;
  faceId?: string;
  faceDescriptor?: string;
}

/**
 * Response DTO cho Register
 */
export interface RegisterResponseDTO {
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

/**
 * Legacy EnrollDTO - Giữ lại để backward compatibility
 * @deprecated Sử dụng RegisterDTO thay thế
 */
export interface EnrollDTO {
  email: string;
  faceId?: string;
  faceDescriptor?: string;
}

/**
 * Legacy EnrollResponseDTO - Giữ lại để backward compatibility
 * @deprecated Sử dụng RegisterResponseDTO thay thế
 */
export interface EnrollResponseDTO {
  message: string;
  user: {
    id: string;
    email: string;
    faceId: string | null;
    createdAt: Date;
  };
}
