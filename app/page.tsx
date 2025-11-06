import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, FileText, PieChart, Shield, Smartphone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Keuangan UMKM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
            Kelola Keuangan Bisnis Anda dengan <span className="text-primary">Mudah & Profesional</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            Sistem manajemen keuangan lengkap untuk UMKM Indonesia. Catat transaksi, kelola piutang-hutang, dan buat
            laporan keuangan otomatis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Mulai Gratis Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Lihat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Lengkap untuk Bisnis Anda</h2>
          <p className="text-muted-foreground text-lg">Semua yang Anda butuhkan dalam satu platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-blue-100 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pencatatan Transaksi</h3>
            <p className="text-muted-foreground">
              Catat pemasukan dan pengeluaran dengan mudah. Kategorisasi otomatis dan pelacakan real-time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-success w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manajemen Piutang & Hutang</h3>
            <p className="text-muted-foreground">
              Kelola piutang pelanggan dan hutang supplier. Reminder otomatis untuk jatuh tempo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Laporan Keuangan</h3>
            <p className="text-muted-foreground">
              Laporan laba rugi, arus kas, dan laporan pajak otomatis sesuai standar Indonesia.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-orange-100 text-warning w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Keamanan Data</h3>
            <p className="text-muted-foreground">
              Data keuangan Anda tersimpan aman dengan enkripsi tingkat enterprise.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-red-100 text-destructive w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Akses Multi-Device</h3>
            <p className="text-muted-foreground">
              Akses dari mana saja, kapan saja. Responsive di desktop, tablet, dan smartphone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-User & Role</h3>
            <p className="text-muted-foreground">
              Tambahkan staff dan akuntan dengan hak akses berbeda sesuai kebutuhan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mengelola Keuangan Bisnis Lebih Baik?</h2>
          <p className="text-lg mb-8 opacity-90">Bergabung dengan ribuan UMKM Indonesia yang sudah mempercayai kami</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Mulai Sekarang - Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Keuangan UMKM. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
