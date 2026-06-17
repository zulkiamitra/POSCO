import 'package:flutter/material.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class InputCheckupFormScreen extends StatefulWidget {
  const InputCheckupFormScreen({
    super.key,
    required this.name,
    required this.birthDate,
    required this.gender,
    this.childId,
    this.childRecord,
  });

  final String name;
  final DateTime birthDate;
  final String gender;
  final String? childId;
  final NutritionChildRecord? childRecord;

  @override
  State<InputCheckupFormScreen> createState() => _InputCheckupFormScreenState();
}

class _InputCheckupFormScreenState extends State<InputCheckupFormScreen> {
  final TextEditingController _weightController = TextEditingController();
  final TextEditingController _heightController = TextEditingController();
  final TextEditingController _armController = TextEditingController();
  final TextEditingController _headController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();

  final Set<String> _selectedServices = {};

  @override
  void dispose() {
    _weightController.dispose();
    _heightController.dispose();
    _armController.dispose();
    _headController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _toggleService(String value) {
    setState(() {
      if (_selectedServices.contains(value)) {
        _selectedServices.remove(value);
      } else {
        _selectedServices.add(value);
      }
    });
  }

  Future<void> _save() async {
    final weightStr = _weightController.text.trim();
    final heightStr = _heightController.text.trim();
    final armStr = _armController.text.trim();
    final headStr = _headController.text.trim();

    if (weightStr.isEmpty || heightStr.isEmpty || armStr.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Berat Badan, Tinggi Badan, dan Lingkar Lengan wajib diisi')),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Konfirmasi'),
        content: Text('Simpan hasil pemeriksaan untuk ${widget.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4DBFA3),
            ),
            child: const Text('Simpan'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    final now = DateTime.now();
    final months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    final dateString = '${now.day} ${months[now.month - 1]} ${now.year}';
    final services = _selectedServices.map((s) => '+ ${s.toUpperCase()}').toList();

    final newCheckup = {
      'date': dateString,
      'location': 'Posyandu Melati - Kec. Padang Timur',
      'status': widget.childRecord?.status ?? 'Normal',
      'weight': '$weightStr kg',
      'height': '$heightStr cm',
      'arm': '$armStr cm',
      'headCircumference': headStr.isNotEmpty ? '$headStr cm' : '-',
      'note': _noteController.text.trim(),
      'services': services,
    };

    final currentHistory = widget.childRecord?.rawData?['checkupHistory'] ?? [];
    List<dynamic> updatedHistory = [newCheckup];
    if (currentHistory is List) {
      updatedHistory.addAll(currentHistory);
    }

    final weightVal = double.tryParse(weightStr);
    final heightVal = double.tryParse(heightStr);

    final updatedRecord = (widget.childRecord ?? NutritionChildRecord(
      name: widget.name,
      parentName: '',
      birthDate: widget.birthDate,
      gender: widget.gender,
      status: 'Normal',
      createdAt: DateTime.now(),
    )).copyWith(
      rawData: {
        ...widget.childRecord?.rawData ?? {},
        'checkupHistory': updatedHistory,
        if (heightVal != null) 'height': heightVal,
        if (weightVal != null) 'weight': weightVal,
      },
    );

    final success = await NutritionStatsRepository.instance.upsertChild(
      updatedRecord,
      id: widget.childId,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Hasil pemeriksaan disimpan')));
      Navigator.of(context).pop(true);
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Gagal menyimpan hasil pemeriksaan')));
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const background = Color(0xFFF6F8F6);
    const softBorder = Color(0xFFE6F3EE);

    return Scaffold(
      backgroundColor: background,
      body: Column(
        children: [
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF4DBFA3), Color(0xFF2AA37A)],
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(22)),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 8, 12, 14),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text(
                        'INPUT PEMERIKSAAN',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 18,
                        ),
                      ),
                    ),
                    const SizedBox(width: 44),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // child header
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 12,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: primaryColor.withOpacity(0.12),
                          child: Text(
                            widget.name.isNotEmpty
                                ? widget.name.trim()[0].toUpperCase()
                                : '?',
                            style: const TextStyle(
                              color: primaryColor,
                              fontWeight: FontWeight.w800,
                              fontSize: 20,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.name,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(999),
                                      border: Border.all(
                                        color: const Color(0xFFE6F3EE),
                                      ),
                                    ),
                                    child: Text(
                                      formatAge(widget.birthDate),
                                      style: const TextStyle(
                                        color: Color(0xFF111827),
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(999),
                                      border: Border.all(
                                        color: const Color(0xFFE6F3EE),
                                      ),
                                    ),
                                    child: Text(
                                      widget.gender,
                                      style: const TextStyle(
                                        color: Color(0xFF111827),
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  const Text(
                    'Pengukuran Utama',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 10),

                  Row(
                    children: [
                      Expanded(
                        child: _MetricInputCard(
                          title: 'Berat Badan',
                          hintText: 'kg',
                          controller: _weightController,
                          accentColor: const Color(0xFF22B8A5),
                          icon: Icons.monitor_weight_outlined,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _MetricInputCard(
                          title: 'Tinggi Badan',
                          hintText: 'cm',
                          controller: _heightController,
                          accentColor: const Color(0xFF4C7CFE),
                          icon: Icons.height_outlined,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _MetricInputCard(
                          title: 'Lingkar Lengan',
                          hintText: 'cm',
                          controller: _armController,
                          accentColor: const Color(0xFFFFA23D),
                          icon: Icons.straighten,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _MetricInputCard(
                          title: 'Lingkar Kepala',
                          hintText: 'cm',
                          controller: _headController,
                          accentColor: const Color(0xFF8F6BFF),
                          icon: Icons.face_2_outlined,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),
                  // notes card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: softBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.note_alt_outlined, color: primaryColor),
                            SizedBox(width: 8),
                            Text(
                              'Catatan Pemeriksaan',
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F7F3),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.all(12),
                          child: TextField(
                            controller: _noteController,
                            maxLines: 4,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Tulis catatan pemeriksaan',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),
                  // services
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: softBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(
                              Icons.medical_services_outlined,
                              color: primaryColor,
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Layanan Tambahan',
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Pilih layanan yang diberikan',
                          style: TextStyle(
                            color: Color(0xFF6B7280),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _ChipButton(
                              label: 'Vitamin A',
                              isActive: _selectedServices.contains('Vitamin A'),
                              onTap: () => _toggleService('Vitamin A'),
                            ),
                            _ChipButton(
                              label: 'Vitamin D',
                              isActive: _selectedServices.contains('Vitamin D'),
                              onTap: () => _toggleService('Vitamin D'),
                            ),
                            _ChipButton(
                              label: 'Vitamin C',
                              isActive: _selectedServices.contains('Vitamin C'),
                              onTap: () => _toggleService('Vitamin C'),
                            ),
                            _ChipButton(
                              label: 'Zinc',
                              isActive: _selectedServices.contains('Zinc'),
                              onTap: () => _toggleService('Zinc'),
                            ),
                            _ChipButton(
                              label: 'Zat Besi',
                              isActive: _selectedServices.contains('Zat Besi'),
                              onTap: () => _toggleService('Zat Besi'),
                            ),
                            _ChipButton(
                              label: 'Kalsium',
                              isActive: _selectedServices.contains('Kalsium'),
                              onTap: () => _toggleService('Kalsium'),
                            ),
                            _ChipButton(
                              label: 'Obat Cacing',
                              isActive: _selectedServices.contains(
                                'Obat Cacing',
                              ),
                              onTap: () => _toggleService('Obat Cacing'),
                            ),
                            _ChipButton(
                              label: 'Paracetamol',
                              isActive: _selectedServices.contains(
                                'Paracetamol',
                              ),
                              onTap: () => _toggleService('Paracetamol'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 22),
                  SizedBox(
                    height: 56,
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _save,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Simpan Hasil Pemeriksaan',
                        style: TextStyle(fontWeight: FontWeight.w800),
                      ),
                    ),
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

class _MetricInputCard extends StatelessWidget {
  const _MetricInputCard({
    required this.title,
    required this.hintText,
    required this.controller,
    required this.accentColor,
    required this.icon,
  });

  final String title;
  final String hintText;
  final TextEditingController controller;
  final Color accentColor;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFECEFF0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: accentColor),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    color: accentColor,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FBF9),
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: const TextStyle(color: Color(0xFF9CA3AF)),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChipButton extends StatelessWidget {
  const _ChipButton({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  final String label;
  final bool isActive;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF4DBFA3);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: isActive ? primary : primary.withOpacity(0.12),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? Colors.white : primary,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFE6F3EE)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF4DBFA3)),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF111827),
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
