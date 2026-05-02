import Link from "next/link"
import { Search, Filter, BookOpen, MapPin, Clock, Users } from "lucide-react"
import { sql, type Kajian } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { KajianFilter } from "./kajian-filter"

async function getKajian(category?: string): Promise<Kajian[]> {
  if (category && category !== "all") {
    return (await sql`SELECT * FROM kajian WHERE category = ${category} ORDER BY created_at DESC`) as Kajian[]
  }
  return (await sql`SELECT * FROM kajian ORDER BY created_at DESC`) as Kajian[]
}

async function getCategories(): Promise<string[]> {
  const result = await sql`SELECT DISTINCT category FROM kajian WHERE category IS NOT NULL`
  return result.map((r) => r.category as string)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function KajianPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const kajianList = await getKajian(params.category)
  const categories = await getCategories()

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-4">Kajian</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
          <Input
            placeholder="Cari kajian..."
            className="pl-10 bg-primary-foreground/20 border-0 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
      </header>

      {/* Content */}
      <div className="p-4 -mt-2">
        {/* Filter */}
        <KajianFilter categories={categories} currentCategory={params.category} />

        {/* Kajian List */}
        <div className="space-y-3 mt-4">
          {kajianList.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada kajian tersedia</p>
            </div>
          ) : (
            kajianList.map((kajian) => (
              <Link key={kajian.id} href={`/kajian/${kajian.id}`}>
                <Card className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-28 bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary" />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                kajian.type === "free"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-accent/10 text-accent"
                              }`}
                            >
                              {kajian.type === "free" ? "Gratis" : "Berbayar"}
                            </span>
                            <h3 className="font-semibold text-foreground mt-1 truncate">
                              {kajian.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {kajian.ustadz}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {kajian.schedule_date}, {kajian.schedule_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {kajian.filled}/{kajian.spot}
                          </span>
                        </div>
                        {kajian.type === "paid" && (
                          <p className="text-primary font-semibold mt-2">
                            {formatPrice(kajian.price)}
                          </p>
                        )}
                      </div>
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
