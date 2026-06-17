# LAPORAN PROGRESS APLIKASI WEB POSCO

## BAB I
## PENDAHULUAN

### 1.1 Latar Belakang
Pengembangan aplikasi Posco pada sisi web bertujuan menyediakan antarmuka yang jelas, konsisten, dan mudah digunakan untuk berbagai pengguna: admin, kader posyandu, dan orang tua. Kebutuhan ini muncul karena pengguna memiliki peran berbeda yang memerlukan fitur spesifik—admin membutuhkan dashboard manajemen, kader memerlukan tools pencatatan dan monitoring data anak, sedangkan orang tua membutuhkan akses informasi kesehatan anak mereka. Jika tampilan tidak jelas atau navigasi membingungkan, alur kerja menjadi kurang efisien dan adopsi pengguna akan menurun.

Oleh karena itu, fokus pengembangan frontend web diarahkan pada keterbacaan informasi, konsistensi desain antar role, kejelasan komponen UI, serta pengalaman navigasi yang intuitif. Aplikasi web dibangun menggunakan React dengan Vite sebagai build tool untuk memastikan performa optimal dan development experience yang baik.

Progress ini berfokus pada pembuatan struktur frontend web yang lengkap, dimulai dari sistem autentikasi berbasis role, dashboard untuk setiap role pengguna, hingga fitur-fitur inti seperti monitoring anak, pengelolaan data, dan pelaporan status gizi. Data dummy digunakan untuk mensimulasikan kondisi lapangan, memungkinkan evaluasi visual dan fungsional sebelum integrasi backend nyata tersedia.

#### 1.1.1 Konteks Operasional Multi-Role
Aplikasi Posco melayani tiga peran utama: admin mengelola sistem dan data pengguna, kader mencatat dan memantau data anak di lapangan, dan orang tua mengakses informasi kesehatan anak. Setiap role memiliki dashboard dan fitur yang disesuaikan dengan kebutuhan mereka. Desain antarmuka harus menonjolkan informasi inti untuk setiap role sambil mempertahankan konsistensi visual.

#### 1.1.2 Permasalahan yang Diatasi
Pada tahap awal, terdapat beberapa tantangan utama: pertama, belum adanya struktur navigasi yang jelas untuk sistem multi-role; kedua, kebutuhan konsistensi desain antar halaman agar pengalaman pengguna tetap smooth; ketiga, integrasi Auth Context agar user dapat berpindah role dengan lancar. Progress ini mengatasi tantangan tersebut dengan membangun struktur komponen yang reusable, sistem routing berbasis role, dan AuthContext yang mendukung multiple roles.

#### 1.1.3 Arah Pengembangan Web
Arah pengembangan web pada progress ini menekankan responsiveness, aksesibilitas, konsistensi desain, dan kemudahan navigasi. Dengan demikian, aplikasi dapat diakses dari berbagai perangkat dan siap untuk evaluasi pengguna internal maupun integrasi dengan backend.

### 1.2 Tujuan Progress
Tujuan utama progress ini adalah membangun struktur frontend web lengkap dengan sistem routing berbasis role dan dashboard untuk setiap pengguna. Tujuan tersebut dijabarkan menjadi beberapa poin:

1) Mengimplementasikan sistem autentikasi dengan AuthContext yang mendukung multiple roles (admin, kader, orang tua).
2) Membuat halaman login dan register sebagai pintu masuk aplikasi.
3) Membangun dashboard khusus untuk setiap role dengan navigasi yang intuitif.
4) Mengembangkan fitur monitoring anak, pengelolaan data, dan pelaporan status gizi.
5) Menyiapkan data dummy yang konsisten untuk semua halaman.
6) Memastikan konsistensi desain dan warna status gizi di seluruh aplikasi.
7) Mengoptimalkan performa dengan build tool Vite dan struktur komponen yang efisien.

