import 'package:flutter/material.dart';
import 'package:posco_app/features/auth/login_screen.dart';
import 'package:posco_app/features/kader/kader_dashboard_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/shared/api_client.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String _selectedRole = 'Kader';
  String? _selectedPosyanduKader = 'Posyandu Melati - Kec. Padang Timur';
  String? _selectedKaderCategory = 'Bidan';
  String? _selectedPosyanduOrangTua = 'Posyandu Melati - Kec. Padang Timur';
  DateTime? _tahunBergabung;
  DateTime? _tanggalLahirAnak;

  final _nameController = TextEditingController();
  final _nikController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _sikController = TextEditingController();
  final _alamatController = TextEditingController();
  final _childNameController = TextEditingController();

  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _nikController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _sikController.dispose();
    _alamatController.dispose();
    _childNameController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final nik = _nikController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama, Email, dan Password wajib diisi')),
      );
      return;
    }

    setState(() => _isLoading = true);

    String roleString = _selectedRole == 'Kader' ? 'kader' : 'orangtua';
    String? wilayah = _selectedRole == 'Kader' ? _selectedPosyanduKader : _selectedPosyanduOrangTua;

    final result = await ApiClient.instance.register(
      email: email,
      password: password,
      name: name,
      role: roleString,
      nik: nik.isNotEmpty ? nik : null,
      phone: phone.isNotEmpty ? phone : null,
      wilayah: wilayah,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result['success'] == true) {
      if (roleString == 'orangtua' && _childNameController.text.trim().isNotEmpty) {
        final childName = _childNameController.text.trim();
        await ApiClient.instance.createChild({
          'name': childName,
          'motherName': name,
          'birthDate': _tanggalLahirAnak?.toIso8601String(),
          'gender': null,
          'birthWeight': null,
          'height': null,
          'weight': null,
          'nutritionStatus': 'Normal',
          'stuntingStatus': 'Normal',
        });
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _selectedRole == 'Kader'
                ? 'Registrasi berhasil! Akun Kader terdaftar, menunggu verifikasi admin.'
                : 'Registrasi berhasil! Selamat datang.',
          ),
          backgroundColor: const Color(0xFF4DBFA3),
        ),
      );

      if (_selectedRole == 'Kader') {
        // Clear login session since kader requires admin approval
        await ApiClient.instance.logout();
        if (!mounted) return;
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
            builder: (context) => const LoginScreen(),
          ),
          (route) => false,
        );
      } else {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
            builder: (context) => const OrangTuaDashboardScreen(),
          ),
          (route) => false,
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message'] ?? 'Registrasi gagal'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _selectDate(BuildContext context, bool isKader) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: isKader
          ? DateTime(1950)
          : DateTime.now().subtract(const Duration(days: 365 * 10)),
      lastDate: isKader ? DateTime.now() : DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF4DBFA3),
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        if (isKader) {
          _tahunBergabung = picked;
        } else {
          _tanggalLahirAnak = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Color(0xFFF6F8F6);
    const fieldFillColor = Color(0xFFF1F7F3);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Registrasi Akun Baru',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: _RoleButton(
                      label: 'Kader',
                      selected: _selectedRole == 'Kader',
                      onTap: () => setState(() => _selectedRole = 'Kader'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _RoleButton(
                      label: 'Orang Tua',
                      selected: _selectedRole == 'Orang Tua',
                      onTap: () => setState(() => _selectedRole = 'Orang Tua'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 24,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      _selectedRole == 'Kader'
                          ? 'Daftarkan diri Anda sebagai kader posyandu.'
                          : 'Daftarkan diri Anda sebagai orang tua.',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1F2933),
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Nama Lengkap (untuk semua)
                    _InputField(
                      hintText: 'Masukkan Nama Lengkap',
                      icon: Icons.person,
                      fillColor: fieldFillColor,
                      controller: _nameController,
                    ),
                    const SizedBox(height: 16),
                    // NIK/KTP (untuk semua)
                    _InputField(
                      hintText: _selectedRole == 'Kader'
                          ? 'Masukkan NIK Kader'
                          : 'Masukkan Nomor KTP',
                      icon: Icons.badge,
                      fillColor: fieldFillColor,
                      controller: _nikController,
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                    // Email (untuk semua)
                    _InputField(
                      hintText: 'Masukkan Alamat Email Akun',
                      icon: Icons.email,
                      fillColor: fieldFillColor,
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),
                    // Password (untuk semua)
                    _InputField(
                      hintText: 'Password Akun',
                      icon: Icons.lock,
                      fillColor: fieldFillColor,
                      controller: _passwordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),
                    // Nomor Telepon (untuk semua)
                    _InputField(
                      hintText: 'Masukkan Nomor Telepon',
                      icon: Icons.phone,
                      fillColor: fieldFillColor,
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 16),
                    // Fields SPESIFIK untuk Kader
                    if (_selectedRole == 'Kader') ...[
                      // Info Box Kader
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEDE9FE),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFDDD6FE)),
                        ),
                        child: const Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.verified_user,
                              color: Color(0xFF7C3AED),
                              size: 18,
                            ),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                'Khusus kader: Akun memerlukan verifikasi admin sebelum dapat mengakses aplikasi.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF6D28D9),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Posyandu untuk Kader
                      DropdownButtonFormField<String>(
                        value: _selectedPosyanduKader,
                        isExpanded: true,
                        isDense: true,
                        decoration: InputDecoration(
                          labelText: 'Posyandu Tempat Bekerja',
                          labelStyle: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                          filled: true,
                          fillColor: fieldFillColor,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                          prefixIcon: const Icon(Icons.location_on),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide.none,
                          ),
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
                        onChanged: (value) {
                          setState(() => _selectedPosyanduKader = value);
                        },
                      ),
                      const SizedBox(height: 16),
                      // Kategori Kader
                      DropdownButtonFormField<String>(
                        value: _selectedKaderCategory,
                        isExpanded: true,
                        isDense: true,
                        decoration: InputDecoration(
                          labelText: 'Kategori / Jabatan',
                          labelStyle: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                          filled: true,
                          fillColor: fieldFillColor,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                          prefixIcon: const Icon(Icons.badge),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'Bidan',
                            child: Text('Bidan'),
                          ),
                          DropdownMenuItem(
                            value: 'Perawat',
                            child: Text('Perawat'),
                          ),
                          DropdownMenuItem(
                            value: 'Ahli Gizi',
                            child: Text('Ahli Gizi'),
                          ),
                          DropdownMenuItem(
                            value: 'Kader Kesehatan',
                            child: Text('Kader Kesehatan'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() => _selectedKaderCategory = value);
                        },
                      ),
                      const SizedBox(height: 16),
                      // Nomor SIK/Lisensi
                      _InputField(
                        hintText: 'Nomor SIK / STR / Lisensi',
                        icon: Icons.card_membership,
                        fillColor: fieldFillColor,
                        controller: _sikController,
                        keyboardType: TextInputType.text,
                      ),
                      const SizedBox(height: 16),
                      // Tahun Bergabung (Date Picker)
                      Material(
                        child: InkWell(
                          onTap: () => _selectDate(context, true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                            decoration: BoxDecoration(
                              color: fieldFillColor,
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.calendar_month,
                                  color: Color(0xFF4DBFA3),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    _tahunBergabung == null
                                        ? 'Pilih Tahun Bergabung'
                                        : '${_tahunBergabung!.day}/${_tahunBergabung!.month}/${_tahunBergabung!.year}',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: _tahunBergabung == null
                                          ? const Color(0xFF9CA3AF)
                                          : Colors.black,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ] else ...[
                      // Fields SPESIFIK untuk Orang Tua
                      // Info Box Orang Tua
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFBFDBFE)),
                        ),
                        child: const Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.check_circle,
                              color: Color(0xFF0284C7),
                              size: 18,
                            ),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                'Pendaftaran langsung aktif: Bisa login dan akses aplikasi segera setelah daftar.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF0C4A6E),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Nama Anak
                      _InputField(
                        hintText: 'Nama Lengkap Anak',
                        icon: Icons.child_care,
                        fillColor: fieldFillColor,
                        controller: _childNameController,
                      ),
                      const SizedBox(height: 16),
                      // Tanggal Lahir Anak (Date Picker)
                      Material(
                        child: InkWell(
                          onTap: () => _selectDate(context, false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                            decoration: BoxDecoration(
                              color: fieldFillColor,
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.cake,
                                  color: Color(0xFF4DBFA3),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    _tanggalLahirAnak == null
                                        ? 'Pilih Tanggal Lahir Anak'
                                        : '${_tanggalLahirAnak!.day}/${_tanggalLahirAnak!.month}/${_tanggalLahirAnak!.year}',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: _tanggalLahirAnak == null
                                          ? const Color(0xFF9CA3AF)
                                          : Colors.black,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Alamat Rumah
                      _InputField(
                        hintText: 'Alamat Rumah Lengkap',
                        icon: Icons.home,
                        fillColor: fieldFillColor,
                        controller: _alamatController,
                      ),
                      const SizedBox(height: 16),
                      // Posyandu Terdekat
                      DropdownButtonFormField<String>(
                        value: _selectedPosyanduOrangTua,
                        isExpanded: true,
                        isDense: true,
                        decoration: InputDecoration(
                          labelText: 'Posyandu Terdekat dari Rumah',
                          labelStyle: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                          filled: true,
                          fillColor: fieldFillColor,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                          prefixIcon: const Icon(Icons.location_on_outlined),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(18),
                            borderSide: BorderSide.none,
                          ),
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
                        onChanged: (value) {
                          setState(() => _selectedPosyanduOrangTua = value);
                        },
                      ),
                      const SizedBox(height: 20),
                    ],
                    const SizedBox(height: 24),
                    if (_selectedRole == 'Kader')
                      // Tombol untuk Kader (Disabled - Pending Verification)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFFCD34D)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Row(
                              children: [
                                Icon(
                                  Icons.hourglass_bottom,
                                  color: Color(0xFFD97706),
                                ),
                                SizedBox(width: 8),
                                Text(
                                  'Proses Verifikasi',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFFB45309),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Setelah daftar, akun Anda akan masuk status "PENDING VERIFICATION" selama 1-3 hari kerja. Admin posyandu akan memverifikasi data dan lisensi Anda.',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF92400E),
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              height: 52,
                              child: ElevatedButton(
                                onPressed: _isLoading ? null : _handleRegister,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFD97706),
                                  foregroundColor: Colors.white,
                                  disabledBackgroundColor: const Color(0xFFD97706).withOpacity(0.6),
                                  disabledForegroundColor: Colors.white,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: _isLoading
                                    ? const SizedBox(
                                        width: 24,
                                        height: 24,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2.5,
                                        ),
                                      )
                                    : const Text(
                                        'Daftar (Menunggu Verifikasi Admin)',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      // Tombol untuk Orang Tua (Langsung Aktif)
                      SizedBox(
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleRegister,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryColor,
                            foregroundColor: Colors.white,
                            disabledBackgroundColor: primaryColor.withOpacity(0.6),
                            disabledForegroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: _isLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2.5,
                                  ),
                                )
                              : const Text(
                                  'Daftar & Login Sekarang',
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
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleButton extends StatelessWidget {
  const _RoleButton({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    return SizedBox(
      height: 52,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          backgroundColor: selected ? primaryColor : Colors.white,
          foregroundColor: selected ? Colors.white : primaryColor,
          side: BorderSide(color: primaryColor.withOpacity(0.4)),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

class _InputField extends StatelessWidget {
  const _InputField({
    required this.hintText,
    required this.icon,
    required this.fillColor,
    required this.controller,
    this.keyboardType,
    this.obscureText = false,
  });

  final String hintText;
  final IconData icon;
  final Color fillColor;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final bool obscureText;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: fillColor,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        prefixIcon: Icon(icon, color: const Color(0xFF4DBFA3)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
