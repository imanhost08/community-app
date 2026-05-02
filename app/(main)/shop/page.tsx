import Link from "next/link"
import { Search, ShoppingBag, Star } from "lucide-react"
import { sql, type Product } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShopFilter } from "./shop-filter"

async function getProducts(category?: string): Promise<Product[]> {
  if (category && category !== "all") {
    return (await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`) as Product[]
  }
  return (await sql`SELECT * FROM products ORDER BY created_at DESC`) as Product[]
}

async function getCategories(): Promise<string[]> {
  const result = await sql`SELECT DISTINCT category FROM products WHERE category IS NOT NULL`
  return result.map((r) => r.category as string)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const products = await getProducts(params.category)
  const categories = await getCategories()

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-accent text-accent-foreground p-4 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-4">Toko Islami</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
          <Input
            placeholder="Cari produk..."
            className="pl-10 bg-white/20 border-0 placeholder:opacity-60"
          />
        </div>
      </header>

      {/* Content */}
      <div className="p-4 -mt-2">
        {/* Filter */}
        <ShopFilter categories={categories} currentCategory={params.category} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {products.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada produk tersedia</p>
            </div>
          ) : (
            products.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`}>
                <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating} | {product.sold} terjual
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-primary font-semibold">
                        {formatPrice(product.price)}
                      </p>
                      {product.old_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.old_price)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
