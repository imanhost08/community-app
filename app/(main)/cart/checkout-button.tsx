"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, QrCode, Wallet, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const paymentMethods = [
  { id: "va_bca", name: "Virtual Account BCA", icon: Building2, number: "8280812345678901" },
  { id: "va_bni", name: "Virtual Account BNI", icon: Building2, number: "8810123456789012" },
  { id: "va_mandiri", name: "Virtual Account Mandiri", icon: Building2, number: "8900123456789012" },
  { id: "qris", name: "QRIS", icon: QrCode },
  { id: "gopay", name: "GoPay", icon: Wallet, number: "0812-3456-7890" },
  { id: "ovo", name: "OVO", icon: Wallet, number: "0812-3456-7890" },
  { id: "dana", name: "DANA", icon: Wallet, number: "0812-3456-7890" },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function CheckoutButton({
  total,
  uniqueCode,
}: {
  total: number
  uniqueCode: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [step, setStep] = useState<"payment" | "details" | "success">("payment")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedPayment,
          uniqueCode,
        }),
      })

      if (!res.ok) {
        throw new Error("Checkout gagal")
      }

      setStep("success")
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setOpen(false)
    if (step === "success") {
      router.push("/profile/orders")
    }
    setStep("payment")
    setSelectedPayment(null)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full h-12 font-semibold">
        Checkout
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === "payment" && "Pilih Metode Pembayaran"}
              {step === "details" && "Detail Pembayaran"}
              {step === "success" && "Pesanan Berhasil"}
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
                onClick={() => setStep("details")}
                disabled={!selectedPayment}
                className="w-full mt-4"
              >
                Lanjutkan
              </Button>
            </div>
          )}

          {step === "details" && selectedMethod && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Pembayaran
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </p>
              </div>

              {selectedMethod.number && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedMethod.id.startsWith("va_")
                      ? "Nomor Virtual Account"
                      : "Nomor Tujuan"}
                  </p>
                  <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
                    <span className="flex-1 font-mono font-semibold">
                      {selectedMethod.number}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedMethod.number!)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod.id === "qris" && (
                <div className="bg-muted rounded-xl p-4 text-center">
                  <div className="w-40 h-40 bg-background rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Scan QR Code di atas
                  </p>
                </div>
              )}

              <div className="bg-accent/10 rounded-xl p-3 text-sm text-accent-foreground">
                <p className="font-medium mb-1">Penting!</p>
                <p>
                  Transfer tepat sampai 3 digit terakhir untuk memudahkan
                  verifikasi pembayaran.
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Memproses..." : "Saya Sudah Bayar"}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="font-semibold mb-2">Pesanan Berhasil Dibuat!</p>
              <p className="text-sm text-muted-foreground mb-4">
                Pembayaran Anda sedang diverifikasi. Kami akan mengirim notifikasi
                setelah pembayaran dikonfirmasi.
              </p>
              <Button onClick={handleClose} className="w-full">
                Lihat Pesanan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
