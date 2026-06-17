import 'package:flutter/material.dart';
import 'package:posco_app/features/kader/add_agenda_screen.dart';
import 'package:posco_app/features/kader/child_data_screen.dart';
import 'package:posco_app/features/kader/input_checkup_screen.dart';
import 'package:posco_app/features/kader/kader_dashboard_screen.dart';
import 'package:posco_app/features/kader/profile_screen.dart';

import 'package:posco_app/shared/api_client.dart';

// Helper function untuk menemukan Selasa di tanggal belasan (10-19)
DateTime? _findTuesdayInTeens(int year, int month) {
  for (int day = 10; day <= 19; day++) {
    try {
      final date = DateTime(year, month, day);
      if (date.weekday == 2) {
        return date;
      }
    } catch (e) {
      // Tanggal tidak valid
    }
  }
  return null;
}

class AgendaScreen extends StatefulWidget {
  const AgendaScreen({super.key});

  @override
  State<AgendaScreen> createState() => _AgendaScreenState();
}

class _AgendaScreenState extends State<AgendaScreen> {
  AgendaFilter _activeFilter = AgendaFilter.all;
  bool _isLoading = true;
  List<_AgendaItemData> _sessions = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadSessions();
  }

  Future<void> _loadSessions() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final data = await ApiClient.instance.fetchSessions();
      final loaded = <_AgendaItemData>[];
      for (final item in data) {
        DateTime date = DateTime.now();
        if (item['date'] != null) {
          try {
            date = DateTime.parse(item['date']);
          } catch (_) {}
        }
        
        final posyanduObj = item['posyandu'];
        final String location = (posyanduObj != null && posyanduObj is Map) 
            ? (posyanduObj['name'] ?? 'Posyandu') 
            : (item['posyanduId'] ?? 'Posyandu');
            
        final String time = item['timeRange'] ?? '08:00 - 11:00';
        final int count = item['attendanceCount'] ?? 0;
        
        loaded.add(
          _AgendaItemData(
            dateTime: date,
            title: item['name'] ?? 'Posyandu Rutin $location',
            location: location,
            time: time,
            participants: count.toString(),
            kaderName: item['kaderName'],
          ),
        );
      }
      // Urutkan agenda secara kronologis (terbaru di atas)
      loaded.sort((a, b) => b.dateTime.compareTo(a.dateTime));
      if (!mounted) return;
      setState(() {
        _sessions = loaded;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal memuat agenda: $e';
        _isLoading = false;
      });
    }
  }

  void _showAgendaDetail(BuildContext context, _AgendaItemData item) {
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
                          item.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Detail Agenda Posyandu (Kader)',
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
                label: 'Kader Penanggung Jawab',
                value: item.kaderName ?? 'Siti Rahayu (Kader)',
              ),
              const SizedBox(height: 16),

              // Participants
              _buildDetailRow(
                icon: Icons.people_alt_rounded,
                label: 'Jumlah Balita Terdaftar Hadir',
                value: '${item.participants} Anak',
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
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    final filteredItems = _sessions.where((item) {
      final date = DateTime(
        item.dateTime.year,
        item.dateTime.month,
        item.dateTime.day,
      );
      switch (_activeFilter) {
        case AgendaFilter.upcoming:
          return date.isAfter(today) || date.isAtSameMomentAs(today);
        case AgendaFilter.done:
          return date.isBefore(today);
        case AgendaFilter.all:
        default:
          return true;
      }
    }).toList();

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'JADWAL AGENDA',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: primaryColor,
                              letterSpacing: 0.6,
                            ),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Jadwal Kegiatan Posyandu',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () async {
                        final result = await Navigator.of(context).push<bool>(
                          MaterialPageRoute(
                            builder: (context) => const AddAgendaScreen(),
                          ),
                        );
                        if (result == true) {
                          _loadSessions();
                        }
                      },
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: primaryColor,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.add, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: _FilterChip(
                      label: 'Semua',
                      isActive: _activeFilter == AgendaFilter.all,
                      onTap: () {
                        setState(() {
                          _activeFilter = AgendaFilter.all;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _FilterChip(
                      label: 'Mendatang',
                      isActive: _activeFilter == AgendaFilter.upcoming,
                      onTap: () {
                        setState(() {
                          _activeFilter = AgendaFilter.upcoming;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _FilterChip(
                      label: 'Selesai',
                      isActive: _activeFilter == AgendaFilter.done,
                      onTap: () {
                        setState(() {
                          _activeFilter = AgendaFilter.done;
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 48),
                  child: Center(
                    child: CircularProgressIndicator(color: primaryColor),
                  ),
                )
              else if (_errorMessage != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 48),
                  child: Center(
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                )
              else if (filteredItems.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                    child: Text(
                      'Belum ada jadwal',
                      style: TextStyle(
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                )
              else
                for (final item in filteredItems) ...[
                  _AgendaCard(
                    data: item,
                    onTap: () => _showAgendaDetail(context, item),
                  ),
                  const SizedBox(height: 16),
                ],
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
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const KaderDashboardScreen(),
              ),
            );
            return;
          }
          if (index == 1) {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const ChildDataScreen()),
            );
            return;
          }
          if (index == 2) {
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
          // All indices handled, no default fallback needed
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
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isActive ? primaryColor.withOpacity(0.12) : Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isActive ? primaryColor : Colors.transparent,
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: primaryColor,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AgendaCard extends StatelessWidget {
  const _AgendaCard({required this.data, required this.onTap});

  final _AgendaItemData data;
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
              Container(
                width: 92,
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
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            data.title,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF111827),
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.person_outline,
                              color: primaryColor,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              data.participants,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on,
                          size: 18,
                          color: primaryColor,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            data.location,
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(
                          Icons.access_time,
                          size: 18,
                          color: primaryColor,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          data.time,
                          style: const TextStyle(
                            color: Color(0xFF6B7280),
                            fontWeight: FontWeight.w600,
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

class _AgendaItemData {
  const _AgendaItemData({
    required this.dateTime,
    required this.title,
    required this.location,
    required this.time,
    required this.participants,
    this.kaderName,
  });

  final DateTime dateTime;
  final String title;
  final String location;
  final String time;
  final String participants;
  final String? kaderName;

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

enum AgendaFilter { all, upcoming, done }