#### 1.2.1 Target Output
Target output progress ini adalah aplikasi web yang siap diuji end-to-end untuk ketiga role (admin, kader, orang tua), dengan alur lengkap dari login hingga fitur utama. Output ini diharapkan cukup representatif untuk demo internal dan evaluasi UX/UI.

#### 1.2.2 Indikator Keberhasilan
Indikator keberhasilan progress meliputi:

1) Alur login, register, dan sistem AuthContext berfungsi dengan baik.
2) Dashboard tersedia untuk setiap role dan menampilkan informasi yang relevan.
3) Navigasi antar halaman berjalan lancar tanpa error.
4) Status gizi memiliki warna konsisten di semua layar (hijau untuk Normal, oranye untuk Berisiko, merah untuk Stunting).
5) Data dummy konsisten pada daftar anak, detail anak, dan riwayat pemeriksaan.
6) Komponen UI responsif dan terlihat jelas di berbagai ukuran layar.
7) Hot reload development berjalan optimal untuk iterasi cepat.

### 1.3 Ruang Lingkup
Ruang lingkup progress ini mencakup seluruh frontend web aplikasi Posco dengan fokus pada struktur dan komponen. Pekerjaan meliputi:

1) Sistem autentikasi dan AuthContext untuk multi-role.
2) Layout aplikasi dengan navigasi berbasis role.
3) Halaman login dan register.
4) Dashboard admin, kader, dan orang tua.
5) Fitur monitoring anak dan detail anak.
6) Manajemen data, agenda, dan status gizi.
7) Komponen reusable untuk konsistensi desain.
8) Sistem routing dengan ProtectedRoute untuk kontrol akses.
9) Data dummy untuk simulasi lapangan.

Progress ini belum mencakup backend API, database nyata, sinkronisasi real-time, maupun deployment production. Semua informasi masih berbasis dummy agar frontend dapat dievaluasi secara visual dan fungsional.

#### 1.3.1 Batasan Teknis
Karena fokus berada pada frontend, aspek seperti manajemen state global yang kompleks, real-time sync, dan optimasi performa tingkat lanjut belum menjadi prioritas utama. Pendekatan ini dipilih agar struktur dan UX matang terlebih dahulu sebelum integrasi backend.

#### 1.3.2 Asumsi Dasar
Diasumsikan bahwa: (1) admin membutuhkan dashboard administratif dengan kontrol penuh; (2) kader memerlukan tools yang cepat dan mudah untuk pencatatan; (3) orang tua ingin informasi mudah diakses terkait anak mereka. Asumsi ini mempengaruhi penempatan menu, prioritas fitur, dan desain setiap role.

### 1.4 Manfaat Kegiatan
Manfaat progress ini mencakup sisi pengguna, tim pengembang, dan kebutuhan dokumentasi.

Untuk pengguna:
1) Interface yang jelas mempermudah setiap role menggunakan aplikasi sesuai kebutuhan mereka.
2) Navigasi intuitif menghemat waktu training pengguna.
3) Status gizi dengan indikator warna visual membantu kader membuat keputusan cepat.

Untuk pengembang:
1) Struktur komponen reusable mempercepat development fitur berikutnya.
2) AuthContext yang terstruktur memudahkan manajemen state autentikasi.
3) Data dummy konsisten memfasilitasi pengujian dan debugging.

Untuk organisasi:
1) Aplikasi siap untuk demo ke stakeholder.
2) Basis teknis yang solid untuk integrasi backend.
3) Dokumentasi lengkap mendukung laporan progress.

#### 1.4.1 Manfaat Teknis
Progress ini menghasilkan struktur aplikasi yang scalable dan maintainable. Komponen yang terpisah dengan baik memudahkan penambahan fitur baru. Sistem routing berbasis role menjadi fondasi untuk ekspansi role di masa depan.

