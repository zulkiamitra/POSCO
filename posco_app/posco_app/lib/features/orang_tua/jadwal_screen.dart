import 'package:flutter/material.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/features/orang_tua/child_data_screen.dart';
import 'package:posco_app/features/orang_tua/riwayat_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_profile_screen.dart';
import 'package:posco_app/shared/api_client.dart';

// Helper function untuk menemukan Selasa di tanggal belasan (10-19)
DateTime? _findTuesdayInTeens(int year, int month) {
  for (int day = 10; day <= 19; day++) {
    try {
      final date = DateTime(year, month, day);
      // weekday: 1=Monday, 2=Tuesday, 3=Wednesday, ..., 7=Sunday
      if (date.weekday == 2) {
        return date;
      }
    } catch (e) {
      // Tanggal tidak valid (misalnya Feb 31)
    }
  }
  return null;
}

// Helper function untuk generate jadwal posyandu berdasarkan tanggal saat ini.
// Posyandu dilakukan 1x sebulan setiap Selasa di tanggal belasan.
List<_JadwalItemData> _generatePosyanduSchedules() {
  final now = DateTime.now();
  final schedules = <_JadwalItemData>[];

  int visitCount = 0;

  // Generate jadwal dari Januari 2026 sampai Mei 2026 (sesuai asumsi aplikasi mulai 2026).
  var currentYear = 2026;
  var currentMonth = 1; // Januari

  while (currentYear < 2026 || (currentYear == 2026 && currentMonth <= 5)) {
    final tuesdayDate = _findTuesdayInTeens(currentYear, currentMonth);

    if (tuesdayDate != null) {
      visitCount++;
      schedules.add(
        _JadwalItemData(
          dateTime: tuesdayDate,
          activity: 'Posyandu Rutin - Kunjungan ke-$visitCount',
          location: 'Posyandu Melati - Kec. Padang Timur',
          time: '08:00 - 11:00 WIB',
          type: 'checkup',
        ),
      );
    }

    // Move to next month
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return schedules;
}

// Public wrapper so other screens can reuse the generated jadwal.
List<_JadwalItemData> generatePosyanduSchedules() =>
    _generatePosyanduSchedules();

class OrangTuaJadwalScreen extends StatefulWidget {
  const OrangTuaJadwalScreen({super.key});

  @override
  State<OrangTuaJadwalScreen> createState() => _OrangTuaJadwalScreenState();
}

class _OrangTuaJadwalScreenState extends State<OrangTuaJadwalScreen> {
  JadwalFilter _activeFilter = JadwalFilter.all;
  bool _isLoading = true;
  String? _errorMessage;
  List<_JadwalItemData> _schedules = [];
  List<_JadwalItemData> _filteredSchedules = [];

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Minggu Ini':
        return const Color(0xFF10B981);
      case 'Minggu Depan':
        return const Color(0xFF2F6BFF);
      case 'Dijadwalkan':
        return const Color(0xFFF59E0B);
      case 'Selesai':
        return const Color(0xFF6B7280);
      case 'Dikonfirmasi':
        return const Color(0xFF10B981);
      case 'Menunggu Konfirmasi':
        return const Color(0xFFF59E0B);
      default:
        return Colors.grey;
    }
  }

  void _showJadwalDetail(BuildContext context, _JadwalItemData item) {
    const primaryColor = Color(0xFF4DBFA3);

    final List<String> days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    final List<String> months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    final dayName = days[item.dateTime.weekday - 1];
    final monthName = months[item.dateTime.month - 1];
    final formattedDate = '$dayName, ${item.dateTime.day} $monthName ${item.dateTime.year}';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 48,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: primaryColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(
                      Icons.event_available_rounded,
                      color: primaryColor,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.activity,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Detail Agenda Posyandu',
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[500],
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Divider(),
              const SizedBox(height: 12),
              
              // Date
              _buildDetailRow(
                icon: Icons.calendar_today_rounded,
                label: 'Tanggal',
                value: formattedDate,
              ),
              const SizedBox(height: 16),
              
              // Time
              _buildDetailRow(
                icon: Icons.access_time_rounded,
                label: 'Waktu',
                value: item.time,
              ),
              const SizedBox(height: 16),
              
              // Location
              _buildDetailRow(
                icon: Icons.location_on_rounded,
                label: 'Tempat',
                value: item.location,
              ),
              const SizedBox(height: 16),

              // Kader
              _buildDetailRow(
                icon: Icons.person_rounded,
                label: 'Petugas / Kader',
                value: item.kaderName ?? 'Siti Rahayu (Kader)',
              ),
              const SizedBox(height: 16),

              // Status
              Row(
                children: [
                  Icon(
                    Icons.info_outline_rounded,
                    size: 20,
                    color: primaryColor.withOpacity(0.7),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Status:',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _getStatusColor(item.status).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: _getStatusColor(item.status).withOpacity(0.25),
                        width: 0.8,
                      ),
                    ),
                    child: Text(
                      item.status,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: _getStatusColor(item.status),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Tutup',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          size: 20,
          color: const Color(0xFF4DBFA3).withOpacity(0.7),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF6B7280),
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
          ),
        ),
      ],
    );
  }

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
      final sessions = await ApiClient.instance.fetchSessions();
      final parsed = <_JadwalItemData>[];
      for (final sess in sessions) {
        if (sess['date'] != null) {
          try {
            final date = DateTime.parse(sess['date']);
            final posyanduName = sess['posyandu']?['name'] ?? 'Posyandu';
            parsed.add(
              _JadwalItemData(
                dateTime: date,
                activity: sess['name'] ?? 'Posyandu Rutin',
                location: posyanduName,
                time: sess['timeRange'] ?? '08:00 - 11:00 WIB',
                status: sess['status'],
                type: 'checkup',
                kaderName: sess['kaderName'],
              ),
            );
          } catch (_) {}
        }
      }
      
      // Sort schedules chronologically (oldest to newest)
      parsed.sort((a, b) => a.dateTime.compareTo(b.dateTime));

      if (!mounted) return;
      setState(() {
        _schedules = parsed;
        _isLoading = false;
        _updateFilteredSchedules();
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal memuat jadwal: $e';
        _isLoading = false;
      });
    }
  }

  void _updateFilteredSchedules() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    _filteredSchedules = _schedules.where((item) {
      final date = DateTime(
        item.dateTime.year,
        item.dateTime.month,
        item.dateTime.day,
      );
      switch (_activeFilter) {
        case JadwalFilter.upcoming:
          return date.isAfter(today) || date.isAtSameMomentAs(today);
        case JadwalFilter.done:
          return date.isBefore(today);
        case JadwalFilter.all:
        default:
          return true;
      }
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const secondaryColor = Color(0xFF2D8F6B);
    const darkText = Color(0xFF111827);
    const mutedText = Color(0xFF6B7280);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: RefreshIndicator(
        onRefresh: _loadData,
        color: primaryColor,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Modern Gradient Header
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
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'JADWAL PEMERIKSAAN',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.white70,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Jadwal Kegiatan Posyandu',
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Kelola dan pantau jadwal pemeriksaan anak Anda',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Colors.white.withOpacity(0.85),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Content Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Filter Chips - Modern Style
                    const Text(
                      'FILTER JADWAL',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: primaryColor,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _FilterChip(
                            label: 'Semua',
                            isActive: _activeFilter == JadwalFilter.all,
                            onTap: () {
                              setState(() {
                                _activeFilter = JadwalFilter.all;
                                _updateFilteredSchedules();
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _FilterChip(
                            label: 'Mendatang',
                            isActive: _activeFilter == JadwalFilter.upcoming,
                            onTap: () {
                              setState(() {
                                _activeFilter = JadwalFilter.upcoming;
                                _updateFilteredSchedules();
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _FilterChip(
                            label: 'Selesai',
                            isActive: _activeFilter == JadwalFilter.done,
                            onTap: () {
                              setState(() {
                                _activeFilter = JadwalFilter.done;
                                _updateFilteredSchedules();
                              });
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 22),

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
                    else ...[
                      // Schedules List Header
                      if (_filteredSchedules.isNotEmpty)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${_filteredSchedules.length} Jadwal',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: primaryColor,
                                letterSpacing: 0.8,
                              ),
                            ),
                            const SizedBox(height: 14),
                          ],
                        ),

                      // Schedules List
                      if (_filteredSchedules.isEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 32),
                          child: Center(
                            child: Column(
                              children: [
                                Icon(
                                  Icons.event_busy,
                                  size: 56,
                                  color: primaryColor.withOpacity(0.3),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Belum ada jadwal',
                                  style: TextStyle(
                                    color: mutedText,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      else
                        for (final item in _filteredSchedules) ...[
                          _JadwalCard(
                            data: item,
                            onTap: () => _showJadwalDetail(context, item),
                          ),
                          const SizedBox(height: 14),
                        ],
                    ],
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
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
          if (index == 3) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaRiwayatScreen(),
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
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Riwayat'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({required this.label, this.isActive = false, this.onTap});

  final String label;
  final bool isActive;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Color(0xFFF6F8F6);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 11),
          decoration: BoxDecoration(
            color: isActive ? backgroundColor : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isActive
                  ? primaryColor.withOpacity(0.3)
                  : Colors.grey.withOpacity(0.15),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isActive ? primaryColor : const Color(0xFF6B7280),
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _JadwalCard extends StatelessWidget {
  const _JadwalCard({required this.data, required this.onTap});

  final _JadwalItemData data;
  final VoidCallback onTap;

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Minggu Ini':
        return const Color(0xFF10B981); // Hijau - upcoming this week
      case 'Minggu Depan':
        return const Color(0xFF2F6BFF); // Biru - next week
      case 'Dijadwalkan':
        return const Color(0xFFF59E0B); // Oranye - scheduled
      case 'Selesai':
        return const Color(0xFF6B7280); // Abu-abu - done
      case 'Dikonfirmasi':
        return const Color(0xFF10B981); // Hijau - confirmed
      case 'Menunggu Konfirmasi':
        return const Color(0xFFF59E0B); // Oranye - waiting confirmation
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: primaryColor.withOpacity(0.1),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              // Date Box - Modern Style
              Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [primaryColor, Color(0xFF2D8F6B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(14),
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
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          data.monthLabel,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),

              // Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Activity title
                    Text(
                      data.activity,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                        letterSpacing: -0.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),

                    // Location
                    Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          size: 14,
                          color: primaryColor.withOpacity(0.7),
                        ),
                        const SizedBox(width: 5),
                        Expanded(
                          child: Text(
                            data.location,
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Time and Status
                    Row(
                      children: [
                        Icon(
                          Icons.access_time,
                          size: 14,
                          color: primaryColor.withOpacity(0.7),
                        ),
                        const SizedBox(width: 5),
                        Expanded(
                          child: Text(
                            data.time,
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: _getStatusColor(
                              data.status,
                            ).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: _getStatusColor(
                                data.status,
                              ).withOpacity(0.25),
                              width: 0.8,
                            ),
                          ),
                          child: Text(
                            data.status,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: _getStatusColor(data.status),
                              letterSpacing: 0.1,
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
    );
  }
}

class _JadwalItemData {
  _JadwalItemData({
    required this.dateTime,
    required this.activity,
    required this.location,
    required this.time,
    String? status,
    required this.type,
    this.kaderName,
  }) : _statusOverride = status;

  final DateTime dateTime;
  final String activity;
  final String location;
  final String time;
  final String? _statusOverride;
  final String type;
  final String? kaderName;

  String get dayLabel => dateTime.day.toString().padLeft(2, '0');

  String get monthLabel => _monthLabels[dateTime.month - 1];

  String get status {
    // Jika status di-override (hardcoded), gunakan itu
    if (_statusOverride != null) {
      return _statusOverride;
    }

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final eventDate = DateTime(dateTime.year, dateTime.month, dateTime.day);

    // Jika event sudah lewat
    if (eventDate.isBefore(today)) {
      return 'Selesai';
    }

    // Hitung minggu ini dan minggu depan
    final startOfWeek = today.subtract(Duration(days: today.weekday - 1));
    final endOfWeek = startOfWeek.add(const Duration(days: 7));
    final startOfNextWeek = endOfWeek;
    final endOfNextWeek = startOfNextWeek.add(const Duration(days: 7));

    // Jika event minggu ini
    if ((eventDate.isAtSameMomentAs(startOfWeek) ||
            eventDate.isAfter(startOfWeek)) &&
        eventDate.isBefore(endOfWeek)) {
      return 'Minggu Ini';
    }

    // Jika event minggu depan
    if ((eventDate.isAtSameMomentAs(startOfNextWeek) ||
            eventDate.isAfter(startOfNextWeek)) &&
        eventDate.isBefore(endOfNextWeek)) {
      return 'Minggu Depan';
    }

    // Jika event lebih dari 2 minggu ke depan
    return 'Dijadwalkan';
  }

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

enum JadwalFilter { all, upcoming, done }
