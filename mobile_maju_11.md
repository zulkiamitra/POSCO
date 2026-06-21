# 📱 Laporan Kemajuan Aplikasi Mobile POSCO: Integrasi Backend & State Management (mobile_maju_11.md)

Dokumen ini menjelaskan perkembangan terbaru pada aplikasi mobile POSCO (Flutter) yang menandai transisi besar dari penggunaan **Data Dummy Lokal** ke **Integrasi REST API Backend Nyata** secara penuh, aman, dan asinkron.

---

## 🛠️ Ringkasan Arsitektur Baru Sisi Mobile

Untuk mendukung integrasi backend yang handal, arsitektur frontend mobile Flutter diperbarui dengan modul-modul berikut:

*   **HTTP Client**: Menggunakan package `http` untuk melakukan pemanggilan endpoint REST API Express.js.
*   **Persistent Session**: Menggunakan `shared_preferences` untuk menyimpan JWT token dan informasi dasar profil secara lokal (persistent login).
*   **State Management**: Menerapkan pattern Repository berbasis `ChangeNotifier` untuk mengelola sinkronisasi reaktif data kesehatan ke UI.

---

## 🚀 Detail Fitur-Fitur Terbaru & Perubahan Mobile

### 1. 🔑 Integrasi Autentikasi Riil (JWT & Session Management)
*   **Berkas Terkait**: [api_client.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/shared/api_client.dart)
*   **Detail**:
    *   **Login Akun**: Menghubungkan form login ke backend `/auth/login`. Jika sukses, token JWT disimpan ke `SharedPreferences` dan digunakan pada header request berikutnya (`Authorization: Bearer <token>`).
    *   **Registrasi Akun**: Menghubungkan form registrasi ke `/auth/register` dengan pemetaan string role yang dinamis (misal, mereduksi "Orang Tua" menjadi "orangtua" untuk backend).
    *   **Manajemen Sesi**: Saat aplikasi dimulai (`init`), sistem memeriksa ketersediaan token di penyimpanan lokal agar pengguna tidak perlu login berulang kali.

### 2. 🔄 Sinkronisasi Data Otomatis & Reaktif (State Repository)
*   **Berkas Terkait**: [nutrition_stats_repository.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/shared/nutrition_stats_repository.dart)
*   **Detail**:
    *   Mengimplementasikan `NutritionStatsRepository` sebagai singleton untuk melacak data anak (`_children`) dan status sinkronisasi (`_isSyncing`).
    *   **Normalisasi Data (`_normalizeCheckupHistory`)**: Melakukan konversi format tanggal pemeriksaan bahasa Indonesia/format lokal serta merapikan parsing variabel desimal (berat badan, tinggi badan, lingkar kepala, lingkar lengan) dari tipe JSON agar tidak menyebabkan crash tipe data di Dart.
    *   Fungsi `syncFromApi()` otomatis mengunduh daftar anak terdaftar. Untuk role Orang Tua, request secara otomatis memfilter parameter `orangtuaId` ke API backend.

### 3. ➕ Alur Operasional Pemeriksaan Balita (Kader)
*   **Berkas Terkait**: [agenda_screen.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/features/kader/agenda_screen.dart) & [nutrition_stats_repository.dart](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/lib/shared/nutrition_stats_repository.dart)
*   **Detail**:
    *   Kader posyandu dapat menambahkan data rekam medis pemeriksaan balita (Berat Badan, Tinggi Badan, Lingkar Lengan, Lingkar Kepala, status gizi, dan layanan tambahan).
    *   Melalui method `upsertChild`, data pemeriksaan baru di-append ke array `riwayatPemeriksaan` dan dikirim secara real-time ke API backend via `PUT /children/$id`.
    *   Setiap kali penyimpanan berhasil, repositori otomatis memicu `notifyListeners()` sehingga tampilan dashboard dan list anak langsung ter-update secara reaktif.

### 4. 👩‍👩‍👦 Dashboard & Monitoring Pertumbuhan Anak (Orang Tua)
*   **Detail**:
    *   Orang tua dapat melihat status gizi anak secara visual (Normal: Hijau, Berisiko: Oranye, Stunting: Merah) yang tersinkron langsung dengan input terakhir dari kader.
    *   Riwayat pemeriksaan sebelumnya ditampilkan dalam bentuk list kronologis, hanya memuat penimbangan yang tanggalnya telah terlampaui (dibandingkan dengan `DateTime.now()`).
    *   Jadwal kunjungan imunisasi/posyandu ditampilkan menggunakan status dinamis ("Mendatang" jika tanggal > hari ini, dan "Selesai" jika tanggal <= hari ini).

### 5. ⚙️ Halaman Profil Interaktif (Kedua Peran)
*   **Detail**:
    *   Kedua role (Kader & Orang Tua) memiliki menu profil untuk mengelola data akun pribadinya.
    *   **Edit Profil Mandiri**: Form pengeditan data terhubung dengan REST API `PUT /users/$id` melalui method `updateProfile`.
    *   **Ganti Foto Profil**: Terintegrasi dengan Image Picker lokal untuk mengganti foto profil baik melalui kamera langsung maupun mengambil dari galeri ponsel.
    *   **Pusat Bantuan (Orang Tua)**: Halaman FAQ (Frequently Asked Questions) interaktif untuk mengedukasi orang tua tentang cara membaca indikator tumbuh kembang balita.

---

## 📂 Struktur Berkas Mobile yang Dikembangkan

```
posco_app/posco_app/
├── lib/
│   ├── main.dart                       # Entry point aplikasi Flutter
│   ├── shared/
│   │   ├── config.dart                 # Konfigurasi base URL server
│   │   ├── api_client.dart             # Driver API Client asinkron (login, logout, CRUD)
│   │   └── nutrition_stats_repository.dart # State Management repositori data gizi anak
│   ├── features/
│   │   ├── shared/
│   │   │   └── splash_screen.dart       # Layar splash screen awal
│   │   ├── kader/                      # Modul operasional Kader Posyandu
│   │   │   ├── agenda_screen.dart      # Agenda kegiatan & input pemeriksaan
│   │   │   ├── edit_profile_screen.dart
│   │   │   └── checkup_detail_screen.dart
│   │   └── orang_tua/                  # Modul pemantauan Orang Tua
│   │       ├── orang_tua_dashboard_screen.dart
│   │       ├── child_data_screen.dart   # Visualisasi tumbuh kembang
│   │       ├── riwayat_screen.dart      # Daftar riwayat pemeriksaan
│   │       ├── help_center_screen.dart  # Pusat bantuan & FAQ
│   │       └── edit_profile_screen.dart # Form profil keluarga
```
