# LAPORAN PROGRESS ORANG TUA

BAB I
PENDAHULUAN

1.1 Latar Belakang
Pengembangan aplikasi Posco pada sisi mobile bertujuan menyediakan antarmuka yang jelas, konsisten, dan mudah digunakan tidak hanya oleh kader posyandu, tetapi juga oleh orang tua. Kebutuhan ini muncul karena orang tua perlu memantau jadwal posyandu anak, melihat riwayat pemeriksaan, dan memahami status gizi anak dengan cara yang sederhana dan intuitif. Jika tampilan tidak jelas, orang tua akan merasa kesulitan mengikuti perkembangan kesehatan anak, sehingga manfaat aplikasi menjadi kurang optimal.

Progress orang tua ini berfokus pada pembuatan frontend mobile role orang tua sebagai kelanjutan dari pengembangan role kader. Fitur yang dikembangkan mencakup dashboard orang tua, jadwal pemeriksaan, riwayat pemeriksaan, data anak, dan profil. Seluruh fitur didesain dengan mempertimbangkan perspektif orang tua yang ingin informasi ringkas, mudah dipahami, dan dapat diakses dengan cepat.

Pengembangan ini menggunakan data dummy yang konsisten dengan role kader, sehingga informasi yang ditampilkan kepada orang tua selalu sinkron dengan data kader. Dengan konsistensi data, orang tua dapat mempercayai informasi yang ditampilkan dan melakukan tindakan follow-up dengan percaya diri.

1.1.1 Konteks Operasional Orang Tua
Orang tua memiliki kebutuhan berbeda dengan kader. Mereka tidak perlu detail teknis, tetapi membutuhkan informasi ringkas tentang jadwal posyandu berikutnya, status gizi anak, dan riwayat pemeriksaan untuk referensi pribadi. Aplikasi harus memudahkan orang tua memahami status kesehatan anak dengan sekali pandang, tanpa harus membaca laporan teknis yang panjang.

1.1.2 Permasalahan yang Diatasi
Pada tahap awal pengembangan orang tua, terdapat beberapa tantangan: pertama, memastikan data jadwal dan riwayat sinkron dengan role kader; kedua, menyajikan informasi status gizi dengan cara yang mudah dipahami oleh non-medis; ketiga, membuat navigasi yang intuitif sehingga orang tua tidak kebingungan saat menggunakan aplikasi. Progress ini mengatasi ketiga hal tersebut dengan desain yang user-friendly dan integrasi data yang konsisten.

1.1.3 Arah Pengembangan Role Orang Tua
Arah pengembangan role orang tua menekankan kesederhanaan, kejelasan, dan konsistensi data. Fitur dirancang agar orang tua dapat dengan mudah memahami informasi tanpa pelatihan khusus. Palet warna, ukuran font, dan tata letak dirancang untuk audiens yang lebih umum dibandingkan role kader.

1.2 Tujuan Progress
Tujuan utama progress orang tua adalah menyelesaikan frontend mobile role orang tua agar dapat diakses dan digunakan oleh orang tua dengan lancar. Tujuan tersebut dijabarkan menjadi beberapa poin:

1) Membuat dashboard orang tua yang menampilkan informasi ringkas tentang anak dan status kesehatan.
2) Membangun fitur jadwal pemeriksaan yang menampilkan jadwal posyandu yang akan datang dan yang sudah dilalui.
3) Membuat fitur riwayat pemeriksaan yang menampilkan detail hasil pemeriksaan sebelumnya dengan cara yang mudah dipahami.
4) Memastikan seluruh data sinkron dengan role kader sehingga tidak ada inkonsistensi informasi.
5) Menampilkan status gizi dengan indikator visual yang jelas dan mudah dipahami oleh orang tua.
6) Membuat profil orang tua agar data pribadi dapat dikelola dengan baik.

1.2.1 Target Output
Target output progress orang tua adalah frontend mobile yang siap diuji, dengan fitur lengkap dashboard, jadwal, riwayat, data anak, dan profil. Output ini harus menampilkan data yang sinkron dengan role kader dan dapat diakses dengan navigasi yang lancar.

