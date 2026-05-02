"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, ShoppingBag, ShoppingCart, User } from "lucide-react"

const navItems = [
  { href: "/home", icon: Home, label: "Beranda" },
  { href: "/kajian", icon: BookOpen, label: "Kajian" },
  { href: "/shop", icon: ShoppingBag, label: "Toko" },
  { href: "/cart", icon: ShoppingCart, label: "Keranjang" },
  { href: "/profile", icon: User, label: "Profil" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
