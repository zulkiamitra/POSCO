import 'package:flutter/foundation.dart';
import 'package:posco_app/shared/api_client.dart';

class NutritionChildRecord {
  const NutritionChildRecord({
    required this.name,
    required this.parentName,
    required this.birthDate,
    required this.gender,
    required this.status,
    required this.createdAt,
    this.id,
    this.rawData,
  });

  final String name;
  final String parentName;
  final DateTime birthDate;
  final String gender;
  final String status;
  final DateTime createdAt;
  final String? id;
  final Map<String, dynamic>? rawData;

  NutritionChildRecord copyWith({
    String? name,
    String? parentName,
    DateTime? birthDate,
    String? gender,
    String? status,
    DateTime? createdAt,
    String? id,
    Map<String, dynamic>? rawData,
  }) {
    return NutritionChildRecord(
      name: name ?? this.name,
      parentName: parentName ?? this.parentName,
      birthDate: birthDate ?? this.birthDate,
      gender: gender ?? this.gender,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      id: id ?? this.id,
      rawData: rawData ?? this.rawData,
    );
  }
}

class NutritionTrendPoint {
  const NutritionTrendPoint({
    required this.label,
    required this.normal,
    required this.risk,
    required this.stunting,
  });

  final String label;
  final int normal;
  final int risk;
  final int stunting;
}

class NutritionStatsSummary {
  const NutritionStatsSummary({
    required this.totalChildren,
    required this.normalCount,
    required this.riskCount,
    required this.stuntingCount,
    required this.trendPoints,
  });

  final int totalChildren;
  final int normalCount;
  final int riskCount;
  final int stuntingCount;
  final List<NutritionTrendPoint> trendPoints;
}

class NutritionStatsRepository extends ChangeNotifier {
  NutritionStatsRepository._();

  static final NutritionStatsRepository instance = NutritionStatsRepository._();

  final List<NutritionChildRecord> _children = [];
  bool _isSyncing = false;

  List<NutritionChildRecord> get children => List.unmodifiable(_children);
  bool get isSyncing => _isSyncing;

  List<dynamic> _normalizeCheckupHistory(dynamic rawHistory) {
    if (rawHistory is! List) return [];
    return rawHistory.map((c) {
      if (c is! Map) return c;
      final map = Map<String, dynamic>.from(c);

      // Normalize Date/Tanggal
      var dateVal = map['tanggal']?.toString() ?? '';
      if (dateVal.isEmpty && map['date'] != null) {
        final dateStr = map['date'].toString().toLowerCase().trim();
        final parts = dateStr.split(RegExp(r'\s+'));
        if (parts.length == 3) {
          final indMonths = {
            'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'mei': '05', 'juni': '06',
            'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
          };
          final day = parts[0].padLeft(2, '0');
          final month = indMonths[parts[1]] ?? '01';
          final year = parts[2];
          dateVal = '$year-$month-$day';
        } else {
          final slashParts = dateStr.split('/');
          if (slashParts.length == 3) {
            final day = slashParts[0].padLeft(2, '0');
            final month = slashParts[1].padLeft(2, '0');
            final year = slashParts[2];
            dateVal = '$year-$month-$day';
          }
        }
      }
      if (dateVal.isEmpty) {
        dateVal = DateTime.now().toIso8601String().split('T')[0];
      }

      var dateFormatted = map['date']?.toString() ?? '';
      if (dateFormatted.isEmpty && dateVal.isNotEmpty) {
        try {
          final parsed = DateTime.parse(dateVal);
          final months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          dateFormatted = '${parsed.day} ${months[parsed.month - 1]} ${parsed.year}';
        } catch (_) {}
      }
      if (dateFormatted.startsWith(RegExp(r'\d{4}-\d{2}-\d{2}'))) {
        try {
          final parsed = DateTime.parse(dateFormatted);
          final months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          dateFormatted = '${parsed.day} ${months[parsed.month - 1]} ${parsed.year}';
        } catch (_) {}
      }

      // Parse double helper
      double parseDouble(dynamic val) {
        if (val is num) return val.toDouble();
        if (val is String) {
          final cleaned = val.replaceAll(RegExp(r'[^\d.,]'), '').replaceAll(',', '.');
          return double.tryParse(cleaned) ?? 0.0;
        }
        return 0.0;
      }

      // Format string helper
      String formatStr(dynamic val, String unit) {
        if (val == null || val == '-') return '-';
        final s = val.toString();
        if (s.endsWith(unit)) return s;
        return '$s $unit';
      }

      final double bb = map['bb'] != null ? parseDouble(map['bb']) : (map['weight'] != null ? parseDouble(map['weight']) : 0.0);
      final String weight = map['weight']?.toString() ?? formatStr(bb, 'kg');

      final double tb = map['tb'] != null ? parseDouble(map['tb']) : (map['height'] != null ? parseDouble(map['height']) : 0.0);
      final String height = map['height']?.toString() ?? formatStr(tb, 'cm');

      final double lingkarLengan = map['lingkarLengan'] != null ? parseDouble(map['lingkarLengan']) : (map['arm'] != null ? parseDouble(map['arm']) : 0.0);
      final String arm = map['arm']?.toString() ?? formatStr(lingkarLengan, 'cm');

      final double lingkarKepala = map['lingkarKepala'] != null ? parseDouble(map['lingkarKepala']) : (map['headCircumference'] != null ? parseDouble(map['headCircumference']) : 0.0);
      final String headCircumference = map['headCircumference']?.toString() ?? formatStr(lingkarKepala, 'cm');

      final String statusGizi = map['statusGizi']?.toString() ?? map['status']?.toString() ?? 'Normal';
      final String status = map['status']?.toString() ?? map['statusGizi']?.toString() ?? 'Normal';

      final String note = map['note']?.toString() ?? map['catatan']?.toString() ?? '';
      final String catatan = map['catatan']?.toString() ?? map['note']?.toString() ?? '';

      final String location = map['location']?.toString() ?? map['tempat']?.toString() ?? 'Posyandu Melati - Kec. Padang Timur';
      final String tempat = map['tempat']?.toString() ?? map['location']?.toString() ?? 'Posyandu Melati - Kec. Padang Timur';

      final services = map['services'] ?? map['layanan'] ?? [];
      final layanan = map['layanan'] ?? map['services'] ?? [];

      return {
        'tanggal': dateVal,
        'date': dateFormatted,
        'bb': bb,
        'weight': weight,
        'tb': tb,
        'height': height,
        'lingkarKepala': lingkarKepala,
        'headCircumference': headCircumference,
        'lingkarLengan': lingkarLengan,
        'arm': arm,
        'statusGizi': statusGizi,
        'status': status,
        'note': note,
        'catatan': catatan,
        'location': location,
        'tempat': tempat,
        'services': services,
        'layanan': layanan,
      };
    }).toList();
  }

