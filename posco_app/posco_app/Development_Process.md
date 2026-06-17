# DEVELOPMENT PROCESS

Dokumen ini berisi langkah kerja lengkap pembuatan frontend Flutter untuk aplikasi Posco, mulai dari membuat proyek hingga halaman Statistik Gizi. Contoh kode di bawah fokus pada UI dan data dummy agar aplikasi dapat demo end-to-end.

## 1. Persiapan Proyek
1) Install Flutter SDK dan pastikan `flutter doctor` tanpa error kritis.
2) Buat proyek baru:
    - `flutter create posco_app`
3) Masuk ke folder proyek:
    - `cd posco_app`
4) Ambil dependency awal:
    - `flutter pub get`

## 2. Struktur Folder
Gunakan struktur fitur agar rapi dan scalable:
```
lib/
   main.dart
   features/
      auth/
         splash_screen.dart
         login_screen.dart
         register_screen.dart
      kader/
         kader_dashboard_screen.dart
         child_data_screen.dart
         child_detail_screen.dart
         checkup_detail_screen.dart
         agenda_screen.dart
         add_agenda_screen.dart
         input_checkup_screen.dart
         input_checkup_form_screen.dart
         profile_screen.dart
         edit_profile_screen.dart
         nutrition_stats_screen.dart
         notification_screen.dart
      shared/
         status_color.dart
```

## 3. Setup Dasar Aplikasi
Edit `lib/main.dart` untuk theme, font, dan halaman awal:
```dart
import 'package:flutter/material.dart';
import 'features/auth/splash_screen.dart';

void main() {
   runApp(const PoscoApp());
}

class PoscoApp extends StatelessWidget {
   const PoscoApp({super.key});

   @override
   Widget build(BuildContext context) {
      const primaryColor = Color(0xFF4DBFA3);
      return MaterialApp(
         debugShowCheckedModeBanner: false,
         theme: ThemeData(
            primaryColor: primaryColor,
            scaffoldBackgroundColor: const Color(0xFFF6F8F6),
            fontFamily: 'Poppins',
         ),
         home: const SplashScreen(),
      );
   }
}
```

## 4. Helper Warna Status Gizi
Buat file `lib/features/shared/status_color.dart`:
```dart
import 'package:flutter/material.dart';

Color statusColor(String value) {
   switch (value.toLowerCase()) {
      case 'berisiko':
         return const Color(0xFFF59E0B);
      case 'stunting':
         return const Color(0xFFEF4444);
      default:
         return const Color(0xFF16A34A);
   }
}
```

## 5. Splashscreen
Buat `lib/features/auth/splash_screen.dart`:
```dart
import 'package:flutter/material.dart';
import 'login_screen.dart';

class SplashScreen extends StatelessWidget {
   const SplashScreen({super.key});

   @override
   Widget build(BuildContext context) {
      Future.delayed(const Duration(seconds: 2), () {
         Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const LoginScreen()),
         );
      });

      return const Scaffold(
         body: Center(
            child: Column(
               mainAxisSize: MainAxisSize.min,
               children: [
                  Icon(Icons.health_and_safety, size: 64, color: Color(0xFF4DBFA3)),
                  SizedBox(height: 12),
                  Text('POSCO', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
               ],
            ),
         ),
      );
   }
}
```

## 6. Login
Buat `lib/features/auth/login_screen.dart`:
```dart
import 'package:flutter/material.dart';
import '../kader/kader_dashboard_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatelessWidget {
   const LoginScreen({super.key});

   @override
   Widget build(BuildContext context) {
      const primaryColor = Color(0xFF4DBFA3);
      return Scaffold(
         body: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
               mainAxisAlignment: MainAxisAlignment.center,
               children: [
                  const Text('Login', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 16),
                  TextField(decoration: const InputDecoration(labelText: 'Email')),
                  const SizedBox(height: 12),
                  TextField(obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
                  const SizedBox(height: 20),
                  SizedBox(
                     width: double.infinity,
                     height: 48,
                     child: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
                        onPressed: () {
                           Navigator.of(context).pushReplacement(
                              MaterialPageRoute(builder: (_) => const KaderDashboardScreen()),
                           );
                        },
                        child: const Text('Masuk'),
                     ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                     onPressed: () {
                        Navigator.of(context).push(
                           MaterialPageRoute(builder: (_) => const RegisterScreen()),
                        );
                     },
                     child: const Text('Belum punya akun? Daftar'),
                  )
               ],
            ),
         ),
      );
   }
}
```

