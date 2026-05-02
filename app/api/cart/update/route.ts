import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { updateCartItem } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { productId, quantity } = await request.json()

    if (productId === undefined) {
      return NextResponse.json(
        { error: "Product ID diperlukan" },
        { status: 400 }
      )
    }

    const cart = await updateCartItem(user.id, productId, quantity)

    return NextResponse.json({ success: true, cart })
  } catch (error) {
    console.error("Update cart error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    )
  }
}
