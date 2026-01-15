"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import * as faceapi from "face-api.js";
import {
  loadModels,
  detectFace,
  descriptorToString,
} from "@/app/lib/faceRecognition";

interface FaceRecognitionButtonProps {
  onEnroll?: (faceDescriptor: string, email: string) => void;
  onLogin?: (faceDescriptor: string) => void;
  mode?: "login" | "enroll";
  email?: string; // Email từ form để dùng khi enroll
}

export default function FaceRecognitionButton({
  onEnroll,
  onLogin,
  mode = "login",
  email = "",
}: FaceRecognitionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [detectionProgress, setDetectionProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Load models khi component mount
    loadModels()
      .then(() => setModelsReady(true))
      .catch((err) => {
        console.error("Failed to load models:", err);
        setError("Không thể tải models nhận diện khuôn mặt");
      });
  }, []);

  // Cleanup interval khi component unmount hoặc camera đóng
  useEffect(() => {
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [detectionInterval]);

  // Ngăn scroll khi modal mở
  useEffect(() => {
    if (showCamera) {
      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll khi đóng modal
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showCamera]);

  const startFaceDetection = useCallback(async () => {
    if (!modelsReady || !videoRef.current || !canvasRef.current) return;

    let detectionCount = 0;
    const requiredDetections = 3; // Cần phát hiện 3 lần liên tiếp để xác nhận

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current || !modelsReady) return;

      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const detection = await faceapi
          .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detection) {
          detectionCount++;
          const progress = Math.min((detectionCount / requiredDetections) * 100, 100);
          setDetectionProgress(progress);

          if (detectionCount >= requiredDetections) {
            setFaceDetected(true);
          }
        } else {
          detectionCount = 0;
          setDetectionProgress(0);
          setFaceDetected(false);
        }
      } catch (err: unknown) {
        console.error("Face detection error:", err);
        // Ignore detection errors during real-time detection
      }
    };

    // Detect mỗi 300ms để mượt hơn
    const interval = setInterval(detect, 300);
    setDetectionInterval(interval);
    detect(); // Detect ngay lập tức
  }, [modelsReady]);

  // Gán stream vào video element khi cả hai đã sẵn sàng
  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      console.log("Assigning stream to video element");
      videoRef.current.srcObject = cameraStream;

      videoRef.current.onloadedmetadata = () => {
        console.log("Video ready, starting face detection");
        setTimeout(() => {
          if (modelsReady) {
            startFaceDetection();
          }
        }, 500);
      };
    }
  }, [showCamera, cameraStream, modelsReady, startFaceDetection]);

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");

      // Mở modal trước để video element được render
      setShowCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      console.log("Camera access granted, stream:", stream);

      // Lưu stream vào state, useEffect sẽ gán vào video element
      setCameraStream(stream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      setShowCamera(false);
      setCameraStream(null);
    }
  };


  const stopCamera = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setFaceDetected(false);
    setDetectionProgress(0);
  };

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Vẽ video frame lên canvas
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Không thể lấy canvas context");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Phát hiện và lấy face descriptor
      const descriptor = await detectFace(canvas);
      const descriptorString = descriptorToString(descriptor);

      console.log("Face detected and converted:", {
        descriptorType: descriptor?.constructor?.name,
        descriptorLength: descriptor?.length || 0,
        descriptorStringLength: descriptorString?.length || 0,
        descriptorStringPreview: descriptorString?.substring(0, 100) || "",
      });

      stopCamera();

      if (mode === "enroll") {
        // Lấy email từ props hoặc prompt
        let userEmail = email;

        // Nếu không có email từ props, prompt để nhập
        if (!userEmail) {
          userEmail = prompt("Vui lòng nhập email của bạn:") || "";
        }

        if (!userEmail) {
          alert("Email là bắt buộc để đăng ký!");
          setLoading(false);
          return;
        }

        if (onEnroll) {
          await onEnroll(descriptorString, userEmail);
        }
      } else {
        // Login mode - gửi descriptor lên server để so sánh
        if (onLogin) {
          await onLogin(descriptorString);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi khi nhận diện khuôn mặt";
      console.error("Face recognition error:", err);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    console.log("Button clicked, modelsReady:", modelsReady, "showCamera:", showCamera);

    if (!modelsReady) {
      alert("Models đang được tải. Vui lòng đợi...");
      return;
    }

    if (showCamera) {
      // Nếu camera đang mở, chụp ảnh
      await captureAndProcess();
    } else {
      // Mở camera
      console.log("Starting camera...");
      await startCamera();
      console.log("Camera started, showCamera should be true");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || !modelsReady}
        className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary via-[#2ba08a] to-primary hover:from-[#1c7162] hover:via-[#248f7d] hover:to-[#1c7162] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">
          face_unlock
        </span>
        <span className="relative z-10">
          {loading
            ? "Đang xử lý..."
            : !modelsReady
              ? "Đang tải models..."
              : mode === "enroll"
                ? "Đăng ký khuôn mặt"
                : "Đăng nhập bằng khuôn mặt"}
        </span>

        {/* Loading indicator */}
        {loading && (
          <span className="absolute right-4 material-symbols-outlined text-xl animate-spin">
            sync
          </span>
        )}
      </button>

      {/* Camera Modal - Dùng Portal để render ra ngoài component tree */}
      {mounted && showCamera && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-md p-3 w-screen h-screen animate-in fade-in duration-300 overflow-hidden"
          onClick={(e) => {
            // Đóng modal khi click vào backdrop
            if (e.target === e.currentTarget) {
              stopCamera();
            }
          }}
        >
          <div
            className="bg-white/95 dark:bg-[#1f2229]/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden relative z-10000 border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header với gradient */}
            <div className="bg-gradient-to-r from-primary via-[#2ba08a] to-primary text-white p-3 flex items-center justify-between shadow-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xl">face</span>
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {mode === "enroll" ? "Đăng ký khuôn mặt" : "Đăng nhập bằng khuôn mặt"}
                  </h3>
                  <p className="text-[10px] text-white/80 mt-0.5">
                    {mode === "enroll" ? "Quét khuôn mặt để đăng ký" : "Quét khuôn mặt để đăng nhập"}
                  </p>
                </div>
              </div>
              <button
                onClick={stopCamera}
                disabled={loading}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Camera View */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden pt-16 pb-2 flex-1 min-h-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-[40vh] object-cover block"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Loading indicator khi video chưa sẵn sàng */}
              {videoRef.current && videoRef.current.readyState < 2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="text-white text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <span className="material-symbols-outlined text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        camera
                      </span>
                    </div>
                    <p className="text-sm font-medium">Đang khởi động camera...</p>
                  </div>
                </div>
              )}

              {/* Status và Progress bar - Đặt ở trên cùng, không đè lên khung */}
              <div className="absolute top-3 left-0 right-0 px-4 z-20 pointer-events-none">
                {/* Status indicator với glassmorphism */}
                {faceDetected ? (
                  <div className="mx-auto max-w-fit bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl backdrop-blur-sm border border-white/20 animate-in zoom-in-95 duration-300">
                    <span className="material-symbols-outlined text-sm animate-in zoom-in">check_circle</span>
                    <span className="text-xs font-bold">Đã phát hiện khuôn mặt</span>
                  </div>
                ) : (
                  <div className="mx-auto max-w-fit bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl backdrop-blur-sm border border-white/20">
                    <span className="material-symbols-outlined text-sm animate-pulse">face</span>
                    <span className="text-xs font-bold">Đưa khuôn mặt vào khung</span>
                  </div>
                )}

                {/* Progress bar */}
                {!faceDetected && detectionProgress > 0 && (
                  <div className="mx-auto mt-2 w-40">
                    <div className="h-1 bg-gray-700/80 rounded-full overflow-hidden backdrop-blur-sm">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
                        style={{ width: `${detectionProgress}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Face Detection Overlay với thiết kế hiện đại */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                {/* Mask overlay - Giảm độ mờ để không che quá nhiều */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

                {/* Detection frame - Chỉ hiển thị khung, không có status indicator */}
                <div className={`relative w-56 h-72 transition-all duration-500 ${faceDetected ? 'scale-105' : 'scale-100'}`}>
                  {/* Main frame với gradient border */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${faceDetected
                    ? 'border-[3px] border-green-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_20px_rgba(34,197,94,0.5)]'
                    : 'border-[3px] border-yellow-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_20px_rgba(250,204,21,0.3)]'
                    }`}>
                    {/* Animated corner indicators */}
                    <div className={`absolute -top-1.5 -left-1.5 w-8 h-8 border-t-[3px] border-l-[3px] rounded-tl-xl transition-all duration-300 ${faceDetected ? 'border-green-400' : 'border-yellow-400'
                      }`}>
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    </div>
                    <div className={`absolute -top-1.5 -right-1.5 w-8 h-8 border-t-[3px] border-r-[3px] rounded-tr-xl transition-all duration-300 ${faceDetected ? 'border-green-400' : 'border-yellow-400'
                      }`}>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full animate-ping animate-ping-delay-1"></div>
                    </div>
                    <div className={`absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-[3px] border-l-[3px] rounded-bl-xl transition-all duration-300 ${faceDetected ? 'border-green-400' : 'border-yellow-400'
                      }`}>
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white rounded-full animate-ping animate-ping-delay-2"></div>
                    </div>
                    <div className={`absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-[3px] border-r-[3px] rounded-br-xl transition-all duration-300 ${faceDetected ? 'border-green-400' : 'border-yellow-400'
                      }`}>
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white rounded-full animate-ping animate-ping-delay-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions với glassmorphism - Đặt riêng biệt, không đè lên camera */}
            <div className="px-3 py-2 bg-gradient-to-b from-gray-50/90 to-white/90 dark:from-background-dark/90 dark:to-[#1f2229]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
              <div className="bg-black/60 backdrop-blur-xl text-white p-2.5 rounded-xl text-xs border border-white/10 shadow-xl">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-primary/30 rounded-md">
                    <span className="material-symbols-outlined text-sm">info</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold mb-1 text-xs">Hướng dẫn:</p>
                    <ul className="space-y-1 text-[10px]">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                        <span>Đưa khuôn mặt vào khung hình</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                        <span>Đảm bảo đủ ánh sáng</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                        <span>Nhìn thẳng vào camera</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                        <span>Giữ nguyên khi thấy &quot;Đã phát hiện&quot;</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions với thiết kế hiện đại */}
            <div className="p-3 bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-background-dark/80 dark:to-[#1f2229]/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 flex gap-2 flex-shrink-0">
              <button
                onClick={stopCamera}
                disabled={loading}
                className="flex-1 bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50"
              >
                <span className="material-symbols-outlined text-base">close</span>
                Hủy
              </button>
              <button
                onClick={captureAndProcess}
                disabled={loading || !faceDetected}
                className={`flex-1 bg-gradient-to-r from-primary via-[#2ba08a] to-primary hover:from-[#1c7162] hover:via-[#248f7d] hover:to-[#1c7162] text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden ${faceDetected && !loading ? 'opacity-100' : ''} ${faceDetected && !loading ? 'animate-pulse' : ''
                  }`}
              >
                {/* Animated background */}
                {faceDetected && !loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                )}

                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin relative z-10">sync</span>
                    <span className="relative z-10">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base relative z-10">
                      {faceDetected ? 'camera' : 'hourglass_empty'}
                    </span>
                    <span className="relative z-10">
                      {faceDetected ? "Xác nhận" : "Chờ phát hiện"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {error && (
        <div className="mt-2 text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          {error}
        </div>
      )}
    </>
  );
}
