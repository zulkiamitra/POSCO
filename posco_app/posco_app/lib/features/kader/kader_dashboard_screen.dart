import 'package:flutter/material.dart';
import 'package:posco_app/features/kader/agenda_screen.dart';
import 'package:posco_app/features/kader/child_detail_screen.dart';
import 'package:posco_app/features/kader/child_data_screen.dart';
import 'package:posco_app/features/kader/input_checkup_screen.dart';
import 'package:posco_app/features/kader/notification_screen.dart';
import 'package:posco_app/features/kader/profile_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/api_client.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class KaderDashboardScreen extends StatefulWidget {
  const KaderDashboardScreen({super.key});

  @override
  State<KaderDashboardScreen> createState() => _KaderDashboardScreenState();
}

class _KaderDashboardScreenState extends State<KaderDashboardScreen> {
  bool _isLoadingAgenda = true;
  Map<String, dynamic>? _nextAgenda;

  @override
  void initState() {
    super.initState();
    // Fetch latest children list from backend on startup
    WidgetsBinding.instance.addPostFrameCallback((_) {
      NutritionStatsRepository.instance.syncFromApi();
      _loadNextAgenda();
    });
  }

  Future<void> _loadNextAgenda() async {
    if (!mounted) return;
    setState(() {
      _isLoadingAgenda = true;
    });
    try {
      final sessions = await ApiClient.instance.fetchSessions();
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
        _nextAgenda = nextSess;
        _isLoadingAgenda = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _isLoadingAgenda = false;
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
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const dayNames = [
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'Minggu',
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
    final kaderName = currentUser?['name']?.toUpperCase() ?? 'KADER';
    final wilayah = currentUser?['wilayah'] ?? 'Posyandu';

    return ListenableBuilder(
      listenable: NutritionStatsRepository.instance,
      builder: (context, _) {
        final summary = NutritionStatsRepository.instance.summary;
        final childrenList = NutritionStatsRepository.instance.children;

        return Scaffold(
          backgroundColor: backgroundColor,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(22),
                      onTap: () => _showQuickMessage(context, 'Header'),
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
                                    'HALO, $kaderName',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w800,
                                      color: primaryColor,
                                      letterSpacing: 0.6,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    'Selamat bertugas di wilayah $wilayah',
                                    style: const TextStyle(
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
                                          const NotificationScreen(),
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
                  ),
                  const SizedBox(height: 18),
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(18),
                      onTap: () => _showQuickMessage(context, 'Wilayah Posyandu'),
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
                                    wilayah,
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
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          title: 'Total Balita',
                          value: summary.totalChildren.toString(),
                          color: primaryColor,
                          onTap: () => _showQuickMessage(context, 'Total Balita'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          title: 'Normal',
                          value: summary.normalCount.toString(),
                          color: const Color(0xFF2F6BFF),
                          onTap: () => _showQuickMessage(context, 'Normal'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          title: 'Beresiko',
                          value: (summary.riskCount + summary.stuntingCount).toString(),
                          color: const Color(0xFFE0463B),
                          onTap: () => _showQuickMessage(context, 'Beresiko'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
              if (_isLoadingAgenda)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: CircularProgressIndicator(color: primaryColor),
                  ),
                )
              else
                Builder(
                  builder: (context) {
                    final dayLabel = _nextAgenda != null && _nextAgenda!['date'] != null
                        ? _formatLongDate(DateTime.parse(_nextAgenda!['date']))
                        : 'Belum ada jadwal posyandu mendatang';

                    final timeLabel = _nextAgenda?['timeRange'] ?? '-';

                    return Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(22),
                        onTap: () =>
                            _showQuickMessage(context, 'Agenda Mendatang'),
                        child: Container(
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
                                dayLabel,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.access_time,
                                    color: Colors.white,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    timeLabel,
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
                    );
                  },
                ),
              const SizedBox(height: 22),
              const Text(
                'Aktivitas Terakhir',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),
              if (childrenList.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Text(
                      'Belum ada data balita',
                      style: TextStyle(color: mutedText),
                    ),
                  ),
                )
              else
                ...childrenList.take(3).map((child) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _ActivityItem(
                      name: child.name,
                      birthDate: child.birthDate,
                      status: child.status,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => ChildDetailScreen(
                              name: child.name,
                              birthDate: child.birthDate,
                              gender: child.gender,
                              status: child.status,
                              id: child.id,
                            ),
                          ),
                        );
                      },
                    ),
                  );
                }).toList(),
              const SizedBox(height: 24),
            ],
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
              MaterialPageRoute(builder: (context) => const ChildDataScreen()),
            );
            return;
          }
          if (index == 2) {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const AgendaScreen()),
            );
            return;
          }
          if (index == 3) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const InputCheckupScreen(),
              ),
            );
            return;
          }
          if (index == 4) {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const ProfileScreen()),
            );
            return;
          }
          final labels = ['Beranda', 'Data Anak', 'Agenda', 'Input', 'Profil'];
          _showQuickMessage(context, labels[index]);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: 'Beranda',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.group), label: 'Data Anak'),
          BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Agenda'),
          BottomNavigationBarItem(
            icon: Icon(Icons.playlist_add_check),
            label: 'Input',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
        },
      );
  }
}

// age formatting provided by lib/shared/date_utils.dart

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.title,
    required this.value,
    required this.color,
    this.onTap,
  });

  final String title;
  final String value;
  final Color color;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
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
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(color: color, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  const _ActivityItem({
    required this.name,
    required this.birthDate,
    required this.status,
    required this.onTap,
  });

  final String name;
  final DateTime birthDate;
  final String status;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    final statusColor = _statusColor(status);
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
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
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
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      formatAge(birthDate),
                      style: const TextStyle(color: Color(0xFF6B7280)),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.w600,
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
