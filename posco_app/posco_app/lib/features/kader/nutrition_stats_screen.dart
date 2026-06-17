import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:posco_app/shared/nutrition_stats_repository.dart';

class NutritionStatsScreen extends StatelessWidget {
  const NutritionStatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF4DBFA3);
    const warningColor = Color(0xFFF59E0B);
    const dangerColor = Color(0xFFEF4444);

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F6),
      appBar: AppBar(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
        ),
        title: const Text(
          'STATISTIK GIZI',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: AnimatedBuilder(
          animation: NutritionStatsRepository.instance,
          builder: (context, _) {
            final summary = NutritionStatsRepository.instance.summary;

            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
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
                          color: Colors.black.withAlpha(13),
                          blurRadius: 14,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: primaryColor.withAlpha(31),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.auto_graph_rounded,
                            color: primaryColor,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'STATISTIK POSYANDU',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Data berubah otomatis saat data anak disimpan.',
                                style: TextStyle(
                                  color: Color(0xFF6B7280),
                                  fontWeight: FontWeight.w600,
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: primaryColor.withAlpha(31),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Text(
                            'Realtime',
                            style: TextStyle(
                              color: primaryColor,
                              fontWeight: FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F7F3),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.trending_up, color: primaryColor),
                            SizedBox(width: 10),
                            Text(
                              'DIAGRAM GARIS GIZI',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF111827),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Setiap titik menunjukkan jumlah anak yang tersimpan dari waktu ke waktu.',
                          style: TextStyle(
                            color: Color(0xFF6B7280),
                            fontWeight: FontWeight.w600,
                            height: 1.35,
                          ),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          height: 250,
                          child: summary.trendPoints.isEmpty
                              ? const Center(
                                  child: Text(
                                    'Belum ada data untuk digrafikkan',
                                    style: TextStyle(
                                      color: Color(0xFF6B7280),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                )
                              : _NutritionLineChart(
                                  points: summary.trendPoints,
                                ),
                        ),
                        const SizedBox(height: 16),
                        const _LegendChip(
                          label:
                              'Garis ini menunjukkan total anak, bukan persentase.',
                          color: primaryColor,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _SummaryTile(
                          label: 'Normal',
                          value: summary.normalCount,
                          color: primaryColor,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _SummaryTile(
                          label: 'Berisiko',
                          value: summary.riskCount,
                          color: warningColor,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _SummaryTile(
                          label: 'Stunting',
                          value: summary.stuntingCount,
                          color: dangerColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(10),
                          blurRadius: 12,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.people_alt_outlined,
                          color: primaryColor,
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            'Total anak tercatat',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ),
                        Text(
                          '${summary.totalChildren}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF111827),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _LegendChip extends StatelessWidget {
  const _LegendChip({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withAlpha(31),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final int value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(10),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(color: color.withAlpha(36)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '$value',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w800,
              fontSize: 22,
            ),
          ),
        ],
      ),
    );
  }
}

class _NutritionLineChart extends StatelessWidget {
  const _NutritionLineChart({required this.points});

  final List<NutritionTrendPoint> points;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return CustomPaint(
          painter: _NutritionLineChartPainter(points),
          size: Size(constraints.maxWidth, constraints.maxHeight),
        );
      },
    );
  }
}

class _NutritionLineChartPainter extends CustomPainter {
  _NutritionLineChartPainter(this.points);

  final List<NutritionTrendPoint> points;

  @override
  void paint(Canvas canvas, Size size) {
    const gridColor = Color(0xFFD9E7E1);
    const labelColor = Color(0xFF6B7280);
    const backgroundColor = Color(0xFFF8FBF9);
    const lineColor = Color(0xFF4DBFA3);
    final chartRect = Offset.zero & size;
    final chartPaint = Paint()..color = backgroundColor;
    canvas.drawRRect(
      RRect.fromRectAndRadius(chartRect, const Radius.circular(18)),
      chartPaint,
    );

    const leftPadding = 42.0;
    const topPadding = 18.0;
    const rightPadding = 18.0;
    const bottomPadding = 32.0;

    final plotLeft = leftPadding;
    final plotTop = topPadding;
    final plotWidth = math.max(0.0, size.width - leftPadding - rightPadding);
    final plotHeight = math.max(0.0, size.height - topPadding - bottomPadding);
    final plotBottom = plotTop + plotHeight;

    final maxValue = math.max(1, points.length);

    final gridSteps = math.min(4, math.max(1, maxValue));
    final gridPaint = Paint()
      ..color = gridColor
      ..strokeWidth = 1;

    for (var index = 0; index <= gridSteps; index++) {
      final y = plotTop + (plotHeight / gridSteps) * index;
      canvas.drawLine(
        Offset(plotLeft, y),
        Offset(size.width - rightPadding, y),
        gridPaint,
      );

      final tickValue = ((maxValue / gridSteps) * (gridSteps - index)).round();
      _drawText(
        canvas,
        '$tickValue',
        const TextStyle(
          color: labelColor,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
        Offset(4, y - 7),
        maxWidth: leftPadding - 8,
      );
    }

    final xStep = points.length == 1
        ? plotWidth / 2
        : plotWidth / (points.length - 1);

    final values = List<int>.generate(points.length, (index) => index + 1);
    final linePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = lineColor;

    final fillPaint = Paint()
      ..style = PaintingStyle.fill
      ..color = lineColor.withAlpha(36);

    final pts = <Offset>[];
    for (var i = 0; i < values.length; i++) {
      final dx = plotLeft + xStep * i;
      final dy = plotBottom - ((values[i] / maxValue) * plotHeight);
      pts.add(Offset(dx, dy));
    }

    if (pts.isNotEmpty) {
      final path = Path()..moveTo(pts.first.dx, pts.first.dy);

      if (pts.length == 1) {
        path.lineTo(pts.first.dx + 0.1, pts.first.dy);
      } else if (pts.length == 2) {
        path.quadraticBezierTo(
          (pts[0].dx + pts[1].dx) / 2,
          (pts[0].dy + pts[1].dy) / 2,
          pts[1].dx,
          pts[1].dy,
        );
      } else {
        for (var i = 0; i < pts.length - 1; i++) {
          final p0 = i - 1 < 0 ? pts[i] : pts[i - 1];
          final p1 = pts[i];
          final p2 = pts[i + 1];
          final p3 = i + 2 < pts.length ? pts[i + 2] : p2;

          final control1 = Offset(
            p1.dx + (p2.dx - p0.dx) / 6,
            p1.dy + (p2.dy - p0.dy) / 6,
          );
          final control2 = Offset(
            p2.dx - (p3.dx - p1.dx) / 6,
            p2.dy - (p3.dy - p1.dy) / 6,
          );

          path.cubicTo(
            control1.dx,
            control1.dy,
            control2.dx,
            control2.dy,
            p2.dx,
            p2.dy,
          );
        }
      }

      final fillPath = Path.from(path)
        ..lineTo(pts.last.dx, plotBottom)
        ..lineTo(pts.first.dx, plotBottom)
        ..close();

      canvas.drawPath(fillPath, fillPaint);
      canvas.drawPath(path, linePaint);

      for (final pt in pts) {
        _drawSeriesDot(canvas, pt, lineColor);
      }
    }

    // x-axis labels
    for (var index = 0; index < points.length; index++) {
      final dx = plotLeft + xStep * index;
      _drawText(
        canvas,
        points[index].label,
        const TextStyle(
          color: labelColor,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
        Offset(dx - 18, plotBottom + 6),
        maxWidth: 48,
      );
    }
  }

  void _drawSeriesDot(Canvas canvas, Offset offset, Color color) {
    final outerPaint = Paint()..color = Colors.white;
    final innerPaint = Paint()..color = color;
    canvas.drawCircle(offset, 6, outerPaint);
    canvas.drawCircle(offset, 4, innerPaint);
  }

  void _drawText(
    Canvas canvas,
    String text,
    TextStyle style,
    Offset offset, {
    double maxWidth = 60,
  }) {
    final painter = TextPainter(
      text: TextSpan(text: text, style: style),
      textDirection: TextDirection.ltr,
      textAlign: TextAlign.center,
      maxLines: 1,
      ellipsis: '...',
    )..layout(maxWidth: maxWidth);
    painter.paint(canvas, offset);
  }

  @override
  bool shouldRepaint(covariant _NutritionLineChartPainter oldDelegate) {
    return oldDelegate.points != points;
  }
}
