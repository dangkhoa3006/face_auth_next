"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import VisualSection from "./VisualSection";
import LoginHeader from "./LoginHeader";
import FaceRecognitionButton from "./FaceRecognitionButton";
import LoginForm from "./LoginForm";
import LoginFooter from "./LoginFooter";

export default function LoginLayout() {
    const t = useTranslations("login");
    const tCommon = useTranslations("common");
    const [loading, setLoading] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState<Array<{ faceId: string; descriptor: string }>>([]);

  // Ngăn scroll hoàn toàn
  useEffect(() => {
    // Disable scroll
    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
    };

    // Disable scroll events
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('scroll', () => window.scrollTo(0, 0));

    // Disable body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // Load danh sách users đã đăng ký để so sánh khi login
  useEffect(() => {
    const loadEnrolledUsers = async () => {
      try {
        const response = await fetch("/api/auth/users");
        if (response.ok) {
          const data = await response.json();
          const usersWithDescriptors = data.users
            .filter((u: any) => u.faceDescriptor)
            .map((u: any) => ({
              faceId: u.faceId,
              descriptor: u.faceDescriptor,
            }));
          setEnrolledUsers(usersWithDescriptors);
        }
      } catch (error) {
        console.error("Error loading enrolled users:", error);
      }
    };
    loadEnrolledUsers();
  }, []);

  const handleFaceEnroll = async (faceDescriptor: string, email: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, faceDescriptor }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng ký khuôn mặt thành công!");
        // Reload enrolled users
        const reloadResponse = await fetch("/api/auth/users");
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          const usersWithDescriptors = reloadData.users
            .filter((u: any) => u.faceDescriptor)
            .map((u: any) => ({
              faceId: u.faceId,
              descriptor: u.faceDescriptor,
            }));
          setEnrolledUsers(usersWithDescriptors);
        }
      } else {
        alert(`Lỗi: ${data.error || "Đã xảy ra lỗi"}`);
      }
    } catch (error) {
      console.error("Enroll error:", error);
      alert("Đã xảy ra lỗi khi đăng ký khuôn mặt");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async (faceDescriptor: string) => {
    setLoading(true);
    try {
      // Gửi faceDescriptor lên server để so sánh
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faceDescriptor }),
      });

      const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                alert(t("success", { name: data.user.name || data.user.email }));
                // Có thể redirect đến trang dashboard ở đây
                window.location.href = "/dashboard";
            } else {
                alert(`${t("error")}: ${data.error || t("invalidCredentials")}`);
            }
    } catch (error) {
      console.error("Login error:", error);
      alert("Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (
    email: string,
    password: string,
    remember: boolean
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    
                    // Nếu remember = true, có thể lưu vào cookie với thời gian dài hơn
                    if (remember) {
                        // Có thể implement cookie storage ở đây nếu cần
                    }
                }
                alert(t("success", { name: data.user.name || data.user.email }));
                // Redirect đến trang dashboard
                window.location.href = "/dashboard";
            } else {
                alert(`${t("error")}: ${data.error || t("invalidCredentials")}`);
            }
    } catch (error) {
      console.error("Form login error:", error);
      alert("Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden fixed inset-0">
      <VisualSection />
      {/* Right Section: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="w-full max-w-[480px]">
          <LoginHeader />
          {/* Biometric Action */}
          <div className="mb-8">
            <FaceRecognitionButton
              onEnroll={handleFaceEnroll}
              onLogin={handleFaceLogin}
              mode="login"
            />
          </div>
          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-[#dde4e3] dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-[#67837f] text-sm font-bold uppercase tracking-widest">
              {tCommon("or")}
            </span>
            <div className="flex-grow border-t border-[#dde4e3] dark:border-gray-700"></div>
          </div>
          {/* Traditional Form */}
          <LoginForm onSubmit={handleFormSubmit} loading={loading} />
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
