import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Clock,
  Users,
  Calendar,
  Share2,
} from "lucide-react"
import { sql, type Kajian } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RegisterKajianButton } from "./register-button"

async function getKajian(id: number): Promise<Kajian | null> {
  const result = await sql`SELECT * FROM kajian WHERE id = ${id}`
  return (result[0] as Kajian) || null
}

async function checkRegistration(userId: number, kajianId: number): Promise<boolean> {
  const result = await sql`
    SELECT id FROM kajian_registrations 
    WHERE user_id = ${userId} AND kajian_id = ${kajianId}
  `
  return result.length > 0
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function KajianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const kajian = await getKajian(parseInt(id))
  const user = await getCurrentUser()

  if (!kajian) {
    notFound()
  }

  const isRegistered = user ? await checkRegistration(user.id, kajian.id) : false
  const spotsLeft = kajian.spot - kajian.filled

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-48 bg-primary">
        <Link
          href="/kajian"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center z-10">
          <Share2 className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-20 h-20 text-primary-foreground/30" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 relative">
        <Card>
          <CardContent className="p-4">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  kajian.type === "free"
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {kajian.type === "free" ? "Gratis" : "Berbayar"}
              </span>
              {kajian.category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {kajian.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-foreground mb-2">
              {kajian.title}
            </h1>
            <p className="text-muted-foreground mb-4">{kajian.ustadz}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Tanggal</p>
                  <p className="font-medium">{kajian.schedule_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Waktu</p>
                  <p className="font-medium">{kajian.schedule_time} WIB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Kuota</p>
                  <p className="font-medium">
                    {kajian.filled}/{kajian.spot} peserta
                  </p>
                </div>
              </div>
              {kajian.location && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lokasi</p>
                    <p className="font-medium truncate">{kajian.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {kajian.description && (
              <div>
                <h2 className="font-semibold text-foreground mb-2">Deskripsi</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {kajian.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infaq Section for Paid Kajian */}
        {kajian.type === "paid" && !isRegistered && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h2 className="font-semibold text-foreground mb-2">Infaq Kajian</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Kajian ini memerlukan infaq sebagai bentuk dukungan untuk kegiatan dakwah.
              </p>
              <div className="bg-primary/5 rounded-xl p-3">
                <p className="text-sm text-muted-foreground">Minimal Infaq</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(kajian.price)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-md mx-auto flex items-center gap-4">
          {kajian.type === "paid" && !isRegistered && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Infaq</p>
              <p className="text-lg font-bold text-primary">
                {formatPrice(kajian.price)}
              </p>
            </div>
          )}
          <div className={kajian.type === "free" || isRegistered ? "flex-1" : ""}>
            {isRegistered ? (
              <Button disabled className="w-full h-12">
                Sudah Terdaftar
              </Button>
            ) : spotsLeft <= 0 ? (
              <Button disabled className="w-full h-12">
                Kuota Penuh
              </Button>
            ) : (
              <RegisterKajianButton kajian={kajian} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
