# 📙 Buku Panduan Pengguna: Orang Tua / Wali POSCO

Buku panduan ini ditujukan bagi **Orang Tua / Wali Balita** dalam menggunakan sistem POSCO. Melalui platform ini, Orang Tua dapat memantau secara langsung status gizi anak, melihat riwayat pertumbuhan berat dan tinggi badan, melihat jadwal kunjungan posyandu terdekat, serta memperbarui profil secara praktis baik via portal web maupun aplikasi handphone (mobile).

---

## 💻 Bagian 1: Portal Web Orang Tua

Portal web ini diakses melalui browser komputer atau smartphone Anda. Halaman dashboard utama diimplementasikan pada berkas: [OrangtuaDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/OrangtuaDashboard.jsx).

### 1. Menu Navigasi Portal Web
Terdapat bilah navigasi (sidebar) di sisi kiri layar dengan menu-menu sebagai berikut:

*   🏠 **Beranda**: Halaman utama berisi kartu ucapan selamat datang, metrik jumlah anak yang terdaftar, dan kartu rangkuman ringkas untuk masing-masing anak.
*   👶 **Data Anak**: Informasi biodata anak secara detail termasuk tanggal lahir, jenis kelamin, berat lahir, dan pengukuran fisik teranyar (BB, TB, status stunting).
*   📋 **Monitoring Anak**: Halaman berbentuk tabel yang memuat daftar anak dan tombol unduh dokumen. Anda dapat memfilter berdasarkan status gizi.
*   📈 **Grafik Pertumbuhan**: Menampilkan kurva grafik visual pertumbuhan anak (Kurva Berat Badan dan Tinggi Badan) dari waktu ke waktu berdasarkan riwayat catatan timbangan kader.
*   📅 **Jadwal Kunjungan**: Daftar agenda sesi posyandu terdekat lengkap dengan lokasi, tanggal, waktu, dan sisa kuota antrean.
*   👤 **Profil Saya**: Tab khusus untuk mengedit data profil akun orang tua.

---

### 2. Mengunduh Dokumen Laporan PDF Anak
Orang Tua dapat mengunduh berkas laporan digital untuk kebutuhan medis atau administrasi:
1.  Pilih menu **Monitoring Anak** di sidebar.
2.  **Unduh PDF Per Anak**: Cari nama anak Anda di tabel, lalu klik tombol hijau **`📄 Unduh PDF`**.
3.  **Unduh Semua PDF**: Jika Anda memiliki lebih dari 1 anak yang terdaftar di posyandu, klik tombol **`📥 Unduh Semua PDF`** di bagian atas tabel. Sistem akan mengemas dan mengunduh seluruh laporan PDF anak Anda satu per satu secara otomatis.

---

### 3. Memantau Grafik Tumbuh Kembang (Kurva KMS Digital)
Fitur ini mempermudah Orang Tua melihat perkembangan anak secara visual:
1.  Masuk ke menu **Grafik Pertumbuhan**.
2.  Pilih tab nama anak Anda di bagian atas jika Anda memiliki lebih dari satu anak.
3.  Sistem akan menampilkan 2 grafik garis interaktif:
    - **Kurva Berat Badan (BB)**: Menunjukkan kenaikan/penurunan berat badan anak (dalam kg).
    - **Kurva Tinggi Badan (TB)**: Menunjukkan perkembangan tinggi badan anak (dalam cm).
4.  Arahkan kursor (*hover*) pada titik lingkaran grafik untuk melihat nilai spesifik berat/tinggi badan pada tanggal pemeriksaan tersebut.
5.  Di bagian bawah grafik, terdapat tabel log data pemeriksaan lengkap yang diinput oleh kader secara kronologis.

---

