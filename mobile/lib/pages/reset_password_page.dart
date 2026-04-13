import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/custom_text_field.dart';

class ResetPasswordPage extends StatefulWidget {
  const ResetPasswordPage({
    super.key,
    this.initialEmail = '',
  });

  final String initialEmail;

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _codeCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();

  bool _loading = false;
  String _errorText = '';
  String _successText = '';

  @override
  void dispose() {
    _codeCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmPasswordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = widget.initialEmail.trim();
    final code = _codeCtrl.text.trim();
    final password = _passwordCtrl.text;
    final confirmPassword = _confirmPasswordCtrl.text;

    if (email.isEmpty) {
      setState(() => _errorText = 'Start from forgot password so we know which email to reset.');
      return;
    }

    if (code.length != 6) {
      setState(() => _errorText = 'Reset code must be 6 digits.');
      return;
    }

    if (password != confirmPassword) {
      setState(() => _errorText = 'Passwords do not match.');
      return;
    }

    setState(() {
      _loading = true;
      _errorText = '';
      _successText = '';
    });

    final res = await ApiService.resetPassword(
      email: email,
      code: code,
      password: password,
    );

    if (!mounted) return;

    setState(() {
      _loading = false;
      if (res.ok) {
        _successText = res.message.isNotEmpty
            ? res.message
            : 'Password reset successfully.';
      } else {
        _errorText = res.message;
      }
    });

    if (res.ok) {
      Future.delayed(const Duration(milliseconds: 1200), () {
        if (!mounted) return;
        Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
      });
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
                  const Text(
                    'Reset password',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.initialEmail.isNotEmpty
                        ? 'Enter the code sent to ${widget.initialEmail} and choose a new password.'
                        : 'Enter the code from your email and choose a new password.',
                    style: const TextStyle(
                      color: AppTheme.textMuted,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 24),
                  CustomTextField(
                    label: 'Reset Code',
                    placeholder: 'Enter your 6-digit code',
                    controller: _codeCtrl,
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.password_outlined,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    label: 'New Password',
                    placeholder: 'Enter a new password',
                    controller: _passwordCtrl,
                    obscureText: true,
                    prefixIcon: Icons.lock_outline,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    label: 'Confirm Password',
                    placeholder: 'Re-enter your new password',
                    controller: _confirmPasswordCtrl,
                    obscureText: true,
                    prefixIcon: Icons.lock_outline,
                  ),
                  if (_errorText.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      _errorText,
                      style: const TextStyle(
                        color: AppTheme.error,
                        fontSize: 13,
                      ),
                    ),
                  ],
                  if (_successText.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      _successText,
                      style: const TextStyle(
                        color: AppTheme.primary,
                        fontSize: 13,
                      ),
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
                          : const Text('Update password'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: () => Navigator.pushNamedAndRemoveUntil(
                      context,
                      '/login',
                      (_) => false,
                    ),
                    child: const Text('Back to sign in'),
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