1.2.2 Indikator Keberhasilan
Indikator keberhasilan progress orang tua meliputi:

1) Semua halaman role orang tua dapat diakses dan berfungsi secara visual.
2) Data jadwal posyandu ditampilkan dengan status dinamis (mendatang/selesai).
3) Riwayat pemeriksaan menampilkan hanya pemeriksaan yang sudah terjadi, dengan detail lengkap.
4) Status gizi memiliki warna konsisten antara orang tua dan kader.
5) Data sinkron sempurna antara role kader dan role orang tua.
6) Navigasi antar halaman berjalan lancar dan intuitif.

1.3 Ruang Lingkup
Ruang lingkup progress orang tua mencakup seluruh frontend mobile untuk role user orang tua. Fokus pekerjaan meliputi:

1) Dashboard orang tua dengan tampilan ringkas status anak.
2) Jadwal pemeriksaan (Jadwal) dengan filter status (Semua, Mendatang, Selesai).
3) Riwayat pemeriksaan (Riwayat) yang menampilkan detail hasil pemeriksaan.
4) Detail riwayat pemeriksaan dengan informasi lengkap termasuk pengukuran dan layanan.
5) Data anak dengan profil dan informasi lainnya.
6) Profil orang tua untuk pengelolaan informasi pribadi.
7) Penyesuaian data dummy agar konsisten dengan role kader.

Progress ini tetap berbasis frontend dengan data dummy. Integrasi API backend akan dilakukan di tahap berikutnya.

1.3.1 Batasan Teknis
Karena fokus berada pada frontend, aspek seperti manajemen state global yang kompleks, optimasi performa tingkat lanjut, dan integrasi API belum menjadi prioritas. Data masih berbasis dummy yang dihasilkan secara dinamis berdasarkan parameter (usia anak, tanggal lahir, dll).

1.3.2 Asumsi Dasar
Diasumsikan bahwa user orang tua memiliki latar belakang pendidikan umum dan tidak memiliki pengetahuan medis mendalam. Asumsi ini mempengaruhi pemilihan teks, ukuran font, penggunaan ikon, dan penjelasan istilah medis yang disederhanakan.

1.4 Manfaat Kegiatan
Manfaat progress orang tua mencakup sisi pengguna, keluarga, dan pengembang. Untuk orang tua, aplikasi menjadi alat yang mempermudah pemantauan kesehatan anak. Untuk keluarga, informasi menjadi lebih terstruktur dan mudah diakses. Untuk pengembang, progress ini memberikan gambaran lengkap tentang kebutuhan kedua role utama aplikasi.

Manfaat tersebut dapat dirinci sebagai berikut:

1) Orang tua dapat memantau jadwal posyandu dengan mudah tanpa perlu bertanya kepada kader.
2) Riwayat pemeriksaan tersedia dalam format yang mudah dipahami.
3) Status gizi anak dapat dimonitor melalui visual yang jelas dan konsisten.
4) Data sinkron antara kader dan orang tua memastikan tidak ada informasi yang tertinggal atau berbeda.
5) Aplikasi siap untuk demo kepada calon pengguna orang tua.

1.4.1 Manfaat Teknis
Progress ini menghasilkan struktur tampilan role orang tua yang konsisten dan mudah dimaintain. Dengan pemisahan role yang jelas, penambahan fitur untuk role lain di masa depan dapat dilakukan lebih efisien. Selain itu, data generation logic yang dinamis memudahkan perubahan parameter (seperti tanggal lahir anak) tanpa perlu mengubah hard-coded data.

1.4.2 Manfaat Organisasi
Hasil progress ini memberikan bukti bahwa aplikasi dapat melayani dua role berbeda (kader dan orang tua) dengan konsistensi data. Hal ini penting untuk presentasi dan mendapatkan dukungan stakeholder untuk tahap pengembangan berikutnya.

1.5 Sistematika Laporan
Laporan ini disusun dengan struktur: Bab I Pendahuluan, Bab II Progress Pengembangan, Bab III Detail Fitur, Bab IV Rencana Selanjutnya, dan Bab V Penutup.

