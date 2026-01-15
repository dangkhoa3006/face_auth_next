import * as faceapi from "face-api.js";

// Models URL - sử dụng CDN hoặc public folder
const MODEL_URL = "/models";

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;

  try {
    // Load models từ CDN (miễn phí, không cần đăng ký)
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"),
      faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"),
      faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"),
    ]);
    modelsLoaded = true;
    console.log("Face recognition models loaded successfully");
  } catch (error) {
    console.error("Error loading models:", error);
    // Fallback: thử load từ local public/models nếu có
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoaded = true;
    } catch (localError) {
      console.error("Error loading models from local:", localError);
      throw new Error("Không thể tải models nhận diện khuôn mặt");
    }
  }
}

export async function detectFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
  await loadModels();
  
  const detection = await faceapi
    .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error("Không phát hiện được khuôn mặt. Vui lòng đảm bảo khuôn mặt rõ ràng và đủ ánh sáng.");
  }

  return detection.descriptor;
}

export function calculateFaceDistance(descriptor1: Float32Array, descriptor2: Float32Array): number {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}

export function isMatch(distance: number, threshold: number = 0.6): boolean {
  return distance < threshold;
}

// Convert descriptor to JSON string để lưu vào database
export function descriptorToString(descriptor: Float32Array): string {
  return JSON.stringify(Array.from(descriptor));
}

// Convert từ string về Float32Array
export function stringToDescriptor(str: string): Float32Array {
  return new Float32Array(JSON.parse(str));
}
