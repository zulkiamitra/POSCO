import 'package:flutter/material.dart';
import 'package:posco_app/features/kader/checkup_detail_screen.dart';
import 'package:posco_app/features/kader/add_child_screen.dart';
import 'package:posco_app/features/kader/input_checkup_form_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class ChildDetailScreen extends StatefulWidget {
  const ChildDetailScreen({
    super.key,
    required this.name,
    required this.birthDate,
    required this.gender,
    required this.status,
    this.id,
  });

  final String name;
  final DateTime birthDate;
  final String gender;
  final String status;
  final String? id;

  @override
  State<ChildDetailScreen> createState() => _ChildDetailScreenState();
}

class _ChildDetailScreenState extends State<ChildDetailScreen> {
  final NutritionStatsRepository _statsRepository =
      NutritionStatsRepository.instance;

  late String _name;
  late DateTime _birthDate;
  late String _gender;
  late String _status;

  late String _nik;
  late String _birthPlaceDate;
  late String _parentName;
  late String _address;
  late List<_CheckupRecord> _checkups;

  @override
  void initState() {
    super.initState();
    _loadChildData();
  }

  void _loadChildData() {
    _name = widget.name;
    _birthDate = widget.birthDate;
    _gender = widget.gender;
    _status = widget.status;

    final record = _statsRepository.children.firstWhere(
      (c) => widget.id != null ? c.id == widget.id : c.name == widget.name,
      orElse: () => NutritionChildRecord(
        name: widget.name,
        parentName: '',
        birthDate: widget.birthDate,
        gender: widget.gender,
        status: widget.status,
        createdAt: DateTime.now(),
      ),
    );

    if (record.id != null) {
      _name = record.name;
      _birthDate = record.birthDate;
      _gender = record.gender;
      _status = record.status;
      _parentName = record.parentName;
    } else {
      _parentName = '';
    }

    _nik = record.rawData?['nik']?.toString() ?? '1371060101010000';
    _birthPlaceDate = record.rawData?['birthPlace']?.toString() ?? 'Padang';
    _address = record.rawData?['address']?.toString() ?? 'Kel. Air Tawar, Kec. Padang Utara, Kota Padang';

    final history = record.rawData?['checkupHistory'];
    _checkups = [];
    if (history != null && history is List) {
      for (final checkup in history) {
        if (checkup is Map) {
          final dateStr = checkup['date'] ?? checkup['tanggal'] ?? '';
          final location = checkup['location'] ?? checkup['tempat'] ?? 'Posyandu Melati - Kec. Padang Timur';
          final status = checkup['status'] ?? checkup['statusGizi'] ?? record.status;
          final weight = checkup['weight'] ?? checkup['bb'] ?? '-';
          final height = checkup['height'] ?? checkup['tb'] ?? '-';
          final arm = checkup['arm'] ?? checkup['lingkarLengan'] ?? '-';
          final head = checkup['headCircumference'] ?? checkup['lingkarKepala'] ?? '-';
          final note = checkup['note'] ?? checkup['catatan'] ?? '';

          final servicesRaw = checkup['services'] ?? checkup['layanan'];
          List<String> services = [];
          if (servicesRaw is List) {
            services = servicesRaw.map((s) => s.toString()).toList();
          }

          _checkups.add(
            _CheckupRecord(
              date: dateStr.toString(),
              location: location.toString(),
              status: status.toString(),
              weight: weight.toString(),
              height: height.toString(),
              arm: arm.toString(),
              head: head.toString(),
              note: note.toString(),
              services: services,
            ),
          );
        }
      }
    } else {
      final profile = _childProfileFor(widget.name);
      if (_parentName.isEmpty) _parentName = profile.parentName;
      _nik = profile.nik;
      _birthPlaceDate = profile.birthPlaceDate;
      _address = profile.address;
      _checkups = List<_CheckupRecord>.from(profile.checkups);
    }
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);

