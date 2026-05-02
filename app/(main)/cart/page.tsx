import Link from "next/link"
import { ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCart } from "@/lib/redis"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CartItemCard } from "./cart-item"
import { CheckoutButton } from "./checkout-button"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function CartPage() {
  const user = await getCurrentUser()
  const cart = user ? await getCart(user.id) : []

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const uniqueCode = Math.floor(Math.random() * 999)
  const total = subtotal + uniqueCode

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Keranjang</h1>
      </header>

      {/* Content */}
      <div className="p-4">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-muted-foreground mb-6">
              Yuk mulai belanja produk Islami!
            </p>
            <Button asChild>
              <Link href="/shop">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Mulai Belanja
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4">
          <div className="max-w-md mx-auto">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kode Unik</span>
                <span>{formatPrice(uniqueCode)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <CheckoutButton total={total} uniqueCode={uniqueCode} />
          </div>
        </div>
      )}
    </div>
  )
}
