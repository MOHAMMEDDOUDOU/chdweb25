import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (token) {
      await logoutUser(token);
    }
    const res = NextResponse.json({ message: "تم تسجيل الخروج بنجاح" });
    res.cookies.delete("auth-token");
    return res;
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الخروج" }, { status: 500 });
  }
}
