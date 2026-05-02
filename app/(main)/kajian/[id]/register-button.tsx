"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Building2, QrCode, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Kajian } from "@/lib/db"

const paymentMethods = [
  { id: "va_bca", name: "Virtual Account BCA", icon: Building2 },
  { id: "va_bni", name: "Virtual Account BNI", icon: Building2 },
  { id: "va_mandiri", name: "Virtual Account Mandiri", icon: Building2 },
  { id: "qris", name: "QRIS", icon: QrCode },
  { id: "gopay", name: "GoPay", icon: Wallet },
  { id: "ovo", name: "OVO", icon: Wallet },
  { id: "dana", name: "DANA", icon: Wallet },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function RegisterKajianButton({ kajian }: { kajian: Kajian }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"payment" | "confirm" | "success">("payment")

  const handleRegister = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/kajian/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kajianId: kajian.id,
          paymentMethod: kajian.type === "paid" ? selectedPayment : "free",
          amount: kajian.type === "paid" ? kajian.price : 0,
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal mendaftar")
      }

      setStep("success")
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    if (step === "success") {
      router.refresh()
    }
    setStep("payment")
    setSelectedPayment(null)
  }

  // For free kajian, directly register
  if (kajian.type === "free") {
    return (
      <>
        <Button onClick={() => setOpen(true)} className="w-full h-12 font-semibold">
          Daftar Sekarang
        </Button>

        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {step === "success" ? "Pendaftaran Berhasil" : "Konfirmasi Pendaftaran"}
              </DialogTitle>
            </DialogHeader>

            {step === "payment" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Anda akan mendaftar kajian:
                </p>
                <div className="bg-muted rounded-xl p-3">
                  <p className="font-semibold">{kajian.title}</p>
                  <p className="text-sm text-muted-foreground">{kajian.ustadz}</p>
                  <p className="text-sm text-muted-foreground">
                    {kajian.schedule_date}, {kajian.schedule_time}
                  </p>
                </div>
                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Mendaftar..." : "Konfirmasi"}
                </Button>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-4">
                  Anda telah terdaftar di kajian ini. Jangan lupa hadir tepat waktu!
                </p>
                <Button onClick={handleClose} className="w-full">
                  Tutup
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // For paid kajian with payment selection
  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full h-12 font-semibold">
        Daftar & Bayar
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === "payment" && "Pilih Metode Pembayaran"}
              {step === "confirm" && "Konfirmasi Pembayaran"}
              {step === "success" && "Pembayaran Berhasil"}
            </DialogTitle>
          </DialogHeader>

          {step === "payment" && (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <method.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
              <Button
                onClick={() => setStep("confirm")}
                disabled={!selectedPayment}
                className="w-full mt-4"
              >
                Lanjutkan
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-3">
                <p className="font-semibold">{kajian.title}</p>
                <p className="text-sm text-muted-foreground">{kajian.ustadz}</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Infaq Kajian</span>
                <span className="font-semibold">{formatPrice(kajian.price)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(kajian.price)}
                </span>
              </div>
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-semibold mb-2">Pembayaran Berhasil!</p>
              <p className="text-sm text-muted-foreground mb-4">
                Anda telah terdaftar di kajian ini. Bukti pendaftaran telah dikirim.
              </p>
              <Button onClick={handleClose} className="w-full">
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