#### 1.4.2 Manfaat Organisasi
Hasil progress memberikan bukti kerja yang terukur dan mudah diverifikasi. Demo aplikasi dapat langsung ditampilkan kepada tim dan stakeholder.

### 1.5 Sistematika Laporan
Laporan ini disusun dengan struktur: Bab I Pendahuluan, Bab II Progress Pengembangan, Bab III Rencana Selanjutnya, Bab IV Penutup, dan Lampiran.

#### 1.5.1 Gaya Penulisan
Laporan ditulis secara naratif-deskriptif dengan subbab rinci untuk menjelaskan proses pengembangan frontend web secara menyeluruh.

#### 1.5.2 Petunjuk Pembacaan
Pembaca dianjurkan mengikuti alur bab secara berurutan. Diagram mermaid disisipkan sebagai pendukung visual proses, struktur komponen, dan alur navigasi.

---

## BAB II
## PROGRESS PENGEMBANGAN

### 2.1 Deskripsi Kegiatan
Progress dilakukan dengan fokus pada pembangunan struktur frontend web dari awal hingga seluruh fitur untuk ketiga role dapat diakses. Pekerjaan dimulai dari setup proyek React dengan Vite, pembuatan struktur folder yang terorganisir, dan konfigurasi build tool.

Tahap awal mencakup pembuatan AuthContext untuk mengelola autentikasi dan state pengguna lintas role. Setelah itu, halaman login dan register dibangun sebagai pintu masuk aplikasi. Tahap berikutnya adalah mengimplementasikan sistem routing dengan ProtectedRoute untuk membatasi akses berdasarkan role pengguna.

Fitur inti dibangun secara progresif: dashboard untuk setiap role, halaman monitoring anak dengan fitur pencarian dan filter, detail anak dengan riwayat pemeriksaan, manajemen data, dan pelaporan status gizi. Selama pengembangan, dilakukan iterasi untuk memastikan konsistensi desain, responsiveness, dan pengalaman pengguna yang smooth.

Data dummy diseragamkan untuk mensimulasikan kondisi lapangan yang realistis. Konsistensi status gizi diterapkan di semua halaman agar pengguna dapat dengan cepat memahami kategori kesehatan anak.

#### 2.1.1 Setup Proyek dan Struktur Folder
Proyek diinisialisasi dengan create-vite menggunakan React preset. Struktur folder diorganisir sebagai berikut:
- `src/pages/` untuk halaman utama setiap role.
- `src/components/` untuk komponen reusable.
- `src/context/` untuk AuthContext dan state management.
- `src/data/` untuk data dummy.
- `src/styles/` untuk CSS global dan utility.
- `src/assets/` untuk aset grafis.

Struktur ini memastikan kode tetap terorganisir dan mudah di-maintain.

#### 2.1.2 Implementasi AuthContext
AuthContext dibuat untuk mengelola state autentikasi dan role pengguna. Context ini menyediakan fungsi login, logout, dan register, serta menyimpan informasi pengguna yang login. Dengan AuthContext, setiap komponen dapat mengakses status autentikasi tanpa prop drilling yang berlebihan.

#### 2.1.3 Pembuatan Halaman Login dan Register
Halaman login dan register dibangun dengan form validation dasar dan styling konsisten dengan tema aplikasi. Meskipun autentikasi masih berbasis dummy, halaman ini menunjukkan alur awal yang utuh dan memberikan pengalaman pengguna yang realistis.

#### 2.1.4 Sistem Routing dan ProtectedRoute
Sistem routing diimplementasikan menggunakan React Router. ProtectedRoute component dibuat untuk membatasi akses halaman berdasarkan role pengguna. Pengguna yang belum login akan diarahkan ke halaman login, sementara pengguna dengan role yang tidak sesuai akan diarahkan ke dashboard mereka.

