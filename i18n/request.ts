import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Lấy locale từ cookie, mặc định là 'vi'
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
