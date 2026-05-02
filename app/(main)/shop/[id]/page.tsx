import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
} from "lucide-react"
import { sql, type Product } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "./add-to-cart-button"

async function getProduct(id: number): Promise<Product | null> {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return (result[0] as Product) || null
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(parseInt(id))

  if (!product) {
    notFound()
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-72 bg-muted">
        <Link
          href="/shop"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center z-10">
          <Share2 className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground/30" />
        </div>
        {discount > 0 && (
          <div className="absolute bottom-4 left-4 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 -mt-4 relative">
        <Card>
          <CardContent className="p-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-2">
              {product.category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  {product.category}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.sold} terjual)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-foreground mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              {product.old_price && (
                <p className="text-base text-muted-foreground line-through">
                  {formatPrice(product.old_price)}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="font-semibold text-foreground mb-2">Deskripsi</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="font-semibold text-foreground mb-3">
              Informasi Produk
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kategori</span>
                <span className="font-medium">{product.category || "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {product.rating}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terjual</span>
                <span className="font-medium">{product.sold} pcs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link
            href="/cart"
            className="w-12 h-12 rounded-xl border border-border flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}
