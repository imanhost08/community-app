import Link from "next/link"
import { ArrowLeft, ShoppingBag, Package, Clock, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"

type OrderWithItems = {
  id: number
  total_amount: number
  payment_method: string
  status: string
  created_at: string
  item_count: number
}

async function getMyOrders(userId: number): Promise<OrderWithItems[]> {
  const result = await sql`
    SELECT 
      o.id, o.total_amount, o.payment_method, o.status, o.created_at,
      COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `
  return result as OrderWithItems[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getStatusInfo(status: string) {
  switch (status) {
    case "pending":
      return {
        label: "Menunggu Pembayaran",
        color: "text-amber-600 bg-amber-100",
        icon: Clock,
      }
    case "paid":
      return {
        label: "Dibayar",
        color: "text-blue-600 bg-blue-100",
        icon: CheckCircle,
      }
    case "shipped":
      return {
        label: "Dikirim",
        color: "text-primary bg-primary/10",
        icon: Package,
      }
    case "completed":
      return {
        label: "Selesai",
        color: "text-primary bg-primary/10",
        icon: CheckCircle,
      }
    default:
      return {
        label: status,
        color: "text-muted-foreground bg-muted",
        icon: Clock,
      }
  }
}

export default async function MyOrdersPage() {
  const user = await getCurrentUser()
  const orders = user ? await getMyOrders(user.id) : []

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Pesanan Saya</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Pesanan
            </h2>
            <p className="text-muted-foreground mb-6">
              Anda belum memiliki pesanan apapun
            </p>
            <Link
              href="/shop"
              className="text-primary font-medium hover:underline"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        #{order.id.toString().padStart(6, "0")}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {order.item_count} item
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
