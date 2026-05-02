"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading} className="w-full mt-4">
      <Card className="hover:shadow-md transition-shadow border-destructive/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="flex-1 font-medium text-destructive text-left">
              {loading ? "Keluar..." : "Keluar"}
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