1.5.1 Gaya Penulisan
Laporan ditulis secara naratif-deskriptif dengan subbab rinci untuk menjelaskan proses pengembangan frontend mobile role orang tua secara menyeluruh.

1.5.2 Petunjuk Pembacaan
Pembaca dianjurkan mengikuti alur bab secara berurutan. Diagram mermaid disisipkan sebagai pendukung visual alur data dan interaksi pengguna.

BAB II
PROGRESS PENGEMBANGAN

2.1 Deskripsi Kegiatan
Progress orang tua dilakukan dengan fokus pada pembuatan frontend mobile role orang tua yang sinkron dengan role kader. Pekerjaan dimulai dari dashboard orang tua yang menampilkan informasi ringkas anak dan status kesehatan. Tahap berikutnya adalah membangun fitur jadwal pemeriksaan dengan filter status, diikuti dengan fitur riwayat pemeriksaan yang menampilkan detail hasil pemeriksaan sebelumnya.

Selama pengembangan, dilakukan evaluasi untuk memastikan konsistensi data antara role kader dan orang tua. Ditemukan bahwa sistem date-based filtering adalah kunci kesuksesan, karena aplikasi menggunakan DateTime.now() untuk menentukan status jadwal (mendatang/selesai). Dengan pendekatan ini, data otomatis berubah status berdasarkan tanggal sistem tanpa perlu manual update.

Setelah tampilan inti terbentuk, dilakukan penyesuaian detail riwayat pemeriksaan agar menampilkan informasi lengkap dengan layout yang sesuai dengan design system yang sama dengan role kader. Data dummy diseragamkan agar setiap halaman menunjukkan informasi yang konsisten terkait anak, lokasi, dan hasil pemeriksaan.

2.1.1 Pembuatan Dashboard Orang Tua
Dashboard orang tua dibuat sebagai halaman beranda yang menampilkan informasi ringkas tentang anak. Dashboard mencakup profil anak, status kesehatan terkini, dan akses cepat ke fitur jadwal dan riwayat. Desain dibuat sederhana dan fokus pada informasi yang paling penting bagi orang tua.

2.1.2 Pengembangan Fitur Jadwal Pemeriksaan
Fitur jadwal dibuat untuk menampilkan seluruh jadwal posyandu anak dengan status dinamis. Filter tersedia untuk menampilkan semua jadwal, hanya jadwal mendatang, atau hanya jadwal selesai. Status badge ditampilkan dengan warna untuk membedakan jadwal yang sudah terjadi (Selesai/hijau) dari yang akan datang (Mendatang/biru).

2.1.3 Pengembangan Fitur Riwayat Pemeriksaan
Fitur riwayat dibuat untuk menampilkan daftar pemeriksaan yang sudah terjadi. Sistem secara otomatis hanya menampilkan pemeriksaan dengan tanggal yang sudah lewat dari hari ini. Setiap item riwayat dapat di-tap untuk melihat detail lengkap pemeriksaan.

2.1.4 Pembuatan Detail Riwayat Pemeriksaan
Detail riwayat menampilkan informasi lengkap hasil pemeriksaan, termasuk lokasi, status gizi, pengukuran (berat badan, tinggi badan, lingkar lengan atas), catatan medis, dan layanan yang diberikan. Layout dirancang sesuai dengan design system yang sama dengan role kader untuk konsistensi.

2.1.5 Penyesuaian Data Dummy dan Sinkronisasi
Data dummy untuk orang tua disinkronkan dengan role kader. Setiap anak memiliki jadwal dan riwayat yang konsisten di kedua role. Misalnya, anak Rani yang lahir 10 Januari 2026 akan memiliki jadwal posyandu mulai Februari 2026 di role kader, dan jadwal yang sama akan ditampilkan kepada orang tua.

Sistem generation jadwal menggunakan helper function `_findTuesdayInTeens()` yang mencari hari Selasa di tanggal belasan (10-19) untuk setiap bulan. Dengan cara ini, semua posyandu anak dijadwalkan pada hari yang konsisten (Selasa tanggal belasan).

