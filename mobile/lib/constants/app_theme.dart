import 'package:flutter/material.dart';

class AppTheme {

  static const Color background   = Color(0xFF18181B); 
  static const Color surface      = Color(0xFF27272A);
  static const Color surfaceHover = Color(0xFF3F3F46);
  static const Color primary      = Color(0xFF7C3AED);
  static const Color primaryHover = Color(0xFF6D28D9);
  static const Color textPrimary  = Color(0xFFF4F4F5);
  static const Color textMuted    = Color(0xFFA1A1AA);
  static const Color border       = Color(0xFF3F3F46);
  static const Color error        = Color(0xFFEF4444);

  static ThemeData get dark => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: background,
    colorScheme: const ColorScheme.dark(
      surface: surface,
      primary: primary,
      error: error,
    ),
    fontFamily: 'Inter',
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: surfaceHover,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: error, width: 1.5),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: error, width: 1.5),
      ),
      hintStyle: const TextStyle(color: textMuted, fontSize: 14),
      labelStyle: const TextStyle(color: textMuted, fontSize: 13, fontWeight: FontWeight.w500),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: textPrimary,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        textStyle: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.2,
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primary,
        textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
      ),
    ),
  );
}
