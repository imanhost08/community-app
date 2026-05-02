import Link from "next/link"
import { ArrowLeft, User, Phone, Mail, Lock, Bell, Moon } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default async function SettingsPage() {
  const user = await getCurrentUser()

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
          <h1 className="text-lg font-semibold">Pengaturan</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            PROFIL
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{user?.name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{user?.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || "Belum diatur"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            PREFERENSI
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Notifikasi</p>
                    <p className="text-sm text-muted-foreground">
                      Terima pemberitahuan
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Mode Gelap</p>
                    <p className="text-sm text-muted-foreground">
                      Tampilan gelap
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            KEAMANAN
          </h2>
          <Card>
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Ubah Password</p>
                  <p className="text-sm text-muted-foreground">
                    Perbarui password akun
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        </section>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Majelis Ilmu v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Komunitas Kajian Islam
          </p>
        </div>
      </div>
    </div>
  )
}