2.2 Fitur-Fitur yang Dibangun

2.2.1 Dashboard Orang Tua
- Menampilkan salam dan profil anak
- Menampilkan status kesehatan terkini dengan badge warna
- Menampilkan jadwal posyandu berikutnya
- Akses cepat ke jadwal, riwayat, data anak, dan profil
- Navigasi bottom nav bar untuk akses fitur utama

2.2.2 Jadwal Pemeriksaan
- Daftar jadwal posyandu dengan status dinamis
- Filter: Semua (All), Mendatang (Upcoming), Selesai (Done)
- Setiap jadwal menampilkan: tanggal, aktivitas, lokasi, waktu, dan badge status
- Badge Selesai berwarna hijau, Mendatang berwarna biru
- Tap item untuk navigasi ke detail (jika diperlukan)

2.2.3 Riwayat Pemeriksaan
- Daftar pemeriksaan yang sudah selesai (tanggal lewat)
- Setiap item menampilkan: tanggal, lokasi, status gizi (Normal/Berisiko/Stunting)
- Warna status: hijau (Normal), oranye (Berisiko), merah (Stunting)
- Tap item untuk melihat detail lengkap

2.2.4 Detail Riwayat Pemeriksaan
- Header dengan warna solid sesuai tema aplikasi
- Informasi lengkap: lokasi, status gizi, pengukuran (berat, tinggi, lengan)
- Catatan medis dari kader
- Daftar layanan yang diberikan dalam bentuk chip/badge

2.2.5 Data Anak
- Profil anak dengan informasi lengkap (NIK, nama, tanggal lahir, dll)
- Orang tua dapat melihat informasi pribadi anak yang terdaftar
- Akses ke detail lebih lanjut jika diperlukan

2.2.6 Profil Orang Tua
- Informasi pribadi orang tua (nama, nomor telepon, alamat, dll)
- Pengaturan dasar aplikasi
- Opsi logout untuk keluar dari aplikasi

2.3 Alur Data dan Sinkronisasi

Diagram alur data orang tua:

```
┌─────────────────────────────────────────────────────┐
│           Role Kader (Data Source)                   │
├─────────────────────────────────────────────────────┤
│ - Profil anak (NIK, nama, tanggal lahir, orang tua) │
│ - Riwayat pemeriksaan (tanggal, status, pengukuran) │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────▼──────────────┐
        │  Data Synchronization    │
        │  (Konsistensi antara     │
        │   kader dan orang_tua)   │
        └────────────┬──────────────┘
                     │
┌────────────────────▼────────────────────┐
│    Role Orang Tua (Data Consumer)      │
├────────────────────────────────────────┤
│ Dashboard: Status ringkas anak          │
│ Jadwal: Timeline posyandu (filtered)    │
│ Riwayat: Detail pemeriksaan sebelumnya  │
│ Profil: Info pribadi orang tua          │
└────────────────────────────────────────┘
```

2.4 Teknis Implementasi

2.4.1 Dynamic Status Generation
Sistem menggunakan `DateTime.now()` untuk menentukan status dinamis jadwal. Setiap kali halaman dibuka, status dihitung ulang berdasarkan tanggal sistem:
- Jadwal dengan tanggal > hari ini = Status "Mendatang" (badge biru)
- Jadwal dengan tanggal ≤ hari ini = Status "Selesai" (badge hijau)
- Riwayat hanya menampilkan pemeriksaan dengan tanggal ≤ hari ini

2.4.2 Schedule Generation Algorithm
Helper function `_generatePosyanduSchedules()` menggunakan algoritma:
1. Mulai dari bulan pertama posyandu anak
2. Untuk setiap bulan, cari hari Selasa di tanggal 10-19
3. Buat jadwal untuk tanggal tersebut dengan label "Kunjungan ke-X"
4. Lanjutkan hingga Mei 2026
5. Sort cronologi dan tampilkan sesuai filter