    return ListenableBuilder(
      listenable: _statsRepository,
      builder: (context, _) {
        _loadChildData();

        final items = _checkups
            .map(
              (checkup) => _CheckupItem(
                date: checkup.date,
                location: checkup.location,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => CheckupDetailScreen(
                        date: checkup.date,
                        location: checkup.location,
                        status: checkup.status,
                        weight: checkup.weight,
                        height: checkup.height,
                        arm: checkup.arm,
                        head: checkup.head,
                        note: checkup.note,
                        services: checkup.services,
                      ),
                    ),
                  );
                },
              ),
            )
            .toList();

        return Scaffold(
          backgroundColor: backgroundColor,
      body: Column(
        children: [
          // Header (green)
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF4DBFA3), Color(0xFF2AA37A)],
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(12)),
              boxShadow: [
                BoxShadow(
                  color: Color(0x0F000000),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 12,
                ),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    Text(
                      formatAge(_birthDate),
                      style: const TextStyle(
                        color: Colors.white70,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                ),
              ),
            ),
          ),

          // Body
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Data Anak',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Info card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    _parentName,
                                    style: const TextStyle(
                                      color: Color(0xFF6B7280),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Edit + status
                            Column(
                              children: [
                                IconButton(
                                  onPressed: () async {
                                    final result = await Navigator.of(context)
                                        .push(
                                          MaterialPageRoute(
                                            builder: (c) => AddChildScreen(
                                              initialData: {
                                                'parentName': _parentName,
                                                'name': _name,
                                                'place': _birthPlaceDate,
                                                'birthDate': _birthDate,
                                                'gender': _gender,
                                                'nik': _nik,
                                                'status': _status,
                                              },
                                            ),
                                          ),
                                        );
                                    if (result != null && result is Map) {
                                      final existingRecord = _statsRepository.children.firstWhere(
                                        (c) => widget.id != null ? c.id == widget.id : c.name == _name,
                                        orElse: () => NutritionChildRecord(
                                          name: _name,
                                          parentName: _parentName,
                                          birthDate: _birthDate,
                                          gender: _gender,
                                          status: _status,
                                          createdAt: DateTime.now(),
                                        ),
                                      );

                                      final updatedRecord = existingRecord.copyWith(
                                        name: result['name'] as String? ?? _name,
                                        parentName: result['parentName'] as String? ?? _parentName,
                                        birthDate: result['birthDate'] as DateTime? ?? _birthDate,
                                        gender: result['gender'] as String? ?? _gender,
                                        status: result['status'] as String? ?? _status,
                                        rawData: {
                                          ...existingRecord.rawData ?? {},
                                          'nik': result['nik'] as String? ?? _nik,
                                          'birthPlace': result['place'] as String? ?? _birthPlaceDate,
                                        },
                                      );

                                      final success = await _statsRepository.upsertChild(
                                        updatedRecord,
                                        id: widget.id ?? existingRecord.id,
                                      );

                                      if (success) {
                                        setState(() {
                                          _loadChildData();
                                        });
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text('Data anak diperbarui'),
                                          ),
                                        );
                                      } else {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text('Gagal memperbarui data anak'),
                                          ),
                                        );
                                      }
                                    }
                                  },
                                  icon: const Icon(
                                    Icons.edit,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _statusColor(
                                      _status,
                                    ).withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    _status,
                                    style: TextStyle(
                                      color: _statusColor(_status),
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        const SizedBox(height: 12),
                        // two-column details
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _InfoRow(
                                    label: 'Tempat Lahir',
                                    value: _birthPlaceDate.split(',').first,
                                  ),
                                  const SizedBox(height: 8),
                                  _InfoRow(
                                    label: 'Tanggal Lahir',
                                    value:
                                        '${_birthDate.day}/${_birthDate.month}/${_birthDate.year}',
                                  ),
                                  const SizedBox(height: 8),
                                  _InfoRow(label: 'NIK', value: _nik),
                                ],
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _InfoRow(
                                    label: 'Nama Orang Tua',
                                    value: _parentName,
                                  ),
                                  const SizedBox(height: 8),
                                  _InfoRow(label: 'Alamat', value: _address),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Nutrition status card
                  SizedBox(
                    width: double.infinity,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.06),
                            blurRadius: 12,
                            offset: Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF4DBFA3), Color(0xFF2AA37A)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.show_chart,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Status Gizi',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF6B7280),
                                    letterSpacing: 0.6,
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
                                        color: _statusColor(
                                          _status,
                                        ).withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        _status,
                                        style: TextStyle(
                                          color: _statusColor(_status),
                                          fontWeight: FontWeight.w700,
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
                  ),

                  const SizedBox(height: 16),

                  // Checkup history
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Riwayat Pemeriksaan',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                          ),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () async {
                          final existingRecord = _statsRepository.children.firstWhere(
                            (c) => widget.id != null ? c.id == widget.id : c.name == _name,
                            orElse: () => NutritionChildRecord(
                              name: _name,
                              parentName: _parentName,
                              birthDate: _birthDate,
                              gender: _gender,
                              status: _status,
                              createdAt: DateTime.now(),
                            ),
                          );

                          await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (c) => InputCheckupFormScreen(
                                name: _name,
                                birthDate: _birthDate,
                                gender: _gender,
                                childId: widget.id ?? existingRecord.id,
                                childRecord: existingRecord,
                              ),
                            ),
                          );

                          setState(() {
                            _loadChildData();
                          });
                        },
                        icon: const Icon(Icons.add, size: 18),
                        label: const Text('Tambah'),
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF4DBFA3),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),
                  const Divider(),
                  const SizedBox(height: 12),

                  Column(
                    children: items
                        .map(
                          (i) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: i,
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 6),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Total ${items.length} pemeriksaan',
                      style: const TextStyle(
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
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
      },
    );
  }
}

