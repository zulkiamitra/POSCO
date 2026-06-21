# 📊 Laporan Kemajuan & Fitur Aplikasi Web POSCO (Posyandu Connection)

Dokumen ini berisi rangkuman kemajuan (progress) pengembangan aplikasi web POSCO beserta detail fitur yang telah diimplementasikan pada sisi Frontend (React + Vite) maupun Backend (Node.js + Express + Prisma + PostgreSQL).

---

## 🛠️ Ringkasan Arsitektur & Teknologi

Aplikasi POSCO dibangun dengan arsitektur modern untuk memastikan performa yang cepat, aman, dan responsif:

*   **Frontend (Web Application)**:
    *   **Framework**: React 19.2.5 + Vite 8
    *   **Routing**: React Router DOM (versi 7.14.2)
    *   **State Management**: Context API (`AuthContext`, `NotificationContext`)
    *   **Styling**: Vanilla CSS dengan desain modern, layout adaptif, dan responsif (CSS Grid/Flexbox)
    *   **Export Laporan**: `jspdf` & `html2canvas` untuk pembuatan laporan kesehatan balita berformat PDF secara dinamis.
*   **Backend (API Server)**:
    *   **Runtime/Language**: Node.js + TypeScript
    *   **Framework**: Express.js
    *   **Database ORM**: Prisma ORM
    *   **Database**: PostgreSQL
    *   **Autentikasi**: JWT (JSON Web Token) dengan session management.

---

## 👥 Fitur Utama Berdasarkan Peran Pengguna (Role-based Features)

Sistem POSCO mendukung multi-role secara penuh dengan pembatasan hak akses rute menggunakan komponen [ProtectedRoute.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/components/ProtectedRoute.jsx). Berikut adalah penjelasan detail mengenai fitur untuk masing-masing peran:

### 1. 🔑 Autentikasi & Halaman Umum (Public Pages)
*   **Halaman Beranda (Home)**: Landing page interaktif yang memberikan gambaran umum tentang POSCO dan mengarahkan pengguna ke halaman login berdasarkan role mereka.
*   **Login Multirole ([Login.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/Login.jsx))**: Halaman masuk bagi Kader, Orang Tua, dan Verifikator. Dilengkapi validasi form instan dan pesan toast untuk error/sukses.
*   **Login Admin Khusus ([AdminLogin.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/AdminLogin.jsx))**: Pintu masuk terpisah khusus untuk administrator sistem guna menjaga keamanan.
*   **Registrasi Akun ([Register.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/Register.jsx))**: Pendaftaran pengguna baru (Kader, Orang Tua, dll) dengan validasi data yang ketat (format email, NIK 16 digit, nomor telepon standar Indonesia, dan kekuatan kata sandi).
*   **Lupa Kata Sandi ([ForgotPassword.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/ForgotPassword.jsx))**: Alur pemulihan akun bagi pengguna yang lupa password.

### 2. 🛡️ Portal Admin ([AdminDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/AdminDashboard.jsx))
*   **Statistik Global**: Menampilkan metrik utama seperti total pengguna (kader, orang tua), total balita yang terdaftar, dan tingkat kehadiran posyandu.
*   **Manajemen Pengguna (CRUD)**:
    *   Mengelola akun Admin, Kader, dan Orang Tua.
    *   Fitur Tambah, Edit, Hapus, dan Pencarian/Filter pengguna berdasarkan nama, peran, atau wilayah kerja.
*   **Monitoring Data Balita & Ibu Hamil**: Akses menyeluruh ke database rekam medis untuk memantau tren kesehatan regional.
*   **Laporan & Analitik**: Visualisasi grafik atau tabulasi data untuk dianalisis oleh dinas kesehatan atau pengurus pusat.

### 3. 👩‍⚕️ Portal Kader Posyandu ([KaderDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/KaderDashboard.jsx))
Kader memiliki peran vital di lapangan, oleh karena itu fiturnya dibuat sangat operasional:
*   **Manajemen Data Warga**: Pengelolaan data Balita dan Ibu Hamil di wilayah posyandu setempat.
*   **Detail Balita Modal (3 Tab Utama)**:
    *   **Tab Informasi (📋)**: Menampilkan detail dasar balita (nama, tanggal lahir, jenis kelamin, BB lahir) dan status kesehatan terkini (BB/TB sekarang, status gizi dengan indikasi warna, status stunting), serta rekam imunisasi lengkap (BCG, HB0, Polio, DPT, Campak) bersimbol ikon status (✅/⏳).
    *   **Tab Riwayat (📊)**: Riwayat pemeriksaan kesehatan berkala yang diurutkan secara kronologis (dari terbaru ke terlama), menampilkan status gizi, Berat Badan (kg), Tinggi Badan (cm), dan Lingkar Kepala (cm) dalam bentuk kartu metrik.
    *   **Tab Orang Tua (👨‍👩‍👧)**: Detail kontak orang tua/wali seperti nama, email, dan wilayah kerja dengan background warna pembeda.
