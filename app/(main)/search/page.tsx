import Link from "next/link"
import { ArrowLeft, Search, BookOpen, ShoppingBag, Star, Clock, Users } from "lucide-react"
import { sql, type Kajian, type Product } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { SearchInput } from "./search-input"

async function searchKajian(query: string): Promise<Kajian[]> {
  if (!query) return []
  const searchQuery = `%${query}%`
  return (await sql`
    SELECT * FROM kajian 
    WHERE title ILIKE ${searchQuery} OR ustadz ILIKE ${searchQuery} OR category ILIKE ${searchQuery}
    LIMIT 5
  `) as Kajian[]
}

async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return []
  const searchQuery = `%${query}%`
  return (await sql`
    SELECT * FROM products 
    WHERE name ILIKE ${searchQuery} OR category ILIKE ${searchQuery}
    LIMIT 5
  `) as Product[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const kajianResults = await searchKajian(query)
  const productResults = await searchProducts(query)

  const hasResults = kajianResults.length > 0 || productResults.length > 0

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <SearchInput initialQuery={query} />
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {!query ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Cari Kajian atau Produk
            </h2>
            <p className="text-muted-foreground">
              Ketik kata kunci untuk mencari
            </p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Kajian Results */}
            {kajianResults.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Kajian
                </h2>
                <div className="space-y-2">
                  {kajianResults.map((kajian) => (
                    <Link key={kajian.id} href={`/kajian/${kajian.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">
                                {kajian.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {kajian.ustadz}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {kajian.schedule_date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {kajian.filled}/{kajian.spot}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Product Results */}
            {productResults.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Produk
                </h2>
                <div className="space-y-2">
                  {productResults.map((product) => (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                <span className="text-xs text-muted-foreground">
                                  {product.rating} | {product.sold} terjual
                                </span>
                              </div>
                              <p className="text-primary font-semibold mt-1">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
