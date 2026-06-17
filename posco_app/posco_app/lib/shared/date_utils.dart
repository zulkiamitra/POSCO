String formatAge(DateTime birth) {
  final now = DateTime.now();
  int years = now.year - birth.year;
  int months = now.month - birth.month;
  int days = now.day - birth.day;

  if (days < 0) {
    final prevMonth = DateTime(now.year, now.month, 0);
    days += prevMonth.day;
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    if (months > 0) return '$years tahun $months bulan';
    return '$years tahun';
  }
  if (months > 0) return '$months bulan';
  return '$days hari';
}

DateTime? parseFlexibleDate(String? dateStr) {
  if (dateStr == null || dateStr.trim().isEmpty) return null;

  // Try ISO parse first
  final parsed = DateTime.tryParse(dateStr);
  if (parsed != null) return parsed;

  // Try parsing Indonesian format (e.g. "10 Februari 2026", or with day name "Senin, 10 Februari 2026")
  try {
    String cleanStr = dateStr.replaceAll(RegExp(r'^[a-zA-Z]+,\s*'), '').trim(); // Remove day names like "Senin, "
    final parts = cleanStr.split(RegExp(r'\s+'));
    if (parts.length >= 3) {
      final day = int.tryParse(parts[0]);
      final monthName = parts[1].toLowerCase();
      final year = int.tryParse(parts[2]);

      if (day != null && year != null) {
        final monthMap = {
          'januari': 1, 'jan': 1,
          'februari': 2, 'feb': 2,
          'maret': 3, 'mar': 3,
          'april': 4, 'apr': 4,
          'mei': 5,
          'juni': 6, 'jun': 6,
          'juli': 7, 'jul': 7,
          'agustus': 8, 'agt': 8, 'agu': 8,
          'september': 9, 'sep': 9,
          'oktober': 10, 'okt': 10,
          'november': 11, 'nov': 11,
          'desember': 12, 'des': 12
        };
        final month = monthMap[monthName];
        if (month != null) {
          return DateTime(year, month, day);
        }
      }
    }
  } catch (_) {}

  return null;
}

