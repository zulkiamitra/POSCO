import 'package:flutter/material.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/features/orang_tua/child_data_screen.dart';
import 'package:posco_app/features/orang_tua/jadwal_screen.dart';
import 'package:posco_app/features/orang_tua/riwayat_detail_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_profile_screen.dart';
import 'package:posco_app/shared/api_client.dart';
import 'package:posco_app/shared/date_utils.dart';

class OrangTuaRiwayatScreen extends StatefulWidget {
  const OrangTuaRiwayatScreen({super.key});

  @override
  State<OrangTuaRiwayatScreen> createState() => _OrangTuaRiwayatScreenState();
}

class _OrangTuaRiwayatScreenState extends State<OrangTuaRiwayatScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  List<_RiwayatItemData> _riwayats = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final children = await ApiClient.instance.fetchChildren();
      final allRiwayats = <_RiwayatItemData>[];

      for (final child in children) {
        final childName = child['name'] ?? 'Anak';
        final history = child['checkupHistory'];
        if (history is List) {
          for (final checkup in history) {
            final dateStr = checkup['date'] ?? checkup['tanggal'] ?? '';
            final parsedDate = parseFlexibleDate(dateStr) ?? DateTime(1970);
            
            final weight = checkup['weight'] ?? checkup['bb'] ?? '-';
            final height = checkup['height'] ?? checkup['tb'] ?? '-';
            final arm = checkup['arm'] ?? checkup['lingkarLengan'] ?? '-';
            final head = checkup['headCircumference'] ?? checkup['lingkarKepala'];
            final status = checkup['status'] ?? checkup['statusGizi'] ?? child['nutritionStatus'] ?? 'Normal';
            final note = checkup['note'] ?? checkup['catatan'] ?? '-';
            
            final servicesRaw = checkup['services'] ?? checkup['layanan'];
            List<String> services = [];
            if (servicesRaw is List) {
              services = servicesRaw.map((s) => s.toString()).toList();
            }

            allRiwayats.add(
              _RiwayatItemData(
                childName: childName,
                dateTime: parsedDate,
                date: dateStr.isNotEmpty ? dateStr : 'Tidak ada tanggal',
                location: checkup['location'] ?? 'Posyandu Melati - Kec. Padang Timur',
                status: status,
                weight: weight.toString(),
                height: height.toString(),
                arm: arm.toString(),
                head: head?.toString(),
                note: note.toString(),
                services: services,
              ),
            );
          }
        }
      }

      // Sort by date descending (latest first)
      allRiwayats.sort((a, b) => b.dateTime.compareTo(a.dateTime));

      if (!mounted) return;
      setState(() {
        _riwayats = allRiwayats;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal memuat riwayat: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          color: primaryColor,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 18,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.06),
                        blurRadius: 14,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'RIWAYAT PEMERIKSAAN',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: primaryColor,
                          letterSpacing: 0.6,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Riwayat Pemeriksaan Anak',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF111827),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Riwayat List
                if (_isLoading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 64),
                      child: CircularProgressIndicator(color: primaryColor),
                    ),
                  )
                else if (_errorMessage != null)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 64),
                      child: Column(
                        children: [
                          Text(
                            _errorMessage!,
                            style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: _loadData,
                            style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
                            child: const Text('Coba Lagi'),
                          ),
                        ],
                      ),
                    ),
                  )
                else if (_riwayats.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 64),
                    child: Center(
                      child: Text(
                        'Belum ada riwayat pemeriksaan',
                        style: TextStyle(
                          color: Color(0xFF6B7280),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  )
                else
                  for (final item in _riwayats) ...[
                    _RiwayatCard(
                      data: item,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => OrangTuaRiwayatDetailScreen(
                              date: item.date,
                              location: item.location,
                              status: item.status,
                              weight: item.weight,
                              height: item.height,
                              arm: item.arm,
                              head: item.head,
                              note: item.note,
                              services: item.services,
                              childName: item.childName,
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 3,
        selectedItemColor: primaryColor,
        unselectedItemColor: mutedText,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          if (index == 0) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaDashboardScreen(),
              ),
            );
            return;
          }
          if (index == 1) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaChildDataScreen(),
              ),
            );
            return;
          }
          if (index == 2) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaJadwalScreen(),
              ),
            );
            return;
          }
          if (index == 4) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaProfileScreen(),
              ),
            );
            return;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: 'Beranda',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Data Anak'),
          BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Jadwal'),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: 'Riwayat',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}

class _RiwayatCard extends StatelessWidget {
  const _RiwayatCard({required this.data, required this.onTap});

  final _RiwayatItemData data;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 12,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            children: [
              // Date Box
              Container(
                width: 80,
                height: 72,
                padding: const EdgeInsets.symmetric(vertical: 6),
                decoration: BoxDecoration(
                  color: primaryColor,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          data.dayLabel,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          data.monthLabel,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Activity title
                    Text(
                      '${data.childName} - ${data.date}',
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),

                    // Status gizi
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _statusColor(
                              data.status ?? 'Normal',
                            ).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            data.status ?? 'Normal',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: _statusColor(data.status ?? 'Normal'),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.location_on,
                          size: 14,
                          color: const Color(0xFF4DBFA3).withOpacity(0.7),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            data.location,
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Arrow icon
              const Icon(
                Icons.chevron_right,
                color: Color(0xFFD1D5DB),
                size: 28,
              ),
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
      return const Color(0xFFF59E0B);
    case 'stunting':
      return const Color(0xFFEF4444);
    default:
      return const Color(0xFF16A34A);
  }
}

class _RiwayatItemData {
  const _RiwayatItemData({
    required this.childName,
    required this.dateTime,
    required this.date,
    required this.location,
    this.status,
    this.weight,
    this.height,
    this.arm,
    this.head,
    this.note,
    this.services,
  });

  final String childName;
  final DateTime dateTime;
  final String date;
  final String location;
  final String? status;
  final String? weight;
  final String? height;
  final String? arm;
  final String? head;
  final String? note;
  final List<String>? services;

  String get dayLabel => dateTime.day.toString().padLeft(2, '0');

  String get monthLabel => _monthLabels[dateTime.month - 1];

  static const List<String> _monthLabels = [
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
}
