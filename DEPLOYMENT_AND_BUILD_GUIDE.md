# Panduan Lengkap Deployment Backend/Web & Build APK Flutter
Dokumen ini merangkum seluruh langkah konfigurasi, deployment, serta pemecahan masalah (troubleshooting) yang dilakukan hingga seluruh sistem (Backend, Web Frontend, dan Aplikasi Mobile) berhasil berjalan lancar.

---

## 📂 Daftar Isi
1. [Bagian 1: Deployment Backend (Express.js + Prisma + Supabase + Vercel)](#1-deployment-backend-expressjs--prisma--supabase--vercel)
2. [Bagian 2: Deployment Frontend Web (React + Vite + Vercel)](#2-deployment-frontend-web-react--vite--vercel)
3. [Bagian 3: Build & Troubleshooting Aplikasi Mobile (Flutter APK)](#3-build--troubleshooting-aplikasi-mobile-flutter-apk)
4. [Ringkasan Perintah Penting](#4-ringkasan-perintah-penting)

---

## 1. Deployment Backend (Express.js + Prisma + Supabase + Vercel)

Backend menggunakan **Express.js (TypeScript)**, dengan **Prisma ORM** yang terhubung ke database **Supabase (PostgreSQL)**, didaftarkan sebagai serverless function di **Vercel**.

### A. Konfigurasi Serverless di Vercel
Agar aplikasi Express dapat berjalan sebagai fungsi serverless di Vercel, struktur file berikut dikonfigurasi:
1. **Entry Point Serverless (`backend/api/index.ts`)**:
   Dibuat file entry point baru sebagai pembungkus aplikasi Express utama untuk Vercel:
   ```typescript
   import app from '../src/app';
   export default app;
   ```
2. **Konfigurasi Vercel (`backend/vercel.json`)**:
   Menghubungkan seluruh request ke file entry point `api/index.ts`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "api/index.ts"
       }
     ]
   }
   ```

### B. Konfigurasi Environment Variables di Vercel (PENTING)
Ketika memindahkan environment variables dari file `.env` ke dashboard Vercel, ada 2 kendala kritis yang berhasil diselesaikan:
* **Tanda Petik Dua (`"`)**: Pastikan nilai `DATABASE_URL` dan `DIRECT_URL` **tidak** dibungkus dengan tanda petik dua di dashboard Vercel. Penggunaan tanda petik menyebabkan Prisma gagal mem-parsing string koneksi (Error: *Prisma connection URL parsing fail*).
* **Connection Pooling Exhaustion (Error 504 Gateway Timeout)**: Supabase memiliki batas koneksi bersamaan yang kecil pada model serverless. Untuk mengatasinya, tambahkan query string parameter `&connection_limit=1` pada ujung nilai `DATABASE_URL` (URL Connection Pooler Supabase port 6543) di Vercel.
  * *Contoh*: `postgres://postgres.xxx:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

### C. Penanganan CORS (Cross-Origin Resource Sharing)
Untuk mengizinkan aplikasi frontend web Vercel mengakses backend, file `backend/src/app.ts` diperbarui agar menerima semua origin domain Vercel secara fleksibel:
```typescript
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    // Mengizinkan localhost dan semua domain yang berakhiran .vercel.app
    if (origin.indexOf('localhost') !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'), false);
  },
  credentials: true
}));
```

---

## 2. Deployment Frontend Web (React + Vite + Vercel)

Frontend web berbasis React & Vite dideploy langsung ke Vercel dengan konfigurasi routing SPA (Single Page Application).

### A. Konfigurasi Routing Rewrites (`web/vercel.json`)
Vite + React Router menggunakan routing sisi klien (client-side routing). Tanpa konfigurasi routing rewrite, menekan tombol *Refresh* saat berada di halaman selain homepage (`/`) akan memicu error **404 Not Found** dari Vercel. 

Untuk mengatasinya, dibuat file `web/vercel.json` dengan konten berikut:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Build & Troubleshooting Aplikasi Mobile (Flutter APK)

Pembangunan (build) aplikasi Flutter untuk rilis Android dilakukan secara lokal di komputer Windows, dengan pemecahan masalah lingkungan build sebagai berikut:

### A. Penambahan Izin Akses Internet (`AndroidManifest.xml`)
Pada mode debug, Flutter otomatis menyisipkan izin internet. Namun, pada build **Release** (produksi), Android memblokirnya jika tidak ditulis eksplisit. Tanpa izin ini, aplikasi akan mengalami error `SocketException: Failed host lookup: 'posco-backend.vercel.app' (errno = 7)` saat mencoba login.

* **Solusi**: File [AndroidManifest.xml](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/android/app/src/main/AndroidManifest.xml) diubah untuk menambahkan baris berikut di bawah tag `<manifest>` utama:
  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```

