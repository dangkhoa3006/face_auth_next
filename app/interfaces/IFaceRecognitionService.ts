/**
 * Interface cho Face Recognition Service
 * Service Pattern - Business logic cho face recognition
 */
export interface IFaceRecognitionService {
  /**
   * Tính toán khoảng cách giữa 2 face descriptors
   */
  calculateDistance(
    descriptor1: Float32Array,
    descriptor2: Float32Array
  ): number;

  /**
   * Kiểm tra xem 2 khuôn mặt có khớp không
   */
  isMatch(
    descriptor1: Float32Array,
    descriptor2: Float32Array,
    threshold?: number
  ): boolean;

  /**
   * Convert descriptor thành string để lưu vào database
   */
  descriptorToString(descriptor: Float32Array): string;

  /**
   * Convert string từ database về Float32Array
   */
  stringToDescriptor(str: string): Float32Array;
}
