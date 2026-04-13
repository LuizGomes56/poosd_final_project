import 'package:flutter/material.dart';
import 'constants/app_theme.dart';
import 'pages/forgot_password_page.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'pages/account_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduCMS',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      initialRoute: '/login',
      routes: {
        '/login': (_) => const LoginPage(),
        '/register': (_) => const RegisterPage(),
        '/forgot-password': (_) => const ForgotPasswordPage(),
        '/account': (_) => AccountPage(),
      },
    );
  }
}
