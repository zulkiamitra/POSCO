# 🎯 Quick Reference - Fitur Kader Baru

## 📌 Akses Cepat Fitur-Fitur Baru

### 1. 👀 Lihat Detail Balita
```
Sidebar → Data Warga → Tab "Balita"
         → Tabel → Tombol "Lihat Detail"
         → Modal terbuka dengan 3 tab
```

**Di Modal:**
- 📋 Tab 1: Informasi (data balita + imunisasi)
- 📊 Tab 2: Riwayat (timeline pemeriksaan)
- 👨‍👩‍👧 Tab 3: Orang Tua (info wali)

---

### 2. 📥 Download Laporan PDF
```
Detail Modal → Tombol "📥 Download PDF" (Biru)
            → File akan diunduh otomatis
            → Nama: Laporan-{NamaBalita}.pdf
```

**PDF Berisi:**
- Header dengan logo POSCO
- Info balita lengkap
- Info orang tua
- Tabel riwayat pemeriksaan
- Footer dengan tanggal & halaman

---

### 3. 📈 Lihat Riwayat Pemeriksaan
```
Sidebar → Riwayat Catatan
       → Pilih balita di sisi kiri
       → Detail riwayat tampil di kanan
       → Timeline dengan metrik lengkap
```

**Info yang Ditampilkan per Pemeriksaan:**
- 📅 Tanggal
- ⚖️ Berat badan (kg)
- 📏 Tinggi badan (cm)
- 🎯 Lingkar kepala (cm)
- ✨ Status gizi

---

## 🎨 Color Guide

| Warna | Arti | Contoh |
|-------|------|--------|
| 🟢 Hijau | Normal/Good | Status gizi normal, active |
| 🟡 Kuning | Warning | Gizi kurang, perlu perhatian |
| 🔴 Merah | Alert | Gizi buruk, perlu tindakan |
| 🔵 Biru | Secondary | Download button, info |

---

## ⌨️ Keyboard Shortcuts (Browser)

| Aksi | Shortcut |
|------|----------|
| Open DevTools | F12 |
| Close Modal | Esc |
| Refresh Page | F5 |

---

## 💡 Tips & Tricks

### Tip 1: Melihat Banyak Balita
Gunakan halaman **Riwayat Catatan** untuk:
- Scroll daftar balita di sidebar
- Klik balita yang berbeda untuk compare
- Lihat timeline growth setiap balita

### Tip 2: Print PDF
1. Download PDF
2. Buka file di viewer
3. Tekan Ctrl+P untuk print
4. Pilih printer

### Tip 3: Navigasi Cepat
- Klik X atau "Tutup" untuk menutup modal
- Klik tab untuk switch informasi
- Hover over status untuk lihat indicator warna

### Tip 4: Sorting Data
Tab "Data Warga" menampilkan 5 balita terbaru.
Untuk melihat semua, bisa scroll atau buat fitur search di future.

---

## ❓ FAQ

**Q: PDF tidak bisa diunduh?**  
A: Check browser popup blocker atau permission settings

**Q: Informasi orang tua tidak muncul?**  
A: Kemungkinan data orang tua belum ada di sistem. Check ID reference.

**Q: Bagaimana menambah riwayat pemeriksaan baru?**  
A: Fitur add masih manual di dummyData. Future: Tambah form input.

**Q: Bisa export ke Excel?**  
A: Tidak tersedia sekarang. Bisa request di future development.

**Q: Riwayat bisa diedit?**  
A: Tidak. Fitur edit bisa ditambah nanti jika diperlukan.

---

## 🔧 Technical Quick Ref

### Files Modified
- `/web/src/pages/KaderDashboard.jsx` (Main implementation)

### New Dependencies
```bash
npm install jspdf html2canvas
```

### Key Components
1. `DetailBalitaModal` - Detail view modal
2. `downloadPDF()` - PDF generation
3. `RiwayatPage` - Enhanced history view
4. `DataWargaPage` - Updated with detail button

### State Variables
```javascript
selectedChild       // Balita yang dipilih
showDetailModal     // Kontrol tampil modal
selectedRiwayat     // Balita di halaman riwayat
```

---

## 📞 Troubleshooting

### Modal tidak terbuka
- Check browser console (F12)
- Pastikan child data valid
- Try refresh page (F5)

### PDF generation error
- Ensure jsPDF & html2canvas installed
- Check internet connection (if using CDN)
- Try different browser

### Styling issue
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check CSS in DevTools

---

## 📚 Related Files to Read

For more details, see:
1. `KADER_NEW_FEATURES.md` - Complete feature documentation
2. `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
3. `DEVELOPER_QUICK_REFERENCE.md` - General project reference

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install jspdf html2canvas

# Run development server
npm run dev

# Build for production
npm run build

# Check lint
npm run lint
```

---

**Last Updated:** May 21, 2026  
**Version:** 1.0.0
