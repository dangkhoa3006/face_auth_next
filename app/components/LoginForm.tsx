"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => void;
  loading?: boolean;
}

export default function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const t = useTranslations("login");
  const tCommon = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password, remember);
  };

  return (
    <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
          {tCommon("email")}
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-xl border-[#dde4e3] dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder={t("emailPlaceholder")}
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
        <div className="flex justify-between items-center">
          <label className="text-[#121716] dark:text-gray-200 text-sm font-bold">
            {tCommon("password")}
          </label>
          <a
            className="text-primary text-xs font-bold hover:underline"
            href="#"
          >
            {tCommon("forgotPassword")}
          </a>
        </div>
        <div className="relative flex items-stretch">
          <input
            className="form-input flex-1 rounded-l-xl border-[#dde4e3] border-r-0 dark:border-gray-700 bg-white dark:bg-[#1f2229] h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary dark:text-white placeholder:text-[#67837f]/50"
            placeholder={t("passwordPlaceholder")}
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
      <div className="flex items-center py-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              className="peer h-5 w-5 rounded border-[#dde4e3] dark:border-gray-700 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 transition-colors"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            />
            <span className="material-symbols-outlined absolute opacity-0 peer-checked:opacity-100 text-white text-sm pointer-events-none left-0.5">
              check
            </span>
          </div>
          <span className="text-[#121716] dark:text-gray-300 text-sm font-medium">
            {tCommon("remember")}
          </span>
        </label>
      </div>
      <button
        className="w-full bg-[#121716] dark:bg-white dark:text-[#121716] text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? tCommon("loading") : tCommon("signIn")}
      </button>
    </form>
  );
}
