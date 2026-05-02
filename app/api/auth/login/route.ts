import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { verifyPassword, generateSessionId } from "@/lib/auth"
import { setSession } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Nomor telepon dan password harus diisi" },
        { status: 400 }
      )
    }

    // Find user
    const users = await sql`
      SELECT id, name, phone, password_hash 
      FROM users 
      WHERE phone = ${phone}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Nomor telepon atau password salah" },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Nomor telepon atau password salah" },
        { status: 401 }
      )
    }

    // Create session
    const sessionId = generateSessionId()
    await setSession(sessionId, user.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, phone: user.phone },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    )
  }
}
