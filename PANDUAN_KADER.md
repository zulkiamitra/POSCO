# 📗 Buku Panduan Pengguna: Kader Posyandu POSCO

Kader Posyandu memegang peran penting di garis depan dalam mengumpulkan data pertumbuhan anak, melakukan penyuluhan kesehatan, serta menginput riwayat imunisasi. Kader POSCO difasilitasi dengan dua media akses: **Portal Web POSCO** (untuk administrasi & unduh laporan) dan **Aplikasi Mobile POSCO** (untuk input praktis langsung di lapangan).

---

## 💻 Bagian 1: Penggunaan Portal Web Kader

Portal web kader berfokus pada visualisasi data yang kaya, manajemen rujukan warga, pencetakan berkas, serta pengelolaan data yang komprehensif. Portal web diakses melalui: [KaderDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/KaderDashboard.jsx).

### 1. Navigasi Halaman Utama Web
Di sebelah kiri halaman terdapat sidebar navigasi yang berisi menu-menu berikut:

| Nama Menu | Fungsi Utama | Keterangan Fitur |
| :--- | :--- | :--- |
| **Dashboard** | Statistik Visual Gizi Anak | Grafik lingkaran gender, grafik batang status gizi, dan kurva kehadiran posyandu. |
| **Data Warga** | Direktori Pencarian Balita & Ibu | Melihat detail informasi balita, imunisasi, dan mengunduh laporan PDF. |
| **Jadwal Sesi** | Riwayat Jadwal Posyandu | Melihat kalender kegiatan posyandu dan absensi kehadiran warga. |
| **Buat Sesi Baru** | Perencanaan Kegiatan | Membuat agenda posyandu mendatang (lokasi, kuota, tanggal & waktu). |
| **Tindak Lanjut** | Menu Operasional Edit & Cek | Sub-tab Rujukan Sesi, Edit Data Anak/Ibu Hamil, dan Input Pemeriksaan baru. |
| **Riwayat Catatan** | Timeline Pemeriksaan Balita | Riwayat rekam medis antropometri balita dari waktu ke waktu secara kronologis. |

---

### 2. Fitur Detail Balita & Unduh PDF Laporan
1. Buka halaman **Data Warga** → Tab **Balita**.
2. Klik tombol **Lihat Detail** pada baris anak yang dipilih.
3. Sebuah jendela modal interaktif akan terbuka dengan 3 tab informasi:
   - **Informasi**: Detail kelahiran, biodata anak, dan daftar checklist imunisasi (BCG, DPT, Polio, Campak).
   - **Riwayat**: Timeline riwayat penimbangan (tanggal pemeriksaan, berat, tinggi, lingkar lengan, status gizi).
   - **Orang Tua**: Informasi wali / orang tua kandung (nama, email, nomor telepon, wilayah).
4. **Unduh PDF**: Klik tombol biru **`📥 Download PDF`** di pojok kanan modal. Laporan fisik anak dengan header POSCO resmi akan diunduh secara otomatis dengan format nama file `Laporan-{NamaBalita}.pdf`.

---

### 3. Operasional Menu "Tindak Lanjut" (Fitur Web Baru)
Menu **Tindak Lanjut** dirancang ulang sebagai pusat kendali perubahan data warga di lapangan. Menu ini memiliki tiga sub-tab:

#### A. Tab "Rujukan Sesi"
Menampilkan daftar balita yang dirujuk ke faskes/puskesmas karena risiko gizi kurang atau stunting.
*   Kader dapat meninjau status rujukan (`Proses` / `Selesai`) dan mengedit keterangan tindak lanjut medis.

#### B. Tab "Data Balita"
Berisi list anak balita aktif posyandu. Tersedia dua tombol aksi penting di kolom kanan:
*   **Aksi `📝 Edit`**: Membuka `EditWargaModal`. Digunakan untuk mengubah biodata dasar anak, nama ibu kandung, tanggal lahir, jenis kelamin, serta berat lahir.
*   **Aksi `➕ Pemeriksaan`**: Membuka `InputPemeriksaanModal`. Digunakan untuk menambahkan rekaman hasil pemeriksaan posyandu berkala:
    - Masukkan tanggal pemeriksaan (default hari ini).
    - Isi parameter fisik: Berat Badan (kg), Tinggi Badan (cm), Lingkar Kepala (cm), Lingkar Lengan (cm).
    - Pilih kategori status gizi anak (`Normal`, `Gizi Kurang`, atau `Gizi Lebih`).
    - Klik **Simpan**. Data pada dashboard dan grafik tumbuh kembang anak akan otomatis ter-update seketika tanpa perlu memuat ulang halaman browser!