### B. Pembenahan Struktur Android SDK & NDK yang Terbalik
Sebelumnya, sistem pelacak SDK tidak menemukan Android SDK karena file-file SDK (`build-tools`, `platforms`, dll.) tidak sengaja terpindahkan ke dalam folder NDK (`Sdk\ndk\27.0.12077973`).
* **Solusi**: Folder-folder tersebut dikembalikan ke lokasi default-nya secara terstruktur:
  - Direktori SDK utama: `C:\Users\MitraZulkia\AppData\Local\Android\Sdk\` (berisi `build-tools`, `platforms`, `platform-tools`, dll.)
  - Direktori NDK versi: `C:\Users\MitraZulkia\AppData\Local\Android\Sdk\ndk\27.0.12077973\` (berisi langsung file-file NDK seperti `ndk-build.cmd` dan `source.properties`).

### C. Pemecahan Masalah Versi Build Tools (Subproyek/Plugin)
Komputer lokal hanya memiliki Android Build Tools versi `36.1.0`, sedangkan konfigurasi bawaan proyek meminta versi `35.0.0`. Penyetelan versi hanya di `:app:build.gradle.kts` tidak cukup karena plugin (seperti `image_picker_android`) tetap mencari versi `35.0.0`.
* **Solusi**: Diperbarui file [build.gradle.kts](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/android/build.gradle.kts) pada root folder `android` untuk memaksa seluruh subproyek menggunakan versi yang terinstal secara dinamis saat evaluasi plugin:
  ```kotlin
  subprojects {
      plugins.withId("com.android.application") {
          val android = extensions.findByName("android") as? com.android.build.gradle.BaseExtension
          android?.buildToolsVersion = "36.1.0"
      }
      plugins.withId("com.android.library") {
          val android = extensions.findByName("android") as? com.android.build.gradle.BaseExtension
          android?.buildToolsVersion = "36.1.0"
      }
  }
  ```

### D. Pemecahan Masalah Platform SDK Versi Minor (`android-36.1`)
Android SDK Manager mengunduh Platform Android 16 dengan nama folder minor `android-36.1`, sedangkan Gradle secara baku mencari folder `android-36`.
* **Solusi**:
  1. Folder `platforms/android-36.1` diubah namanya (rename) menjadi `android-36`.
  2. File `platforms/android-36/source.properties` diperbarui dengan mengganti baris `AndroidVersion.ApiLevel=36.1` menjadi `AndroidVersion.ApiLevel=36`.
  3. File `platforms/android-36/package.xml` diperbarui dengan mengganti seluruh teks `36.1` (pada path dan api-level) menjadi `36` agar dikenali dengan benar oleh pencari Platform SDK Gradle.

### E. Penanganan CMake dan Error "It is too late to set version"
Secara default, Gradle mencari CMake versi `3.22.1`. Namun, komputer lokal memiliki CMake versi `4.1.2`. Percobaan menyetel versi CMake secara terprogram di Gradle memicu error *"It is too late to set version"*.
* **Solusi**: Lokasi CMake versi `4.1.2` dideklarasikan secara langsung via file [local.properties](file:///c:/Kuliah/Semester%206/Proyek%20Integrasi%20Sistem/posco%20webv2/projek-posco/posco_app/posco_app/android/local.properties). File ini dibaca pertama kali oleh Gradle saat inisialisasi:
  ```properties
  cmake.dir=C:\\Users\\MitraZulkia\\AppData\\Local\\Android\\Sdk\\cmake\\4.1.2
  ```

### F. Cara Instalasi APK di Android (Bypass Play Protect)
Ketika memasang file APK rilis hasil build secara manual, Google Play Protect akan memunculkan peringatan *"Aplikasi diblokir... developer tidak dikenal"*.
* **Solusi**: Klik tulisan **"Detail selengkapnya"** pada kotak dialog tersebut, lalu pilih tombol **"Tetap instal"** (*Install anyway*).

---

## 4. Ringkasan Perintah Penting

Jalankan perintah-perintah ini di dalam folder `posco_app/posco_app/` lewat PowerShell:

* **Merapikan Dependensi**:
  ```powershell
  flutter pub get
  ```
* **Membuat Build APK Rilis**:
  ```powershell
  flutter build apk --release
  ```
* **Melihat Informasi/Status Deteksi SDK**:
  ```powershell
  flutter doctor -v
  ```
