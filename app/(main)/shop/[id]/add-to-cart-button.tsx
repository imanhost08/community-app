"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Product } from "@/lib/db"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to add to cart")
      }

      router.push("/cart")
    } catch (error) {
      console.error(error)
      alert("Gagal menambahkan ke keranjang")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center gap-3">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 h-12 font-semibold"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {loading ? "Menambahkan..." : formatPrice(product.price * quantity)}
      </Button>
    </div>
  )
}
