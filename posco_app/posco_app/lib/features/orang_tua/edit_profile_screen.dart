import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:posco_app/shared/api_client.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final ImagePicker _picker = ImagePicker();
  File? _photoFile;

  final TextEditingController _namaLengkapCtrl = TextEditingController();
  final TextEditingController _nikCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _passwordCtrl = TextEditingController();
  final TextEditingController _nomorTeleponCtrl = TextEditingController();
  final TextEditingController _namaAnakCtrl = TextEditingController();
  final TextEditingController _tanggalLahirAnakCtrl = TextEditingController();
  final TextEditingController _alamatCtrl = TextEditingController();

  String? _selectedPosyandu = 'Posyandu Kenanga - Kec. Padang Utara';
  Map<String, dynamic>? _childData;

  @override
  void initState() {
    super.initState();
    // Populate parent controllers
    final user = ApiClient.instance.currentUser;
    if (user != null) {
      _namaLengkapCtrl.text = user['name'] ?? '';
      _nikCtrl.text = user['nik'] ?? '';
      _emailCtrl.text = user['email'] ?? '';
      _passwordCtrl.text = '••••••••';
      _nomorTeleponCtrl.text = user['phone'] ?? '';
      _alamatCtrl.text = user['wilayah'] ?? '';
      _selectedPosyandu = user['posyandu'] ?? 'Posyandu Kenanga - Kec. Padang Utara';
    }
    // Fetch children info
    _fetchChildInfo();
  }

  Future<void> _fetchChildInfo() async {
    try {
      final children = await ApiClient.instance.fetchChildren();
      if (children.isNotEmpty) {
        final child = children.first;
        _childData = child;
        _namaAnakCtrl.text = child['name'] ?? '';
        
        String formattedBirthDate = '';
        if (child['birthDate'] != null) {
          try {
            final parsed = DateTime.parse(child['birthDate']);
            final d = parsed.day.toString().padLeft(2, '0');
            final m = parsed.month.toString().padLeft(2, '0');
            final y = parsed.year.toString();
            formattedBirthDate = '$d/$m/$y';
          } catch (_) {}
        }
        _tanggalLahirAnakCtrl.text = formattedBirthDate;
        setState(() {});
      }
    } catch (_) {}
  }

  Future<void> _pickImage(ImageSource source) async {
    final XFile? file = await _picker.pickImage(
      source: source,
      imageQuality: 80,
    );
    if (file != null) {
      setState(() => _photoFile = File(file.path));
    }
  }

  Future<void> _pickTanggalLahirAnak() async {
    final now = DateTime.now();
    DateTime initialDate = DateTime(now.year - 2);

    final raw = _tanggalLahirAnakCtrl.text.trim();
    final parts = raw.split('/');
    if (parts.length == 3) {
      final day = int.tryParse(parts[0]);
      final month = int.tryParse(parts[1]);
      final year = int.tryParse(parts[2]);
      if (day != null && month != null && year != null) {
        initialDate = DateTime(year, month, day);
      }
    }

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2000),
      lastDate: now,
    );

    if (picked != null) {
      final d = picked.day.toString().padLeft(2, '0');
      final m = picked.month.toString().padLeft(2, '0');
      final y = picked.year.toString();
      _tanggalLahirAnakCtrl.text = '$d/$m/$y';
      setState(() {});
    }
  }

  Future<void> _save() async {
    final user = ApiClient.instance.currentUser;
    if (user == null) return;

    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(color: Color(0xFF4DBFA3)),
      ),
    );

    final Map<String, dynamic> updateData = {
      'name': _namaLengkapCtrl.text.trim(),
      'nik': _nikCtrl.text.trim(),
      'email': _emailCtrl.text.trim(),
      'phone': _nomorTeleponCtrl.text.trim(),
      'wilayah': _alamatCtrl.text.trim(),
      'posyandu': _selectedPosyandu,
    };

    if (_passwordCtrl.text.trim().isNotEmpty && _passwordCtrl.text != '••••••••') {
      updateData['password'] = _passwordCtrl.text.trim();
    }

    final res = await ApiClient.instance.updateProfile(user['id'], updateData);

    if (res['success'] == true) {
      // Parse child birth date
      DateTime? childBirth;
      final parts = _tanggalLahirAnakCtrl.text.trim().split('/');
      if (parts.length == 3) {
        final day = int.tryParse(parts[0]);
        final month = int.tryParse(parts[1]);
        final year = int.tryParse(parts[2]);
        if (day != null && month != null && year != null) {
          childBirth = DateTime(year, month, day);
        }
      }

      final Map<String, dynamic> childPayload = {
        'name': _namaAnakCtrl.text.trim(),
        'motherName': _namaLengkapCtrl.text.trim(),
        'birthDate': childBirth?.toIso8601String(),
        'orangtuaId': user['id'],
      };

      if (_childData != null) {
        // Update child
        await ApiClient.instance.updateChild(_childData!['id'], childPayload);
      } else if (_namaAnakCtrl.text.trim().isNotEmpty) {
        // Create child
        await ApiClient.instance.createChild({
          ...childPayload,
          'gender': null,
          'birthWeight': null,
          'height': null,
          'weight': null,
          'nutritionStatus': 'Normal',
          'stuntingStatus': 'Normal',
        });
      }
    }

    if (!mounted) return;
    Navigator.of(context).pop(); // dismiss loading dialog

    if (res['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profil & Data Keluarga berhasil diperbarui'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.of(context).pop(res['user']);
    } else {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Gagal Memperbarui Profil'),
          content: Text(res['message'] ?? 'Terjadi kesalahan.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  @override
  void dispose() {
    _namaLengkapCtrl.dispose();
    _nikCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nomorTeleponCtrl.dispose();
    _namaAnakCtrl.dispose();
    _tanggalLahirAnakCtrl.dispose();
    _alamatCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const accentColor = Color(0xFF2E8B74);
    const backgroundColor = Color(0xFFF4FBF8);
    final fieldFillColor = Colors.white.withValues(alpha: 0.96);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        title: const Text('Edit Profil'),
        centerTitle: false,
        elevation: 0,
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        toolbarHeight: 66,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFE7F7F2), Color(0xFFF9FCFB)],
          ),
        ),
        child: SafeArea(
          top: false,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF4DBFA3), Color(0xFF7EDCC7)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: primaryColor.withValues(alpha: 0.20),
                        blurRadius: 24,
                        offset: const Offset(0, 12),
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
                              'Perbarui profil orang tua',
                              style: Theme.of(context).textTheme.titleLarge
                                  ?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w800,
                                  ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Ubah data akun dan data keluarga sesuai registrasi orang tua.',
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(
                                    color: Colors.white.withValues(alpha: 0.92),
                                    height: 1.35,
                                  ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.18),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.28),
                          ),
                        ),
                        child: const Icon(
                          Icons.family_restroom_rounded,
                          color: Colors.white,
                          size: 34,
                        ),
                      ),
                    ],
                  ),
                ),
                // const SizedBox(height: 18),
                // _SectionCard(
                //   title: 'Foto Profil',
                //   subtitle:
                //       'Ketuk avatar untuk mengganti gambar dari galeri atau kamera.',
                //   child: Column(
                //     children: [
                //       GestureDetector(
                //         onTap: () => _showPhotoPicker(context),
                //         child: Stack(
                //           alignment: Alignment.bottomRight,
                //           children: [
                //             AnimatedSwitcher(
                //               duration: const Duration(milliseconds: 350),
                //               switchInCurve: Curves.easeOut,
                //               transitionBuilder: (child, anim) =>
                //                   FadeTransition(
                //                     opacity: anim,
                //                     child: ScaleTransition(
                //                       scale: anim,
                //                       child: child,
                //                     ),
                //                   ),
                //               child: Container(
                //                 key: ValueKey(_photoFile?.path ?? 'no_photo'),
                //                 width: 118,
                //                 height: 118,
                //                 padding: const EdgeInsets.all(5),
                //                 decoration: BoxDecoration(
                //                   shape: BoxShape.circle,
                //                   gradient: const LinearGradient(
                //                     colors: [
                //                       Color(0xFFB8EEE0),
                //                       Color(0xFFECFBF7),
                //                     ],
                //                   ),
                //                   boxShadow: [
                //                     BoxShadow(
                //                       color: Colors.black.withValues(
                //                         alpha: 0.06,
                //                       ),
                //                       blurRadius: 18,
                //                       offset: const Offset(0, 10),
                //                     ),
                //                   ],
                //                 ),
                //                 child: CircleAvatar(
                //                   radius: 54,
                //                   backgroundColor: const Color(0xFFF2FBF8),
                //                   backgroundImage: _photoFile != null
                //                       ? FileImage(_photoFile!)
                //                       : null,
                //                   child: _photoFile == null
                //                       ? const Icon(
                //                           Icons.person_rounded,
                //                           size: 56,
                //                           color: primaryColor,
                //                         )
                //                       : null,
                //                 ),
                //               ),
                //             ),
                //             Container(
                //               padding: const EdgeInsets.all(10),
                //               decoration: BoxDecoration(
                //                 color: accentColor,
                //                 shape: BoxShape.circle,
                //                 boxShadow: [
                //                   BoxShadow(
                //                     color: accentColor.withValues(alpha: 0.28),
                //                     blurRadius: 14,
                //                     offset: const Offset(0, 8),
                //                   ),
                //                 ],
                //               ),
                //               child: const Icon(
                //                 Icons.edit,
                //                 color: Colors.white,
                //                 size: 18,
                //               ),
                //             ),
                //           ],
                //         ),
                //       ),
                //       const SizedBox(height: 12),
                //       Text(
                //         'Ganti Foto Profil',
                //         style: Theme.of(context).textTheme.titleSmall?.copyWith(
                //           fontWeight: FontWeight.w700,
                //           color: const Color(0xFF1F2937),
                //         ),
                //       ),
                //     ],
                //   ),
                // ),
                // const SizedBox(height: 16),
                _SectionCard(
                  title: 'Data Akun Orang Tua',
                  subtitle:
                      'Lengkapi identitas dan kontak akun orang tua sesuai registrasi.',
                  child: Column(
                    children: [
                      _ProfileField(
                        controller: _namaLengkapCtrl,
                        hintText: 'Masukkan Nama Lengkap Orang Tua',
                        icon: Icons.person_rounded,
                        fillColor: fieldFillColor,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _nikCtrl,
                        enabled: false,
                        decoration: _inputDecoration(
                          fillColor: fieldFillColor,
                          hintText: 'NIK (tidak dapat diubah)',
                          icon: Icons.badge_rounded,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _ProfileField(
                        controller: _emailCtrl,
                        hintText: 'Masukkan Alamat Email Akun',
                        icon: Icons.email_rounded,
                        fillColor: fieldFillColor,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 12),
                      _ProfileField(
                        controller: _passwordCtrl,
                        hintText: 'Password Akun',
                        icon: Icons.lock_rounded,
                        fillColor: fieldFillColor,
                        obscureText: true,
                      ),
                      const SizedBox(height: 12),
                      _ProfileField(
                        controller: _nomorTeleponCtrl,
                        hintText: 'Masukkan Nomor Telepon',
                        icon: Icons.phone_rounded,
                        fillColor: fieldFillColor,
                        keyboardType: TextInputType.phone,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                _SectionCard(
                  title: 'Data Keluarga',
                  subtitle:
                      'Sesuaikan nama anak, tanggal lahir anak, alamat, dan posyandu terdekat.',
                  child: Column(
                    children: [
                      _ProfileField(
                        controller: _namaAnakCtrl,
                        hintText: 'Nama Lengkap Anak',
                        icon: Icons.child_care_rounded,
                        fillColor: fieldFillColor,
                      ),
                      const SizedBox(height: 12),
                      InkWell(
                        borderRadius: BorderRadius.circular(18),
                        onTap: _pickTanggalLahirAnak,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                          decoration: BoxDecoration(
                            color: fieldFillColor,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFE4F2EC)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE7F7F2),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: const Icon(
                                  Icons.calendar_month_rounded,
                                  color: primaryColor,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Tanggal Lahir Anak',
                                      style: Theme.of(context)
                                          .textTheme
                                          .labelMedium
                                          ?.copyWith(
                                            color: const Color(0xFF6B7280),
                                          ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _tanggalLahirAnakCtrl.text,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleSmall
                                          ?.copyWith(
                                            fontWeight: FontWeight.w700,
                                            color: const Color(0xFF111827),
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(
                                Icons.chevron_right_rounded,
                                color: Color(0xFF9CA3AF),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _ProfileField(
                        controller: _alamatCtrl,
                        hintText: 'Alamat Rumah Lengkap',
                        icon: Icons.home_rounded,
                        fillColor: fieldFillColor,
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedPosyandu,
                        isExpanded: true,
                        decoration: _inputDecoration(
                          fillColor: fieldFillColor,
                          hintText: 'Posyandu Terdekat dari Rumah',
                          icon: Icons.location_on_rounded,
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'Posyandu Melati - Kec. Padang Timur',
                            child: Text('Posyandu Melati - Kec. Padang Timur'),
                          ),
                          DropdownMenuItem(
                            value: 'Posyandu Kenanga - Kec. Padang Utara',
                            child: Text('Posyandu Kenanga - Kec. Padang Utara'),
                          ),
                          DropdownMenuItem(
                            value: 'Posyandu Anggrek - Kec. Kuranji',
                            child: Text('Posyandu Anggrek - Kec. Kuranji'),
                          ),
                          DropdownMenuItem(
                            value: 'Posyandu Mawar - Kec. Padang Barat',
                            child: Text('Posyandu Mawar - Kec. Padang Barat'),
                          ),
                        ],
                        onChanged: (v) => setState(() => _selectedPosyandu = v),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  height: 56,
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                    child: const Text(
                      'Simpan Perubahan',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

InputDecoration _inputDecoration({
  required Color fillColor,
  required String hintText,
  required IconData icon,
}) {
  return InputDecoration(
    hintText: hintText,
    filled: true,
    fillColor: fillColor,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    prefixIcon: Icon(icon, color: const Color(0xFF4DBFA3)),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: const BorderSide(color: Color(0xFFE4F2EC)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: const BorderSide(color: Color(0xFF4DBFA3), width: 1.2),
    ),
  );
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.subtitle,
    required this.child,
  });

  final String title;
  final String subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.98),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w800,
              color: const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: const Color(0xFF6B7280),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}

class _ProfileField extends StatelessWidget {
  const _ProfileField({
    required this.controller,
    required this.hintText,
    required this.icon,
    required this.fillColor,
    this.keyboardType,
    this.obscureText = false,
  });

  final TextEditingController controller;
  final String hintText;
  final IconData icon;
  final Color fillColor;
  final TextInputType? keyboardType;
  final bool obscureText;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      decoration: _inputDecoration(
        fillColor: fillColor,
        hintText: hintText,
        icon: icon,
      ),
    );
  }
}

extension on _EditProfileScreenState {
  void _showPhotoPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Pilih Foto Profil',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 16),
              _PhotoActionTile(
                icon: Icons.photo_library_rounded,
                title: 'Ambil dari Galeri',
                subtitle: 'Pilih gambar dari penyimpanan perangkat',
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage(ImageSource.gallery);
                },
              ),
              const SizedBox(height: 12),
              _PhotoActionTile(
                icon: Icons.camera_alt_rounded,
                title: 'Gunakan Kamera',
                subtitle: 'Ambil foto langsung dari kamera',
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage(ImageSource.camera);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PhotoActionTile extends StatelessWidget {
  const _PhotoActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF7FCFA),
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFE7F7F2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: const Color(0xFF4DBFA3)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFF6B7280),
                        fontSize: 12,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: Color(0xFF9CA3AF)),
            ],
          ),
        ),
      ),
    );
  }
}
