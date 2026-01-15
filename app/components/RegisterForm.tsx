"use client";

import { useState, FormEvent } from "react";

interface RegisterFormProps {
  onSubmit: (email: string, password: string, confirmPassword: string) => void;
  loading?: boolean;
  email?: string;
}

export default function RegisterForm({ onSubmit, loading = false, email }: RegisterFormProps) {
  const [formEmail, setFormEmail] = useState(email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formEmail, password, confirmPassword);
  };

  return (
    <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Email Address
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="name@company.com"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
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
          Password
        </label>
        <div className="relative flex items-stretch">
          <input
            className="form-input flex-1 rounded-l-xl border-[#dde4e3] border-r-0 dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder="Tạo mật khẩu"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          Confirm Password
        </label>
        <div className="relative flex items-stretch">
          <input
            className="form-input flex-1 rounded-l-xl border-[#dde4e3] border-r-0 dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
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
