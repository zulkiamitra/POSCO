// Default credentials for testing
export const defaultCredentials = {
  admin: { id: 1, name: "Dr. Ahmad Fauzi", email: "admin@posco.id", role: "admin", password: "admin123", wilayah: "Kota Padang" },
  kader: { id: 2, name: "Siti Rahayu", email: "siti@posco.id", role: "kader", password: "kader123", wilayah: "Kecamatan Koto Tangah", posyandu: "Posyandu Melati" },
  orangtua: { id: 4, name: "Budi Santoso", email: "budi@posco.id", role: "orangtua", password: "orangtua123", wilayah: "Kecamatan Koto Tangah" },
};

export const users = [
  { id: 1, name: "Dr. Ahmad Fauzi", email: "admin@posco.id", role: "admin", status: "active", wilayah: "Kota Padang" },
  { id: 2, name: "Siti Rahayu", email: "siti@posco.id", role: "kader", status: "active", wilayah: "Kecamatan Koto Tangah", posyandu: "Posyandu Melati" },
  { id: 3, name: "Dewi Lestari", email: "dewi@posco.id", role: "kader", status: "active", wilayah: "Kecamatan Padang Utara", posyandu: "Posyandu Mawar" },
  { id: 4, name: "Budi Santoso", email: "budi@posco.id", role: "orangtua", status: "active", wilayah: "Kecamatan Koto Tangah" },
  { id: 5, name: "Rina Marlina", email: "rina@posco.id", role: "orangtua", status: "active", wilayah: "Kecamatan Padang Selatan" },
  { id: 6, name: "Hendra Gunawan", email: "hendra@posco.id", role: "kader", status: "inactive", wilayah: "Kecamatan Lubuk Kilangan", posyandu: "Posyandu Anggrek" },
];

export const posyandus = [
  { id: 1, nama: "Posyandu Melati", kecamatan: "Koto Tangah", kelurahan: "Batang Kabung Ganting", kader: "Siti Rahayu", totalBalita: 45, aktif: true },
  { id: 2, nama: "Posyandu Mawar", kecamatan: "Padang Utara", kelurahan: "Gunung Pangilun", kader: "Dewi Lestari", totalBalita: 38, aktif: true },
  { id: 3, nama: "Posyandu Anggrek", kecamatan: "Lubuk Kilangan", kelurahan: "Bandar Buat", kader: "Hendra Gunawan", totalBalita: 52, aktif: false },
  { id: 4, nama: "Posyandu Kenanga", kecamatan: "Padang Selatan", kelurahan: "Rawang", kader: "Ani Suryani", totalBalita: 31, aktif: true },
  { id: 5, nama: "Posyandu Dahlia", kecamatan: "Kuranji", kelurahan: "Anduring", kader: "Fatimah", totalBalita: 60, aktif: true },
];

export const children = [
  {
    id: 1, nama: "Aisyah Budi", namaIbu: "Rina Marlina", tanggalLahir: "2022-03-15",
    jenisKelamin: "P", beratLahir: 3.2, tinggiBadan: 75, beratBadan: 9.5,
    statusGizi: "Normal", statusStunting: "Tidak Stunting", posyandu: "Posyandu Mawar",
    orangtuaId: 5, imunisasi: { bcg: true, hb0: true, polio: true, dpt1: true, dpt2: true, campak: false },
    riwayatPemeriksaan: [
      { tanggal: "2024-01-10", bb: 8.2, tb: 70, lingkarKepala: 44, statusGizi: "Normal" },
      { tanggal: "2024-02-14", bb: 8.7, tb: 72, lingkarKepala: 44.5, statusGizi: "Normal" },
      { tanggal: "2024-03-20", bb: 9.1, tb: 73.5, lingkarKepala: 45, statusGizi: "Normal" },
      { tanggal: "2024-04-18", bb: 9.5, tb: 75, lingkarKepala: 45.5, statusGizi: "Normal" },
    ]
  },
  {
    id: 2, nama: "Rizki Santoso", namaIbu: "Ani Suryani", tanggalLahir: "2021-08-22",
    jenisKelamin: "L", beratLahir: 2.9, tinggiBadan: 82, beratBadan: 11.2,
    statusGizi: "Normal", statusStunting: "Tidak Stunting", posyandu: "Posyandu Melati",
    orangtuaId: 4, imunisasi: { bcg: true, hb0: true, polio: true, dpt1: true, dpt2: true, campak: true },
    riwayatPemeriksaan: [
      { tanggal: "2024-01-08", bb: 10.1, tb: 78, lingkarKepala: 46, statusGizi: "Normal" },
      { tanggal: "2024-02-12", bb: 10.6, tb: 80, lingkarKepala: 46.5, statusGizi: "Normal" },
      { tanggal: "2024-03-18", bb: 10.9, tb: 81, lingkarKepala: 47, statusGizi: "Normal" },
      { tanggal: "2024-04-15", bb: 11.2, tb: 82, lingkarKepala: 47.2, statusGizi: "Normal" },
    ]
  },
  {
    id: 3, nama: "Nayla Fitri", namaIbu: "Dewi Permata", tanggalLahir: "2022-11-05",
    jenisKelamin: "P", beratLahir: 2.5, tinggiBadan: 68, beratBadan: 7.1,
    statusGizi: "Gizi Kurang", statusStunting: "Stunting", posyandu: "Posyandu Kenanga",
    orangtuaId: 5, imunisasi: { bcg: true, hb0: true, polio: false, dpt1: true, dpt2: false, campak: false },
    riwayatPemeriksaan: [
      { tanggal: "2024-01-12", bb: 6.2, tb: 63, lingkarKepala: 43, statusGizi: "Gizi Kurang" },
      { tanggal: "2024-02-16", bb: 6.5, tb: 64.5, lingkarKepala: 43.5, statusGizi: "Gizi Kurang" },
      { tanggal: "2024-03-22", bb: 6.8, tb: 66, lingkarKepala: 43.8, statusGizi: "Gizi Kurang" },
      { tanggal: "2024-04-19", bb: 7.1, tb: 68, lingkarKepala: 44, statusGizi: "Gizi Kurang" },
    ]
  },
  {
    id: 4, nama: "Farhan Hidayat", namaIbu: "Susi Wulandari", tanggalLahir: "2023-01-20",
    jenisKelamin: "L", beratLahir: 3.5, tinggiBadan: 65, beratBadan: 8.8,
    statusGizi: "Normal", statusStunting: "Tidak Stunting", posyandu: "Posyandu Dahlia",
    orangtuaId: 4, imunisasi: { bcg: true, hb0: true, polio: true, dpt1: true, dpt2: false, campak: false },
    riwayatPemeriksaan: [
      { tanggal: "2024-01-15", bb: 7.8, tb: 61, lingkarKepala: 43, statusGizi: "Normal" },
      { tanggal: "2024-02-18", bb: 8.2, tb: 62.5, lingkarKepala: 43.5, statusGizi: "Normal" },
      { tanggal: "2024-03-25", bb: 8.5, tb: 63.5, lingkarKepala: 44, statusGizi: "Normal" },
      { tanggal: "2024-04-20", bb: 8.8, tb: 65, lingkarKepala: 44.5, statusGizi: "Normal" },
    ]
  },
  {
    id: 5, nama: "Zahra Amelia", namaIbu: "Rini Handayani", tanggalLahir: "2021-05-10",
    jenisKelamin: "P", beratLahir: 3.0, tinggiBadan: 87, beratBadan: 10.8,
    statusGizi: "Gizi Lebih", statusStunting: "Tidak Stunting", posyandu: "Posyandu Anggrek",
    orangtuaId: 5, imunisasi: { bcg: true, hb0: true, polio: true, dpt1: true, dpt2: true, campak: true },
    riwayatPemeriksaan: [
      { tanggal: "2024-01-09", bb: 10.2, tb: 84, lingkarKepala: 47, statusGizi: "Gizi Lebih" },
      { tanggal: "2024-02-13", bb: 10.5, tb: 85, lingkarKepala: 47.2, statusGizi: "Gizi Lebih" },
      { tanggal: "2024-03-19", bb: 10.7, tb: 86, lingkarKepala: 47.5, statusGizi: "Gizi Lebih" },
      { tanggal: "2024-04-16", bb: 10.8, tb: 87, lingkarKepala: 47.8, statusGizi: "Gizi Lebih" },
    ]
  },
];

