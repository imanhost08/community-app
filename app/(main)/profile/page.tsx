import Link from "next/link"
import {
  User,
  BookOpen,
  ShoppingBag,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { LogoutButton } from "./logout-button"

async function getUserStats(userId: number) {
  const kajianCount = await sql`
    SELECT COUNT(*) as count FROM kajian_registrations WHERE user_id = ${userId}
  `
  const orderCount = await sql`
    SELECT COUNT(*) as count FROM orders WHERE user_id = ${userId}
  `

  return {
    kajian: Number(kajianCount[0].count),
    orders: Number(orderCount[0].count),
  }
}

const menuItems = [
  {
    icon: BookOpen,
    label: "Kajian Saya",
    href: "/profile/kajian",
    color: "text-primary bg-primary/10",
  },
  {
    icon: ShoppingBag,
    label: "Pesanan Saya",
    href: "/profile/orders",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Bell,
    label: "Notifikasi",
    href: "/notifications",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Settings,
    label: "Pengaturan",
    href: "/profile/settings",
    color: "text-gray-600 bg-gray-100",
  },
  {
    icon: HelpCircle,
    label: "Bantuan",
    href: "/profile/help",
    color: "text-orange-600 bg-orange-100",
  },
]

export default async function ProfilePage() {
  const user = await getCurrentUser()
  const stats = user ? await getUserStats(user.id) : { kajian: 0, orders: 0 }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pb-20 rounded-b-3xl">
        <h1 className="text-xl font-bold">Profil</h1>
      </header>

      {/* Profile Card */}
      <div className="px-4 -mt-16">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {user?.name || "Guest"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user?.phone || "-"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.kajian}</p>
                <p className="text-sm text-muted-foreground">Kajian Diikuti</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.orders}</p>
                <p className="text-sm text-muted-foreground">Pesanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-medium text-foreground">
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Logout */}
        <LogoutButton />
      </div>
    </div>
  )
}
