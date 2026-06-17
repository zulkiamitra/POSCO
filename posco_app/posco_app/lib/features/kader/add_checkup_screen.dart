import 'package:flutter/material.dart';

class AddCheckupScreen extends StatefulWidget {
  const AddCheckupScreen({super.key});

  @override
  State<AddCheckupScreen> createState() => _AddCheckupScreenState();
}

class _AddCheckupScreenState extends State<AddCheckupScreen> {
  DateTime? _date;
  TimeOfDay? _time;
  final _locationCtrl = TextEditingController();
  final String _status = 'Normal';
  final _weightCtrl = TextEditingController();
  final _heightCtrl = TextEditingController();
  final _armCtrl = TextEditingController();
  final _headCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();

  final List<String> _locationOptions = const [
    'Posyandu Melati',
    'Posyandu Kenanga',
    'Posyandu Mawar',
    'Puskesmas Padang Utara',
  ];

  final List<String> _services = const [
    'Vitamin A',
    'Vitamin D',
    'Vitamin C',
    'Vitamin B Kompleks',
    'Multivitamin',
    'Zinc',
    'Zat Besi',
    'Kalsium',
    'Obat Cacing',
    'Paracetamol',
    'Ibuprofen',
    'Oralit',
  ];

  final Set<String> _selectedServices = {};

  @override
  void dispose() {
    _locationCtrl.dispose();
    _weightCtrl.dispose();
    _heightCtrl.dispose();
    _armCtrl.dispose();
    _headCtrl.dispose();
    _noteCtrl.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _locationCtrl.text = _locationOptions.first;
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _date ?? now,
      firstDate: DateTime(now.year - 5),
      lastDate: now,
    );
    if (picked != null) {
      setState(() => _date = picked);
    }
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _time ?? TimeOfDay.now(),
      builder: (context, child) {
        return Localizations.override(
          context: context,
          locale: const Locale('en', 'US'),
          child: MediaQuery(
            data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: false),
            child: child ?? const SizedBox.shrink(),
          ),
        );
      },
    );
    if (picked != null) {
      setState(() => _time = picked);
    }
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

  Widget _chip(String label) {
    final selected = _selectedServices.contains(label);
    return FilterChip(
      label: Text(
        label,
        style: TextStyle(
          color: selected ? Colors.white : const Color(0xFF2AA37A),
          fontWeight: FontWeight.w700,
          fontSize: 13,
        ),
      ),
      selected: selected,
      onSelected: (_) => _toggleService(label),
      selectedColor: const Color(0xFF4DBFA3),
      backgroundColor: const Color(0xFFEAF7F3),
      checkmarkColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(999),
        side: BorderSide(
          color: selected ? const Color(0xFF4DBFA3) : const Color(0xFFD7EEE5),
        ),
      ),
    );
  }

  String _monthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return months[month - 1];
  }

  String _formatTime12(TimeOfDay timeOfDay) {
    final hour = timeOfDay.hourOfPeriod == 0 ? 12 : timeOfDay.hourOfPeriod;
    final minute = timeOfDay.minute.toString().padLeft(2, '0');
    final period = timeOfDay.period == DayPeriod.am ? 'AM' : 'PM';
    return '$hour.$minute $period';
  }

  Future<void> _save() async {
    if (_date == null || _locationCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tanggal dan lokasi wajib diisi')),
      );
      return;
    }

    final dateText =
        '${_date!.day.toString().padLeft(2, '0')} ${_monthName(_date!.month)} ${_date!.year}';
    final timeText = _time == null ? '-' : _formatTime12(_time!);

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text('Konfirmasi'),
          content: Text(
            'Anda yakin menambahkan pemeriksaan ini?\n\n'
            'Lokasi: ${_locationCtrl.text.trim()}\n'
            'Tanggal: $dateText\n'
            'Waktu: $timeText\n'
            'Status: $_status',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Batal'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4DBFA3),
                foregroundColor: Colors.white,
              ),
              child: const Text('Ya, Tambahkan'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) return;

    final result = {
      'date': '${_date!.day}/${_date!.month}/${_date!.year}',
      'location': _locationCtrl.text.trim(),
      'status': _status,
      'weight': _weightCtrl.text.trim(),
      'height': _heightCtrl.text.trim(),
      'arm': _armCtrl.text.trim(),
      'head': _headCtrl.text.trim(),
      'note': _noteCtrl.text.trim(),
      'services': _selectedServices.toList(),
    };

    Navigator.of(context).pop(result);
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Colors.white;
    const primaryColor = Color(0xFF4DBFA3);
    const fieldFillColor = Color(0xFFF1F7F3);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Column(
        children: [
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF4DBFA3), Color(0xFF2AA37A)],
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 8, 16, 22),
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
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.4,
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
                  Row(
                    children: [
                      Expanded(
                        child: _NumberInputCard(
                          label: 'Berat Badan',
                          controller: _weightCtrl,
                          suffix: 'kg',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _NumberInputCard(
                          label: 'Tinggi Badan',
                          controller: _heightCtrl,
                          suffix: 'cm',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _NumberInputCard(
                          label: 'Lingkar Lengan Atas',
                          controller: _armCtrl,
                          suffix: 'cm',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _NumberInputCard(
                          label: 'Lingkar Kepala',
                          controller: _headCtrl,
                          suffix: 'cm',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'CATATAN DAN PELAYANAN',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F7F4),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Catatan dari Kader Posyandu',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _noteCtrl,
                          maxLines: 4,
                          decoration: const InputDecoration(
                            hintText: 'Tulis catatan pemeriksaan',
                            border: InputBorder.none,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Waktu Pemeriksaan',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: _SelectButton(
                          label: _date == null
                              ? 'Pilih Tanggal'
                              : '${_date!.day}/${_date!.month}/${_date!.year}',
                          icon: Icons.calendar_month,
                          onTap: _pickDate,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _SelectButton(
                          label: _time == null
                              ? 'Pilih Jam'
                              : _formatTime12(_time!),
                          icon: Icons.access_time,
                          onTap: _pickTime,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Layanan Tambahan',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _services.take(8).map(_chip).toList(),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: _save,
                      child: const Text(
                        'Simpan Pemeriksaan',
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

class _NumberInputCard extends StatelessWidget {
  const _NumberInputCard({
    required this.label,
    required this.controller,
    required this.suffix,
  });

  final String label;
  final TextEditingController controller;
  final String suffix;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F7F4),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFF4DBFA3),
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              decoration: InputDecoration(
                hintText: suffix,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SelectButton extends StatelessWidget {
  const _SelectButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5EAE7)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: const Color(0xFF4DBFA3)),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