  Future<void> syncFromApi() async {
    _isSyncing = true;
    notifyListeners();

    try {
      final apiChildren = await ApiClient.instance.fetchChildren();
      _children.clear();
      for (final item in apiChildren) {
        final id = item['id']?.toString() ?? '';
        final name = item['name'] ?? '';
        final motherName = item['motherName'] ?? '';
        
        DateTime birthDate = DateTime.now();
        if (item['birthDate'] != null) {
          try {
            birthDate = DateTime.parse(item['birthDate']);
          } catch (_) {}
        }
        
        final gender = item['gender'] ?? 'Laki-laki';
        final status = item['nutritionStatus'] ?? 'Normal';
        
        DateTime createdAt = DateTime.now();
        if (item['createdAt'] != null) {
          try {
            createdAt = DateTime.parse(item['createdAt']);
          } catch (_) {}
        }

        final normalizedItem = Map<String, dynamic>.from(item);
        if (normalizedItem['checkupHistory'] != null) {
          normalizedItem['checkupHistory'] = _normalizeCheckupHistory(normalizedItem['checkupHistory']);
        }

        _children.add(
          NutritionChildRecord(
            id: id,
            name: name,
            parentName: motherName,
            birthDate: birthDate,
            gender: gender,
            status: status,
            createdAt: createdAt,
            rawData: normalizedItem,
          ),
        );
      }
    } catch (e) {
      debugPrint('Sync failed: $e');
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
  }

  Future<bool> upsertChild(NutritionChildRecord child, {String? id}) async {
    final Map<String, dynamic> childData = {
      'name': child.name,
      'motherName': child.parentName,
      'birthDate': child.birthDate.toIso8601String(),
      'gender': child.gender,
      'nutritionStatus': child.status,
      'stuntingStatus': child.status,
      if (child.rawData?['checkupHistory'] != null)
        'checkupHistory': _normalizeCheckupHistory(child.rawData!['checkupHistory']),
      if (child.rawData?['immunization'] != null)
        'immunization': child.rawData!['immunization'],
      if (child.rawData?['height'] != null)
        'height': child.rawData!['height'],
      if (child.rawData?['weight'] != null)
        'weight': child.rawData!['weight'],
    };

    bool success = false;
    if (id != null || child.id != null) {
      final targetId = id ?? child.id!;
      final res = await ApiClient.instance.updateChild(targetId, childData);
      success = res['success'] == true;
    } else {
      final res = await ApiClient.instance.createChild(childData);
      success = res['success'] == true;
    }

    if (success) {
      await syncFromApi();
    }
    return success;
  }

  NutritionStatsSummary get summary {
    var normalCount = 0;
    var riskCount = 0;
    var stuntingCount = 0;

    for (final child in _children) {
      switch (child.status.trim().toLowerCase()) {
        case 'berisiko':
          riskCount++;
          break;
        case 'stunting':
          stuntingCount++;
          break;
        default:
          normalCount++;
          break;
      }
    }

    return NutritionStatsSummary(
      totalChildren: _children.length,
      normalCount: normalCount,
      riskCount: riskCount,
      stuntingCount: stuntingCount,
      trendPoints: _buildTrendPoints(),
    );
  }

  List<NutritionTrendPoint> _buildTrendPoints() {
    if (_children.isEmpty) {
      return const [];
    }

    final sortedChildren = [..._children]
      ..sort((left, right) => left.createdAt.compareTo(right.createdAt));

    var normalCount = 0;
    var riskCount = 0;
    var stuntingCount = 0;

    return List.generate(sortedChildren.length, (index) {
      final child = sortedChildren[index];
      switch (child.status.trim().toLowerCase()) {
        case 'berisiko':
          riskCount++;
          break;
        case 'stunting':
          stuntingCount++;
          break;
        default:
          normalCount++;
          break;
      }

      return NutritionTrendPoint(
        label: _formatShortDate(child.createdAt),
        normal: normalCount,
        risk: riskCount,
        stunting: stuntingCount,
      );
    });
  }

  String _formatShortDate(DateTime dateTime) {
    final day = dateTime.day.toString().padLeft(2, '0');
    final month = dateTime.month.toString().padLeft(2, '0');
    return '$day/$month';
  }
}
