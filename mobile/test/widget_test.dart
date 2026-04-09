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

testWidgets('Page Navigation', (tester) async {
  await tester.pumpWidget(const MyApp());
  await tester.pumpAndSettle();

  await tester.tap(find.widgetWithText(TextButton, 'Register'));
  await tester.pumpAndSettle();
  expect(find.widgetWithText(ElevatedButton, 'Register'), findsOneWidget);

  await tester.scrollUntilVisible(
    find.widgetWithText(TextButton, 'Sign In'),
    100,
  );
  await tester.pumpAndSettle();

  await tester.tap(find.widgetWithText(TextButton, 'Sign In'));
  await tester.pumpAndSettle();
  expect(find.widgetWithText(ElevatedButton, 'Sign In'), findsOneWidget);
});
}