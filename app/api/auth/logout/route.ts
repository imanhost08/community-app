import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/redis"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (sessionId) {
      await deleteSession(sessionId)
    }

    cookieStore.delete("session_id")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 }
    )
  }
}
