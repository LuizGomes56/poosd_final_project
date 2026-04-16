import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('Render Login', (tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    expect(find.widgetWithText(ElevatedButton, 'Sign In'), findsOneWidget);
    expect(find.widgetWithText(TextButton, 'Register'),    findsOneWidget);
  });

}