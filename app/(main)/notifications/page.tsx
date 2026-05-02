import Link from "next/link"
import { ArrowLeft, Bell, BookOpen, ShoppingBag, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock notifications - in production, this would come from a database
const notifications = [
  {
    id: 1,
    type: "kajian",
    title: "Pendaftaran Berhasil",
    message: "Anda telah terdaftar di kajian Fiqih Puasa Ramadhan",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: 2,
    type: "order",
    title: "Pesanan Dikonfirmasi",
    message: "Pembayaran untuk pesanan #000123 telah dikonfirmasi",
    time: "5 jam lalu",
    read: false,
  },
  {
    id: 3,
    type: "kajian",
    title: "Pengingat Kajian",
    message: "Kajian Tahsin Al-Quran akan dimulai besok pukul 08:00",
    time: "1 hari lalu",
    read: true,
  },
  {
    id: 4,
    type: "order",
    title: "Pesanan Dikirim",
    message: "Pesanan #000122 sedang dalam perjalanan",
    time: "2 hari lalu",
    read: true,
  },
]

function getNotificationIcon(type: string) {
  switch (type) {
    case "kajian":
      return { icon: BookOpen, color: "text-primary bg-primary/10" }
    case "order":
      return { icon: ShoppingBag, color: "text-accent bg-accent/10" }
    default:
      return { icon: Bell, color: "text-blue-600 bg-blue-100" }
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">Notifikasi</h1>
          </div>
          {unreadCount > 0 && (
            <span className="text-sm text-primary font-medium">
              {unreadCount} belum dibaca
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Tidak Ada Notifikasi
            </h2>
            <p className="text-muted-foreground">
              Anda akan menerima notifikasi di sini
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const iconInfo = getNotificationIcon(notification.type)
              return (
                <Card
                  key={notification.id}
                  className={`${
                    !notification.read ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${iconInfo.color} flex items-center justify-center shrink-0`}
                      >
                        <iconInfo.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground text-sm">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
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
