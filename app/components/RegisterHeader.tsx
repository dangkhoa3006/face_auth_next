"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function RegisterHeader() {
  const t = useTranslations("register");

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-white">
              person_add
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            CRYPTO<span className="text-primary">VAULT</span>
          </span>
        </div>
        <LanguageSwitcher />
      </div>
      <h1 className="text-3xl font-black leading-tight text-[#121716] dark:text-white sm:text-4xl">
        {t("title")}
      </h1>
      <p className="text-[#67837f] dark:text-gray-400 mt-2">
        {t("subtitle")}
      </p>
    </div>
  );
}
