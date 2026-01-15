"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const switchLocale = async (newLocale: string) => {
    startTransition(async () => {
      try {
        // Gọi API để set cookie
        await fetch("/api/locale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale: newLocale }),
        });

        // Reload page để áp dụng locale mới
        router.refresh();
      } catch (error) {
        console.error("Failed to switch locale:", error);
      }
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        disabled={isPending}
        aria-label={t("selectLanguage") || "Select language"}
        title={t("selectLanguage") || "Select language"}
        className="appearance-none bg-white dark:bg-[#1f2229] border border-[#dde4e3] dark:border-gray-700 rounded-lg px-3 py-2 pr-3 text-xl cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <option value="vi">🇻🇳</option>
        <option value="en">🇺🇸</option>
      </select>
    </div>
  );
}
