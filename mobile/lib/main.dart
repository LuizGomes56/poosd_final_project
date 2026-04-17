import 'package:flutter/material.dart';
import 'constants/app_theme.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'pages/account_page.dart';
import 'pages/topics_page.dart';
import 'pages/questions_page.dart';
import 'pages/forgot_password_page.dart';
import 'pages/reset_password_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/splash_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  final bool skipSplash;

  const MyApp({super.key, this.skipSplash = false});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduCMS',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      initialRoute: skipSplash ? '/login' : '/',
      routes: {
        '/': (_) => skipSplash ? const LoginPage() : const SplashPage(),
        '/login': (_) => const LoginPage(),
        '/register': (_) => const RegisterPage(),
        '/account': (_) => AccountPage(),
        '/topics': (_) => const TopicsPage(),
        '/questions': (_) => const QuestionsPage(),
        '/dashboard': (_) => const DashboardPage(),
        '/forgot_password' : (_) => const ForgotPasswordPage(),
        '/reset_password' : (_) => const ResetPasswordPage(),
      },
    );
  }
}
