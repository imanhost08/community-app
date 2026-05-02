import Link from "next/link"
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  CreditCard,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Bagaimana cara mendaftar kajian?",
    answer:
      "Pilih kajian yang ingin diikuti, lalu klik tombol 'Daftar'. Untuk kajian berbayar, pilih metode pembayaran dan selesaikan pembayaran.",
  },
  {
    question: "Bagaimana cara melakukan pembayaran?",
    answer:
      "Kami menerima berbagai metode pembayaran termasuk Virtual Account (BCA, BNI, Mandiri), QRIS, dan E-Wallet (GoPay, OVO, DANA).",
  },
  {
    question: "Apakah bisa membatalkan pendaftaran kajian?",
    answer:
      "Pembatalan dapat dilakukan maksimal H-1 sebelum kajian berlangsung. Hubungi CS kami untuk proses pembatalan.",
  },
  {
    question: "Bagaimana jika pesanan belum sampai?",
    answer:
      "Anda dapat melacak pesanan di menu 'Pesanan Saya'. Jika ada kendala, silakan hubungi CS kami.",
  },
  {
    question: "Apakah produk bisa dikembalikan?",
    answer:
      "Pengembalian dapat dilakukan dalam 7 hari setelah produk diterima dengan syarat produk dalam kondisi baik dan belum digunakan.",
  },
]

const contactOptions = [
  {
    icon: MessageCircle,
    label: "Chat WhatsApp",
    value: "0812-3456-7890",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "(021) 123-4567",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Mail,
    label: "Email",
    value: "help@majelisilmu.id",
    color: "text-orange-600 bg-orange-100",
  },
]

export default function HelpPage() {
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
          <h1 className="text-lg font-semibold">Bantuan</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Help */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            BANTUAN CEPAT
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Kajian</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm font-medium">Belanja</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Bayar</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            PERTANYAAN UMUM
          </h2>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-4 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            HUBUNGI KAMI
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {contactOptions.map((contact) => (
                <button
                  key={contact.label}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center`}
                  >
                    <contact.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{contact.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.value}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
