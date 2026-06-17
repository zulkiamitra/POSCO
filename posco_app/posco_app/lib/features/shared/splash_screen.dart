import 'package:flutter/material.dart';
import 'package:posco_app/features/auth/login_screen.dart';
import 'package:posco_app/features/kader/kader_dashboard_screen.dart';
import 'package:posco_app/features/orang_tua/orang_tua_dashboard_screen.dart';
import 'package:posco_app/shared/api_client.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToHome();
  }

  Future<void> _navigateToHome() async {
    // Initialize API Client to check saved session
    await ApiClient.instance.init();
    
    await Future.delayed(const Duration(seconds: 2), () {});
    
    if (!mounted) return;

    final token = ApiClient.instance.token;
    final user = ApiClient.instance.currentUser;

    if (token != null && user != null) {
      final role = user['role'];
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => role == 'kader'
              ? const KaderDashboardScreen()
              : const OrangTuaDashboardScreen(),
        ),
      );
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(color: Color(0xFF4DBFA3)),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: Color(0xFF7C8892), width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 12,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Image.asset(
                    'assets/logo_posco.png',
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'POSCO',
                style: TextStyle(
                  fontSize: 44,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Manajemen Posyandu Digital',
                style: TextStyle(fontSize: 18, color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
