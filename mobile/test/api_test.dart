import 'dart:convert';
import 'package:test/test.dart';
import 'package:http/http.dart' as http;

const _base = String.fromEnvironment('TEST_BASE_URL',
    defaultValue: 'http://localhost:3000/api');

final _email    = 'fluttertest@mail.com';
const _password = 'pass';
const _fullName = 'flutteruser';

Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
  final res = await http.post(
    Uri.parse('$_base/$path'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );
  return jsonDecode(res.body) as Map<String, dynamic>;
}

void main() {
  test('Register', () async {
    final res = await _post('users/register', {
      'full_name': _fullName,
      'email':     _email,
      'password':  _password,
    });
    expect(res['ok'], isTrue, reason: res['message']);
  });

  test('Login', () async {
    final res = await _post('users/login', {
      'email':    _email,
      'password': _password,
    });
    expect(res['ok'], isTrue, reason: res['message']);

    final body = res['body'] as Map<String, dynamic>;
    expect(body['token'], isNotNull);
  });
}