class _CheckupItem extends StatelessWidget {
  const _CheckupItem({
    required this.date,
    required this.location,
    required this.onTap,
  });

  final String date;
  final String location;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.calendar_month, color: primaryColor),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      date,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      location,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right, color: Color(0xFF9CA3AF)),
            ],
          ),
        ),
      ),
    );
  }
}

Color _statusColor(String value) {
  switch (value.toLowerCase()) {
    case 'berisiko':
    case 'beresiko':
      return const Color(0xFFF59E0B);
    case 'stunting':
      return const Color(0xFFEF4444);
    default:
      return const Color(0xFF16A34A);
  }
}

class _CheckupRecord {
  const _CheckupRecord({
    required this.date,
    required this.location,
    required this.status,
    required this.weight,
    required this.height,
    required this.arm,
    this.head = '-',
    required this.note,
    required this.services,
  });

  final String date;
  final String location;
  final String status;
  final String weight;
  final String height;
  final String arm;
  final String head;
  final String note;
  final List<String> services;
}

class _ChildProfile {
  const _ChildProfile({
    required this.nik,
    required this.birthPlaceDate,
    required this.parentName,
    required this.address,
    required this.checkups,
  });

  final String nik;
  final String birthPlaceDate;
  final String parentName;
  final String address;
  final List<_CheckupRecord> checkups;
}

