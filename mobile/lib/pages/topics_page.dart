import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/app_drawer.dart';

class Topic {
  final String topicId;
  final String name;
  final String description;
  final int questions;
  final String createdAt;
  final String updatedAt;

  const Topic({
    required this.topicId,
    required this.name,
    required this.description,
    required this.questions,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Topic.fromJson(Map<String, dynamic> j) => Topic(
        topicId:     j['topic_id']    as String? ?? j['_id']?.toString() ?? '',
        name:        j['name']        as String? ?? 'Unknown',
        description: j['description'] as String? ?? '',
        questions:   (j['questions']  as num?)?.toInt() ?? 0,
        createdAt:   j['createdAt']   as String? ?? '',
        updatedAt:   j['updatedAt']   as String? ?? '',
      );
}

String _fmt(String iso) {
  if (iso.isEmpty) return '—';
  try {
    final d = DateTime.parse(iso).toLocal();
    return '${d.month}/${d.day}/${d.year}';
  } catch (_) { return iso; }
}

class TopicsPage extends StatefulWidget {
  const TopicsPage({super.key});

  @override
  State<TopicsPage> createState() => _TopicsPageState();
}

class _TopicsPageState extends State<TopicsPage> {
  List<Topic> _all     = [];
  bool        _loading = true;
  String?     _error;
  String      _search  = '';
  final TextEditingController _searchCtrl = TextEditingController();

  List<Topic> get _filtered {
    if (_search.isEmpty) return _all;
    final q = _search.toLowerCase();
    return _all.where((t) =>
        t.name.toLowerCase().contains(q) ||
        t.description.toLowerCase().contains(q)).toList();
  }

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(() => setState(() => _search = _searchCtrl.text));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    final res = await ApiService.getRaw('topics/all');
    if (!mounted) return;
    if (res.ok) {
      final raw  = res.rawBody;
      final list = raw is List ? raw
          : (raw is Map && raw['body'] is List ? raw['body'] as List : []);
      setState(() {
        _all     = list.map((e) => Topic.fromJson(e as Map<String, dynamic>)).toList();
        _loading = false;
      });
    } else {
      setState(() { _error = res.message; _loading = false; });
    }
  }

  Future<void> _create(String name, String desc) async {
    final res = await ApiService.post('topics/create', {'name': name, 'description': desc});
    if (!mounted) return;
    if (res.ok) { _load(); _snack('Topic created', false); }
    else _snack(res.message, true);
  }

  Future<void> _update(String id, String name, String desc) async {
    final res = await ApiService.put('topics/update', {
      'topic_id': id, 'name': name, 'description': desc,
    });
    if (!mounted) return;
    if (res.ok) { _load(); _snack('Topic updated', false); }
    else _snack(res.message, true);
  }

  Future<void> _delete(String id) async {
    final res = await ApiService.delete_('topics/delete', {'topic_id': id});
    if (!mounted) return;
    if (res.ok) {
      setState(() => _all.removeWhere((t) => t.topicId == id));
      _snack('Topic deleted', false);
    } else {
      _snack(res.message, true);
    }
  }

  void _snack(String msg, bool err) => ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(msg),
        backgroundColor: err ? AppTheme.error : const Color(0xFF4ADE80),
        behavior: SnackBarBehavior.floating));

  void _openCreate() => _openForm(
    title: 'Create a topic',
    onSave: (n, d) => _create(n, d),
  );

  void _openEdit(Topic t) => _openForm(
    title: 'Edit topic',
    initialName: t.name,
    initialDesc: t.description,
    onSave: (n, d) => _update(t.topicId, n, d),
  );

  void _openView(Topic t) => showModalBottomSheet(
    context: context,
    backgroundColor: AppTheme.surface,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
    builder: (_) => Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
      child: Column(mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start, children: [
        _dragHandle(),
        const SizedBox(height: 16),
        RichText(text: TextSpan(children: [
          const TextSpan(text: 'Viewing ',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary)),
          TextSpan(text: t.name,
              style: const TextStyle(fontSize: 17, fontStyle: FontStyle.italic,
                  color: Color(0xFF7DD3FC))),
        ])),
        const SizedBox(height: 20),
        _vrow('Name',        t.name),
        _vrow('Description', t.description.isEmpty ? '—' : t.description),
        _vrow('Questions',   '${t.questions}'),
        _vrow('Created',     _fmt(t.createdAt)),
        _vrow('Updated',     _fmt(t.updatedAt)),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(child: OutlinedButton.icon(
            onPressed: () { Navigator.pop(context); _openEdit(t); },
            icon: const Icon(Icons.edit_outlined, size: 16),
            label: const Text('Edit'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.textPrimary,
              side: const BorderSide(color: AppTheme.border),
            ),
          )),
          const SizedBox(width: 12),
          Expanded(child: OutlinedButton.icon(
            onPressed: () { Navigator.pop(context); _confirmDelete(t); },
            icon: const Icon(Icons.delete_outline, size: 16),
            label: const Text('Delete'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.error,
              side: BorderSide(color: AppTheme.error.withOpacity(0.5)),
            ),
          )),
        ]),
      ]),
    ),
  );

  void _confirmDelete(Topic t) => showDialog(
    context: context,
    builder: (_) => AlertDialog(
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: const Text('Delete topic', style: TextStyle(
          color: AppTheme.textPrimary, fontWeight: FontWeight.w700)),
      content: Text.rich(TextSpan(
          style: const TextStyle(color: AppTheme.textMuted, fontSize: 14, height: 1.5),
          children: [
            const TextSpan(text: 'Are you sure you want to delete '),
            TextSpan(text: t.name, style: const TextStyle(
                color: AppTheme.textPrimary, fontWeight: FontWeight.w600)),
            const TextSpan(text: '? This cannot be undone.'),
          ])),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
          onPressed: () { Navigator.pop(context); _delete(t.topicId); },
          child: const Text('Delete'),
        ),
      ],
    ),
  );

  void _openForm({
    required String title,
    String initialName = '',
    String initialDesc = '',
    required Future<void> Function(String, String) onSave,
  }) {
    final nameCtrl = TextEditingController(text: initialName);
    final descCtrl = TextEditingController(text: initialDesc);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        final bottom = MediaQuery.of(ctx).viewInsets.bottom;
        return StatefulBuilder(builder: (ctx, setSt) {
          bool saving = false;
          return Padding(
            padding: EdgeInsets.fromLTRB(24, 16, 24, 24 + bottom),
            child: Column(mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start, children: [
              _dragHandle(),
              const SizedBox(height: 16),
              Text(title, style: const TextStyle(fontSize: 18,
                  fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
              const SizedBox(height: 20),
              _flabel('Name'),
              const SizedBox(height: 6),
              TextField(controller: nameCtrl,
                  style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                  decoration: _idec('Topic name')),
              const SizedBox(height: 14),
              _flabel('Description'),
              const SizedBox(height: 6),
              TextField(controller: descCtrl, maxLines: 3,
                  style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                  decoration: _idec('No description')),
              const SizedBox(height: 24),
              Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                TextButton(onPressed: () => Navigator.pop(ctx),
                    child: const Text('Cancel',
                        style: TextStyle(color: AppTheme.textMuted))),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: saving ? null : () async {
                    if (nameCtrl.text.trim().isEmpty) return;
                    setSt(() => saving = true);
                    await onSave(nameCtrl.text.trim(), descCtrl.text.trim());
                    if (ctx.mounted) Navigator.pop(ctx);
                  },
                  child: saving
                      ? const SizedBox(width: 18, height: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Text('Save'),
                ),
              ]),
            ]),
          );
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;
    return Scaffold(
      backgroundColor: AppTheme.background,
      drawer: const AppDrawer(currentRoute: '/topics'),
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        leading: Builder(builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded, color: AppTheme.textPrimary),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        )),
        title: const Text('Topics', style: TextStyle(
            color: AppTheme.textPrimary, fontWeight: FontWeight.w700, fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh_rounded, color: AppTheme.textMuted),
              onPressed: _load),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ElevatedButton.icon(
              onPressed: _openCreate,
              icon: const Icon(Icons.add, size: 16),
              label: const Text('New'),
              style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : _error != null
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Text(_error!, style: const TextStyle(color: AppTheme.error)),
                  const SizedBox(height: 12),
                  ElevatedButton(onPressed: _load, child: const Text('Retry')),
                ]))
              : Column(children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                    child: TextField(
                      controller: _searchCtrl,
                      style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Search topics...',
                        hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
                        prefixIcon: const Icon(Icons.search_rounded,
                            color: AppTheme.textMuted, size: 20),
                        suffixIcon: _search.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded,
                                    color: AppTheme.textMuted, size: 18),
                                onPressed: () {
                                  _searchCtrl.clear();
                                  setState(() => _search = '');
                                })
                            : null,
                        filled: true,
                        fillColor: AppTheme.surface,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                  if (_search.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      child: Text(
                        '${filtered.length} result${filtered.length == 1 ? '' : 's'} for "$_search"',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                      ),
                    ),
                  const SizedBox(height: 4),
                  Expanded(
                    child: filtered.isEmpty
                        ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                            const Icon(Icons.topic_outlined, size: 48,
                                color: AppTheme.textMuted),
                            const SizedBox(height: 12),
                            Text(_search.isEmpty
                                    ? 'No topics yet'
                                    : 'No topics match "$_search"',
                                style: const TextStyle(color: AppTheme.textMuted)),
                            if (_search.isEmpty) ...[
                              const SizedBox(height: 12),
                              ElevatedButton.icon(onPressed: _openCreate,
                                  icon: const Icon(Icons.add, size: 16),
                                  label: const Text('New Topic')),
                            ],
                          ]))
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(16, 4, 16, 80),
                            itemCount: filtered.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 8),
                            itemBuilder: (_, i) => _TopicCard(
                              topic:    filtered[i],
                              onTap:    () => _openView(filtered[i]),
                              onEdit:   () => _openEdit(filtered[i]),
                              onDelete: () => _confirmDelete(filtered[i]),
                            ),
                          ),
                  ),
                ]),
    );
  }
}

