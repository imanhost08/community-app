"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { type CartItem } from "@/lib/redis"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function CartItemCard({ item }: { item: CartItem }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(item.quantity)
  const [loading, setLoading] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    setLoading(true)
    setQuantity(newQuantity)

    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: newQuantity,
        }),
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      setQuantity(item.quantity)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    await updateQuantity(0)
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image */}
          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm line-clamp-2">
              {item.name}
            </h3>
            <p className="text-primary font-semibold mt-1">
              {formatPrice(item.price)}
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                  disabled={loading || quantity <= 1}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-medium text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={loading}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleRemove}
                disabled={loading}
                className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