#### 2.1.5 Pengembangan Dashboard Multi-Role
Dashboard untuk admin, kader, dan orang tua dibangun dengan fitur yang sesuai untuk setiap role:
- **Dashboard Admin**: menampilkan statistik pengguna, data anak keseluruhan, dan tools manajemen.
- **Dashboard Kader**: menampilkan daftar anak yang dipantau, agenda pemeriksaan, dan akses cepat ke fitur pencatatan.
- **Dashboard Orang Tua**: menampilkan informasi anak, status gizi terkini, dan riwayat pemeriksaan.

#### 2.1.6 Fitur Monitoring Anak dan Detail Anak
Halaman monitoring anak menampilkan daftar anak dengan filter dan pencarian. Detail anak menampilkan informasi lengkap termasuk antropometri, riwayat pemeriksaan, status gizi, dan catatan. Riwayat pemeriksaan ditampilkan dalam format timeline untuk kemudahan tracking perkembangan.

#### 2.1.7 Manajemen Data dan Status Gizi
Fitur manajemen data mencakup form input data anak baru, form pencatatan pemeriksaan, dan form update profil. Setiap form dilengkapi validasi input dasar. Status gizi ditampilkan dengan indikator warna: hijau (Normal), oranye (Berisiko), merah (Stunting).

#### 2.1.8 Konsistensi Data Dummy dan Styling
Data dummy diseragamkan di seluruh aplikasi, mencakup daftar anak (Rani, Bayu, Cantika) dengan status gizi berbeda, lokasi pemeriksaan, jadwal agenda, dan riwayat pemeriksaan. Styling dilakukan secara konsisten menggunakan CSS modules dan utility classes untuk memastikan tampilan yang harmonis.

### 2.2 Hasil Kegiatan
Hasil utama progress adalah terbentuknya struktur frontend web lengkap dengan sistem routing berbasis role dan dashboard untuk ketiga pengguna (admin, kader, orang tua).

#### 2.2.1 Sistem Autentikasi Terbangun
Sistem autentikasi berbasis AuthContext sudah tersedia dengan dukungan login, register, dan logout. State pengguna terpusat sehingga mudah diakses dari berbagai komponen.

#### 2.2.2 Halaman Login dan Register Siap
Halaman login dan register dengan form validation dasar sudah tersedia dan terintegrasi dengan AuthContext.

#### 2.2.3 Dashboard Multi-Role Tersedia
Dashboard untuk admin, kader, dan orang tua sudah dibangun dengan fitur spesifik untuk setiap role.

#### 2.2.4 Sistem Routing dan Kontrol Akses
ProtectedRoute memastikan hanya pengguna dengan role yang tepat dapat mengakses halaman tertentu.

#### 2.2.5 Fitur Monitoring dan Detail Anak
Halaman monitoring anak dan detail anak dengan riwayat pemeriksaan sudah tersedia dan fungsional.

#### 2.2.6 Data Dummy Konsisten
Data anak, lokasi, dan jadwal pemeriksaan konsisten di seluruh aplikasi.

#### 2.2.7 Styling dan Status Gizi Visual
Status gizi ditampilkan dengan warna konsisten dan mudah dibedakan. Styling aplikasi terlihat rapi dan profesional.

### 2.3 Ringkasan Progress
Ringkasan progress mencakup:

1) Inisialisasi proyek React dengan Vite dan struktur folder yang terorganisir.
2) Implementasi AuthContext untuk manajemen autentikasi multi-role.
3) Pembuatan sistem routing dengan ProtectedRoute untuk kontrol akses berbasis role.
4) Pengembangan dashboard untuk admin, kader, dan orang tua.
5) Fitur monitoring anak, detail anak, dan riwayat pemeriksaan.
6) Manajemen data dengan form validation.
7) Konsistensi desain dan data dummy di seluruh aplikasi.

#### 2.3.1 Ringkasan Per Role

**Role Admin:**
1) Dashboard admin dengan statistik pengguna dan data keseluruhan.
2) Manajemen pengguna (admin, kader, orang tua).
3) Monitoring data anak keseluruhan.
4) Laporan dan analytics.

