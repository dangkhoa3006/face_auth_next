"use client";

import { useState, FormEvent } from "react";
import { validatePassword } from "@/app/lib/passwordValidation";

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    sdt: string;
    password: string;
    confirmPassword: string;
    avatar?: string;
  }) => void;
  loading?: boolean;
}

export default function RegisterForm({ onSubmit, loading = false }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    onSubmit({
      name,
      email,
      sdt,
      password,
      confirmPassword,
      avatar: avatar || undefined,
    });
  };

  return (
    <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Họ và Tên
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="Nhập họ và tên"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <span className="material-symbols-outlined absolute right-4 top-4 text-[#67837f]">
            person
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Email Address
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="name@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <span className="material-symbols-outlined absolute right-4 top-4 text-[#67837f]">
            mail
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Số Điện Thoại
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="0123456789"
            type="tel"
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
            required
            disabled={loading}
          />
          <span className="material-symbols-outlined absolute right-4 top-4 text-[#67837f]">
            phone
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Password
        </label>
        <div className="relative flex items-stretch">
          <input
            className={`form-input flex-1 rounded-l-xl border-[#dde4e3] border-r-0 dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50 ${
              passwordErrors.length > 0 ? "border-red-500" : ""
            }`}
            placeholder="Tạo mật khẩu"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center px-4 rounded-r-xl border border-l-0 border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] text-[#67837f] cursor-pointer hover:text-primary"
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {passwordErrors.length > 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
            {passwordErrors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        )}
        {password.length > 0 && passwordErrors.length === 0 && (
          <div className="text-xs text-green-600 dark:text-green-400">
            ✓ Mật khẩu hợp lệ
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Confirm Password
        </label>
        <div className="relative flex items-stretch">
          <input
            className={`form-input flex-1 rounded-l-xl border-[#dde4e3] border-r-0 dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50 ${
              confirmPassword.length > 0 && password !== confirmPassword
                ? "border-red-500"
                : ""
            }`}
            placeholder="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="flex items-center px-4 rounded-r-xl border border-l-0 border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] text-[#67837f] cursor-pointer hover:text-primary"
          >
            <span className="material-symbols-outlined">
              {showConfirmPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {confirmPassword.length > 0 && password !== confirmPassword && (
          <div className="text-xs text-red-600 dark:text-red-400">
            Mật khẩu xác nhận không khớp
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Avatar URL (Tùy chọn)
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="https://example.com/avatar.jpg"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            disabled={loading}
          />
          <span className="material-symbols-outlined absolute right-4 top-4 text-[#67837f]">
            image
          </span>
        </div>
      </div>

      <button
        className="w-full bg-[#121716] dark:bg-white dark:text-[#121716] text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
      </button>
    </form>
  );
}