export const ibuHamil = [
  { id: 1, nama: "Sari Indah", usia: 28, usiaKehamilan: 28, hpht: "2023-11-15", taksirPersalinan: "2024-08-22", tekananDarah: "120/80", beratBadan: 65, posyandu: "Posyandu Melati", risikoTinggi: false },
  { id: 2, nama: "Maya Putri", usia: 34, usiaKehamilan: 36, hpht: "2023-08-10", taksirPersalinan: "2024-05-17", tekananDarah: "140/90", beratBadan: 72, posyandu: "Posyandu Mawar", risikoTinggi: true },
  { id: 3, nama: "Fitri Yanti", usia: 22, usiaKehamilan: 12, hpht: "2024-02-05", taksirPersalinan: "2024-11-12", tekananDarah: "110/70", beratBadan: 55, posyandu: "Posyandu Kenanga", risikoTinggi: false },
];

export const jadwalSesi = [
  { id: 1, tanggal: "2024-04-25", waktu: "08:00 - 11:00", posyandu: "Posyandu Melati", jumlahHadir: 32, status: "Selesai", kader: "Siti Rahayu" },
  { id: 2, tanggal: "2024-04-26", waktu: "09:00 - 12:00", posyandu: "Posyandu Mawar", jumlahHadir: 28, status: "Selesai", kader: "Dewi Lestari" },
  { id: 3, tanggal: "2024-05-02", waktu: "08:00 - 11:00", posyandu: "Posyandu Melati", jumlahHadir: 0, status: "Mendatang", kader: "Siti Rahayu" },
  { id: 4, tanggal: "2024-05-03", waktu: "09:00 - 12:00", posyandu: "Posyandu Kenanga", jumlahHadir: 0, status: "Mendatang", kader: "Ani Suryani" },
  { id: 5, tanggal: "2024-05-10", waktu: "08:00 - 11:00", posyandu: "Posyandu Dahlia", jumlahHadir: 0, status: "Mendatang", kader: "Fatimah" },
];

export const rujukan = [
  { id: 1, namaAnak: "Nayla Fitri", alasan: "Gizi Buruk - perlu penanganan lanjut", tujuan: "Puskesmas Padang Selatan", tanggal: "2024-04-19", status: "Terkirim", kader: "Dewi Lestari" },
  { id: 2, namaAnak: "Haikal Putra", alasan: "Demam tinggi berulang", tujuan: "RSUD M. Djamil", tanggal: "2024-04-18", status: "Proses", kader: "Siti Rahayu" },
  { id: 3, namaAnak: "Laila Sari", alasan: "Terlambat bicara", tujuan: "Poli Tumbuh Kembang RSUP", tanggal: "2024-04-15", status: "Selesai", kader: "Siti Rahayu" },
];

export const statsAdmin = {
  totalPosyandu: posyandus.length,
  totalWilayah: 5,
  totalKader: users.filter(u => u.role === 'kader').length,
  totalOrangTua: users.filter(u => u.role === 'orangtua').length,
  totalBalita: children.length,
  totalIbuHamil: ibuHamil.length,
};
