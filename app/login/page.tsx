"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login gagal")
      }

      router.push("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Masuk</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Selamat Datang
          </h2>
          <p className="text-muted-foreground mt-1">
            Masuk ke akun Majelis Ilmu Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nomor Telepon
            </label>
            <Input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="h-12 text-base"
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !formData.phone || !formData.password}
            className="w-full h-12 text-base font-semibold mt-6"
          >
            {loading ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      </div>

      {/* Bottom */}
      <div className="p-6">
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-medium">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