*   **Ekspor Laporan PDF**: Tombol unduh laporan instan terintegrasi di modal detail balita untuk menghasilkan berkas PDF resmi (`Laporan-{NamaBalita}.pdf`) berisi info anak, orang tua, dan tabel riwayat pemeriksaan lengkap dengan visual header hijau POSCO.
*   **Riwayat Catatan (Tampilan 2 Kolom)**:
    *   **Kolom Kiri**: Daftar nama balita yang dapat diklik dengan filter pencarian cepat.
    *   **Kolom Kanan**: Timeline riwayat pemeriksaan balita yang dipilih, mempermudah kader menganalisis grafik pertumbuhan fisik anak secara langsung.
*   **Agenda Pemeriksaan**: Fitur untuk melihat dan membuat sesi posyandu mendatang serta mencatat kehadiran warga.

### 4. 👨‍👩‍👧 Portal Orang Tua ([OrangtuaDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/OrangtuaDashboard.jsx))
*   **Informasi Tumbuh Kembang Anak**: Dashboard ramah keluarga untuk memantau status gizi anak secara visual (Hijau = Normal, Oranye = Berisiko, Merah = Stunting/Gizi Buruk).
*   **Riwayat Pemeriksaan Anak**: Melihat riwayat penimbangan berat badan, pengukuran tinggi badan, lingkar kepala, serta catatan khusus dari kader.
*   **Jadwal Imunisasi & Sesi Posyandu**: Kalender kegiatan posyandu dan notifikasi jadwal imunisasi wajib anak berikutnya agar tidak terlewat.
*   **Edit Profil**: Manajemen data pribadi orang tua dan koordinat wilayah tempat tinggal.

### 5. 🔍 Portal Verifikator ([VerifikatorDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/VerifikatorDashboard.jsx))
*   **Verifikasi Akun Kader Baru**: Meninjau dan menyetujui pendaftaran kader baru yang masuk dengan status `kader_pending` agar dapat diubah menjadi `kader` aktif yang sah.
*   **Tolak/Hapus Pendaftaran**: Menolak pendaftaran kader yang datanya tidak valid dengan konfirmasi keamanan.
*   **Kader Terverifikasi**: Menampilkan daftar seluruh kader posyandu yang saat ini aktif di sistem beserta wilayah tugasnya.
*   **Statistik Verifikator**: Jumlah kader pending, kader aktif, dan total pendaftaran.

---

## 🔒 Peningkatan Sistem Keamanan & Kualitas Kode (Phase 1 Fixes)

Untuk menjamin keamanan data medis warga, beberapa peningkatan krusial telah diterapkan di sisi frontend:

1.  **Enkripsi Penyimpanan Lokal (Safe localStorage)**:
    *   Sebelumnya, data sensitif seperti *password* dan *email* disimpan secara mentah (plain-text) di `localStorage`, yang sangat rentan terhadap serangan XSS (Cross-Site Scripting).
    *   **Perbaikan**: Data sensitif kini dihapus secara otomatis sebelum diserialisasi ke `localStorage` di dalam [AuthContext.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/context/AuthContext.jsx).
2.  **Manajemen Sesi Otomatis (Session Inactivity Timeout)**:
    *   Sistem secara otomatis mendeteksi ketidakaktifan pengguna selama **30 menit**.
    *   Setiap kali ada interaksi (klik mouse, ketik keyboard, scroll layar, sentuhan layar), timer sesi akan di-reset secara otomatis.
    *   Jika pengguna tidak aktif selama batas waktu tersebut, sistem akan otomatis melakukan *logout* demi keamanan dan memunculkan notifikasi peringatan.
3.  **Sistem Validasi Form Pendaftaran**:
    *   Menggunakan regex standar RFC untuk validasi email.
    *   Validasi NIK Indonesia wajib memiliki panjang tepat 16 karakter angka.
    *   Validasi nomor telepon mendukung awalan `+62` atau `08` dengan rentang panjang 9 hingga 12 digit.
    *   Persyaratan password aman (minimal 8 karakter, harus mengandung huruf besar dan angka).
4.  **Sistem Toast Notification Baru ([NotificationContext.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/context/NotificationContext.jsx))**:
    *   Komponen notifikasi melayang di pojok kanan bawah yang mendukung empat tipe visual: `success` (hijau), `error` (merah), `warning` (oranye), dan `info` (biru).
    *   Otomatis menghilang setelah 3 detik dengan transisi animasi GPU-accelerated yang mulus.
