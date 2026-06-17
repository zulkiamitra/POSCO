import 'package:flutter/material.dart';

class OrangTuaNotificationScreen extends StatelessWidget {
  const OrangTuaNotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Colors.white;

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
            decoration: const BoxDecoration(
              color: primaryColor,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
            ),
            child: SafeArea(
              bottom: false,
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'NOTIFIKASI',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Column(
                children: const [
                  _NotificationCard(
                    title: 'Jadwal Pemeriksaan Anak',
                    description:
                        'Jadwal pemeriksaan anak Anda di Posyandu Kenanga, Selasa 12 Mei 2026 pukul 08:00 WIB.',
                  ),
                  SizedBox(height: 16),
                  _NotificationCard(
                    title: 'Status Gizi Anak',
                    description:
                        'Status gizi anak Rani Anda normal. Pertahankan pola makan seimbang.',
                  ),
                  SizedBox(height: 16),
                  _NotificationCard(
                    title: 'Pengingat Imunisasi',
                    description:
                        'Waktu imunisasi anak Anda sudah mendekati. Hubungi kader posyandu untuk detailnya.',
                  ),
                  SizedBox(height: 16),
                  _NotificationCard(
                    title: 'Tips Nutrisi',
                    description:
                        'Konsumsi lebih banyak makanan bergizi tinggi untuk mendukung pertumbuhan optimal.',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  const _NotificationCard({required this.title, required this.description});

  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: primaryColor,
              fontWeight: FontWeight.w700,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              color: Color(0xFF111827),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
