import 'package:flutter/material.dart';
import 'package:posco_app/features/kader/agenda_screen.dart';
import 'package:posco_app/features/kader/child_data_screen.dart';
import 'package:posco_app/features/kader/input_checkup_form_screen.dart';
import 'package:posco_app/features/kader/kader_dashboard_screen.dart';
import 'package:posco_app/features/kader/profile_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class InputCheckupScreen extends StatelessWidget {
  const InputCheckupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);

    return ListenableBuilder(
      listenable: NutritionStatsRepository.instance,
      builder: (context, _) {
        final childrenList = NutritionStatsRepository.instance.children;
        final items = childrenList
            .map((c) => _ChildInputData(
                  name: c.name,
                  birthDate: c.birthDate,
                  gender: c.gender,
                  id: c.id,
                  record: c,
                ))
            .toList();

        return Scaffold(
          backgroundColor: backgroundColor,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'INPUT PEMERIKSAAN',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: primaryColor,
                            letterSpacing: 0.5,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          'Pilih anak lalu isi hasil pemeriksaan terbaru.',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 14,
                          offset: const Offset(0, 8),
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
                          child: const Icon(
                            Icons.monitor_heart_outlined,
                            color: primaryColor,
                          ),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Pantau hasil pemeriksaan',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Buka kartu anak untuk mengisi berat badan, tinggi, dan catatan.',
                                style: TextStyle(
                                  color: Color(0xFF6B7280),
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'Daftar Anak',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (items.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 32),
                      child: Center(
                        child: Text(
                          'Belum ada data balita',
                          style: TextStyle(
                            color: mutedText,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    )
                  else
                    for (final item in items) ...[
                      _ChildInputCard(
                        data: item,
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => InputCheckupFormScreen(
                                name: item.name,
                                birthDate: item.birthDate,
                                gender: item.gender,
                                childId: item.id,
                                childRecord: item.record,
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 14),
                    ],
                ],
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
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const AgendaScreen()),
                );
                return;
              }
              if (index == 4) {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const ProfileScreen()),
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

class _ChildInputCard extends StatelessWidget {
  const _ChildInputCard({required this.data, required this.onTap});

  final _ChildInputData data;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
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
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Icon(Icons.person, color: primaryColor),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Text(
                          formatAge(data.birthDate),
                          style: const TextStyle(
                            color: Color(0xFF6B7280),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 18),
                        Text(
                          data.gender,
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
              const Icon(Icons.chevron_right, color: Color(0xFF9CA3AF)),
            ],
          ),
        ),
      ),
    );
  }
}

class _ChildInputData {
  _ChildInputData({
    required this.name,
    required this.birthDate,
    required this.gender,
    this.id,
    this.record,
  });

  final String name;
  final DateTime birthDate;
  final String gender;
  final String? id;
  final NutritionChildRecord? record;
}
