import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_theme.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  String _fullName = '';
  String _email    = '';
  bool _emailVerified = false;
  String _createdAt   = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';

     if (token.isEmpty) return;

    try {
      final res = await http.get(
        Uri.parse('http://10.0.2.2:3000/api/users/verify'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(res.body);

      if (data['ok']) {
        final user = data['body'];

        setState(() {
          _fullName = user['full_name'];
          _email    = user['email'];
          _emailVerified = user['email_verified'] ?? false;
          _createdAt = user['createdAt']?.split('T')[0] ?? '';
        });
      }
    } catch (e) {
      debugPrint('Error loading user: $e');
    }
  }

  Future<void> _editField(String key, String currentValue) async {
    final controller = TextEditingController(text: currentValue);

    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Edit', style: TextStyle(color: AppTheme.textPrimary)),
        content: TextField(
          controller: controller,
          style: TextStyle(color: AppTheme.textPrimary),
        ),
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

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';

      try {
        final response = await http.patch(
          Uri.parse('http://10.0.2.2:3000/api/users/patch'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: jsonEncode(
            key == 'full_name'
              ? {'full_name': result}
              : {'email': result},
          ),
        );

        debugPrint(response.body);
        final data = jsonDecode(response.body);

        if (data['ok']) {
          setState(() {
            if (key == 'full_name') _fullName = result;
            if (key == 'email') _email = result;
          });
        } else {
          debugPrint(data['message']);
        }

      } catch (e) {
        debugPrint('Error updating user');
      }
    }
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
        leading: Builder(builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded, color: AppTheme.textPrimary),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        )),
        title: const Text('Account',
            style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w700, fontSize: 18)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _Row(label: 'Full Name', value: _fullName),
            const SizedBox(height: 12),
            _Row(label: 'Email',     value: _email),
            const SizedBox(height: 12),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loggingOut ? null : _logout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: _loggingOut
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
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
  final VoidCallback onEdit;

  const _Row({
    required this.label,
    required this.value,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textMuted,
                        fontWeight: FontWeight.w500)),
                const SizedBox(height: 6),
                Text(value,
                    style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textPrimary)),
              ],
            ),
          ),
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppTheme.textMuted),
              foregroundColor: AppTheme.textPrimary,
            ),
            onPressed: onEdit,
            child: const Text('Edit'),
          ),
        ],
      ),
    );
  }
}

class _StaticRow extends StatelessWidget {
  final String label;
  final String value;

  const _StaticRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.textMuted,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 6),
          Text(value,
              style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.textPrimary)),
        ],
      ),
    );
  }
}
