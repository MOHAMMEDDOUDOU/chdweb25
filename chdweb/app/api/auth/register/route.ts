import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, phone_number, password, full_name } = await req.json();
    if (!username || !phone_number || !password || !full_name) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }
    const user = await registerUser(username, phone_number, password, full_name);
    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user.id,
        username: user.username,
        phone_number: user.phone_number,
        full_name: user.full_name,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "حدث خطأ أثناء إنشاء الحساب" },
      { status: e.message?.includes("موجود") ? 409 : 500 }
    );
  }
}