2.4.3 Riwayat Auto-Generation
Riwayat pemeriksaan otomatis ditambahkan berdasarkan:
1. Ambil semua jadwal yang sudah lewat (tanggal ≤ hari ini)
2. Untuk setiap jadwal yang sudah lewat, buat record pemeriksaan dengan:
   - Tanggal sama dengan jadwal
   - Data medis (status, berat, tinggi, lengan) sesuai data kader
   - Catatan dan layanan sesuai profil anak
3. Urutkan dari terbaru hingga terlama

2.5 Hasil dan Capaian

2.5.1 Frontend Lengkap Role Orang Tua
Role orang tua telah memiliki frontend lengkap dengan semua fitur utama yang dapat diakses dan berfungsi dengan baik. Navigasi antar halaman berjalan lancar melalui bottom navigation bar.

2.5.2 Data Sinkronisasi Sempurna
Data antara role kader dan orang tua tersinkronisasi dengan sempurna. Anak yang terdaftar di kader akan muncul dengan jadwal dan riwayat yang sama di role orang tua, hanya dengan presentasi yang berbeda (sesuai kebutuhan pengguna).

2.5.3 Status Dinamis Berjalan
Sistem status dinamis berhasil diimplementasikan. Jadwal otomatis berubah status dari "Mendatang" menjadi "Selesai" pada saat tanggal jadwal telah lewat atau sama dengan hari ini.

2.5.4 Warna Status Konsisten
Warna status gizi konsisten di semua halaman: hijau untuk Normal, oranye untuk Berisiko, merah untuk Stunting. Warna yang sama juga digunakan di role kader untuk memastikan konsistensi.

2.5.5 Filter Jadwal Berfungsi
Filter jadwal pada halaman Jadwal berfungsi dengan baik. Pengguna dapat melihat semua jadwal, hanya yang mendatang, atau hanya yang sudah selesai dengan mudah.

2.6 Tantangan dan Solusi

2.6.1 Tantangan: Data Konsistensi
Tantangan awal adalah memastikan data di role kader dan orang tua selalu sinkron. Solusi: Menggunakan data structure yang sama dan logic filtering berbasis DateTime.now(), sehingga data otomatis konsisten.

2.6.2 Tantangan: Status Dinamis
Tantangan: Status jadwal perlu berubah otomatis berdasarkan tanggal, tanpa manual update. Solusi: Menggunakan getter method yang menghitung status real-time saat halaman di-render, bukan hard-coded status.

2.6.3 Tantangan: User Experience untuk Non-Medis
Tantangan: Orang tua mungkin tidak memahami istilah medis. Solusi: Menggunakan bahasa sederhana, ikon visual, dan badge warna sebagai indikator utama.

2.6.4 Tantangan: Penyesuaian Usia Anak
Tantangan terbaru: Anak Rani yang lahir 10 Januari 2026 seharusnya mulai posyandu dari Februari (umur 1 bulan), bukan dari Januari (bayi baru lahir). Solusi: Mengubah start month jadwal dari bulan lahir ke bulan berikutnya, dan menyesuaikan semua riwayat data.

BAB III
DETAIL FITUR ORANG TUA

3.1 Struktur Data Anak
Setiap anak di role orang tua memiliki struktur data sebagai berikut:

```dart
class _ChildProfile {
  final String name;        // Nama anak
  final String nik;         // Nomor Identitas Anak
  final DateTime birthDate;  // Tanggal lahir
  final String parentName;   // Nama orang tua
  final String address;      // Alamat
  final List<_CheckupRecord> checkups; // Riwayat pemeriksaan
}

class _CheckupRecord {
  final String date;        // Tanggal pemeriksaan
  final String location;    // Lokasi posyandu
  final String status;      // Status gizi (Normal/Berisiko/Stunting)
  final String weight;      // Berat badan
  final String height;      // Tinggi badan
  final String arm;         // Lingkar lengan atas
  final String note;        // Catatan medis
  final List<String> services; // Layanan yang diberikan
}
```

3.2 Jadwal Anak Rani (Contoh Implementasi)
Rani lahir 10 Januari 2026, mulai posyandu dari Februari 2026. Jadwal dan riwayatnya adalah:

