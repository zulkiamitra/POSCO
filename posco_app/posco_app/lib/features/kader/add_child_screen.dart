import 'package:flutter/material.dart';

class AddChildScreen extends StatefulWidget {
  const AddChildScreen({super.key, this.initialData});

  final Map<String, dynamic>? initialData;

  @override
  State<AddChildScreen> createState() => _AddChildScreenState();
}

class _AddChildScreenState extends State<AddChildScreen> {
  final primaryColor = const Color(0xFF4DBFA3);
  final backgroundColor = Colors.white;
  final fieldFillColor = const Color(0xFFF1F7F3);

  final _parentNameController = TextEditingController();
  final _childNameController = TextEditingController();
  final _placeController = TextEditingController();
  final _nikController = TextEditingController();
  String? _gender;
  DateTime? _birthDate;
  String _status = 'Normal';

  @override
  void dispose() {
    _parentNameController.dispose();
    _childNameController.dispose();
    _placeController.dispose();
    _nikController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    final init = widget.initialData;
    if (init != null) {
      _parentNameController.text = (init['parentName'] as String?) ?? '';
      _childNameController.text = (init['name'] as String?) ?? '';
      _placeController.text = (init['place'] as String?) ?? '';
      _nikController.text = (init['nik'] as String?) ?? '';
      _gender = (init['gender'] as String?) ?? _gender;
      _birthDate = (init['birthDate'] as DateTime?) ?? _birthDate;
      _status = _normalizeStatus(init['status'] as String?);
    }
  }

  Future<void> _pickBirthDate() async {
    final now = DateTime.now();
    final initial = _birthDate ?? DateTime(now.year - 1, now.month, now.day);
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2000),
      lastDate: now,
      locale: const Locale('id', 'ID'),
    );
    if (picked != null) {
      setState(() => _birthDate = picked);
    }
  }

  void _save() {
    final parent = _parentNameController.text.trim();
    final child = _childNameController.text.trim();
    final place = _placeController.text.trim();
    final nik = _nikController.text.trim();

    // Simple required-field validation
    if (parent.isEmpty ||
        child.isEmpty ||
        place.isEmpty ||
        _birthDate == null ||
        _gender == null ||
        nik.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lengkapi semua field terlebih dahulu')),
      );
      return;
    }

    // NIK must be exactly 16 digits
    if (!RegExp(r'^\d{16}$').hasMatch(nik)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('NIK harus terdiri dari 16 digit angka')),
      );
      return;
    }

    // Validate that NIK encodes birth date and gender (positions 7-12 -> ddmmyy)
    try {
      final nikDatePart = nik.substring(6, 12); // ddmmyy
      var day = int.parse(nikDatePart.substring(0, 2));
      final month = int.parse(nikDatePart.substring(2, 4));
      final year2 = int.parse(nikDatePart.substring(4, 6));

      if (day > 40) {
        day -= 40;
      }

      final now = DateTime.now();
      final currentTwoDigits = now.year % 100;
      final century = (year2 <= currentTwoDigits) ? 2000 : 1900;
      final fullYear = century + year2;

      final nikBirth = DateTime(fullYear, month, day);

      // Compare with picked birth date
      if (_birthDate == null ||
          nikBirth.year != _birthDate!.year ||
          nikBirth.month != _birthDate!.month ||
          nikBirth.day != _birthDate!.day) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('NIK tidak sesuai dengan tanggal lahir'),
          ),
        );
        return;
      }

    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Format NIK tidak valid')));
      return;
    }

    final result = {
      'parentName': parent,
      'name': child,
      'place': place,
      'birthDate': _birthDate,
      'gender': _gender,
      'nik': nik,
      'status': _status,
    };

    // If editing existing child (initialData provided), ask confirmation
    if (widget.initialData != null) {
      showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Konfirmasi Simpan'),
          content: Text('Simpan perubahan data untuk "$child"?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Batal'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Simpan'),
            ),
          ],
        ),
      ).then((confirmed) {
        if (confirmed == true) Navigator.of(context).pop(result);
      });
      return;
    }

    Navigator.of(context).pop(result);
  }

  String _normalizeStatus(String? value) {
    switch (value?.toLowerCase()) {
      case 'berisiko':
      case 'beresiko':
        return 'Beresiko';
      case 'stunting':
        return 'Stunting';
      default:
        return 'Normal';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Tambah Anak',
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
                'Nama Orang Tua',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _parentNameController,
                hintText: 'Masukkan Nama Orang Tua',
                fillColor: fieldFillColor,
              ),
              const SizedBox(height: 16),
              const Text(
                'Nama Anak',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _childNameController,
                hintText: 'Masukkan Nama Anak',
                fillColor: fieldFillColor,
              ),
              const SizedBox(height: 16),
              const Text(
                'Tempat Lahir',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _placeController,
                hintText: 'Masukkan Tempat Lahir',
                fillColor: fieldFillColor,
              ),
              const SizedBox(height: 16),
              const Text(
                'Tanggal Lahir',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: _pickBirthDate,
                child: AbsorbPointer(
                  child: TextField(
                    controller: TextEditingController(
                      text: _birthDate != null
                          ? '${_birthDate!.day}/${_birthDate!.month}/${_birthDate!.year}'
                          : '',
                    ),
                    decoration: InputDecoration(
                      hintText: 'Pilih Tanggal Lahir',
                      filled: true,
                      fillColor: fieldFillColor,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: const Icon(Icons.calendar_today),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Jenis Kelamin',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: fieldFillColor,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: BorderSide.none,
                  ),
                ),
                icon: const Icon(Icons.keyboard_arrow_down),
                hint: const Text('Pilih Jenis Kelamin'),
                items: const [
                  DropdownMenuItem(
                    value: 'Laki-laki',
                    child: Text('Laki-laki'),
                  ),
                  DropdownMenuItem(
                    value: 'Perempuan',
                    child: Text('Perempuan'),
                  ),
                ],
                onChanged: (value) => setState(() => _gender = value),
              ),
              const SizedBox(height: 16),
              const Text(
                'Status Anak',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _status,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: fieldFillColor,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: BorderSide.none,
                  ),
                ),
                icon: const Icon(Icons.keyboard_arrow_down),
                items: const [
                  DropdownMenuItem(value: 'Normal', child: Text('Normal')),
                  DropdownMenuItem(value: 'Beresiko', child: Text('Beresiko')),
                  DropdownMenuItem(value: 'Stunting', child: Text('Stunting')),
                ],
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _status = _normalizeStatus(value));
                  }
                },
              ),
              const SizedBox(height: 16),
              const Text(
                'Nomor Induk Kependudukan',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              _InputField(
                controller: _nikController,
                hintText: 'Masukkan NIK Anak',
                fillColor: fieldFillColor,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 26),
              SizedBox(
                height: 52,
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
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
}

class _InputField extends StatelessWidget {
  const _InputField({
    required this.hintText,
    required this.fillColor,
    this.keyboardType,
    this.controller,
  });

  final String hintText;
  final Color fillColor;
  final TextInputType? keyboardType;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
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
