import 'package:flutter/material.dart';
import 'package:mobile/pages/questions_page.dart';
import 'constants/app_theme.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'pages/account_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/topics_page.dart';
import 'pages/questions_page.dart';

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
        '/account': (_) => AccountPage(),
        '/dashboard': (_) => const DashboardPage(),
        '/topics': (_) => const TopicsPage(),
        '/questions': (_) => const QuestionsPage(),
      },
    );
  }
}
