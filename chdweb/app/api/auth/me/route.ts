import { NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const user = await verifySession(token)
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        phone_number: user.phone_number,
        full_name: user.full_name,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    )
  }
}
