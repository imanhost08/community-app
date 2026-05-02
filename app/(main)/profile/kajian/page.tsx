import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Clock, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"

type KajianWithRegistration = {
  id: number
  title: string
  ustadz: string
  schedule_date: string
  schedule_time: string
  type: string
  registered_at: string
  status: string
}

async function getMyKajian(userId: number): Promise<KajianWithRegistration[]> {
  const result = await sql`
    SELECT 
      k.id, k.title, k.ustadz, k.schedule_date, k.schedule_time, k.type,
      kr.registered_at, kr.status
    FROM kajian_registrations kr
    JOIN kajian k ON kr.kajian_id = k.id
    WHERE kr.user_id = ${userId}
    ORDER BY kr.registered_at DESC
  `
  return result as KajianWithRegistration[]
}

export default async function MyKajianPage() {
  const user = await getCurrentUser()
  const kajianList = user ? await getMyKajian(user.id) : []

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
          <h1 className="text-lg font-semibold">Kajian Saya</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {kajianList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Kajian
            </h2>
            <p className="text-muted-foreground mb-6">
              Anda belum mendaftar kajian apapun
            </p>
            <Link
              href="/kajian"
              className="text-primary font-medium hover:underline"
            >
              Lihat Kajian Tersedia
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {kajianList.map((kajian) => (
              <Link key={kajian.id} href={`/kajian/${kajian.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-xs text-primary font-medium">
                            Terdaftar
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground truncate">
                          {kajian.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {kajian.ustadz}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {kajian.schedule_date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {kajian.schedule_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