### 4. Mengubah Profil & Sinkronisasi Instan
Orang tua dapat memperbarui nama atau username mereka secara reaktif:
1.  Klik menu **Profil Saya** di sidebar.
2.  Klik tombol **`Edit Profil`**.
3.  Ubah data pada kotak teks **Nama Lengkap**.
4.  Klik **`Simpan`**.
5.  **Reaktivitas Instan**: Melalui integrasi `updateCurrentUser` di [AuthContext.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/context/AuthContext.jsx), nama Anda di sidebar, topbar, dan welcome banner akan langsung berubah saat itu juga tanpa perlu me-refresh halaman web!

---

## 📱 Bagian 2: Aplikasi Mobile Orang Tua (Flutter)

Aplikasi mobile POSCO memberikan kemudahan memantau kesehatan anak langsung dari genggaman handphone Anda kapan saja.

### 1. Dashboard Utama & Status Kesehatan
Diimplementasikan pada berkas: [orang_tua_dashboard_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/orang_tua/orang_tua_dashboard_screen.dart).
*   Dasbor langsung menampilkan ringkasan status gizi anak Anda saat ini.
*   Pewarnaan status gizi (Hijau untuk Normal, Oranye untuk Berisiko/Gizi Kurang, Merah untuk Stunting) langsung menyesuaikan dengan hasil penimbangan terakhir yang dimasukkan oleh Kader di posyandu.

### 2. Riwayat Pemeriksaan & Penimbangan
Diakses melalui: [riwayat_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/orang_tua/riwayat_screen.dart).
*   Menampilkan daftar pemeriksaan sebelumnya secara kronologis.
*   Hanya menampilkan kunjungan yang tanggalnya telah terlampaui (dibandingkan waktu sekarang).

### 3. Jadwal Kunjungan & Notifikasi Sesi
*   Orang tua dapat melihat jadwal posyandu mendatang.
*   Agenda yang tanggal kegiatannya masih di masa depan akan berlabel biru **"Mendatang"**.
*   Agenda yang telah lewat berlabel hijau **"Selesai"**.

### 4. Pusat Bantuan & FAQ Edukasi
Diakses melalui: [help_center_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/orang_tua/help_center_screen.dart).
*   Menyediakan artikel edukatif dan FAQ seputar kesehatan balita.
*   Membantu Orang Tua memahami cara membaca grafik tumbuh kembang anak, pentingnya imunisasi dasar, serta nutrisi penunjang untuk mencegah stunting.

### 5. Ganti Foto Profil & Biodata (Mobile)
Diakses melalui: [edit_profile_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/orang_tua/edit_profile_screen.dart).
1.  Klik menu **Profil** → **Edit Profil**.
2.  Ketuk ikon foto profil untuk membuka menu kamera atau galeri handphone Anda (menggunakan *Image Picker*).
3.  Pilih gambar terbaik Anda, lalu klik **Simpan** untuk mengunggah dan menyinkronkan profil Anda dengan database pusat.

---

## ❓ FAQ & Penanganan Masalah Orang Tua

> [!IMPORTANT]
> **Pembaruan Data Pemeriksaan**:
> Jika Anda menyadari data tinggi badan atau berat badan anak di aplikasi mobile berbeda dengan catatan buku fisik KMS, silakan hubungi Kader Posyandu Anda untuk melakukan pembaharuan data melalui menu **Tindak Lanjut** di Portal Web Kader.

**Q: Mengapa data anak saya tidak muncul di dashboard setelah login?**  
A: Pastikan akun Orang Tua Anda telah terhubung dengan data anak Anda di sistem. Hubungi Kader Posyandu untuk menautkan NIK / ID Orang Tua Anda ke profil balita terkait di database.

**Q: Bagaimana cara memperbarui Password akun saya?**  
A: Di portal web, Anda dapat menggunakan tautan [ForgotPassword.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/ForgotPassword.jsx) pada halaman masuk untuk memulihkan akun via email terdaftar.

**Q: Apakah data di aplikasi mobile saya ter-update otomatis jika Kader melakukan perubahan di web?**  
A: Ya, berkat arsitektur `ChangeNotifier` reaktif pada `NutritionStatsRepository` di mobile, data akan otomatis diperbarui saat Anda membuka kembali halaman dasbor.
