import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { addToCart, type CartItem } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { productId, quantity, name, price, image } = await request.json()

    if (!productId || !quantity || !name || !price) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      )
    }

    const item: CartItem = {
      productId,
      quantity,
      name,
      price,
      image,
    }

    const cart = await addToCart(user.id, item)

    return NextResponse.json({ success: true, cart })
  } catch (error) {
    console.error("Add to cart error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    )
  }
}