**Role Kader:**
1) Dashboard kader dengan daftar anak yang dipantau.
2) Form pencatatan pemeriksaan dan input data.
3) Agenda pemeriksaan dan notifikasi.
4) Monitoring status gizi anak.

**Role Orang Tua:**
1) Dashboard orang tua dengan informasi anak mereka.
2) Akses ke riwayat pemeriksaan dan status gizi.
3) Profil anak.
4) Notifikasi terkait kesehatan anak.

### 2.4 Kendala dan Solusi

#### 2.4.1 Kendala Prop Drilling pada AuthContext
**Masalah**: Mengakses state autentikasi dari komponen yang dalam memerlukan prop drilling yang berlebihan.
**Solusi**: Menggunakan Context API dengan custom hook `useAuth()` untuk akses langsung ke AuthContext dari komponen manapun.

#### 2.4.2 Kendala Konsistensi Warna Status Gizi
**Masalah**: Warna status gizi tidak konsisten di beberapa halaman karena menggunakan hex code yang berbeda.
**Solusi**: Membuat file konstanta warna terpusat dan menggunakannya di seluruh aplikasi.

#### 2.4.3 Kendala Responsive Design
**Masalah**: Layout kurang responsif pada ukuran layar yang berbeda.
**Solusi**: Menggunakan CSS Flexbox dan media queries untuk memastikan responsive design di mobile, tablet, dan desktop.

#### 2.4.4 Kendala Data Dummy Terkotak
**Masalah**: Data dummy tersebar di berbagai file dan sulit diupdate.
**Solusi**: Mengelompokkan semua data dummy di file `src/data/dummyData.js` dan menggunakannya sebagai source of truth.

#### 2.4.5 Kendala Navigasi Antar Role
**Masalah**: Pengguna bingung ketika berpindah role karena layout berubah drastis.
**Solusi**: Mempertahankan header/navbar yang konsisten dan memberikan indikasi role aktif yang jelas.

---

## BAB III
## RENCANA SELANJUTNYA

### 3.1 Rencana Kegiatan

#### Prioritas Jangka Pendek (1-2 minggu)
1) Integrasi dengan backend API untuk autentikasi nyata.
2) Menambahkan validasi form yang lebih ketat dan error handling.
3) Implementasi notifikasi sistem.
4) Menambahkan fitur pencarian dan filter yang lebih advanced.
5) Optimasi performa dengan React.memo dan code splitting.

#### Prioritas Jangka Menengah (2-4 minggu)
1) Implementasi manajemen state global dengan Redux atau Zustand jika diperlukan.
2) Integrasi dengan API real untuk semua fitur.
3) Penambahan fitur grafik dan analytics.
4) Implementasi real-time sync untuk update data.
5) Testing (unit test dan integration test).

#### Prioritas Jangka Panjang (1-3 bulan)
1) Deployment ke production.
2) Monitoring dan maintenance berkelanjutan.
3) Penambahan fitur berdasarkan feedback pengguna.
4) Scaling untuk menangani lebih banyak data dan pengguna.

### 3.2 Strategi Pelaksanaan

#### 3.2.1 Strategi Development
- Menggunakan Git untuk version control dengan branch strategy yang jelas.
- Melakukan daily stand-up atau progress tracking.
- Iterasi cepat dengan feedback loop reguler.

#### 3.2.2 Strategi Testing
- Manual testing di setiap tahap development.
- Automated testing untuk komponen kritis.
- User acceptance testing dengan pengguna internal sebelum launch.

#### 3.2.3 Strategi Dokumentasi
- Update dokumentasi seiring development.
- Membuat API documentation untuk backend.
- Screenshot dan demo reguler untuk progress tracking.

---

## BAB IV
## PENUTUP