_ChildProfile _childProfileFor(String name) {
  const address = 'Kel. Air Tawar, Kec. Padang Utara, Kota Padang';
  const location = 'Posyandu Kenanga - Kec. Padang Utara';

  switch (name) {
    case 'Rani':
      return const _ChildProfile(
        nik: '1371061201260001',
        birthPlaceDate: 'Padang, 10 Januari 2026',
        parentName: 'Ibu Lestari',
        address: address,
        checkups: [
          _CheckupRecord(
            date: '10 Februari 2026',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Normal',
            weight: '4.2 kg',
            height: '54 cm',
            arm: '11.8 cm',
            note:
                'Perkembangan baik, berat naik sesuai harapan. Lanjutkan ASI eksklusif.',
            services: ['+ VITAMIN A', '+ IMUNISASI DPT'],
          ),
          _CheckupRecord(
            date: '10 Maret 2026',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Normal',
            weight: '5.0 kg',
            height: '57 cm',
            arm: '12.3 cm',
            note:
                'Tumbuh kembang normal, aktivitas baik. Mulai perkenalkan MPASI halus.',
            services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
          ),
          _CheckupRecord(
            date: '14 April 2026',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Normal',
            weight: '5.5 kg',
            height: '59 cm',
            arm: '12.5 cm',
            note:
                'Aktif dan responsif. MPASI berjalan baik, lanjutkan dengan variasi.',
            services: ['+ VITAMIN A', '+ IMUNISASI BOOSTER'],
          ),
        ],
      );
    case 'Bayu':
      return const _ChildProfile(
        nik: '1371060504250002',
        birthPlaceDate: 'Padang, 05 April 2025',
        parentName: 'Ibu Rika',
        address: address,
        checkups: [
          _CheckupRecord(
            date: '08 April 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Berisiko',
            weight: '4.2 kg',
            height: '55 cm',
            arm: '11.5 cm',
            note:
                'Bayi baru lahir, kondisi perlu dipantau. Lanjutkan ASI eksklusif.',
            services: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K'],
          ),
          _CheckupRecord(
            date: '10 Juni 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Berisiko',
            weight: '5.8 kg',
            height: '62 cm',
            arm: '12.0 cm',
            note: 'MPASI berkembang. Perlu protein hewani lebih banyak.',
            services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
          ),
          _CheckupRecord(
            date: '08 Juli 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Berisiko',
            weight: '6.3 kg',
            height: '64 cm',
            arm: '12.2 cm',
            note: 'Pertumbuhan berlanjut. Pantau kualitas gizi MPASI.',
            services: ['+ VITAMIN A', '+ ZINC'],
          ),
          _CheckupRecord(
            date: '12 Agustus 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Berisiko',
            weight: '6.8 kg',
            height: '66 cm',
            arm: '12.3 cm',
            note: 'Nafsu makan mulai baik. Lanjutkan edukasi gizi.',
            services: ['+ VITAMIN A', '+ IMUNISASI BOOSTER'],
          ),
          _CheckupRecord(
            date: '09 September 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Berisiko',
            weight: '7.2 kg',
            height: '68 cm',
            arm: '12.4 cm',
            note: 'Perlu pemantauan berkelanjutan. Edukasi menu tinggi kalori.',
            services: ['+ VITAMIN A', '+ ZINC'],
          ),
        ],
      );
    case 'Cantika':
      return const _ChildProfile(
        nik: '1371061412240003',
        birthPlaceDate: 'Padang, 14 Desember 2024',
        parentName: 'Ibu Dina',
        address: address,
        checkups: [
          _CheckupRecord(
            date: '17 Desember 2024',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Stunting',
            weight: '4.1 kg',
            height: '50 cm',
            arm: '11.2 cm',
            note:
                'Bayi baru lahir, perlu pendampingan gizi intensif. ASI eksklusif.',
            services: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K'],
          ),
          _CheckupRecord(
            date: '14 Januari 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Stunting',
            weight: '4.8 kg',
            height: '54 cm',
            arm: '11.5 cm',
            note:
                'Pertumbuhan lambat. Perbanyak konten gizi ASI dan pemberian IMD.',
            services: ['+ VITAMIN A', '+ IMUNISASI DPT'],
          ),
          _CheckupRecord(
            date: '11 Februari 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Stunting',
            weight: '5.4 kg',
            height: '57 cm',
            arm: '11.8 cm',
            note:
                'Pertumbuhan masih lambat. Konsultasi menu tinggi protein dilakukan.',
            services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
          ),
          _CheckupRecord(
            date: '11 Maret 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Stunting',
            weight: '6.0 kg',
            height: '59 cm',
            arm: '12.0 cm',
            note:
                'Butuh follow-up rutin. Edukasi pola makan keluarga ditingkatkan.',
            services: ['+ VITAMIN A', '+ ZAT BESI'],
          ),
          _CheckupRecord(
            date: '08 April 2025',
            location: 'Posyandu Melati - Kec. Padang Timur',
            status: 'Stunting',
            weight: '6.5 kg',
            height: '61 cm',
            arm: '12.1 cm',
            note: 'Perkembangan perlahan. Lanjutkan pendampingan intensif.',
            services: ['+ VITAMIN A', '+ ZAT BESI', '+ IMUNISASI'],
          ),
        ],
      );
    default:
      return const _ChildProfile(
        nik: '1371060101010000',
        birthPlaceDate: 'Padang, 01 Januari 2025',
        parentName: 'Ibu Wati',
        address: address,
        checkups: [
          _CheckupRecord(
            date: '10 April 2026',
            location: location,
            status: 'Normal',
            weight: '6.9 kg',
            height: '66 cm',
            arm: '12.0 cm',
            note: 'Tumbuh sesuai usia, lanjutkan pola makan seimbang.',
            services: ['+ VITAMIN A'],
          ),
        ],
      );
  }
}

// age formatting provided by lib/shared/date_utils.dart

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: Color(0xFF6B7280),
            letterSpacing: 0.2,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
          ),
        ),
      ],
    );
  }
}