| No. | Tanggal | Hari | Status |
|-----|---------|------|--------|
| 1 | 10 Februari 2026 | Selasa | Selesai ✓ |
| 2 | 10 Maret 2026 | Selasa | Selesai ✓ |
| 3 | 14 April 2026 | Selasa | Selesai ✓ |
| 4 | 12 Mei 2026 | Selasa | Mendatang (belum tiba) |

Hanya data yang tanggalnya sudah lewat yang ditampilkan di riwayat. Tanggal 12 Mei tidak ditampilkan di riwayat karena belum tiba.

3.3 Jadwal Anak Bayu dan Cantika
Bayu (lahir 05 April 2025, umur 12+ bulan): Memiliki 5 pemeriksaan sebelumnya (April-September 2025).
Cantika (lahir 14 Desember 2024, umur 16+ bulan): Memiliki 5 pemeriksaan sebelumnya (Desember 2024-April 2025).

Semua tanggal pemeriksaan mengikuti pola Selasa tanggal belasan (hari Selasa di rentang tanggal 10-19).

BAB IV
RENCANA SELANJUTNYA

4.1 Perbaikan UI/UX
- Tambahkan animasi transisi antar halaman untuk pengalaman yang lebih smooth
- Optimasi responsive design untuk berbagai ukuran layar
- Tambahkan empty state untuk kondisi ketika data kosong

4.2 Integrasi Backend
- Koneksi dengan API backend untuk data real-time
- Implementasi autentikasi dengan server
- Sinkronisasi data real-time antara mobile dan backend

4.3 Fitur Tambahan
- Notifikasi reminder untuk jadwal posyandu yang akan datang
- Export data pemeriksaan ke format PDF/Excel
- Chat dengan kader untuk konsultasi
- Pencapaian milestone anak (milestone tracker)

4.4 Testing
- Unit testing untuk helper functions
- Widget testing untuk UI components
- Integration testing untuk alur lengkap

BAB V
PENUTUP

5.1 Kesimpulan
Progress orang tua berhasil mengimplementasikan frontend mobile role orang tua dengan fitur lengkap dan konsistensi data yang sempurna. Fitur yang dibangun mencakup dashboard, jadwal, riwayat, data anak, dan profil, semuanya terintegrasi dengan sempurna dan menampilkan data yang sinkron dengan role kader.

Sistem status dinamis berbasis DateTime.now() memastikan jadwal otomatis berubah status tanpa perlu manual update. Warna status gizi konsisten di semua halaman, memudahkan orang tua memahami kondisi kesehatan anak dengan sekali pandang.

5.2 Pencapaian Utama
1. ✅ Frontend role orang tua lengkap dengan 6 halaman utama
2. ✅ Status dinamis berdasarkan tanggal sistem
3. ✅ Data sinkron sempurna antara kader dan orang tua
4. ✅ Filter jadwal berfungsi dengan baik
5. ✅ Warna status konsisten di semua halaman
6. ✅ Desain user-friendly untuk non-medis
7. ✅ Riwayat otomatis menampilkan hanya data yang sudah lewat

5.3 Saran untuk Tahap Selanjutnya
1. Fokus pada integrasi backend untuk data real-time
2. Implementasi sistem notifikasi push untuk reminder
3. Tambahkan fitur komunikasi langsung antara orang tua dan kader
4. Testing ekstensif dengan user orang tua sesungguhnya
5. Dokumentasi user guide untuk memandu orang tua menggunakan aplikasi

5.4 Penutup
Dengan selesainya development role orang tua, aplikasi POSCO kini memiliki dua role lengkap (kader dan orang tua) yang dapat melayani kebutuhan berbeda dengan presentasi data yang sesuai untuk masing-masing user. Frontend mobile sudah siap untuk tahap integrasi backend dan pengujian dengan pengguna nyata.

---

**Dokumen ini disiapkan sebagai laporan progress development fitur orang tua aplikasi POSCO mobile. Catatan teknis dan implementasi dapat dilihat di repository GitHub atau langsung di source code aplikasi.**

**Last Updated: 6 Mei 2026**
