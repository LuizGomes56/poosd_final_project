import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final String placeholder;
  final bool obscureText;
  final TextEditingController controller;
  final String? errorText;
  final TextInputType keyboardType;
  final IconData? prefixIcon;

  const CustomTextField({
    super.key,
    required this.label,
    required this.placeholder,
    required this.controller,
    this.obscureText = false,
    this.errorText,
    this.keyboardType = TextInputType.text,
    this.prefixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: AppTheme.textMuted,
            letterSpacing: 0.1,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
          decoration: InputDecoration(
            hintText: placeholder,
            errorText: errorText,
            prefixIcon: prefixIcon != null ? Icon(prefixIcon, size: 18, color: AppTheme.textMuted) : null,
          ),
        ),
      ],
    );
  }
}
