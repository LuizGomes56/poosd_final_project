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

  factory ApiResponse.fromJson(Map<String, dynamic> json) => ApiResponse(
        ok:      json['ok']      as bool?   ?? false,
        status:  json['status']  as int?    ?? 0,
        message: json['message'] as String? ?? '',
        body:    json['body']    as Map<String, dynamic>?,
      );
}

class RawApiResponse {
  final bool ok;
  final int status;
  final String message;
  final dynamic rawBody;

  const RawApiResponse({
    required this.ok,
    required this.status,
    required this.message,
    this.rawBody,
  });
}

class ApiService {
  static const String _base = 'http://10.0.2.2:3000/api';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<void> _saveSession(Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token',          body['token']          as String? ?? '');
    await prefs.setString('full_name',      body['full_name']      as String? ?? '');
    await prefs.setString('email',          body['email']          as String? ?? '');
    await prefs.setBool(  'email_verified', body['email_verified'] as bool?   ?? false);
    await prefs.setString('created_at',     body['createdAt']      as String? ?? '');
    await prefs.setBool('has_registered', true);
  }
 
  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('full_name');
    await prefs.remove('email');
    await prefs.remove('email_verified');
    await prefs.remove('created_at');
  }

  static Future<Map<String, String>> _headers() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
      if (token != null && token.isNotEmpty)
        'Authorization': 'Bearer $token',
    };
  }

  static ApiResponse _parse(http.Response res) {
    debugPrint('[API] ${res.statusCode} ${res.request?.url}');
    debugPrint('[API] body: ${res.body}');
    if (res.body.isEmpty) {
      return const ApiResponse(ok: false, status: 0, message: 'Empty response from server');
    }
    try {
      final json = jsonDecode(res.body) as Map<String, dynamic>;
      return ApiResponse.fromJson(json);
    } catch (e) {
      return ApiResponse(ok: false, status: 0, message: 'Failed to parse response: $e');
    }
  }

  static RawApiResponse _parseRaw(http.Response res) {
    debugPrint('[API] ${res.statusCode} ${res.request?.url}');
    if (res.body.isEmpty) {
      return const RawApiResponse(ok: false, status: 0, message: 'Empty response from server');
    }
    try {
      final decoded = jsonDecode(res.body);
      if (decoded is Map<String, dynamic>) {
        return RawApiResponse(
          ok:      decoded['ok']      as bool?   ?? false,
          status:  decoded['status']  as int?    ?? 0,
          message: decoded['message'] as String? ?? '',
          rawBody: decoded['body'],
        );
      }
      return RawApiResponse(ok: true, status: 200, message: '', rawBody: decoded);
    } catch (e) {
      return RawApiResponse(ok: false, status: 0, message: 'Failed to parse response: $e');
    }
  }

  static Future<ApiResponse> post(String path, Map<String, dynamic> payload) async {
    try {
      final res = await http.post(
        Uri.parse('$_base/$path'),
        headers: await _headers(),
        body: jsonEncode(payload),
      );
      return _parse(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return ApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  //If the body is a list

  static Future<RawApiResponse> postRaw(String path, Map<String, dynamic> payload) async {
    try {
      final res = await http.post(
        Uri.parse('$_base/$path'),
        headers: await _headers(),
        body: jsonEncode(payload),
      );
      return _parseRaw(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return RawApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  static Future<RawApiResponse> getRaw(String path) async {
    try {
      final res = await http.get(
        Uri.parse('$_base/$path'),
        headers: await _headers(),
      );
      return _parseRaw(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return RawApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  static Future<ApiResponse> put(String path, Map<String, dynamic> payload) async {
    try {
      final res = await http.put(
        Uri.parse('$_base/$path'),
        headers: await _headers(),
        body: jsonEncode(payload),
      );
      return _parse(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return ApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  static Future<ApiResponse> delete_(String path, Map<String, dynamic> payload) async {
    try {
      final req = http.Request('DELETE', Uri.parse('$_base/$path'));
      (await _headers()).forEach((k, v) => req.headers[k] = v);
      req.body = jsonEncode(payload);
      final streamed = await req.send();
      final res = await http.Response.fromStream(streamed);
      return _parse(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return ApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  static Future<ApiResponse> patch(String path, Map<String, dynamic> payload) async {
    try {
      final res = await http.patch(
        Uri.parse('$_base/$path'),
        headers: await _headers(),
        body: jsonEncode(payload),
      );
      return _parse(res);
    } catch (e) {
      debugPrint('[API] error: $e');
      return ApiResponse(ok: false, status: 0, message: e.toString());
    }
  }

  static Future<ApiResponse> login({
    required String email,
    required String password,
  }) async {
    final res = await post('users/login', {'email': email, 'password': password});
    if (res.ok && res.body != null) await _saveSession(res.body!);
    return res;
  }

  static Future<ApiResponse> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    return post('users/register', {
      'full_name': fullName,
      'email':     email,
      'password':  password,
    });
  }

  static Future<ApiResponse> forgotPassword({
    required String email,
  }) async {
    return post('users/forgot_password', {
      'email': email,
    });
  }

  static Future<ApiResponse> resetPassword({
    required String code,
    required String password,
  }) async {
    return post('users/reset_password', {
      'code': code,
      'password': password,
    });
  }
  
  static Future<ApiResponse> verifyUser() async {
    return getRaw('users/verify').then((res) {
      return ApiResponse(
        ok: res.ok,
        status: res.status,
        message: res.message,
        body: res.rawBody is Map<String, dynamic>
            ? res.rawBody as Map<String, dynamic>
            : null,
      );
    });
  }

  static Future<ApiResponse> updateUser({
    String? fullName,
    String? email,
  }) async {
    final payload = <String, dynamic>{};

    if (fullName != null) payload['full_name'] = fullName;
    if (email != null) payload['email'] = email;

    return patch('users/patch', payload);
  }

  static Future<ApiResponse> sendEmailVerification() async {
    return getRaw('users/send_email_verification').then((res) {
      return ApiResponse(
        ok: res.ok,
        status: res.status,
        message: res.message,
        body: res.rawBody is Map<String, dynamic>
            ? res.rawBody as Map<String, dynamic>
            : null,
      );
    });
  }

  static Future<ApiResponse> verifyEmail(String code) async {
    return post('users/verify_email', {
      'code': code,
    });
  }
}
