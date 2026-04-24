import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/app_drawer.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  String _fullName = '';
  String _email = '';
  bool _emailVerified = false;
  String _createdAt = '';
  bool _loggingOut = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await ApiService.verifyUser();

    if (res.ok && res.body != null) {
      final user = res.body!;

      setState(() {
        _fullName = user['full_name'];
        _email = user['email'];
        _emailVerified = user['email_verified'] ?? false;
        _createdAt = user['createdAt']?.split('T')[0] ?? '';
      });
    }
  }

  Future<void> _editField(String key, String currentValue) async {
    final controller = TextEditingController(text: currentValue);

    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Edit', style: TextStyle(color: AppTheme.textPrimary)),
        content: TextField(controller: controller),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, controller.text),
            child: const Text('Save'),
          ),
        ],
      ),
    );

    if (result != null && result.isNotEmpty) {
      final res = await ApiService.updateUser(
        fullName: key == 'full_name' ? result : null,
        email: key == 'email' ? result : null,
      );

      if (res.ok) {
        setState(() {
          if (key == 'full_name') _fullName = result;
          if (key == 'email') _email = result;
        });
      }
    }
  }

  Future<void> _openVerifyDialog() async {
    final send = await ApiService.sendEmailVerification();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(send.message)),
    );

    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text(
          'Verify Email',
          style: TextStyle(color: AppTheme.textPrimary),
        ),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'Enter verification code',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final res = await ApiService.verifyEmail(controller.text);

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(res.message)),
              );

              if (res.ok) {
                setState(() => _emailVerified = true);
                Navigator.pop(context);
              }
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  Future<void> _logout() async {
    setState(() => _loggingOut = true);

    await ApiService.clearSession();

    if (!mounted) return;

    Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      drawer: const AppDrawer(currentRoute: '/account'),
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppTheme.textPrimary),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: const Text('Account',
            style: TextStyle(color: AppTheme.textPrimary)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _Row(
              label: 'Full Name',
              value: _fullName,
              onEdit: () => _editField('full_name', _fullName),
            ),

            _Row(
              label: 'Email',
              value: _email,
              onEdit: () => _editField('email', _email),
            ),

            _Row(
              label: 'Email Verified',
              value: _emailVerified ? 'Yes' : 'No',
              onEdit: _emailVerified ? null : _openVerifyDialog,
              buttonText: 'Verify',
            ),

            _Row(
              label: 'Your account creation date',
              value: _createdAt,
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loggingOut ? null : _logout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                ),
                child: _loggingOut
                    ? const CircularProgressIndicator()
                    : const Text('Log Out'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback? onEdit;
  final String? buttonText;

  const _Row({
    required this.label,
    required this.value,
    this.onEdit,
    this.buttonText,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(color: AppTheme.textMuted)),
                const SizedBox(height: 6),
                Text(value,
                    style: const TextStyle(color: AppTheme.textPrimary)),
              ],
            ),
          ),

          if (onEdit != null)
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: BorderSide(color: Colors.white.withOpacity(0.2)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: onEdit,
              child: Text(
                buttonText ?? 'Edit',
                style: const TextStyle(color: Colors.white),
              ),
            )
        ],
      ),
    );
  }
}
