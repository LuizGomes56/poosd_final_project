import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/app_drawer.dart';
 
class DashboardTopic {
  final String topicId;
  final String name;
  final int frq;
  final int mcq;
  final int tf;
  final int totalPoints;
 
  DashboardTopic({
    required this.topicId,
    required this.name,
    required this.frq,
    required this.mcq,
    required this.tf,
    required this.totalPoints,
  });
 
  int get totalQuestions => frq + mcq + tf;
 
  factory DashboardTopic.fromJson(Map<String, dynamic> json) {
    final q = json['questions'] as Map<String, dynamic>? ?? {};
    return DashboardTopic(
      topicId:     json['topic_id']     as String? ?? '',
      name:        json['name']         as String? ?? 'Unknown',
      frq:         q['frq']             as int?    ?? 0,
      mcq:         q['mcq']             as int?    ?? 0,
      tf:          q['tf']              as int?    ?? 0,
      totalPoints: json['total_points'] as int?    ?? 0,
    );
  }
}
 
class DashboardData {
  final int numberOfTopics;
  final int questionsCreatedLastWeek;
  final List<DashboardTopic> topics;
 
  DashboardData({
    required this.numberOfTopics,
    required this.questionsCreatedLastWeek,
    required this.topics,
  });
 
  factory DashboardData.fromJson(Map<String, dynamic> json) {
    final rawTopics = json['topics'] as List<dynamic>? ?? [];
    return DashboardData(
      numberOfTopics:           json['number_of_topics']            as int? ?? 0,
      questionsCreatedLastWeek: json['questions_created_last_week'] as int? ?? 0,
      topics: rawTopics
          .whereType<Map<String, dynamic>>()
          .map((t) => DashboardTopic.fromJson(t))
          .toList(),
    );
  }
}
 
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});
 
  @override
  State<DashboardPage> createState() => _DashboardPageState();
}
 
class _DashboardPageState extends State<DashboardPage> {
  DashboardData? _data;
  bool _loading = true;
  String _error = '';
 
  static const String _base = 'http://10.0.2.2:3000/api';
 
  @override
  void initState() {
    super.initState();
    _fetch();
  }
 
  Future<void> _fetch() async {
    setState(() {
      _loading = true;
      _error = '';
    });
 
    try {
      final token = await ApiService.getToken();
 
      final res = await http.get(
        Uri.parse('$_base/users/dashboard'),
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
          if (token != null && token.isNotEmpty)
            'Authorization': 'Bearer $token',
        },
      );
 
      if (!mounted) return;
 
      if (res.body.isEmpty) {
        setState(() => _error = 'Empty response from server');
        return;
      }
 
      final decoded = jsonDecode(res.body) as Map<String, dynamic>;
      final ok = decoded['ok'] as bool? ?? false;
 
      if (ok && decoded['body'] is Map<String, dynamic>) {
        setState(() {
          _data = DashboardData.fromJson(
            decoded['body'] as Map<String, dynamic>,
          );
        });
      } else {
        setState(() {
          _error = decoded['message'] as String? ?? 'Failed to load dashboard';
        });
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      drawer: const AppDrawer(currentRoute: '/dashboard'),
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppTheme.textPrimary),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: const Text(
          'Dashboard',
          style: TextStyle(
            color: AppTheme.textPrimary,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.textMuted),
            onPressed: _fetch,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetch,
        color: AppTheme.primary,
        backgroundColor: AppTheme.surface,
        child: _buildBody(),
      ),
    );
  }
 
  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.primary),
      );
    }
 
    if (_error.isNotEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, color: AppTheme.error, size: 40),
              const SizedBox(height: 12),
              Text(
                _error,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _fetch,
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }
 
    final data = _data;
    if (data == null) return const SizedBox();
 
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // stat cards — mirrors web dashboard
        Row(
          children: [
            Expanded(
              child: _StatCard(
                label: 'Total Topics',
                value: data.numberOfTopics.toString(),
                icon: Icons.topic_outlined,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _StatCard(
                label: 'Questions Last Week',
                value: data.questionsCreatedLastWeek.toString(),
                icon: Icons.help_outline_rounded,
                color: const Color(0xFF3B82F6),
              ),
            ),
          ],
        ),
 
        const SizedBox(height: 20),
 
        // topic breakdown table — matches web dashboard
        const Text(
          'Topic Breakdown',
          style: TextStyle(
            color: AppTheme.textMuted,
            fontSize: 11,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 8),
 
        data.topics.isEmpty ? _buildEmptyState() : _buildTable(data.topics),
      ],
    );
  }
 
  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(
        child: Column(
          children: [
            Icon(Icons.inbox_outlined, color: AppTheme.textMuted, size: 36),
            SizedBox(height: 12),
            Text(
              'No topics yet',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
 
  Widget _buildTable(List<DashboardTopic> topics) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border.withAlpha(100)),
      ),
      child: Column(
        children: [
          _buildHeader(),
          const Divider(color: AppTheme.border, height: 1),
          ...List.generate(topics.length, (i) {
            return Column(
              children: [
                _buildRow(topics[i]),
                if (i < topics.length - 1)
                  const Divider(color: AppTheme.border, height: 1),
              ],
            );
          }),
        ],
      ),
    );
  }
 
  Widget _buildHeader() {
    const style = TextStyle(
      color: AppTheme.textMuted,
      fontSize: 11,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.5,
    );
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: const [
          Expanded(flex: 3, child: Text('Topic Name',    style: style)),
          Expanded(flex: 2, child: Text('Total Points',  style: style)),
          Expanded(flex: 1, child: Text('FRQ',           style: style)),
          Expanded(flex: 1, child: Text('MCQ',           style: style)),
          Expanded(flex: 1, child: Text('TF',            style: style)),
        ],
      ),
    );
  }
 
  Widget _buildRow(DashboardTopic topic) {
    const valueStyle = TextStyle(color: AppTheme.textMuted, fontSize: 12);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              topic.name,
              style: const TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(flex: 2, child: Text(topic.totalPoints.toString(), style: valueStyle)),
          Expanded(flex: 1, child: Text(topic.frq.toString(),         style: valueStyle)),
          Expanded(flex: 1, child: Text(topic.mcq.toString(),         style: valueStyle)),
          Expanded(flex: 1, child: Text(topic.tf.toString(),          style: valueStyle)),
        ],
      ),
    );
  }
}
 
// must be outside _DashboardPageState — top level class
class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
 
  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });
 
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border.withAlpha(100)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 40,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Icon(icon, color: color, size: 18),
        ],
      ),
    );
  }
}