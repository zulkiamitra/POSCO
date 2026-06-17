import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';

class ApiClient {
  ApiClient._();
  static final ApiClient instance = ApiClient._();

  String? _token;
  Map<String, dynamic>? _user;

  String? get token => _token;
  Map<String, dynamic>? get currentUser => _user;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('jwt_token');
    final userJson = prefs.getString('user_info');
    if (userJson != null) {
      try {
        _user = jsonDecode(userJson) as Map<String, dynamic>;
      } catch (_) {
        _user = null;
      }
    }
  }

  Map<String, String> _headers({bool auth = true}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (auth && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${Config.apiBaseUrl}/auth/login'),
        headers: _headers(auth: false),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        _token = data['token'];
        _user = data['user'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', _token!);
        await prefs.setString('user_info', jsonEncode(_user));
        return {'success': true, 'user': _user};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login gagal'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi ke server gagal: $e'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String role,
    String? nik,
    String? phone,
    String? wilayah,
  }) async {
    try {
      // Normalise role (e.g. "Orang Tua" / "orang_tua" to "orangtua")
      String mappedRole = role.toLowerCase().replaceAll(' ', '').replaceAll('_', '');

      final response = await http.post(
        Uri.parse('${Config.apiBaseUrl}/auth/register'),
        headers: _headers(auth: false),
        body: jsonEncode({
          'email': email,
          'password': password,
          'name': name,
          'role': mappedRole,
          'nik': nik,
          'phone': phone,
          'wilayah': wilayah,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        _token = data['token'];
        _user = data['user'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', _token!);
        await prefs.setString('user_info', jsonEncode(_user));
        return {'success': true, 'user': _user};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Registrasi gagal'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi ke server gagal: $e'};
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_info');
  }

  // Children Endpoints
  Future<List<dynamic>> fetchChildren() async {
    String url = '${Config.apiBaseUrl}/children';
    if (_user != null) {
      if (_user!['role'] == 'orangtua') {
        url += '?orangtuaId=${_user!['id']}';
      }
    }

    final response = await http.get(
      Uri.parse(url),
      headers: _headers(),
    );

    if (response.statusCode == 200) {
      final res = jsonDecode(response.body);
      return res['data'] ?? [];
    } else {
      throw Exception('Gagal memuat data anak');
    }
  }

  Future<Map<String, dynamic>> createChild(Map<String, dynamic> childData) async {
    try {
      final response = await http.post(
        Uri.parse('${Config.apiBaseUrl}/children'),
        headers: _headers(),
        body: jsonEncode(childData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return {'success': true, 'child': data['child']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal membuat data anak'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi gagal: $e'};
    }
  }

  Future<Map<String, dynamic>> updateChild(String id, Map<String, dynamic> childData) async {
    try {
      final response = await http.put(
        Uri.parse('${Config.apiBaseUrl}/children/$id'),
        headers: _headers(),
        body: jsonEncode(childData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'child': data['child']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal memperbarui data anak'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi gagal: $e'};
    }
  }

  // Sessions/Agenda Endpoints
  Future<List<dynamic>> fetchSessions() async {
    final response = await http.get(
      Uri.parse('${Config.apiBaseUrl}/sessions'),
      headers: _headers(),
    );

    if (response.statusCode == 200) {
      final res = jsonDecode(response.body);
      return res['data'] ?? [];
    } else {
      throw Exception('Gagal memuat agenda posyandu');
    }
  }

  Future<Map<String, dynamic>> createSession(Map<String, dynamic> sessionData) async {
    try {
      final response = await http.post(
        Uri.parse('${Config.apiBaseUrl}/sessions'),
        headers: _headers(),
        body: jsonEncode(sessionData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return {'success': true, 'session': data['session']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal membuat agenda baru'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi gagal: $e'};
    }
  }

  Future<Map<String, dynamic>> updateProfile(String id, Map<String, dynamic> profileData) async {
    try {
      final response = await http.put(
        Uri.parse('${Config.apiBaseUrl}/users/$id'),
        headers: _headers(),
        body: jsonEncode(profileData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        _user = data['user'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_info', jsonEncode(_user));
        return {'success': true, 'user': _user};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Gagal memperbarui profil'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Koneksi gagal: $e'};
    }
  }
}
