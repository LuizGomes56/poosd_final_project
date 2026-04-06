import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/custom_text_field.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _fullNameCtrl = TextEditingController();
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();

  bool   _loading   = false;
  String _errorText = '';

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() { _loading = true; _errorText = ''; });

    final res = await ApiService.register(
      fullName: _fullNameCtrl.text.trim(),
      email:    _emailCtrl.text.trim(),
      password: _passwordCtrl.text,
    );

    if (!mounted) return;
    setState(() => _loading = false);

    if (res.ok) {
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      setState(() => _errorText = res.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 440),
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo / brand
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppTheme.surface,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Image.asset(
                            'assets/icons/favicon.png', 
                            width: 24, 
                            height: 24,  
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'EduCMS',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          Text(
                            'TEACHER',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primary,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 28),

                  const Text(
                    'Create an account',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Fill in the details below to get started',
                    style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                  ),

                  const SizedBox(height: 24),

                  CustomTextField(
                    label: 'Full Name',
                    placeholder: 'Your name',
                    controller: _fullNameCtrl,
                    prefixIcon: Icons.person_outline,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    label: 'Email Address',
                    placeholder: 'Your email address',
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icons.mail_outline
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    label: 'Password',
                    placeholder: 'Your password',
                    controller: _passwordCtrl,
                    obscureText: true,
                    prefixIcon: Icons.lock_outline
                  ),

                  if (_errorText.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      _errorText,
                      style: const TextStyle(color: AppTheme.error, fontSize: 13),
                    ),
                  ],

                  const SizedBox(height: 24),

                  SizedBox(
                    height: 46,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Register'),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Already have an account?',
                        style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                        child: const Text('Sign In'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