class _TopicCard extends StatelessWidget {
  final Topic topic;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _TopicCard({
    required this.topic,
    required this.onTap,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(children: [
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(topic.name, style: const TextStyle(
                  fontSize: 14, fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary)),
              const SizedBox(height: 4),
              Row(children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF60A5FA).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text('${topic.questions} questions',
                      style: const TextStyle(fontSize: 11,
                          fontWeight: FontWeight.w600, color: Color(0xFF60A5FA))),
                ),
                const SizedBox(width: 8),
                Text(_fmt(topic.createdAt),
                    style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ]),
            ],
          )),
          _IconBtn(icon: Icons.edit_outlined,  onTap: onEdit),
          const SizedBox(width: 6),
          _IconBtn(icon: Icons.delete_outline, onTap: onDelete, danger: true),
        ]),
      ),
    );
  }
}

class _IconBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool danger;
  const _IconBtn({required this.icon, required this.onTap, this.danger = false});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(7),
      decoration: BoxDecoration(
          color: danger ? AppTheme.error.withOpacity(0.1) : AppTheme.surfaceHover,
          borderRadius: BorderRadius.circular(8)),
      child: Icon(icon, size: 16,
          color: danger ? AppTheme.error : AppTheme.textMuted),
    ),
  );
}

Widget _vrow(String label, String value) => Padding(
  padding: const EdgeInsets.only(bottom: 10),
  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
    SizedBox(width: 110, child: Text(label, style: const TextStyle(
        fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w500))),
    Expanded(child: Text(value, style: const TextStyle(
        fontSize: 13, color: AppTheme.textPrimary))),
  ]),
);

Widget _dragHandle() => Center(child: Container(
  width: 40, height: 4,
  decoration: BoxDecoration(
      color: AppTheme.border, borderRadius: BorderRadius.circular(2)),
));

Widget _flabel(String text) => Text(text, style: const TextStyle(
    fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w500));

InputDecoration _idec(String hint) => InputDecoration(
  hintText: hint, filled: true, fillColor: AppTheme.surfaceHover,
  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none),
  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
);