import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';

class AppDrawer extends StatelessWidget {
  final String currentRoute;
  const AppDrawer({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
              child: Row(children: [
                Container(
                  width: 32, height: 32,
                  decoration: BoxDecoration(
                    color: AppTheme.primary,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Text('E', style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                ),
                const SizedBox(width: 10),
                const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('EduCMS', style: TextStyle(
                      fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                  Text('TEACHER', style: TextStyle(
                      fontSize: 10, fontWeight: FontWeight.w600,
                      color: AppTheme.primary, letterSpacing: 1)),
                ]),
              ]),
            ),

            const Divider(color: AppTheme.border, height: 1),
            const SizedBox(height: 8),

            _DrawerItem(
              icon: Icons.grid_view_rounded,
              label: 'Dashboard',
              isActive: currentRoute == '/dashboard',
              onTap: () => _go(context, '/dashboard'),
            ),
            _DrawerItem(
              icon: Icons.topic_outlined,
              label: 'Topics',
              isActive: currentRoute == '/topics',
              onTap: () => _go(context, '/topics'),
            ),
            _DrawerItem(
              icon: Icons.help_outline_rounded,
              label: 'Questions',
              isActive: currentRoute == '/questions',
              onTap: () => _go(context, '/questions'),
            ),
            _DrawerItem(
              icon: Icons.person_outline_rounded,
              label: 'My Account',
              isActive: currentRoute == '/account',
              onTap: () => _go(context, '/account'),
            ),

            const Spacer(),
            const Divider(color: AppTheme.border, height: 1),

            _DrawerItem(
              icon: Icons.logout_rounded,
              label: 'Logout',
              isActive: false,
              textColor: AppTheme.error,
              iconColor: AppTheme.error,
              onTap: () async {
                await ApiService.clearSession();
                if (context.mounted) {
                  Navigator.pushReplacementNamed(context, '/login');
                }
              },
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _go(BuildContext context, String route) {
    Navigator.pop(context);
    if (currentRoute != route) Navigator.pushReplacementNamed(context, route);
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final Color? textColor;
  final Color? iconColor;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
    this.textColor,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    final fg = textColor ?? (isActive ? Colors.white     : AppTheme.textMuted);
    final ic = iconColor ?? (isActive ? AppTheme.primary : AppTheme.textMuted);
    final bg = isActive  ? AppTheme.primary.withOpacity(0.15) : Colors.transparent;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            child: Row(children: [
              Icon(icon, size: 20, color: ic),
              const SizedBox(width: 12),
              Text(label, style: TextStyle(
                fontSize: 14,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: fg,
              )),
            ]),
          ),
        ),
      ),
    );
  }
}
