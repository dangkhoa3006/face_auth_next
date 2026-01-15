import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/locale
 * API để thay đổi locale và set cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    if (!locale || !["vi", "en"].includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, locale });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set locale" },
      { status: 500 }
    );
  }
}
