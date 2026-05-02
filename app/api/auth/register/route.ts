import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { hashPassword, generateSessionId } from "@/lib/auth"
import { setSession } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { name, phone, password } = await request.json()

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingUser = await sql`SELECT id FROM users WHERE phone = ${phone}`
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Nomor telepon sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (name, phone, password_hash)
      VALUES (${name}, ${phone}, ${passwordHash})
      RETURNING id, name, phone
    `

    const user = result[0]

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
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    )
  }
}
