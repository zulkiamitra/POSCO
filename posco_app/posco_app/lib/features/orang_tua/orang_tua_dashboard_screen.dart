import 'package:flutter/material.dart';
import 'package:posco_app/features/orang_tua/notification_screen.dart';
import 'package:posco_app/features/orang_tua/child_data_screen.dart';
import 'package:posco_app/features/orang_tua/jadwal_screen.dart';
import 'package:posco_app/features/orang_tua/riwayat_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_profile_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/api_client.dart';

class OrangTuaDashboardScreen extends StatefulWidget {
  const OrangTuaDashboardScreen({super.key});

  @override
  State<OrangTuaDashboardScreen> createState() => _OrangTuaDashboardScreenState();
}

class _OrangTuaDashboardScreenState extends State<OrangTuaDashboardScreen> {
  bool _isLoading = true;
  List<dynamic> _children = [];
  Map<String, dynamic>? _nextSchedule;
  String? _errorMessage;

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
      final sessions = await ApiClient.instance.fetchSessions();
      
      // Find the next upcoming session (date >= today)
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      
      Map<String, dynamic>? nextSess;
      DateTime? nextSessDate;
      
      for (final sess in sessions) {
        if (sess['date'] != null) {
          try {
            final sDate = DateTime.parse(sess['date']);
            final sDay = DateTime(sDate.year, sDate.month, sDate.day);
            if (!sDay.isBefore(today)) {
              if (nextSessDate == null || sDay.isBefore(nextSessDate)) {
                nextSessDate = sDay;
                nextSess = sess;
              }
            }
          } catch (_) {}
        }
      }
      
      if (!mounted) return;
      setState(() {
        _children = children;
        _nextSchedule = nextSess;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal memuat data: $e';
        _isLoading = false;
      });
    }
  }

  void _showQuickMessage(BuildContext context, String label) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('$label diklik')));
  }

  String _formatLongDate(DateTime date) {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayNames = [
      'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
    ];

    final dayName = dayNames[date.weekday - 1];
    final monthName = monthNames[date.month - 1];
    return '$dayName, ${date.day} $monthName ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);

    final currentUser = ApiClient.instance.currentUser;
    final parentName = currentUser?['name'] ?? 'Orang Tua';
    final posyanduName = currentUser?['wilayah'] ?? 'Posyandu';
    
    String nextScheduleDateLabel = 'Belum ada jadwal posyandu mendatang';
    String nextScheduleTime = '-';
    
    if (_nextSchedule != null && _nextSchedule!['date'] != null) {
      try {
        final date = DateTime.parse(_nextSchedule!['date']);
        nextScheduleDateLabel = _formatLongDate(date);
        nextScheduleTime = _nextSchedule!['timeRange'] ?? '08:00 - 11:00';
      } catch (_) {}
    }

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
                Material(
                  color: Colors.transparent,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 16,
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
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'HALO, ${parentName.toUpperCase()}',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: primaryColor,
                                  letterSpacing: 0.6,
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Selamat datang di POSCO',
                                style: TextStyle(
                                  color: Color(0xFF111827),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(22),
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const OrangTuaNotificationScreen(),
                                ),
                              );
                            },
                            child: Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: primaryColor.withOpacity(0.12),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.notifications_none,
                                color: primaryColor,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 18),

                // Wilayah Posyandu Section
                Material(
                  color: Colors.transparent,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
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
                    child: Row(
                      children: [
                        Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                            color: primaryColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(
                            Icons.location_on,
                            color: primaryColor,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Wilayah Posyandu',
                                style: TextStyle(
                                  color: mutedText,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                posyanduName,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF111827),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 18),

                // Agenda Mendatang Section
                Material(
                  color: Colors.transparent,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 18,
                    ),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4DBFA3), Color(0xFF2D8F6B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 16,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'AGENDA MENDATANG',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          nextScheduleDateLabel,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(Icons.access_time, color: Colors.white),
                            const SizedBox(width: 8),
                            Text(
                              nextScheduleTime,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 22),

                // Data Anak Section
                const Text(
                  'Data Anak',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 12),

                if (_isLoading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 32),
                      child: CircularProgressIndicator(color: primaryColor),
                    ),
                  )
                else if (_errorMessage != null)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600),
                      ),
                    ),
                  )
                else if (_children.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 32),
                      child: Text(
                        'Belum ada data balita terdaftar',
                        style: TextStyle(color: mutedText, fontWeight: FontWeight.w600),
                      ),
                    ),
                  )
                else
                  for (int i = 0; i < _children.length; i++) ...[
                    Builder(
                      builder: (context) {
                        final child = _children[i];
                        
                        DateTime birthDate = DateTime.now();
                        if (child['birthDate'] != null) {
                          try {
                            birthDate = DateTime.parse(child['birthDate']);
                          } catch (_) {}
                        }
                        
                        String statusGizi = child['nutritionStatus'] ?? 'Normal';
                        
                        // Find latest checkup date
                        String lastCheckupDate = 'Belum pernah diperiksa';
                        final history = child['checkupHistory'];
                        if (history != null && history is List && history.isNotEmpty) {
                          final latest = history.first;
                          if (latest is Map) {
                            lastCheckupDate = latest['date'] ?? latest['tanggal'] ?? 'Baru saja';
                          }
                        }
                        
                        return _ChildDataItem(
                          name: child['name'] ?? 'Anak',
                          birthDate: birthDate,
                          status: statusGizi,
                          lastCheckup: lastCheckupDate,
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => OrangTuaChildDataScreen(childData: child),
                              ),
                            );
                          },
                        );
                      },
                    ),
                    if (i < _children.length - 1) const SizedBox(height: 12),
                  ],
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: primaryColor,
        unselectedItemColor: mutedText,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          if (index == 1) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const OrangTuaChildDataScreen(),
              ),
            );
            return;
          }
          if (index == 2) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const OrangTuaJadwalScreen(),
              ),
            );
            return;
          }
          if (index == 3) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const OrangTuaRiwayatScreen(),
              ),
            );
            return;
          }
          if (index == 4) {
            Navigator.of(context).push(
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

// age formatting handled by lib/shared/date_utils.dart

class _ChildDataItem extends StatelessWidget {
  const _ChildDataItem({
    required this.name,
    required this.birthDate,
    required this.status,
    required this.lastCheckup,
    required this.onTap,
  });

  final String name;
  final DateTime birthDate;
  final String status;
  final String lastCheckup;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: primaryColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.person, color: primaryColor),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          formatAge(birthDate),
                          style: const TextStyle(color: Color(0xFF6B7280)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(
                      status,
                      style: const TextStyle(
                        color: primaryColor,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Periksa Terakhir : $lastCheckup',
                  style: const TextStyle(
                    color: Color(0xFF6B7280),
                    fontSize: 12,
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
