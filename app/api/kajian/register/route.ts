import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { kajianId, paymentMethod, amount } = await request.json()

    if (!kajianId) {
      return NextResponse.json(
        { error: "Kajian ID diperlukan" },
        { status: 400 }
      )
    }

    // Check if already registered
    const existing = await sql`
      SELECT id FROM kajian_registrations 
      WHERE user_id = ${user.id} AND kajian_id = ${kajianId}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Anda sudah terdaftar di kajian ini" },
        { status: 400 }
      )
    }

    // Check kajian exists and has spots
    const kajian = await sql`
      SELECT id, spot, filled FROM kajian WHERE id = ${kajianId}
    `

    if (kajian.length === 0) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 }
      )
    }

    if (kajian[0].filled >= kajian[0].spot) {
      return NextResponse.json(
        { error: "Kuota kajian sudah penuh" },
        { status: 400 }
      )
    }

    // Register user
    await sql`
      INSERT INTO kajian_registrations (user_id, kajian_id, amount_paid, payment_method, status)
      VALUES (${user.id}, ${kajianId}, ${amount || 0}, ${paymentMethod || 'free'}, 'success')
    `

    // Update filled count
    await sql`
      UPDATE kajian SET filled = filled + 1 WHERE id = ${kajianId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Register kajian error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    )
  }
}
