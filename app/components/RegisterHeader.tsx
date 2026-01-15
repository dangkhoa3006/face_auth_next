"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function RegisterHeader() {
  const t = useTranslations("register");

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white text-base">
              person_add
            </span>
          </div>
          <span className="text-base font-extrabold tracking-tight">
            CRYPTO<span className="text-primary">VAULT</span>
          </span>
        </div>
        <LanguageSwitcher />
      </div>
      <h1 className="text-xl font-black leading-tight text-[#121716] dark:text-white sm:text-2xl">
        {t("title")}
      </h1>
      <p className="text-[#67837f] dark:text-gray-400 mt-0.5 text-xs">
        {t("subtitle")}
      </p>
    </div>
  );
}
