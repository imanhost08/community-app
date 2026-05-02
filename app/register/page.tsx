"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, User, Phone, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Step = 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registrasi gagal")
      }

      router.push("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.length >= 2
      case 2:
        return formData.phone.length >= 10
      case 3:
        return (
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword
        )
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <button
          onClick={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Daftar Akun</h1>
      </header>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 py-6 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-8 h-1 rounded-full transition-colors ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nama Lengkap</h2>
              <p className="text-muted-foreground text-sm">
                Masukkan nama lengkap Anda
              </p>
            </div>
            <Input
              type="text"
              placeholder="Nama lengkap"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 text-base"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nomor Telepon</h2>
              <p className="text-muted-foreground text-sm">
                Nomor ini akan digunakan untuk login
              </p>
            </div>
            <Input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-12 text-base"
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Buat Password</h2>
              <p className="text-muted-foreground text-sm">
                Minimal 6 karakter
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-12 text-base"
                autoFocus
              />
              <Input
                type="password"
                placeholder="Konfirmasi password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-destructive text-sm text-center mt-4">{error}</p>
        )}
      </div>

      {/* Bottom */}
      <div className="p-6 space-y-4">
        <Button
          onClick={() => {
            if (step < 3) {
              setStep((s) => (s + 1) as Step)
            } else {
              handleSubmit()
            }
          }}
          disabled={!canProceed() || loading}
          className="w-full h-12 text-base font-semibold"
        >
          {loading ? (
            "Mendaftar..."
          ) : step < 3 ? (
            <>
              Lanjutkan
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            "Daftar Sekarang"
          )}
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
