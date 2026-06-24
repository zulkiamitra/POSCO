# 📘 Buku Panduan Pengguna: Administrator & Verifikator POSCO

Panduan ini ditujukan bagi **Administrator Sistem** dan **Verifikator** dalam mengoperasikan Portal Web POSCO. Peran ini memegang kontrol tertinggi dalam memantau wilayah kerja posyandu, memvalidasi kader baru, serta menganalisis statistik kesehatan anak secara menyeluruh.

---

## 🔒 Bagian 1: Autentikasi & Login Admin

Portal Admin diisolasi dari halaman login warga biasa demi alasan keamanan.

### Langkah-langkah Login Admin:
1.  Buka browser dan navigasikan ke halaman khusus login admin: [AdminLogin.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/AdminLogin.jsx).
2.  Masukkan **Email Admin** (contoh default pengujian: `admin@posco.id`).
3.  Masukkan **Password Keamanan**.
4.  Klik tombol **Masuk Portal Admin**.
5.  Setelah kredensial diverifikasi oleh sistem, Anda akan otomatis dialihkan ke halaman dasbor utama: [AdminDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/AdminDashboard.jsx).

---

## 📊 Bagian 2: Fitur Utama Dashboard Admin

Dashboard utama memberikan gambaran cepat mengenai parameter-parameter penting di wilayah Anda:

1.  **Welcome Banner**: Menampilkan nama admin, wilayah koordinasi, dan tanggal sistem aktif.
2.  **Ringkasan Metrik (Stats Cards)**:
    *   **Total Posyandu**: Jumlah posyandu yang terdaftar dalam yurisdiksi.
    *   **Kunjungan Sesi**: Jumlah sesi pemeriksaan yang berjalan.
    *   **Anak Terdaftar**: Jumlah anak balita yang masuk ke database.
    *   **Status Stunting**: Jumlah anak yang terdeteksi dengan status tumbuh kembang stunting.
3.  **Grafik Tren 6 Bulan (Trend Chart)**: Visualisasi reaktif pertumbuhan jumlah balita terdaftar dan tren pencegahan stunting dari bulan ke bulan.
4.  **Bilah Notifikasi**: Menampilkan kejadian terkini secara real-time seperti pendaftaran kader baru, agenda posyandu mendatang, atau perubahan status kesehatan kritis.

---

## 👥 Bagian 3: Manajemen Pengguna (User Management)

Melalui menu **Manajemen User** di sidebar, Admin dapat mengontrol semua hak akses pengguna sistem.

### 1. Menambahkan Pengguna Baru secara Manual
1.  Klik tombol **`+ Tambah User`** di pojok kanan atas.
2.  Isi data form:
    *   **Nama Lengkap & Email**
    *   **Peran (Role)**: Pilih di antara `Admin`, `Kader`, `Verifikator`, atau `Orang Tua`.
    *   **Wilayah Tugas**: Wilayah administrasi (Kecamatan/Kelurahan).
    *   **Posyandu Terkait**: Hubungkan user dengan unit posyandu tertentu.
    *   **Password Keamanan**: Kata sandi awal untuk user tersebut.
3.  Klik **Simpan**.

### 2. Mengubah & Menghapus Akun
*   **Edit**: Klik tombol **`Edit`** pada baris pengguna untuk memperbarui data profil, peran, maupun me-reset password mereka.
*   **Hapus**: Klik tombol **`Hapus`** untuk menghapus akses pengguna dari database secara permanen.

> [!CAUTION]
> Menghapus akun Orang Tua akan memutus hubungan akses data balita di dasbor mereka, pastikan untuk melakukan konfirmasi ulang sebelum menghapus data.

---

## 🏥 Bagian 4: Manajemen Wilayah & Posyandu

Fitur ini digunakan untuk memetakan posyandu aktif yang bertugas di lapangan.
*   **Lokasi Menu**: Sidebar → **Wilayah & Posyandu**
*   **Tambah Posyandu**: Klik **`+ Tambah Posyandu`** lalu masukkan nama posyandu, nama kelurahan, kecamatan, dan tunjuk kader utama yang memimpin.
*   **Status Posyandu**: Posyandu dapat diatur menjadi `Aktif` atau `Nonaktif`. Menonaktifkan posyandu akan membekukan agenda sesi posyandu tersebut untuk sementara waktu.

---

## 👶 Bagian 5: Monitoring Anak Global

Admin dapat memantau seluruh tumbuh kembang balita tanpa batasan wilayah tugas kader.
*   **Pencarian Cepat**: Cari data berdasarkan nama anak atau nama ibu kandung.
*   **Filter Status**: Batasi tampilan hanya untuk anak dengan status `Normal`, `Gizi Kurang`, atau `Stunting`.
*   **Ubah Status Gizi Manual**: Admin memiliki otorisasi untuk mengubah status gizi anak secara manual jika diperlukan melalui dropdown aksi tabel.

---

## ⚙️ Bagian 6: Portal Khusus Verifikator

Peran **Verifikator** ditugaskan khusus untuk menyeleksi kader-kader posyandu baru yang mendaftar secara mandiri.
*   **Lokasi Berkas**: [VerifikatorDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/VerifikatorDashboard.jsx)
*   **Antarmuka**: Memiliki sidebar dengan 2 tab utama:
    1.  **Menunggu Verifikasi (Pending)**: Menampilkan list registrasi kader baru yang statusnya masih `kader_pending`.
    2.  **Kader Terverifikasi (Active)**: Menampilkan seluruh kader yang sudah resmi aktif dalam sistem.

### Prosedur Verifikasi Kader Baru oleh Verifikator:
1.  Buka tab **Menunggu Verifikasi**.
2.  Periksa kesesuaian data pendaftar (Nama, Email, Wilayah, dan NIK).
3.  Pilih salah satu tindakan:
    *   **Setujui Kader**: Klik tombol hijau **`Setujui Kader`**. Status kader berubah menjadi `Aktif` dengan role `kader`. User tersebut kini dapat login ke aplikasi mobile maupun dasbor kader di web.
    *   **Tolak**: Klik tombol merah **`Tolak`** untuk membatalkan registrasi dan menghapus data pendaftaran bermasalah tersebut dari sistem.

---

## ❓ FAQ & Penanganan Masalah (Troubleshooting)

**Q: Mengapa pendaftaran Kader baru tidak bisa digunakan untuk login?**  
A: Kader baru memiliki status default `kader_pending`. Silakan login dengan akun Verifikator lalu setujui pendaftaran mereka di halaman Verifikator terlebih dahulu.

**Q: Apakah Admin bisa memindahkan tugas seorang Kader ke Posyandu lain?**  
A: Ya, masuk ke menu **Manajemen User**, cari nama kader tersebut, klik **Edit**, ubah field **Posyandu Terkait**, lalu simpan perubahan.

**Q: Bagaimana cara mengekspor statistik bulanan ke Excel/PDF dari sisi Admin?**  
A: Fitur analitik visual disediakan secara interaktif di tab **Analitik**. Untuk cetak laporan fisik, gunakan pintasan keyboard `Ctrl + P` pada halaman dasbor analitik untuk mencetak layout dashboard ke printer atau menyimpannya sebagai file PDF.
