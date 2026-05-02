import Link from "next/link"
import {
  Bell,
  Search,
  BookOpen,
  ShoppingBag,
  Users,
  Calendar,
  ArrowRight,
  Star,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { sql, type Kajian, type Product } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { KajianCarousel } from "@/components/kajian-carousel"

async function getStats() {
  const kajianCount = await sql`SELECT COUNT(*) as count FROM kajian`
  const userCount = await sql`SELECT COUNT(*) as count FROM users`
  const productCount = await sql`SELECT COUNT(*) as count FROM products`

  return {
    kajian: Number(kajianCount[0].count),
    users: Number(userCount[0].count),
    products: Number(productCount[0].count),
  }
}

async function getUpcomingKajian(): Promise<Kajian[]> {
  const kajian = await sql`SELECT * FROM kajian ORDER BY created_at DESC LIMIT 3`
  return kajian as Kajian[]
}

async function getFeaturedProducts(): Promise<Product[]> {
  const products = await sql`SELECT * FROM products ORDER BY sold DESC LIMIT 4`
  return products as Product[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const stats = await getStats()
  const upcomingKajian = await getUpcomingKajian()
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">Assalamualaikum,</p>
            <h1 className="text-xl font-bold">{user?.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/notifications"
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-foreground/20 rounded-xl p-3 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.kajian}</p>
            <p className="text-xs text-primary-foreground/80">Kajian</p>
          </div>
          <div className="bg-primary-foreground/20 rounded-xl p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.users}</p>
            <p className="text-xs text-primary-foreground/80">Jamaah</p>
          </div>
          <div className="bg-primary-foreground/20 rounded-xl p-3 text-center">
            <ShoppingBag className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.products}</p>
            <p className="text-xs text-primary-foreground/80">Produk</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Kajian", href: "/kajian", color: "bg-primary/10 text-primary" },
            { icon: ShoppingBag, label: "Toko", href: "/shop", color: "bg-accent/10 text-accent" },
            { icon: Calendar, label: "Jadwal", href: "/kajian", color: "bg-blue-100 text-blue-600" },
            { icon: Users, label: "Komunitas", href: "/profile", color: "bg-orange-100 text-orange-600" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Upcoming Kajian Carousel */}
        <KajianCarousel />

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Produk Terlaris</h2>
            <Link href="/shop" className="text-sm text-primary flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`}>
                <Card className="hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-foreground text-sm truncate">
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
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
