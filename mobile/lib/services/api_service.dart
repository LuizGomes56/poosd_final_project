import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiResponse {
  final bool ok;
  final int status;
  final String message;
  final Map<String, dynamic>? body;

  const ApiResponse({
    required this.ok,
    required this.status,
    required this.message,
    this.body,
  });

  factory ApiResponse.fromJson(Map<String, dynamic> json) {
    return ApiResponse(
      ok:      json['ok']      as bool?   ?? false,
      status:  json['status']  as int?    ?? 0,
      message: json['message'] as String? ?? '',
      body:    json['body']    as Map<String, dynamic>?,
    );
  }
}

class ApiService {
  //Replace with IPV4 address of your local machine for testing and change backend/src/index.ts to match (ipconfig in cmd)
  static const String base = 'http://PLACEHOLDER:3000/api';

  // Tokens

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<void> _saveSession(Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token',     body['token']     as String? ?? '');
    await prefs.setString('full_name', body['full_name'] as String? ?? '');
    await prefs.setString('email',     body['email']     as String? ?? '');
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('full_name');
    await prefs.remove('email');
  }

  static Future<ApiResponse> _post(
    String path,
    Map<String, dynamic> payload,
  ) async {
    try {
      final token = await getToken();

      final headers = <String, String>{
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        if (token != null && token.isNotEmpty)
          'Authorization': 'Bearer $token',
      };

      final uri = Uri.parse('$base/$path');
      final rawBody = jsonEncode(payload);

      debugPrint('[API] POST $uri');
      debugPrint('[API] payload: $rawBody');

      final res = await http.post(uri, headers: headers, body: rawBody);

      debugPrint('[API] status: ${res.statusCode}');
      debugPrint('[API] response: ${res.body}');

      if (res.body.isEmpty) {
        return const ApiResponse(
          ok: false,
          status: 0,
          message: 'Server returned an empty response',
        );
      }

      final json = jsonDecode(res.body) as Map<String, dynamic>;
      return ApiResponse.fromJson(json);
    } catch (e, stack) {
      debugPrint('[API] error: $e');
      debugPrint('[API] stack: $stack');
      return ApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  // API Endpoints

  static Future<ApiResponse> login({
    required String email,
    required String password,
  }) async {
    final res = await _post('users/login', {
      'email':    email,
      'password': password,
    });
    
    if (res.ok && res.body != null) {
      await _saveSession(res.body!);
    }
    return res;
  }

  static Future<ApiResponse> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    
    return _post('users/register', {
      'full_name': fullName,
      'email':     email,
      'password':  password,
    });
  }
}
