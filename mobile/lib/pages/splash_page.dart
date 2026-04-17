import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../constants/app_theme.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _resolve();
  }

  Future<void> _resolve() async {
    await Future.delayed(const Duration(milliseconds: 500));

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';

    if (!mounted) return;

    if (token.isEmpty) {
      Navigator.of(context).pushReplacementNamed('/register');
      return;
    }

    final res = await ApiService.getRaw('users/verify');

    if (!mounted) return;

    if (res.ok) {
      if (res.rawBody is Map<String, dynamic>) {
        final data = res.rawBody as Map<String, dynamic>;
        await prefs.setString('full_name',      data['full_name']      as String? ?? '');
        await prefs.setString('email',          data['email']          as String? ?? '');
        await prefs.setBool(  'email_verified', data['email_verified'] as bool?   ?? false);
        await prefs.setString('created_at',     data['createdAt']      as String? ?? '');
      }
      Navigator.of(context).pushReplacementNamed('/dashboard');
    } else {
      await ApiService.clearSession();
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(height: 48),
            SizedBox(
              width: 48,
              height: 48,
              child: CircularProgressIndicator(
                color: AppTheme.primary,
                strokeWidth: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}