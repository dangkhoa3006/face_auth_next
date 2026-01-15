import * as faceapi from "face-api.js";
import { IFaceRecognitionService } from "../interfaces/IFaceRecognitionService";

/**
 * Face Recognition Service Implementation
 * Service Pattern - Business logic cho face recognition
 */
export class FaceRecognitionService implements IFaceRecognitionService {
  private readonly DEFAULT_THRESHOLD = 0.6;

  calculateDistance(
    descriptor1: Float32Array,
    descriptor2: Float32Array
  ): number {
    return faceapi.euclideanDistance(descriptor1, descriptor2);
  }

  isMatch(
    descriptor1: Float32Array,
    descriptor2: Float32Array,
    threshold: number = this.DEFAULT_THRESHOLD
  ): boolean {
    const distance = this.calculateDistance(descriptor1, descriptor2);
    return distance < threshold;
  }

  descriptorToString(descriptor: Float32Array): string {
    return JSON.stringify(Array.from(descriptor));
  }

  stringToDescriptor(str: string): Float32Array {
    try {
      return new Float32Array(JSON.parse(str));
    } catch (error) {
      throw new Error(`Invalid descriptor string: ${error}`);
    }
  }
}
