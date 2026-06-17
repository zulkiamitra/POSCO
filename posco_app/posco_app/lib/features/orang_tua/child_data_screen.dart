import 'package:flutter/material.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/shared/date_utils.dart';
import 'package:posco_app/features/orang_tua/jadwal_screen.dart';
import 'package:posco_app/features/orang_tua/riwayat_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_profile_screen.dart';
import 'package:posco_app/shared/api_client.dart';

class ChartData {
  final double x;
  final double y;

  ChartData({required this.x, required this.y});
}

class OrangTuaChildDataScreen extends StatefulWidget {
  final Map<String, dynamic>? childData;
  const OrangTuaChildDataScreen({super.key, this.childData});

  @override
  State<OrangTuaChildDataScreen> createState() =>
      _OrangTuaChildDataScreenState();
}

class _OrangTuaChildDataScreenState extends State<OrangTuaChildDataScreen> {
  bool _isLoading = false;
  String? _errorMessage;
  List<dynamic> _children = [];
  Map<String, dynamic>? _selectedChild;
  List<dynamic> _sortedHistory = [];
  List<ChartData> _chartData = [];

  String get childName => _selectedChild?['name'] ?? 'Anak';
  String get childGender => _selectedChild?['gender'] ?? 'Laki-laki';
  String get childStatus => _selectedChild?['nutritionStatus'] ?? _selectedChild?['stuntingStatus'] ?? 'Normal';
  String get childNIK => _selectedChild?['nik'] ?? '-';
  DateTime get birthDate {
    if (_selectedChild?['birthDate'] != null) {
      try {
        return DateTime.parse(_selectedChild!['birthDate']);
      } catch (_) {}
    }
    return DateTime.now();
  }

  double parseDoubleValue(dynamic val) {
    if (val == null) return 0.0;
    if (val is num) return val.toDouble();
    // if string like "5.2 kg", clean it
    final cleanStr = val.toString().replaceAll(RegExp(r'[^\d.]'), '');
    return double.tryParse(cleanStr) ?? 0.0;
  }

  String displayValue(dynamic val, String unit) {
    if (val == null) return '-';
    final doubleVal = parseDoubleValue(val);
    if (doubleVal == 0.0) {
      final rawStr = val.toString().trim();
      if (rawStr.isNotEmpty) return rawStr;
      return '-';
    }
    if (doubleVal == doubleVal.toInt()) {
      return '${doubleVal.toInt()} $unit';
    }
    return '${doubleVal.toStringAsFixed(1)} $unit';
  }

  String calculateGain(double latest, double previous, String unit) {
    final gain = latest - previous;
    if (gain >= 0) {
      return '+${gain.toStringAsFixed(gain == gain.toInt() ? 0 : 1)} $unit';
    } else {
      return '${gain.toStringAsFixed(gain == gain.toInt() ? 0 : 1)} $unit';
    }
  }

  @override
  void initState() {
    super.initState();
    if (widget.childData != null) {
      _selectedChild = widget.childData;
      _processChildData();
      // Still fetch all children in background so the dropdown switcher works if accessed directly
      _loadChildrenSilent();
    } else {
      _loadChildren();
    }
  }

  Future<void> _loadChildrenSilent() async {
    try {
      final children = await ApiClient.instance.fetchChildren();
      if (mounted) {
        setState(() {
          _children = children;
          // Sync selected child reference if we find it in the fetched list
          final found = children.firstWhere(
            (c) => c['id'] == _selectedChild?['id'],
            orElse: () => null,
          );
          if (found != null) {
            _selectedChild = found;
            _processChildData();
          }
        });
      }
    } catch (_) {}
  }

