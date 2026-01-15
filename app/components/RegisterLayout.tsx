"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import VisualSection from "./VisualSection";
import RegisterHeader from "./RegisterHeader";
import FaceRecognitionButton from "./FaceRecognitionButton";
import RegisterForm from "./RegisterForm";
import RegisterFooter from "./RegisterFooter";

export default function RegisterLayout() {
    const router = useRouter();
    const t = useTranslations("register");
    const tCommon = useTranslations("common");
    const [loading, setLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [faceDescriptor, setFaceDescriptor] = useState<string>("");

    const handleFaceEnroll = async (faceDescriptor: string, userEmail: string) => {
        // Lưu faceDescriptor vào state để sử dụng khi submit form
        setFaceDescriptor(faceDescriptor);
        setRegisteredEmail(userEmail);
        
        // Hiển thị thông báo đã quét khuôn mặt thành công
        alert(t("faceScanned"));
    };

    const handleFormSubmit = async (data: {
        name: string;
        email: string;
        sdt: string;
        password: string;
        confirmPassword: string;
        avatar?: string;
    }) => {
        // Kiểm tra xem đã quét khuôn mặt chưa
        if (!faceDescriptor) {
            alert(t("faceRequired"));
            return;
        }

        setLoading(true);
        setRegisteredEmail(data.email);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    sdt: data.sdt,
                    password: data.password,
                    avatar: data.avatar,
                    faceDescriptor: faceDescriptor,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                if (result.token) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("user", JSON.stringify(result.user));
                }
                alert(t("success"));
                router.push("/");
            } else {
                // Kiểm tra xem có phải lỗi khuôn mặt đã tồn tại không
                if (result.code === "FACE_ALREADY_EXISTS" || (result.details && result.details.redirectToLogin)) {
                    const existingEmail = result.details?.existingUserEmail || "";
                    alert(t("faceAlreadyExists", { email: existingEmail }));
                    // Reset faceDescriptor để yêu cầu quét lại
                    setFaceDescriptor("");
                    // Redirect về trang login
                    router.push("/");
                } else {
                    alert(`${t("error")}: ${result.error || ""}`);
                }
            }
        } catch (error: unknown) {
            console.error("Register error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Lỗi không xác định";
            alert(`Đã xảy ra lỗi khi đăng ký: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
            <VisualSection />
            {/* Right Section: Register Form */}
            <div className="flex-1 flex flex-col items-center p-3 sm:p-4 md:p-6 bg-background-light dark:bg-background-dark overflow-y-auto">
                <div className="w-full max-w-[480px] my-auto">
                    <RegisterHeader />

                    {/* Biometric Action - Bắt buộc quét khuôn mặt trước */}
                    <div className="mb-3">
                        <div className="mb-2">
                            <p className="text-xs text-[#67837f] dark:text-gray-400 mb-1">
                                {t("faceRequiredMessage")}
                            </p>
                            {faceDescriptor && (
                                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span>{t("faceScanned")}</span>
                                </div>
                            )}
                        </div>
                        <FaceRecognitionButton
                            onEnroll={handleFaceEnroll}
                            mode="enroll"
                            email={registeredEmail}
                        />
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-1.5">
                        <div className="grow border-t border-[#dde4e3] dark:border-gray-700"></div>
                        <span className="shrink mx-4 text-[#67837f] text-xs font-bold uppercase tracking-widest">
                            {tCommon("then")}
                        </span>
                        <div className="grow border-t border-[#dde4e3] dark:border-gray-700"></div>
                    </div>

                    {/* Traditional Form */}
                    <RegisterForm 
                        onSubmit={handleFormSubmit} 
                        loading={loading}
                        faceScanned={!!faceDescriptor}
                    />

                    {/* Footer */}
                    <RegisterFooter />
                </div>
            </div>
        </div>
    );
}
