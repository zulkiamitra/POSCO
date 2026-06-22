import 'dart:io';
import 'package:flutter/foundation.dart';

class Config {
  static String get apiBaseUrl {
    if (!kReleaseMode) {
      if (!kIsWeb && Platform.isAndroid) {
        return 'http://10.0.2.2:4000'; // Untuk emulator Android lokal
      }
      return 'http://localhost:4000'; // Untuk browser/iOS lokal
    }
    // API URL Production di Vercel
    return 'https://posco-backend.vercel.app';
  }
}