### 4.1 Kesimpulan
Progress telah berhasil membangun struktur frontend web aplikasi Posco yang lengkap dengan sistem autentikasi multi-role, dashboard khusus untuk setiap role, dan fitur inti seperti monitoring anak, manajemen data, dan pelaporan status gizi. Aplikasi sudah mencapai tahap dimana seluruh alur dapat diuji secara end-to-end dari login hingga fitur utama untuk ketiga role (admin, kader, orang tua).

Dengan hasil ini, aplikasi siap untuk:
1) Demo internal kepada tim dan stakeholder.
2) Evaluasi UX/UI dari pengguna potensial.
3) Integrasi dengan backend API.
4) Iterasi dan improvement berdasarkan feedback.

### 4.2 Saran
1) Segera melakukan integrasi dengan backend API untuk mengganti data dummy dengan data nyata.
2) Menambahkan testing suite (unit test dan integration test) untuk meningkatkan kualitas kode.
3) Mengimplementasikan error handling yang lebih komprehensif.
4) Melakukan user testing dengan pengguna internal untuk validasi UX.
5) Mempertimbangkan implementasi cache dan optimasi performa sebelum scaling.

### 4.3 Catatan Tambahan
Proyek ini menggunakan React dengan Vite sebagai foundation yang solid untuk development cepat dan performa optimal. Struktur yang terorganisir memudahkan kolaborasi tim dan maintenance jangka panjang. Dengan pendekatan iteratif dan feedback-driven, aplikasi diharapkan dapat terus berkembang dan memenuhi kebutuhan pengguna.

---

## LAMPIRAN

### 1. Struktur Folder Proyek
```
projek-posco/
├── web/
│   ├── src/
│   │   ├── pages/           # Halaman utama untuk setiap role
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── KaderDashboard.jsx
│   │   │   ├── OrangtuaDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MonitoringAnak.jsx
│   │   │   └── ...
│   │   ├── components/      # Komponen reusable
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/         # State management
│   │   │   ├── AuthContext.jsx
│   │   │   └── ...
│   │   ├── data/            # Data dummy
│   │   │   └── dummyData.js
│   │   ├── styles/          # CSS global dan utility
│   │   ├── assets/          # Grafis dan aset
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

### 2. Daftar Halaman dan Fitur

#### Admin Pages:
- AdminDashboard: Dashboard admin dengan statistik
- AdminPages: Halaman manajemen pengguna
- Laporan: Analisis dan laporan keseluruhan

#### Kader Pages:
- KaderDashboard: Dashboard kader dengan daftar anak
- KaderPages: Fitur khusus kader (input data, monitoring)
- MonitoringAnak: Monitoring anak dengan detail

#### Orang Tua Pages:
- OrangtuaDashboard: Dashboard orang tua
- Halaman melihat status anak dan riwayat

#### Halaman Umum:
- Login: Autentikasi pengguna
- Register: Pendaftaran pengguna baru
- Layout: Template layout aplikasi
- ForgotPassword: Recovery password

#### Komponen Utama:
- ProtectedRoute: Perlindungan rute berbasis role
- ModalForm: Modal reusable untuk form
- AuthContext: Management autentikasi

### 3. Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: CSS Modules + CSS Utilities
- **Package Manager**: npm/yarn

### 4. Timeline Development
- **Phase 1**: Setup dan AuthContext (Hari 1-2)
- **Phase 2**: Dashboard dan Routing (Hari 2-3)
- **Phase 3**: Fitur Utama (Hari 3-5)
- **Phase 4**: Konsistensi dan Testing (Hari 5-6)
- **Phase 5**: Integration dan Polish (Hari 6+)

### 5. Catatan untuk Progress Berikutnya
- Persiapkan API endpoints untuk integrasi backend
- Buat test suite untuk komponen kritis
- Dokumentasi API dan database schema
- Siapkan deployment pipeline (CI/CD)
- Plan untuk mobile responsive optimization lebih lanjut
