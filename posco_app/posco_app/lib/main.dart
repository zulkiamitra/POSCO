import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:posco_app/features/shared/splash_screen.dart';

void main() {
  runApp(const PoscoApp());
}

class PoscoApp extends StatelessWidget {
  const PoscoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'POSCO',
      debugShowCheckedModeBanner: false,
      locale: const Locale('id', 'ID'),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [Locale('id', 'ID'), Locale('en', 'US')],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('POSCO - Home'), centerTitle: true),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.dashboard, size: 80, color: Colors.blue),
            const SizedBox(height: 20),
            const Text(
              'Selamat Datang di POSCO',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              'Production Scanning and Control Operations',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Fitur akan segera tersedia')),
                );
              },
              icon: const Icon(Icons.start),
              label: const Text('Mulai'),
            ),
          ],
        ),
      ),
    );
  }
}
