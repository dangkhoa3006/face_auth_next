"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VisualSection from "./VisualSection";
import RegisterHeader from "./RegisterHeader";
import FaceRecognitionButton from "./FaceRecognitionButton";
import RegisterForm from "./RegisterForm";
import RegisterFooter from "./RegisterFooter";

export default function RegisterLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleFaceEnroll = async (faceDescriptor: string, userEmail: string) => {
    setLoading(true);
    const finalEmail = userEmail || email;
    
    console.log("Enrolling face:", {
      email: finalEmail,
      hasFaceDescriptor: !!faceDescriptor,
      faceDescriptorLength: faceDescriptor?.length || 0,
      faceDescriptorPreview: faceDescriptor?.substring(0, 50) || "",
    });

    try {
      const requestBody = { 
        email: finalEmail, 
        faceDescriptor 
      };
      
      console.log("Sending enroll request:", {
        email: requestBody.email,
        hasFaceDescriptor: !!requestBody.faceDescriptor,
      });

      const response = await fetch("/api/auth/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Kiểm tra content-type trước khi parse JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Nếu không phải JSON, đọc text để xem lỗi gì
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 500));
        throw new Error(`Server trả về lỗi: ${response.status} ${response.statusText}`);
      }
      
      console.log("Enroll response:", {
        ok: response.ok,
        status: response.status,
        data,
      });

      if (response.ok) {
        alert("Đăng ký khuôn mặt thành công! Bạn có thể đăng nhập ngay bây giờ.");
        // Redirect về trang login
        router.push("/");
      } else {
        alert(`Lỗi: ${data.error || "Đã xảy ra lỗi"}`);
      }
    } catch (error: unknown) {
      console.error("Enroll error:", error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      alert(`Đã xảy ra lỗi khi đăng ký khuôn mặt: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (
    userEmail: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    setEmail(userEmail);
    
    // Lưu email để dùng khi đăng ký khuôn mặt
    alert(`Email ${userEmail} đã được lưu. Vui lòng nhấn nút "Đăng ký khuôn mặt" ở trên để hoàn tất đăng ký.`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <VisualSection />
      {/* Right Section: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[480px]">
          <RegisterHeader />
          
          {/* Biometric Action */}
          <div className="mb-8">
            <FaceRecognitionButton
              onEnroll={handleFaceEnroll}
              mode="enroll"
              email={email}
            />
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="grow border-t border-[#dde4e3] dark:border-gray-700"></div>
            <span className="shrink mx-4 text-[#67837f] text-sm font-bold uppercase tracking-widest">
              or
            </span>
            <div className="grow border-t border-[#dde4e3] dark:border-gray-700"></div>
          </div>

          {/* Traditional Form */}
          <RegisterForm onSubmit={handleFormSubmit} loading={loading} email={email} />

          {/* Footer */}
          <RegisterFooter />
        </div>
      </div>
    </div>
  );
}
