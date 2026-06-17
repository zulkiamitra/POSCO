import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:posco_app/features/auth/login_screen.dart';
import 'package:posco_app/features/kader/agenda_screen.dart';
import 'package:posco_app/features/kader/child_data_screen.dart';
import 'package:posco_app/features/kader/edit_profile_screen.dart';
import 'package:posco_app/features/kader/input_checkup_screen.dart';
import 'package:posco_app/features/kader/kader_dashboard_screen.dart';
import 'package:posco_app/features/kader/notification_screen.dart';
import 'package:posco_app/shared/api_client.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _name = 'Kader';
  String _email = '';
  String? _photoPath;

  @override
  void initState() {
    super.initState();
    final user = ApiClient.instance.currentUser;
    if (user != null) {
      _name = user['name'] ?? 'Kader';
      _email = user['email'] ?? '';
    }
  }

  @override
  Widget build(BuildContext context) {
    const backgroundColor = Color(0xFFF6F8F6);
    const primaryColor = Color(0xFF4DBFA3);
    const mutedText = Color(0xFF6B7280);
    const dangerColor = Color(0xFFEF4444);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
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
                            'PROFIL ANDA',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: primaryColor,
                              letterSpacing: 0.6,
                            ),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Informasi Akun Anda',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Profile card
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 16,
                ),
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
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 350),
                      switchInCurve: Curves.easeInOut,
                      child: Container(
                        key: ValueKey(_photoPath ?? 'no_photo'),
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: _photoPath == null
                              ? primaryColor.withOpacity(0.12)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: (!kIsWeb && _photoPath != null)
                              ? Image.file(
                                  File(_photoPath!),
                                  width: 48,
                                  height: 48,
                                  fit: BoxFit.cover,
                                )
                              : const Center(
                                  child: Icon(
                                    Icons.person,
                                    color: Color(0xFF4DBFA3),
                                  ),
                                ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            ApiClient.instance.currentUser?['name'] ?? 'Kader',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            ApiClient.instance.currentUser?['email'] ?? '',
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Action cards
              _ProfileActionCard(
                icon: Icons.edit,
                label: 'Edit Profil',
                onTap: () async {
                  final result = await Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const EditProfileScreen(),
                    ),
                  );
                  if (!mounted) return;
                  if (result != null) {
                    setState(() {});
                  }
                },
              ),
              const SizedBox(height: 16),
              _ProfileActionCard(
                icon: Icons.notifications,
                label: 'Notifikasi',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const NotificationScreen(),
                    ),
                  );
                },
              ),

              const SizedBox(height: 16),
              SizedBox(
                height: 56,
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await ApiClient.instance.logout();
                    if (!mounted) return;
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(
                        builder: (context) => const LoginScreen(),
                      ),
                      (route) => false,
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: dangerColor,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  icon: const Icon(Icons.logout),
                  label: const Text(
                    'Keluar Akun',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 4,
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
          if (index == 3) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const InputCheckupScreen(),
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

class _ProfileActionCard extends StatelessWidget {
  const _ProfileActionCard({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
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
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: primaryColor),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
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
