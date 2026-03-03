Aplikasi Laporan Keuangan UMKM

Aplikasi web modern untuk manajemen dan pelaporan keuangan UMKM. Dibangun menggunakan ekosistem React dan Next.js terbaru dengan fokus pada performa tinggi, skalabilitas, dan antarmuka yang responsif.
Teknologi yang Digunakan:
- Framework: Next.js 15 (App Router) & React 19
- Bahasa: TypeScript
- Styling: Tailwind CSS v4 & PostCSS
- Komponen UI: Radix UI / shadcn/ui
- Manajemen Form: React Hook Form & Zod (Validasi Skema)
- AI Integration: Vercel AI SDK, Anthropic SDK, Groq SDK
- Visualisasi Data: Recharts

Syarat Sistem (Prerequisites)

Pastikan perangkat Anda telah terinstal:
1.	Node.js versi 18.17 atau lebih baru
(Disarankan menggunakan versi LTS 20.x)
2.	Package Manager: pnpm (direkomendasikan) atau npm

Catatan:Proyek ini menggunakan pnpm-lock.yaml. Untuk menjaga konsistensi dependency dan menghindari konflik versi, penggunaan pnpm lebih disarankan.

Instalasi & Menjalankan Proyek

Pilih salah satu metode berikut sesuai dengan package manager yang digunakan.

Opsi 1: Menggunakan pnpm (Direkomendasikan)

Jika belum menginstal pnpm, jalankan:
npm install -g pnpm

Langkah instalasi:
1.	Buka terminal di folder root proyek.
2.	Instal seluruh dependensi:
pnpm install
3.	Jalankan development server:
pnpm dev
4.	Akses aplikasi melalui browser:
http://localhost:3000

Opsi 2: Menggunakan npm

Peringatan untuk pengguna npm:

Terdapat konflik peer dependency antara library zod (v3.25.67) dan ai (v5.0.72).
Untuk menghindari error ERESOLVE, tambahkan flag --legacy-peer-deps saat instalasi.

Langkah instalasi:
1.	Buka terminal di folder root proyek.
2.	Instal dependensi:
npm install --legacy-peer-deps
3.	Jalankan development server:
npm run dev
4.	Akses aplikasi melalui browser:
http://localhost:3000

