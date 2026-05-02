import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { getCart, clearCart } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { paymentMethod, uniqueCode } = await request.json()

    // Get cart
    const cart = await getCart(user.id)

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Keranjang kosong" },
        { status: 400 }
      )
    }

    // Calculate total
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const total = subtotal + (uniqueCode || 0)

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (user_id, total_amount, unique_code, payment_method, status)
      VALUES (${user.id}, ${total}, ${uniqueCode || 0}, ${paymentMethod}, 'pending')
      RETURNING id
    `

    const orderId = orderResult[0].id

    // Create order items
    for (const item of cart) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_buy)
        VALUES (${orderId}, ${item.productId}, ${item.quantity}, ${item.price})
      `
    }

    // Clear cart
    await clearCart(user.id)

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Create order error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat pesanan" },
      { status: 500 }
    )
  }
}
