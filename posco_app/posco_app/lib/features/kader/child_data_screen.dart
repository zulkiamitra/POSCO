import 'package:flutter/material.dart';
import 'package:posco_app/features/kader/agenda_screen.dart';
import 'package:posco_app/features/kader/add_child_screen.dart';
import 'package:posco_app/features/kader/child_detail_screen.dart';
import 'package:posco_app/features/kader/input_checkup_screen.dart';
import 'package:posco_app/features/kader/profile_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class ChildDataScreen extends StatefulWidget {
  const ChildDataScreen({super.key});

  @override
  State<ChildDataScreen> createState() => _ChildDataScreenState();
}

class _ChildDataScreenState extends State<ChildDataScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  final NutritionStatsRepository _statsRepository =
      NutritionStatsRepository.instance;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _statsRepository.syncFromApi();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showQuickMessage(BuildContext context, String label) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('$label diklik')));
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);

    return ListenableBuilder(
      listenable: _statsRepository,
      builder: (context, _) {
        final children = _statsRepository.children
            .map(
              (child) => _ChildData(
                name: child.name,
                parentName: child.parentName,
                birthDate: child.birthDate,
                gender: child.gender,
                status: child.status,
                id: child.id,
              ),
            )
            .toList(growable: false);

        final filteredChildren = children.where((child) {
          final haystack = '${child.name} ${child.parentName}'.toLowerCase();
          return haystack.contains(_query.toLowerCase());
        }).toList();

        return Scaffold(
          backgroundColor: backgroundColor,
          body: SafeArea(
            child: RefreshIndicator(
              onRefresh: () => _statsRepository.syncFromApi(),
              color: primaryColor,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
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
                                  'DATA ANAK',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    color: primaryColor,
                                    letterSpacing: 0.6,
                                  ),
                                ),
                                SizedBox(height: 6),
                                Text(
                                  'Database Anak dan Ibu Hamil',
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
                              final result = await Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) => const AddChildScreen(),
                                ),
                              );
                              if (result != null && result is Map) {
                                await _statsRepository.upsertChild(
                                  NutritionChildRecord(
                                    name: result['name'] as String,
                                    parentName: result['parentName'] as String,
                                    birthDate: result['birthDate'] as DateTime,
                                    gender: result['gender'] as String,
                                    status: result['status'] as String,
                                    createdAt: DateTime.now(),
                                    rawData: {
                                      'nik': result['nik'] as String,
                                      'birthPlace': result['place'] as String,
                                    },
                                  ),
                                );
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
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 6,
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
                      child: TextField(
                        controller: _searchController,
                        onChanged: (value) {
                          setState(() {
                            _query = value.trim();
                          });
                        },
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          prefixIcon: Icon(Icons.search, color: Color(0xFF111827)),
                          hintText: 'Cari Nama Anak atau Orang Tua',
                          hintStyle: TextStyle(
                            color: Color(0xFF111827),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (filteredChildren.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 28),
                        child: Center(
                          child: Text(
                            'Data anak tidak ditemukan',
                            style: TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                    else
                      ...filteredChildren.map(
                        (child) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _ChildListItem(
                            name: child.name,
                            birthDate: child.birthDate,
                            gender: child.gender,
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
                        ),
                      ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: 1,
            selectedItemColor: primaryColor,
            unselectedItemColor: mutedText,
            showUnselectedLabels: true,
            type: BottomNavigationBarType.fixed,
            onTap: (index) {
              if (index == 0) {
                Navigator.of(context).pop();
                return;
              }
              if (index == 1) {
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

class _ChildListItem extends StatelessWidget {
  const _ChildListItem({
    required this.name,
    required this.birthDate,
    required this.gender,
    required this.status,
    required this.onTap,
  });

  final String name;
  final DateTime birthDate;
  final String gender;
  final String status;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    final statusColor = _statusColor(status);
    final statusBackground = statusColor.withOpacity(0.16);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
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
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(16),
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
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${formatAge(birthDate)}    $gender',
                      style: const TextStyle(
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: statusBackground,
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
}

class _ChildData {
  _ChildData({
    required this.name,
    required this.parentName,
    required this.birthDate,
    required this.gender,
    required this.status,
    this.id,
  });

  final String name;
  final String parentName;
  final DateTime birthDate;
  final String gender;
  final String status;
  final String? id;
}

// age formatting provided by lib/shared/date_utils.dart