#### C. Tab "Data Ibu Hamil"
Berisi daftar ibu hamil aktif di wilayah posyandu.
*   **Aksi `Edit`**: Membuka form edit informasi kehamilan seperti HPHT (Hari Pertama Haid Terakhir), taksiran persalinan (HPL), usia kandungan (minggu), tekanan darah sistolik/diastolik, berat badan ibu, serta status kehamilan risiko tinggi.

---

## 📱 Bagian 2: Penggunaan Aplikasi Mobile Kader (Flutter)

Aplikasi mobile dirancang agar Kader dapat melakukan input data dengan praktis langsung di posyandu saat proses penimbangan anak sedang berlangsung tanpa harus membawa laptop.

### 1. Autentikasi Mobile & Sesi
*   Akses login mobile terhubung dengan API backend aman via [api_client.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/shared/api_client.dart).
*   Token JWT akan disimpan di perangkat secara permanen sehingga Kader tidak perlu login kembali di hari posyandu berikutnya (Persistent Session).

### 2. Agenda Screen & Input Hasil Pemeriksaan (Lapangan)
Aksi ini dilakukan melalui: [agenda_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/kader/agenda_screen.dart).

1. Buka layar **Agenda** pada aplikasi mobile.
2. Pilih balita yang sedang mengantre untuk diperiksa.
3. Klik tombol **Input Pemeriksaan**.
4. Isi form dengan cepat:
   - **Berat Badan** (dalam kg)
   - **Tinggi Badan** (dalam cm)
   - **Lingkar Kepala & Lingkar Lengan (LILA)**
   - **Status Gizi** (Normal / Gizi Kurang / Gizi Lebih)
   - **Layanan Tambahan**: Checklist jika anak diberikan Vitamin A, Obat Cacing, atau PMT (Pemberian Makanan Tambahan).
5. Klik **Simpan**. Melalui method `upsertChild` di [nutrition_stats_repository.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/shared/nutrition_stats_repository.dart), data tersebut akan diunggah ke database PostgreSQL secara real-time dan reaktif meng-update tampilan layar dasbor orang tua.

---

### 3. Mengubah Profil & Foto Profil Kader (Mobile)
1. Masuk ke halaman **Profil** di pojok kanan bawah aplikasi mobile.
2. Klik tombol **Edit Profil**.
3. Anda dapat mengubah Nama Lengkap, Nomor HP, atau Wilayah Tugas.
4. **Ganti Foto Profil**: Tekan pada area lingkaran foto profil. Aplikasi akan mengaktifkan *Image Picker* dan menampilkan pilihan:
   - **Kamera**: Mengambil foto diri secara langsung menggunakan kamera HP.
   - **Galeri**: Memilih foto yang sudah ada dari galeri ponsel.
5. Klik **Simpan** untuk mengunggah berkas foto ke server dan meng-update profil secara global.

---

## ❓ FAQ & Penanganan Masalah Kader

> [!TIP]
> **Pemeriksaan Cepat di Lapangan**:
> Saat koneksi internet lambat di lapangan posyandu, gunakan aplikasi mobile untuk input data pemeriksaan. Aplikasi mobile menggunakan pengiriman request asinkron yang efisien untuk mencegah aplikasi macet.

**Q: Bagaimana cara mendaftarkan bayi baru lahir ke posyandu di Portal Web?**  
A: Masuk ke halaman **Data Warga** → Klik tombol **`+ Tambah Data`** di kanan atas → Pilih Tipe **Balita** → Lengkapi formulir kelahiran (Nama, Tgl Lahir, Berat Lahir, Nama Ibu) → Klik **Simpan**.

**Q: Mengapa detail orang tua balita kosong di tab "Orang Tua"?**  
A: Hal ini terjadi jika nama atau ID Orang Tua tidak terelasi dengan benar di database. Pastikan akun Orang Tua telah terdaftar terlebih dahulu di sistem agar data relasi wali di [KaderDashboard.jsx](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/web/src/pages/KaderDashboard.jsx) dapat dimuat secara tepat.

**Q: PDF Laporan Balita tidak mau terunduh?**  
A: Pastikan browser Anda tidak memblokir pop-up/unduhan otomatis. Jika menggunakan browser Chrome di HP, periksa izin penyimpanan berkas.
