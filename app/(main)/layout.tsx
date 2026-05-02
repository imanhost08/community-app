import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { BottomNav } from "@/components/bottom-nav"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
