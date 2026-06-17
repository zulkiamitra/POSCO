import 'package:flutter/material.dart';

class HelpCenterScreen extends StatefulWidget {
  const HelpCenterScreen({super.key});

  @override
  State<HelpCenterScreen> createState() => _HelpCenterScreenState();
}

class _HelpCenterScreenState extends State<HelpCenterScreen> {
  int _expandedIndex = 0;

  final List<_FaqItem> faqItems = [
    _FaqItem(
      title: 'Bagaimana cara melakukan penimbangan di Posyandu?',
      answer:
          'Untuk melakukan penimbangan, Anda dapat datang ke Posyandu terdekat pada hari dan jam yang telah ditentukan. Bawa buku kesehatan ibu dan anak (KIA) serta data diri lengkap. Petugas kesehatan akan melakukan penimbangan dan mencatat hasilnya dalam sistem kami. Hasil penimbangan akan langsung tersimpan di aplikasi ini.',
      category: 'Penimbangan',
    ),
    _FaqItem(
      title: 'Apa itu status gizi dan bagaimana cara membacanya?',
      answer:
          'Status gizi adalah ukuran kesehatan nutrisi anak berdasarkan perbandingan berat badan dan tinggi badan. Status gizi dibagi menjadi beberapa kategori: Gizi Baik (normal), Gizi Kurang, Gizi Buruk, dan Gizi Lebih (obesitas). Anda dapat melihat status gizi anak di aplikasi ini dengan warna yang berbeda-beda. Warna hijau menunjukkan status normal, kuning untuk gizi kurang, dan merah untuk gizi buruk.',
      category: 'Status Gizi',
    ),
    _FaqItem(
      title: 'Bagaimana cara melihat riwayat pemeriksaan anak?',
      answer:
          'Untuk melihat riwayat pemeriksaan anak, buka aplikasi dan masuk ke menu "Riwayat" di bagian bawah layar. Di sini Anda akan menemukan daftar semua pemeriksaan yang telah dilakukan, mulai dari pengukuran berat badan, tinggi badan, hingga hasil pemeriksaan kesehatan lainnya. Setiap item riwayat menampilkan tanggal, jenis pemeriksaan, dan hasil pengukuran. Anda dapat menyentuh salah satu item untuk melihat detail lengkap.',
      category: 'Riwayat',
    ),
    _FaqItem(
      title: 'Berapa biaya layanan Posyandu?',
      answer:
          'Layanan Posyandu adalah program kesehatan pemerintah yang gratis atau dengan biaya yang sangat terjangkau. Untuk penimbangan dasar, konsultasi kesehatan anak, dan vaksinasi rutin, tidak ada biaya tambahan selain kartu kesehatan anak (KIA). Namun, untuk layanan khusus tertentu seperti pemeriksaan laboratorium atau konsultasi gizi intensif, mungkin ada biaya tambahan. Silakan tanyakan langsung ke petugas Posyandu terdekat untuk informasi biaya yang lebih lengkap.',
      category: 'Biaya',
    ),
  ];

  void _showQuickMessage(BuildContext context, String label) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(label)));
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const secondaryColor = Color(0xFF2D8F6B);
    const backgroundColor = Color(0xFFF6F8F6);
    const darkText = Color(0xFF111827);
    const mutedText = Color(0xFF6B7280);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with Back Button
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [primaryColor, secondaryColor],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.arrow_back,
                            color: Colors.white,
                            size: 22,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Text(
                        'PUSAT BANTUAN',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // FAQ Content
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
                top: 2,
                bottom: 24,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // FAQ List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: faqItems.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final isExpanded = index == _expandedIndex;
                      return _FaqCard(
                        item: faqItems[index],
                        isExpanded: isExpanded,
                        onTap: () {
                          setState(() {
                            _expandedIndex = isExpanded ? -1 : index;
                          });
                        },
                      );
                    },
                  ),
                  const SizedBox(height: 24),

                  // Contact Section
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: primaryColor.withOpacity(0.1),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Masih Ada Pertanyaan?',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: darkText,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Hubungi tim dukungan kami melalui kontak di bawah ini',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: mutedText,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () => _showQuickMessage(
                              context,
                              'Hubungi support team',
                            ),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 10,
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.phone_rounded,
                                    color: primaryColor,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 10),
                                  const Text(
                                    '+62-123-456-7890',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: primaryColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () => _showQuickMessage(
                              context,
                              'Email support team',
                            ),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 10,
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.email_rounded,
                                    color: primaryColor,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 10),
                                  const Text(
                                    'support@posco.com',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: primaryColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FaqCard extends StatelessWidget {
  final _FaqItem item;
  final bool isExpanded;
  final VoidCallback onTap;

  const _FaqCard({
    required this.item,
    required this.isExpanded,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const darkText = Color(0xFF111827);
    const mutedText = Color(0xFF6B7280);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isExpanded
                  ? primaryColor.withOpacity(0.3)
                  : primaryColor.withOpacity(0.1),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: isExpanded
                    ? primaryColor.withOpacity(0.1)
                    : Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Question Header
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: primaryColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            item.category,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: primaryColor,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          item.title,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: darkText,
                            letterSpacing: -0.2,
                          ),
                          maxLines: isExpanded ? null : 2,
                          overflow: isExpanded
                              ? TextOverflow.visible
                              : TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Arrow Icon
                  AnimatedRotation(
                    turns: isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 300),
                    child: Icon(
                      Icons.expand_more_rounded,
                      color: primaryColor,
                      size: 24,
                    ),
                  ),
                ],
              ),

              // Answer (if expanded)
              if (isExpanded) ...[
                const SizedBox(height: 14),
                Container(height: 1, color: primaryColor.withOpacity(0.1)),
                const SizedBox(height: 14),
                Text(
                  item.answer,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: mutedText,
                    height: 1.7,
                    letterSpacing: 0.2,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _FaqItem {
  final String title;
  final String answer;
  final String category;

  _FaqItem({required this.title, required this.answer, required this.category});
}