5.  **Penerapan Komponen Reusable UI**:
    *   [EmptyState.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/components/EmptyState.jsx): Digunakan ketika tabel/daftar data kosong atau hasil pencarian tidak ditemukan.
    *   [LoadingSpinner.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/components/LoadingSpinner.jsx): Mengindikasikan proses loading data dari backend.
6.  **Desain Responsif**:
    *   Kerangka styling [responsive.css](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/styles/responsive.css) dengan breakpoint standar (`480px`, `640px`, `768px`, dan `1024px`) memastikan aplikasi tampil sempurna di perangkat *smartphone*, tablet, maupun desktop. Sidebar otomatis kolaps di layar kecil.

---

## 🗄️ Backend API & Skema Database PostgreSQL ([schema.prisma](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/backend/prisma/schema.prisma))

Backend aplikasi POSCO mengimplementasikan skema database relasional menggunakan PostgreSQL yang dimodelkan melalui Prisma ORM:

*   **Tabel `User`**: Menyimpan kredensial pengguna, NIK, nomor telepon, wilayah tugas, serta relasi ke Posyandu.
*   **Tabel `Posyandu`**: Representasi lokasi posyandu beserta kecamatan, kelurahan, nama kader, dan status keaktifan.
*   **Tabel `Child`**: Menyimpan data balita (nama, ibu, tanggal lahir, jenis kelamin, berat/tinggi lahir, berat/tinggi saat ini, status gizi & stunting) beserta kolom JSON untuk rekam imunisasi dan riwayat checkup terperinci.
*   **Tabel `Pregnancy`**: Menyimpan data kesehatan ibu hamil, usia kehamilan, HPHT, taksiran persalinan (HPL), tensi darah, berat badan, dan penanda risiko tinggi (`highRisk`).
*   **Tabel `PosyanduSession`**: Data agenda posyandu, waktu pelaksanaan, status kegiatan, dan catatan kehadiran.
*   **Tabel `Referral`**: Menyimpan riwayat rujukan anak (nama anak, alasan rujukan, tujuan rujukan, kader perujuk, tanggal, dan status rujukan).

---

## 📂 Struktur File Utama yang Dikembangkan

Berikut adalah letak berkas-berkas penting yang membentuk sistem web POSCO saat ini:

```
projek-posco/
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx       # Proteksi rute berbasis login & role
│   │   │   ├── EmptyState.jsx           # Tampilan default jika data kosong
│   │   │   └── LoadingSpinner.jsx       # Animasi loading data
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Logika login, logout & session timeout
│   │   │   └── NotificationContext.jsx  # Penyedia sistem Toast Notification
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx       # Dashboard management admin
│   │   │   ├── KaderDashboard.jsx       # Portal operasional Kader (fitur cetak PDF, detail balita)
│   │   │   ├── OrangtuaDashboard.jsx   # Portal pemantauan gizi orang tua
│   │   │   ├── VerifikatorDashboard.jsx # Portal persetujuan pendaftaran kader
│   │   │   ├── Login.jsx / AdminLogin.jsx
│   │   │   └── Register.jsx             # Form registrasi dengan validasi regex
│   │   ├── styles/
│   │   │   ├── responsive.css           # Kumpulan media queries untuk responsivitas mobile
│   │   │   └── index.css                # Style utama aplikasi
│   │   ├── App.jsx                      # Konfigurasi rute React Router
│   │   └── main.jsx
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                # Definisi model database PostgreSQL
│   │   └── seed.ts                      # Seeder data awal untuk pengembangan
│   ├── src/
│   │   ├── controllers/                 # Kontroler logika bisnis API (user, child, dll)
│   │   ├── routes/                      # Endpoint routing express untuk autentikasi dan resource
│   │   └── index.ts                     # Entrypoint server backend express
```

---

## 🎯 Rencana Langkah Selanjutnya (Next Steps)

1.  **Integrasi Penuh Frontend-Backend**: Mengganti mock/dummy data yang ada di frontend dengan pemanggilan HTTP Request nyata menggunakan Axios/Fetch ke API Server Backend.
2.  **Autentikasi JWT Riil**: Mengintegrasikan sistem verifikasi JWT Token pada backend ke header permintaan frontend.
3.  **Grafik Pertumbuhan Anak**: Mengintegrasikan library chart seperti `Chart.js` atau `Recharts` pada dashboard kader dan orang tua untuk visualisasi kurva pertumbuhan fisik balita (BB/TB terhadap Umur) berdasarkan standar WHO.
4.  **Uji Coba Pengguna (UAT)**: Melakukan UAT (User Acceptance Testing) bersama kader posyandu riil untuk menilai kepraktisan antarmuka mobile-responsive saat digunakan di lapangan.
