import Link from "next/link"
import { BookOpen, ShoppingBag, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SplashPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect("/home")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 via-background to-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 animate-pulse-glow">
          <BookOpen className="w-12 h-12 text-primary-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-2">
          Majelis Ilmu
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-xs">
          Komunitas Kajian Islam untuk Menuntut Ilmu dan Berbagi Kebaikan
        </p>

        {/* Features */}
        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Kajian Rutin</h3>
              <p className="text-sm text-muted-foreground">
                Ikuti kajian online dan offline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Toko Islami</h3>
              <p className="text-sm text-muted-foreground">
                Belanja produk Islami berkualitas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Komunitas</h3>
              <p className="text-sm text-muted-foreground">
                Bergabung dengan jamaah se-Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 space-y-3">
        <Button asChild className="w-full h-12 text-base font-semibold">
          <Link href="/register">
            Mulai Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