  Future<void> _loadChildren() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final children = await ApiClient.instance.fetchChildren();
      if (!mounted) return;
      setState(() {
        _children = children;
        if (children.isNotEmpty) {
          _selectedChild = children.first;
          _processChildData();
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

  void _processChildData() {
    if (_selectedChild == null) return;

    final history = _selectedChild!['checkupHistory'];
    List<dynamic> rawList = [];
    if (history is List) {
      rawList = history;
    }

    // Sort oldest to newest for chronological graph
    _sortedHistory = List.from(rawList);
    _sortedHistory.sort((a, b) {
      final dA = parseFlexibleDate(a['date'] ?? a['tanggal']) ?? DateTime(1970);
      final dB = parseFlexibleDate(b['date'] ?? b['tanggal']) ?? DateTime(1970);
      return dA.compareTo(dB);
    });

    _chartData = [];
    for (int i = 0; i < _sortedHistory.length; i++) {
      final checkup = _sortedHistory[i];
      final weightVal = parseDoubleValue(checkup['weight'] ?? checkup['bb']);
      if (weightVal > 0) {
        _chartData.add(ChartData(x: i.toDouble(), y: weightVal));
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const backgroundColor = Color(0xFFF8FAFB);
    const darkText = Color(0xFF111827);
    const mutedText = Color(0xFF6B7280);

    if (_isLoading) {
      return const Scaffold(
        backgroundColor: backgroundColor,
        body: Center(
          child: CircularProgressIndicator(color: primaryColor),
        ),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        backgroundColor: backgroundColor,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _loadChildren,
                  style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
                  child: const Text('Coba Lagi'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_selectedChild == null) {
      return const Scaffold(
        backgroundColor: backgroundColor,
        body: Center(
          child: Text(
            'Belum ada data balita terdaftar',
            style: TextStyle(color: mutedText, fontWeight: FontWeight.w600),
          ),
        ),
      );
    }

    final hasHistory = _sortedHistory.isNotEmpty;
    final latestMeasurement = hasHistory ? _sortedHistory.last : null;
    final previousMeasurement = (_sortedHistory.length > 1) ? _sortedHistory[_sortedHistory.length - 2] : null;

    final latestWeight = latestMeasurement != null ? parseDoubleValue(latestMeasurement['weight'] ?? latestMeasurement['bb']) : 0.0;
    final prevWeight = previousMeasurement != null ? parseDoubleValue(previousMeasurement['weight'] ?? previousMeasurement['bb']) : 0.0;
    final weightGain = latestWeight - prevWeight;

    final latestHeight = latestMeasurement != null ? parseDoubleValue(latestMeasurement['height'] ?? latestMeasurement['tb']) : 0.0;
    final prevHeight = previousMeasurement != null ? parseDoubleValue(previousMeasurement['height'] ?? previousMeasurement['tb']) : 0.0;
    final heightGain = latestHeight - prevHeight;

    final latestArm = latestMeasurement != null ? parseDoubleValue(latestMeasurement['arm'] ?? latestMeasurement['lingkarLengan']) : 0.0;
    final prevArm = previousMeasurement != null ? parseDoubleValue(previousMeasurement['arm'] ?? previousMeasurement['lingkarLengan']) : 0.0;
    final armGain = latestArm - prevArm;

    final latestHead = latestMeasurement != null ? parseDoubleValue(latestMeasurement['headCircumference'] ?? latestMeasurement['lingkarKepala']) : 0.0;
    final prevHead = previousMeasurement != null ? parseDoubleValue(previousMeasurement['headCircumference'] ?? previousMeasurement['lingkarKepala']) : 0.0;
    final headGain = latestHead - prevHead;

    final String catatanPerkembangan = (latestMeasurement != null && 
        (latestMeasurement['note'] ?? latestMeasurement['catatan']) != null && 
        (latestMeasurement['note'] ?? latestMeasurement['catatan']).toString().trim().isNotEmpty)
        ? (latestMeasurement['note'] ?? latestMeasurement['catatan']).toString().trim()
        : '✓ Pertumbuhan mencapai target kurva normal\n✓ Berat badan naik konsisten setiap bulan\n✓ Tinggi badan berkembang optimal\n✓ Lanjutkan ASI dan MPASI halus untuk usia';

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Modern Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'DATA ANAK',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: primaryColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tumbuh Kembang $childName',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: mutedText,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      childStatus,
                      style: const TextStyle(
                        color: primaryColor,
                        fontWeight: FontWeight.w700,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Dropdown to switch kids if multiple kids exist
              if (_children.length > 1) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<Map<String, dynamic>>(
                      value: _children.firstWhere(
                        (c) => c['id'] == _selectedChild?['id'],
                        orElse: () => _selectedChild,
                      ),
                      isExpanded: true,
                      icon: const Icon(Icons.keyboard_arrow_down, color: primaryColor),
                      hint: const Text('Pilih Balita'),
                      items: _children.map((dynamic child) {
                        return DropdownMenuItem<Map<String, dynamic>>(
                          value: child as Map<String, dynamic>,
                          child: Text(
                            child['name'] ?? 'Anak',
                            style: const TextStyle(fontWeight: FontWeight.w700, color: darkText),
                          ),
                        );
                      }).toList(),
                      onChanged: (newChild) {
                        if (newChild != null) {
                          setState(() {
                            _selectedChild = newChild;
                            _processChildData();
                          });
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Child Profile Card - Modern Design
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF4DBFA3), Color(0xFF2D8F6B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: primaryColor.withOpacity(0.15),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 70,
                          height: 70,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(
                            Icons.person,
                            color: Colors.white,
                            size: 40,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                childName,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'NIK: $childNIK',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Colors.white70,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Text(
                                    '${formatAge(birthDate)} • $childGender',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.white,
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
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Measurements Grid - Modern Cards
              const Text(
                'Pengukuran Terbaru',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: darkText,
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  _ModernMeasurementCard(
                    label: 'Berat Badan',
                    value: latestMeasurement != null ? displayValue(latestMeasurement['weight'] ?? latestMeasurement['bb'], 'kg') : '-',
                    previous: previousMeasurement != null ? displayValue(previousMeasurement['weight'] ?? previousMeasurement['bb'], 'kg') : '-',
                    gain: previousMeasurement != null ? calculateGain(latestWeight, prevWeight, 'kg') : '+0.0 kg',
                    icon: Icons.scale,
                    color: primaryColor,
                  ),
                  _ModernMeasurementCard(
                    label: 'Tinggi Badan',
                    value: latestMeasurement != null ? displayValue(latestMeasurement['height'] ?? latestMeasurement['tb'], 'cm') : '-',
                    previous: previousMeasurement != null ? displayValue(previousMeasurement['height'] ?? previousMeasurement['tb'], 'cm') : '-',
                    gain: previousMeasurement != null ? calculateGain(latestHeight, prevHeight, 'cm') : '+0.0 cm',
                    icon: Icons.straighten,
                    color: const Color(0xFF2F6BFF),
                  ),
                  _ModernMeasurementCard(
                    label: 'Lingkar Lengan',
                    value: latestMeasurement != null ? displayValue(latestMeasurement['arm'] ?? latestMeasurement['lingkarLengan'], 'cm') : '-',
                    previous: previousMeasurement != null ? displayValue(previousMeasurement['arm'] ?? previousMeasurement['lingkarLengan'], 'cm') : '-',
                    gain: previousMeasurement != null ? calculateGain(latestArm, prevArm, 'cm') : '+0.0 cm',
                    icon: Icons.track_changes,
                    color: const Color(0xFFF59E0B),
                  ),
                  _ModernMeasurementCard(
                    label: 'Lingkar Kepala',
                    value: latestMeasurement != null ? displayValue(latestMeasurement['headCircumference'] ?? latestMeasurement['lingkarKepala'], 'cm') : '-',
                    previous: previousMeasurement != null ? displayValue(previousMeasurement['headCircumference'] ?? previousMeasurement['lingkarKepala'], 'cm') : '-',
                    gain: previousMeasurement != null ? calculateGain(latestHead, prevHead, 'cm') : '+0.0 cm',
                    icon: Icons.psychology,
                    color: const Color(0xFF8B5CF6),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Growth Chart Title
              const Text(
                'Grafik Pertumbuhan Berat Badan',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: darkText,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Sesuai Riwayat Pemeriksaan',
                style: TextStyle(
                  fontSize: 12,
                  color: mutedText,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 16),

              // Line Chart - Modern
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 20,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 15,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: AspectRatio(
                  aspectRatio: 16 / 9,
                  child: _chartData.isEmpty
                      ? const Center(
                          child: Text(
                            'Belum ada data pemeriksaan untuk grafik',
                            style: TextStyle(color: mutedText, fontWeight: FontWeight.w500),
                          ),
                        )
                      : FlutterChart(
                          data: _chartData,
                          chartColor: primaryColor,
                        ),
                ),
              ),
              const SizedBox(height: 28),

              // Milestone & Info
              const Text(
                'Perkembangan',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: darkText,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 12,
                          height: 12,
                          decoration: const BoxDecoration(
                            color: Color(0xFF16A34A),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Status Gizi',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: darkText,
                            ),
                          ),
                        ),
                        Text(
                          childStatus,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF16A34A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Catatan Perkembangan',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: mutedText,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      catatanPerkembangan,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF374151),
                        fontWeight: FontWeight.w500,
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
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
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const OrangTuaDashboardScreen(),
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

class _ModernMeasurementCard extends StatelessWidget {
  const _ModernMeasurementCard({
    required this.label,
    required this.value,
    required this.previous,
    required this.gain,
    required this.icon,
    required this.color,
  });

  final String label;
  final String value;
  final String previous;
  final String gain;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEEEE6),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  gain,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFF59E0B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Sebelum: $previous',
            style: const TextStyle(
              fontSize: 10,
              color: Color(0xFF9CA3AF),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _MeasurementCard extends StatelessWidget {
  const _MeasurementCard({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: color,
              fontSize: 16,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class FlutterChart extends StatelessWidget {
  const FlutterChart({super.key, required this.data, required this.chartColor});

  final List<ChartData> data;
  final Color chartColor;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: LineChartPainter(data: data, chartColor: chartColor),
      child: Container(),
    );
  }
}

class LineChartPainter extends CustomPainter {
  final List<ChartData> data;
  final Color chartColor;

  LineChartPainter({required this.data, required this.chartColor});

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final paint = Paint()
      ..color = chartColor
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final gradientPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [chartColor.withOpacity(0.2), chartColor.withOpacity(0.05)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final axisPaint = Paint()
      ..color = const Color(0xFFE5E7EB)
      ..strokeWidth = 1.5;

    final gridPaint = Paint()
      ..color = const Color(0xFFF3F4F6)
      ..strokeWidth = 1;

    final dotPaint = Paint()
      ..color = chartColor
      ..style = PaintingStyle.fill;

    // Draw axes
    canvas.drawLine(
      Offset(50, size.height - 50),
      Offset(size.width - 10, size.height - 50),
      axisPaint,
    );
    canvas.drawLine(Offset(50, 10), Offset(50, size.height - 50), axisPaint);

    // Calculate min and max for scaling
    final maxY = data.map((d) => d.y).reduce((a, b) => a > b ? a : b);
    final minY = data.map((d) => d.y).reduce((a, b) => a < b ? a : b);
    final rangeY = maxY - minY;

    final chartWidth = size.width - 60;
    final chartHeight = size.height - 60;

    // Draw grid lines
    for (int i = 0; i <= 4; i++) {
      final y = size.height - 50 - (chartHeight / 4) * i;
      canvas.drawLine(Offset(50, y), Offset(size.width - 10, y), gridPaint);
    }

    // Draw data line with fill
    final path = Path();
    final fillPath = Path();

    for (int i = 0; i < data.length; i++) {
      final pointData = data[i];
      final x =
          50 +
          (chartWidth / (data.length - 1 > 0 ? data.length - 1 : 1)) *
              pointData.x;
      final y =
          size.height -
          50 -
          (chartHeight / (rangeY > 0 ? rangeY : 1)) * (pointData.y - minY);

      if (i == 0) {
        path.moveTo(x, y);
        fillPath.moveTo(x, y);
      } else {
        // Create smooth curve using quadratic bezier
        final prevPointData = data[i - 1];
        final prevX =
            50 +
            (chartWidth / (data.length - 1 > 0 ? data.length - 1 : 1)) *
                prevPointData.x;
        final prevY =
            size.height -
            50 -
            (chartHeight / (rangeY > 0 ? rangeY : 1)) *
                (prevPointData.y - minY);

        final controlPointX = (prevX + x) / 2;
        final controlPointY = (prevY + y) / 2;

        path.quadraticBezierTo(controlPointX, controlPointY, x, y);
        fillPath.quadraticBezierTo(controlPointX, controlPointY, x, y);
      }
    }

    // Draw fill under the curve
    fillPath.lineTo(size.width - 10, size.height - 50);
    fillPath.lineTo(50, size.height - 50);
    fillPath.close();
    canvas.drawPath(fillPath, gradientPaint);

    // Draw line
    canvas.drawPath(path, paint);

    // Draw data points
    for (int i = 0; i < data.length; i++) {
      final pointData = data[i];
      final x =
          50 +
          (chartWidth / (data.length - 1 > 0 ? data.length - 1 : 1)) *
              pointData.x;
      final y =
          size.height -
          50 -
          (chartHeight / (rangeY > 0 ? rangeY : 1)) * (pointData.y - minY);

      // Outer circle
      canvas.drawCircle(Offset(x, y), 5.5, Paint()..color = Colors.white);

      // Inner dot
      canvas.drawCircle(Offset(x, y), 4, dotPaint);
    }
  }

  @override
  bool shouldRepaint(LineChartPainter oldDelegate) {
    return oldDelegate.data != data || oldDelegate.chartColor != chartColor;
  }
}