## 7. Register
Buat `lib/features/auth/register_screen.dart`:
```dart
import 'package:flutter/material.dart';

class RegisterScreen extends StatelessWidget {
   const RegisterScreen({super.key});

   @override
   Widget build(BuildContext context) {
      return Scaffold(
         appBar: AppBar(title: const Text('Register')),
         body: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
               children: [
                  TextField(decoration: const InputDecoration(labelText: 'Nama Lengkap')),
                  const SizedBox(height: 12),
                  TextField(decoration: const InputDecoration(labelText: 'Email')),
                  const SizedBox(height: 12),
                  TextField(obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                     decoration: const InputDecoration(labelText: 'Role'),
                     items: const [
                        DropdownMenuItem(value: 'kader', child: Text('Kader')),
                        DropdownMenuItem(value: 'orang_tua', child: Text('Orang Tua')),
                     ],
                     onChanged: (_) {},
                  ),
               ],
            ),
         ),
      );
   }
}
```

## 8. Dashboard Kader
`lib/features/kader/kader_dashboard_screen.dart` berisi ringkasan kader, agenda terdekat, dan aktivitas terakhir. Pastikan ada bottom navigation ke Data Anak, Agenda, Input, Profil.

## 9. Data Anak
Tampilkan daftar anak dummy dan status gizi:
```dart
final children = [
   {'name': 'Rani', 'status': 'Normal'},
   {'name': 'Bayu', 'status': 'Berisiko'},
   {'name': 'Cantika', 'status': 'Stunting'},
];
```
Gunakan `statusColor(status)` dari helper.

## 10. Detail Anak
Detail anak menampilkan identitas, status gizi, dan riwayat pemeriksaan. Riwayat ini akan mengarah ke detail pemeriksaan.

## 11. Detail Pemeriksaan
Detail pemeriksaan menampilkan lokasi posyandu, status gizi, metrik (BB/TB/LILA), catatan kader, dan layanan tambahan.

## 12. Agenda
Agenda menampilkan agenda bulan berjalan dan mendatang serta filter kategori.

## 13. Tambah Agenda
Form input terdiri dari nama kegiatan, lokasi, tanggal, waktu, jumlah peserta, dan keterangan.

## 14. Input Pemeriksaan
Tampilkan daftar anak, lalu arahkan ke form input pemeriksaan saat dipilih.

## 15. Form Input Pemeriksaan
Form berisi BB, TB, LILA, lingkar kepala, catatan, dan chip layanan tambahan.

## 16. Profil Kader
Profil menampilkan data kader, tombol Edit Profil, Statistik Gizi, serta Logout.

## 17. Edit Profil
Tampilkan field email dan password dengan dummy, plus tombol simpan.

## 18. Statistik Gizi
Hitung jumlah anak per status dan tampilkan bar statistik:
```dart
final statusList = ['Normal', 'Berisiko', 'Stunting'];
final normalCount = statusList.where((s) => s == 'Normal').length;
```

## 19. Notifikasi
Tampilkan kartu notifikasi untuk agenda, input timbang, dan pengingat profil.

## 20. Konsistensi Visual
1) Warna status gizi:
    - Normal: hijau
    - Berisiko: oranye
    - Stunting: merah
2) Latar putih untuk halaman form agar kartu hijau muda terlihat.

## 21. Pengujian
1) Jalankan aplikasi: `flutter run`.
2) Gunakan hot reload untuk validasi UI.
3) Pastikan navigasi antar halaman berjalan sesuai alur.

## 22. Dokumentasi
1) Ambil screenshot tiap halaman utama.
2) Simpan laporan progress dalam file MD.

Catatan: Dokumen ini fokus pada frontend. Integrasi backend dan autentikasi asli akan dilakukan pada progress berikutnya.
