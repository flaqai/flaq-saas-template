# Flaq SaaS Template (Bahasa Indonesia)

Template SaaS gratis dan sumber terbuka untuk membangun platform pembuatan gambar dan video AI dengan API terpadu Flaq.ai. Dilengkapi ruang kreasi gambar dan video terpadu, alur video berbasis referensi, serta kanvas AI tanpa batas dengan pengelolaan proyek lokal.

**README:** [English](./README.md) · [日本語](./README_ja.md) · [Bahasa Indonesia](./README_id.md) · [Italiano](./README_it.md) · [Português (Brasil)](./README_pt.md) · [Español](./README_es.md) · [Deutsch](./README_de.md) · [Русский](./README_ru.md) · [Français](./README_fr.md) · [简体中文](./README_zh.md) · [繁體中文](./README_tw.md) · [한국어](./README_ko.md) · [ไทย](./README_th.md) · [Tiếng Việt](./README_vi.md) · [العربية](./README_ar.md)

> Bahasa README mengikuti `i18n/languages.ts`, sehingga setiap locale antarmuka memiliki pengantar proyek yang sesuai.

## Daftar isi

- [Tentang template ini](#tentang-template-ini)
- [Fitur utama](#fitur-utama)
- [Tentang Flaq.ai](#tentang-flaqai)
- [Teknologi](#teknologi)
- [Mulai cepat](#mulai-cepat)
  - [Prasyarat](#prasyarat)
  - [Instalasi](#instalasi)
  - [Variabel lingkungan](#variabel-lingkungan)
  - [Unggahan berkas](#unggahan-berkas)
  - [Pengaturan API key Flaq.ai](#pengaturan-api-key-flaqai)
- [Penggunaan](#penggunaan)
  - [Pengembangan](#pengembangan)
  - [Build](#build)
  - [Pemeriksaan dan pemformatan](#pemeriksaan-dan-pemformatan)
- [Kemampuan AIGC](#kemampuan-aigc)
  - [AI Media Creator](#ai-media-creator)
  - [AI Canvas](#ai-canvas)
- [Program Afiliasi Flaq.ai](#program-afiliasi-flaqai)
- [Internasionalisasi](#internasionalisasi)
- [SEO dan akses perayap AI](#seo-dan-akses-perayap-ai)
- [Struktur proyek](#struktur-proyek)
- [Deployment](#deployment)
- [Dokumentasi dan lisensi](#dokumentasi-dan-lisensi)

## Tentang template ini

Dibangun dengan Next.js 16, React 19, TypeScript, dan Tailwind CSS. Template ini menyediakan teks-ke-gambar, gambar-ke-gambar, teks-ke-video, gambar-ke-video, video berbasis referensi, dan virtual try-on, serta AI Media Creator dan AI Canvas.

## Fitur utama

- 🎨 **Teks-ke-gambar** — Buat gambar dari prompt teks dengan model AI mutakhir
- 🖼️ **Gambar-ke-gambar** — Ubah gambar menjadi variasi kreatif dengan gaya yang konsisten
- 🎬 **Teks-ke-video** — Buat video berkualitas tinggi dari deskripsi teks sederhana
- 📹 **Gambar-ke-video** — Animasikan gambar statis menjadi video
- 👗 **Virtual try-on** — Pengalaman mencoba pakaian secara virtual dengan AI
- 🔌 Integrasi API Flaq.ai menggunakan satu Client Key
- 🧠 Model gambar mencakup Nano Banana Pro, Nano Banana 2, GPT Image 2, ChatGPT Images 2.5, Qwen Image 3.0, dan Seedream 5.0; model video mencakup Kling 3.0, Veo 3.1, Wan 2.7, Seedance 2.0, dan Vidu Q3
- 🧩 AI Media Creator dengan formulir bersama dan kontrol sesuai model
- 🎞️ Video berbasis referensi gambar, video, audio, dokumen, atau tautan sesuai dukungan model
- 🗂️ AI Canvas dengan node yang saling terhubung, proyek lokal, serta impor dan ekspor ZIP
- 🌐 15 bahasa untuk UI, perutean, dan tautan alternatif SEO
- ☁️ Unggah melalui API Flaq atau penyimpanan Cloudflare R2 milik Anda
- 🔒 Penyimpanan API key terenkripsi di sisi klien
- 📱 UI responsif berbasis Tailwind CSS dan Radix UI, mode gelap, dan riwayat generasi lokal
- ⚡ Performa cepat dengan Next.js 16 dan dukungan Turbopack
- 🤝 Promosi afiliasi Flaq.ai yang responsif dengan teks dan tautan sesuai bahasa
- 🚀 Jelajahi, modifikasi, dan host sendiri tanpa membuat akun aplikasi
- 🔍 Metadata dinamis, Open Graph, sitemap, data terstruktur, `llms.txt`, dan `llms-full.txt`

## Tentang Flaq.ai

[Flaq.ai](https://flaq.ai/id/) menyatukan model pembuatan gambar dan video terkemuka melalui satu API dan mekanisme autentikasi yang konsisten. Template ini sudah mencakup koneksi API, polling status, tampilan hasil, dan unduhan.

## Teknologi

| Kategori | Teknologi |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Bahasa | [TypeScript](https://www.typescriptlang.org/) |
| Pustaka UI | [React 19](https://react.dev/) |
| Gaya | [Tailwind CSS v4](https://tailwindcss.com/) |
| Pustaka komponen | [Radix UI](https://www.radix-ui.com/) |
| Animasi | [Framer Motion](https://www.framer.com/motion/) |
| Formulir | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Pengelolaan state | [Zustand](https://zustand.docs.pmnd.rs/) |
| Pengambilan data | [SWR](https://swr.vercel.app/) + [TanStack Query](https://tanstack.com/query) |
| Internasionalisasi | [next-intl](https://next-intl-docs.vercel.app/) |
| Ikon | [Lucide React](https://lucide.dev/) |
| Grafik | [Recharts](https://recharts.org/) |
| Pengelola paket | [pnpm](https://pnpm.io/) |
| Pemeriksaan kode | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Mulai cepat

### Prasyarat

- **Node.js 22**, sesuai `.nvmrc`
- **pnpm 10.5.2**, ditetapkan pada kolom `packageManager` di `package.json`
- Akun [Flaq.ai](https://flaq.ai/id/) dengan API key aktif

### Instalasi

```bash
# 1. Kloning repositori
git clone https://github.com/flaqai/flaq-saas-template.git
cd flaq-saas-template
# 2. Instal pnpm jika belum tersedia
npm install -g pnpm@10.5.2
# 3. Instal dependensi
pnpm install
# 4. Salin templat lingkungan
cp .env.example .env.local
```

### Variabel lingkungan

Atur variabel berikut di `.env.local`:

```bash
# URL situs untuk metadata, sitemap, dan Open Graph
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# Email kontak di footer
NEXT_PUBLIC_CONTACT_US_EMAIL="contact@flaq.ai"
# Opsional: kredensial Cloudflare R2, hanya di server
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Unggahan berkas

Secara default, unggahan menggunakan API URL dan Client Key yang dikonfigurasi dalam **Open API Settings**. Untuk memakai R2 sendiri, isi keempat variabel server di atas, masukkan domain publik pada **Image Hosting (R2)**, lalu simpan dan gunakan **Test R2 Connection**. Kredensial R2 hanya boleh disimpan di server. Domain publik yang terisi membuat unggahan menggunakan R2 terlebih dahulu; kosongkan dan simpan untuk kembali ke unggahan Flaq. Kesalahan penyimpanan khusus ditampilkan tanpa beralih otomatis ke Flaq.

Unggahan Flaq meminta URL melalui `POST /api/v1/files/presignedUrl`, lalu mengunggah setiap berkas langsung dengan `PUT`. Setiap permintaan mendukung paling banyak 10 berkas; 14 berkas, misalnya, diproses dalam kelompok 10 dan 4. Setiap kelompok segera diunggah setelah URL diperoleh karena URL kedaluwarsa dalam 60 detik. URL publik hasil unggahan digunakan untuk permintaan generasi.

### Pengaturan API key Flaq.ai

1. Daftar atau masuk di [flaq.ai](https://flaq.ai/id/).
2. Buka dasbor akun Anda.
3. Buat Client Key dari bagian API Keys.
4. Salin Client Key.
5. Klik ikon roda gigi (⚙️) di header aplikasi untuk membuka **Open API Settings**.
6. Tempelkan Client Key dan gunakan **Test Connection** untuk memverifikasi.
7. Simpan pengaturan.

> **💡 Tips:** aktifkan **Remember Me** untuk menyimpan kunci antar sesi dalam penyimpanan lokal terenkripsi. Biarkan opsi ini nonaktif pada perangkat bersama atau publik.

> **🔑 Saldo API:** pembuatan gambar dan video memerlukan saldo API yang cukup. Isi saldo di [flaq.ai](https://flaq.ai/id/) jika perlu.

## Penggunaan

### Pengembangan

```bash
# Server pengembangan dengan Turbopack untuk HMR lebih cepat
pnpm dev:turbo
# Atau perintah pengembangan standar
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build

```bash
# Build produksi
pnpm build
# Jalankan server produksi
pnpm start
```

### Pemeriksaan dan pemformatan

```bash
# Jalankan ESLint
pnpm lint
# Perbaiki masalah lint secara otomatis
pnpm lint:fix
# Format kode dengan Prettier
pnpm prettier
# Pemeriksaan tipe TypeScript
pnpm ts-check
```

## Kemampuan AIGC

Template ini menggabungkan halaman generasi khusus, ruang kreasi bersama, dan kanvas tanpa batas yang didukung API [Flaq.ai](https://flaq.ai).

| Kemampuan | Rute | Fungsi |
| --- | --- | --- |
| Teks-ke-gambar | `/text-to-image/` | Membuat gambar dari prompt teks |
| Gambar-ke-gambar | `/image-to-image/` | Mengedit gambar dengan prompt dan gambar referensi |
| Teks-ke-video | `/text-to-video/` | Membuat video dari prompt teks |
| Gambar-ke-video | `/image-to-video/` | Membuat video dari gambar; kontrol bingkai akhir tersedia pada model yang mendukungnya |
| Video berbasis referensi | `/reference-to-video/` | Menyiapkan referensi lalu melanjutkan generasi di AI Media Creator |
| Virtual try-on | `/virtual-try-on/` | Menggabungkan foto orang dan gambar pakaian untuk pratinjau busana |
| AI Media Creator | `/ai-media-creator/` | Membuat gambar dan video serta melihat riwayat dalam satu ruang kerja |
| AI Canvas | `/ai-canvas/` | Membuat alur visual terhubung dan mengelola proyek kanvas |

Definisi model berada di `lib/constants/template-models/`, dikelompokkan menurut penyedia dan jenis media. Input dan parameter mengikuti konfigurasi model yang dipilih. Virtual try-on memiliki pilihan tersendiri: GPT Image 2 Edit, Nano Banana Pro Edit, Nano Banana 2 Edit, Seedream 5.0 Edit, dan Seedream 4.5 Edit.

### AI Media Creator

Gunakan `/ai-media-creator/` untuk beralih antara pembuatan gambar dan video, pilih model, tambahkan input, dan atur parameter yang didukung. Video berbasis referensi mendukung gambar, video, audio, dokumen, dan tautan sesuai model, termasuk penyebutan referensi di editor prompt. Status generasi diperiksa otomatis; hasil muncul dalam riwayat yang disimpan di penyimpanan lokal browser saat ini.

### AI Canvas

Mulai di `/ai-canvas/`, kelola proyek tersimpan di `/ai-canvas/projects/`, dan buka proyek di `/ai-canvas/{projectId}/`. Formulir awal menyiapkan proyek dari pengaturan generasi dan input pilihan Anda.

- Susun dan hubungkan node media dan generasi pada kanvas tanpa batas
- Buat gambar dan video melalui koneksi API yang dikonfigurasi
- Simpan proyek secara lokal di IndexedDB dan buka kembali dari dasbor proyek
- Ubah nama, hapus, impor, dan ekspor proyek, termasuk arsip ZIP berisi media proyek

Proyek terikat pada browser dan origin situs saat ini, tanpa sinkronisasi berbasis akun. Ekspor salinan portabel sebelum menghapus data browser atau berpindah perangkat maupun domain.

## Program Afiliasi Flaq.ai

Halaman publik dan halaman generasi memuat promosi afiliasi sesuai bahasa. Tombol ajakan membuka halaman Flaq.ai dalam bahasa yang sama dan menyertakan `utm_source=flaq-saas-template` untuk atribusi sumber.

Melalui [Program Afiliasi Flaq.ai](https://flaq.ai/id/affiliate-program?utm_source=flaq-saas-template), Anda dapat memperoleh komisi 20% dari pesanan berbayar valid pertama pengguna rujukan dan 10% dari pesanan berbayar valid berikutnya dalam 60 hari setelah pendaftaran. Kelayakan dan pembayaran mengikuti ketentuan terbaru pada halaman program.

## Internasionalisasi

Template mendukung **15 locale**: Inggris (default), Jepang, Indonesia, Italia, Portugis Brasil, Spanyol, Jerman, Rusia, Prancis, Mandarin Sederhana, Mandarin Tradisional, Korea, Thai, Vietnam, dan Arab. Kode dan README memakai locale yang sama: `en`, `ja`, `id`, `it`, `pt`, `es`, `de`, `ru`, `fr`, `zh`, `tw`, `ko`, `th`, `vi`, dan `ar`. Bahasa Inggris memakai `/`, bahasa lain memakai `/{locale}/`, dan bahasa Arab dirender dari kanan ke kiri.

Berkas terjemahan berada di `messages/`, satu JSON per locale. Bahasa terdeteksi dari header `Accept-Language` browser dan dapat diganti melalui footer atau dialog bahasa. Untuk menambah bahasa, daftarkan locale di `i18n/languages.ts`, buat berkas terjemahan, lalu tambahkan teks halaman dan terjemahan `Metadata` dengan struktur key yang ada.

## SEO dan akses perayap AI

Halaman publik menggunakan judul dan deskripsi lokal, URL canonical absolut, alternatif `hreflang` untuk 15 bahasa, Open Graph, Twitter card, serta arahan index/follow. `/sitemap.xml` mencakup beranda, fitur, dan kebijakan di setiap bahasa beserta tautan alternatifnya; URL proyek kanvas lokal individual tidak disertakan.

- `/robots.txt` mengizinkan perayapan konten publik oleh mesin pencari dan asisten AI, serta memblokir rute API dan callback
- `/llms.txt` menyajikan peta ringkas produk, halaman, bahasa, dokumentasi, dan kebijakan
- `/llms-full.txt` memuat konteks proyek, kemampuan, penyiapan, arsitektur, dan batas penggunaan yang lebih lengkap
- JSON-LD menjelaskan situs serta repositori sumber terbuka berlisensi MIT tanpa penilaian yang tidak dapat diverifikasi

## Struktur proyek

```text
.
├── app/                     # Halaman Next.js App Router
│   ├── [locale]/            # Rute untuk 15 locale
│   │   ├── (with-footer)/   # Halaman dengan footer
│   │   │   ├── (home)/      # Halaman utama
│   │   │   └── (ai-features)/ # Halaman fitur AIGC
│   │   └── (without-footer)/ # Halaman awal, dasbor, dan editor AI Canvas
│   ├── api/                 # Rute API proxy-image dan upload
│   ├── robots.ts            # Pembuatan robots.txt
│   ├── sitemap.ts           # Pembuatan sitemap dinamis
│   ├── llms.txt/            # Peta situs ringkas untuk AI
│   └── llms-full.txt/       # Konteks proyek lengkap untuk AI
├── components/              # Komponen React yang dapat digunakan ulang
│   ├── infinite-canvas/     # Editor, dasbor, integrasi, dan penyimpanan lokal
│   ├── unified-generator/   # Formulir gambar/video bersama dan riwayat
│   ├── ui/                  # Komponen bergaya shadcn/ui berbasis Radix
│   ├── dialog/              # Dialog, termasuk pengaturan API
│   ├── layout/              # Header, footer, dan sidebar
│   └── ...                  # Komponen khusus fitur
├── hooks/                   # Hook React khusus
├── i18n/                    # Konfigurasi internasionalisasi
│   ├── languages.ts         # Definisi locale yang didukung
│   ├── request.ts           # Konfigurasi permintaan next-intl
│   └── routing.ts           # Konfigurasi rute locale
├── lib/                     # Pustaka utilitas
│   ├── seo/                 # Metadata, llms.txt, dan utilitas perayap
│   ├── constants/           # Konstanta, definisi model penyedia, dan navigasi
│   ├── utils/               # Fungsi utilitas
│   └── env.ts               # Utilitas variabel lingkungan
├── messages/                # Satu berkas terjemahan per locale
├── network/                 # Klien API dan utilitas jaringan
│   ├── clientFetch.ts       # Klien API Flaq.ai dengan autentikasi
│   ├── image/               # API pembuatan gambar
│   ├── video/               # API pembuatan video
│   ├── local-history.ts     # Riwayat lokal browser
│   ├── task-polling.ts      # Pemeriksaan status generasi bersama
│   └── upload/              # Klien unggahan Flaq
├── public/                  # Aset statis: gambar, ikon, font
├── store/                   # Penyimpanan state Zustand
├── next.config.mjs          # Konfigurasi Next.js
├── proxy.ts                 # Proxy middleware untuk i18n dan penerusan IP
└── tsconfig.json            # Konfigurasi TypeScript
```

## Deployment

Cara termudah untuk menerapkan template ini adalah melalui [Vercel](https://vercel.com):

[![Deploy dengan Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flaqai/flaq-saas-template)

1. Push repositori ke GitHub lalu impor proyek di Vercel.
2. Atur `NEXT_PUBLIC_SITE_URL` ke origin produksi dan konfigurasi email kontak di pengaturan proyek.
3. Jika memakai R2 sendiri, tambahkan empat variabel server `R2_*` dan atur domain publiknya di aplikasi.
4. Deploy proyek.

Rute unggahan dan proxy gambar memerlukan runtime server Next.js. Untuk hosting Node.js sendiri, jalankan `pnpm build` lalu `pnpm start`. Jalankan `pnpm ts-check` secara terpisah sebelum deployment karena konfigurasi Next.js saat ini mengabaikan kesalahan TypeScript saat build. Origin produksi memastikan URL canonical, sitemap, dan sumber daya LLM memakai domain yang benar.

## Dokumentasi dan lisensi

Untuk penyiapan lengkap, arsitektur teknologi, dan deployment, lihat [README.md](./README.md) atau [README_zh.md](./README_zh.md). Proyek ini tersedia di bawah [MIT License](LICENSE).
