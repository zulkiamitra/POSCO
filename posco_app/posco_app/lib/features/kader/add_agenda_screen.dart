import 'package:flutter/material.dart';
import 'package:posco_app/shared/api_client.dart';

class AddAgendaScreen extends StatefulWidget {
  const AddAgendaScreen({super.key});

  @override
  State<AddAgendaScreen> createState() => _AddAgendaScreenState();
}

class _AddAgendaScreenState extends State<AddAgendaScreen> {
  final _nameController = TextEditingController();
  final _noteController = TextEditingController();
  final _participantsController = TextEditingController();
  bool _isSaving = false;

  final List<String> _locationOptions = const [
    'Posyandu Melati',
    'Posyandu Kenanga',
    'Posyandu Mawar',
    'Puskesmas Padang Utara',
  ];

  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  String? _selectedLocation;
  final int _participants = 0;

  @override
  void initState() {
    super.initState();
    _selectedLocation = _locationOptions.first;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _noteController.dispose();
    _participantsController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? now,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 2),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime ?? TimeOfDay.now(),
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
      setState(() => _selectedTime = picked);
    }
  }

  Future<void> _save() async {
    if (_nameController.text.trim().isEmpty || _selectedDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama kegiatan dan tanggal wajib diisi')),
      );
      return;
    }

    final dateText =
        '${_selectedDate!.day.toString().padLeft(2, '0')} '
        '${_monthName(_selectedDate!.month)} '
        '${_selectedDate!.year}';
    final timeText = _selectedTime == null
        ? '-'
        : _formatTime12(_selectedTime!);

    final participants = int.tryParse(_participantsController.text.trim()) ?? 0;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text('Konfirmasi'),
          content: Text(
            'Anda yakin menambahkan agenda ini?\n\n'
            'Kegiatan: ${_nameController.text.trim()}\n'
            'Lokasi: $_selectedLocation\n'
            'Tanggal: $dateText\n'
            'Waktu: $timeText\n'
            'Peserta: $participants orang',
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

    if (confirmed != true) {
      return;
    }

    setState(() => _isSaving = true);

    try {
      final timeRange = _selectedTime == null
          ? '08:00 - 11:00 WIB'
          : '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')} - 12:00';

      final sessionData = {
        'date': _selectedDate!.toIso8601String(),
        'timeRange': timeRange,
        'attendanceCount': participants,
        'status': 'Mendatang',
        'kaderName': ApiClient.instance.currentUser?['name'] ?? 'Kader',
        'name': _nameController.text.trim(),
      };

      final res = await ApiClient.instance.createSession(sessionData);

      if (!mounted) return;
      setState(() => _isSaving = false);

      if (res['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Agenda berhasil ditambahkan')),
        );
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(res['message'] ?? 'Gagal menambahkan agenda')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menyimpan agenda: $e')),
      );
    }
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

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Colors.white;
    const fieldFillColor = Color(0xFFF1F7F3);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
        ),
        title: const Text(
          'Tambah Agenda',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Nama Kegiatan',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _nameController,
                hintText: 'Masukkan Nama Kegiatan',
                fillColor: fieldFillColor,
              ),
              const SizedBox(height: 16),
              const Text(
                'Lokasi',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedLocation,
                items: _locationOptions
                    .map(
                      (location) => DropdownMenuItem(
                        value: location,
                        child: Text(location),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() => _selectedLocation = value);
                },
                decoration: _inputDecoration(
                  hintText: 'Pilih Lokasi Posyandu',
                  fillColor: fieldFillColor,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Tanggal',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _PickerField(
                hintText: _selectedDate == null
                    ? 'Contoh: 20 Apr 2026'
                    : '${_selectedDate!.day.toString().padLeft(2, '0')} ${_monthName(_selectedDate!.month)} ${_selectedDate!.year}',
                fillColor: fieldFillColor,
                icon: Icons.calendar_month,
                onTap: _pickDate,
              ),
              const SizedBox(height: 16),
              const Text(
                'Waktu',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _PickerField(
                hintText: _selectedTime == null
                    ? 'Contoh: 08.00 - 12.00'
                    : _formatTime12(_selectedTime!),
                fillColor: fieldFillColor,
                icon: Icons.access_time,
                onTap: _pickTime,
              ),
              const SizedBox(height: 16),
              const Text(
                'Jumlah Peserta',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _participantsController,
                hintText: 'Masukkan Jumlah Peserta',
                fillColor: fieldFillColor,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              const Text(
                'Keterangan',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _noteController,
                hintText: 'Catatan tambahan (opsional)',
                fillColor: fieldFillColor,
                maxLines: 3,
              ),
              const SizedBox(height: 26),
              SizedBox(
                height: 52,
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : const Text(
                          'Simpan',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hintText,
    required Color fillColor,
  }) {
    return InputDecoration(
      hintText: hintText,
      filled: true,
      fillColor: fillColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide.none,
      ),
    );
  }
}

class _InputField extends StatelessWidget {
  const _InputField({
    required this.controller,
    required this.hintText,
    required this.fillColor,
    this.keyboardType,
    this.maxLines = 1,
  });

  final TextEditingController controller;
  final String hintText;
  final Color fillColor;
  final TextInputType? keyboardType;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: fillColor,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}

class _PickerField extends StatelessWidget {
  const _PickerField({
    required this.hintText,
    required this.fillColor,
    required this.icon,
    required this.onTap,
  });

  final String hintText;
  final Color fillColor;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: fillColor,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF4DBFA3)),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                hintText,
                style: const TextStyle(
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
