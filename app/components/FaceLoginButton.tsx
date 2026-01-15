"use client";

import { useEffect, useState } from "react";

interface FaceLoginButtonProps {
  onEnroll?: (faceId: string, email: string) => void;
  onLogin?: (faceId: string) => void;
  mode?: "login" | "enroll";
}

// Type cho FaceIO instance
interface FaceIOInstance {
  enroll: (options: { locale: string; payload?: { email?: string } }) => Promise<{
    facialId: string;
    payload?: { email?: string };
  }>;
  authenticate: (options: { locale: string }) => Promise<{
    facialId: string;
  }>;
}

type FaceIO = FaceIOInstance | "demo" | null;

export default function FaceLoginButton({
  onEnroll,
  onLogin,
  mode = "login",
}: FaceLoginButtonProps) {
  const [faceIO, setFaceIO] = useState<FaceIO>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamic import để tránh SSR issues
    const loadFaceIO = async () => {
      const appId = process.env.NEXT_PUBLIC_FACEIO_APP_ID;
      
      // Nếu không có App ID, dùng mock mode (demo)
      if (!appId || appId === "YOUR_FACEIO_APP_PUBLIC_ID") {
        console.warn("FaceIO App ID chưa được cấu hình. Đang chạy ở chế độ demo.");
        setFaceIO("demo"); // Đánh dấu là demo mode
        return;
      }

      try {
        const faceIOModule = await import("@faceio/fiojs");
        const fio = new faceIOModule.default(appId) as FaceIOInstance;
        setFaceIO(fio);
      } catch (error) {
        console.error("Error loading FaceIO:", error);
        // Fallback to demo mode nếu load FaceIO thất bại
        setFaceIO("demo");
      }
    };

    loadFaceIO();
  }, []);

  const handleFaceAuth = async () => {
    if (!faceIO) {
      alert("FaceIO chưa sẵn sàng. Vui lòng thử lại sau.");
      return;
    }

    setLoading(true);
    
    // Demo mode - không cần FaceIO thật
    if (faceIO === "demo") {
      setTimeout(() => {
        if (mode === "enroll") {
          const email = prompt("Vui lòng nhập email của bạn:") || "demo@example.com";
          // Tạo faceId giả cho demo
          const mockFaceId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          alert(`🎭 DEMO MODE: Đăng ký thành công!\nEmail: ${email}\nFaceID: ${mockFaceId}\n\n(Lưu ý: Đây là chế độ demo. Để dùng thật, bạn cần đăng ký FaceIO free tại faceio.net)`);
          if (onEnroll) {
            onEnroll(mockFaceId, email);
          }
        } else {
          // Demo login - giả lập việc nhận diện
          const mockFaceId = prompt("Nhập FaceID để đăng nhập (demo mode):") || "demo_123";
          alert(`🎭 DEMO MODE: Đang đăng nhập với FaceID: ${mockFaceId}\n\n(Lưu ý: Đây là chế độ demo. Để dùng thật, bạn cần đăng ký FaceIO free tại faceio.net)`);
          if (onLogin) {
            onLogin(mockFaceId);
          }
        }
        setLoading(false);
      }, 1000); // Giả lập delay
      return;
    }

    // FaceIO thật
    try {
      if (mode === "enroll") {
        // Đăng ký khuôn mặt
        const email = prompt("Vui lòng nhập email của bạn:") || undefined;
        const response = await faceIO.enroll({
          locale: "auto",
          payload: {
            email,
          },
        });

        if (response && response.facialId && onEnroll) {
          await onEnroll(response.facialId, response.payload?.email || "");
        }
      } else {
        // Đăng nhập bằng khuôn mặt
        const response = await faceIO.authenticate({
          locale: "auto",
        });

        if (response && response.facialId && onLogin) {
          await onLogin(response.facialId);
        }
      }
    } catch (error: unknown) {
      console.error("FaceIO error:", error);
      const faceIOError = error as { name?: string; message?: string };
      if (faceIOError.name === "fioErrCodePERMISSION_REFUSED") {
        alert("Bạn cần cấp quyền truy cập camera để sử dụng tính năng này.");
      } else if (faceIOError.name === "fioErrCodeUSER_CANCELLED") {
        // User cancelled, không cần hiển thị lỗi
      } else {
        alert(`Lỗi: ${faceIOError.message || "Đã xảy ra lỗi không xác định"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const isDemoMode = faceIO === "demo";
  
  return (
    <button
      onClick={handleFaceAuth}
      disabled={loading || !faceIO}
      className="group w-full flex items-center justify-center gap-3 bg-primary hover:bg-[#1c7162] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 relative"
    >
      {isDemoMode && (
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          DEMO
        </span>
      )}
      <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
        face_unlock
      </span>
      <span>
        {loading
          ? "Đang xử lý..."
          : mode === "enroll"
          ? "Đăng ký khuôn mặt"
          : "Login with Face ID"}
      </span>
    </button>
  );
}
