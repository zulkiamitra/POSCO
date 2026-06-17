import 'package:flutter/material.dart';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/features/orang_tua/child_data_screen.dart';
import 'package:posco_app/features/orang_tua/jadwal_screen.dart';
import 'package:posco_app/features/orang_tua/riwayat_screen.dart';
import 'package:posco_app/features/auth/login_screen.dart';
import 'package:posco_app/features/orang_tua/edit_profile_screen.dart';
import 'package:posco_app/features/orang_tua/help_center_screen.dart';
import 'package:posco_app/shared/api_client.dart';

class OrangTuaProfileScreen extends StatefulWidget {
  const OrangTuaProfileScreen({super.key});

  @override
  State<OrangTuaProfileScreen> createState() => _OrangTuaProfileScreenState();
}

class _OrangTuaProfileScreenState extends State<OrangTuaProfileScreen> {
  String _name = '';
  String _email = '';
  String? _photoPath;
  bool _isLoading = true;
  String? _errorMessage;
  Map<String, dynamic>? _firstChild;

  @override
  void initState() {
    super.initState();
    // Initialize profile info from current user
    final currentUser = ApiClient.instance.currentUser;
    _name = currentUser?['name'] ?? 'Orang Tua';
    _email = currentUser?['email'] ?? '';
    _loadFirstChild();
  }

  Future<void> _loadFirstChild() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final children = await ApiClient.instance.fetchChildren();
      if (!mounted) return;
      setState(() {
        if (children.isNotEmpty) {
          _firstChild = children.first;
        }
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal memuat data anak: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Color(0xFFF6F8F6);
    const mutedText = Color(0xFF6B7280);
    const dangerColor = Color(0xFFEF4444);

    DateTime childBirthDate = DateTime.now();
    if (_firstChild?['birthDate'] != null) {
      try {
        childBirthDate = DateTime.parse(_firstChild!['birthDate']);
      } catch (_) {}
    }

    String lastCheckupDate = 'Belum pernah diperiksa';
    final history = _firstChild?['checkupHistory'];
    if (history is List && history.isNotEmpty) {
      // Find latest checkup
      final sorted = List.from(history);
      sorted.sort((a, b) {
        final dA = parseFlexibleDate(a['date'] ?? a['tanggal']) ?? DateTime(1970);
        final dB = parseFlexibleDate(b['date'] ?? b['tanggal']) ?? DateTime(1970);
        return dA.compareTo(dB);
      });
      lastCheckupDate = sorted.last['date'] ?? sorted.last['tanggal'] ?? 'Baru saja';
    }

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
                child: const Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
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
                            'Kelola Informasi Akun Anda',
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
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: primaryColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: (!kIsWeb && _photoPath != null && _photoPath!.isNotEmpty)
                            ? Image.file(File(_photoPath!), fit: BoxFit.cover)
                            : const Icon(
                                Icons.person,
                                color: Color(0xFF4DBFA3),
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
                            ApiClient.instance.currentUser?['name'] ?? 'Orang Tua',
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
              const Text(
                'DATA ANAK',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: primaryColor,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 14),

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
              else if (_firstChild == null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'Belum ada data balita terdaftar',
                      style: TextStyle(
                        color: Color(0xFF6B7280),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: primaryColor.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Icon(
                              Icons.child_care,
                              color: primaryColor,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _firstChild?['name'] ?? 'Anak',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Usia: ${formatAge(childBirthDate)}',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: Color(0xFF6B7280),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: const Color(0xFF10B981).withOpacity(0.25),
                            width: 0.8,
                          ),
                        ),
                        child: Text(
                          'Status: ${_firstChild?['nutritionStatus'] ?? _firstChild?['stuntingStatus'] ?? 'Normal'}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF10B981),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Pemeriksaan Terakhir: $lastCheckupDate',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),

              const SizedBox(height: 16),
              const Text(
                'MENU AKUN',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: primaryColor,
                  letterSpacing: 0.8,
                ),
              ),
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
                    _loadFirstChild();
                  }
                },
              ),
              const SizedBox(height: 16),
              _ProfileActionCard(
                icon: Icons.notifications,
                label: 'Pusat Bantuan',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const HelpCenterScreen(),
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
          if (index == 3) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaRiwayatScreen(),
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

class _ProfileActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ProfileActionCard({
    required this.icon,
    required this.label,
    required this.onTap,
  });

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
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
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
