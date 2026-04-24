import 'dart:async';
import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';
import '../widgets/app_drawer.dart';
import 'topics_page.dart' show Topic;

class Question {
  final String questionId;
  final String prompt;
  final String type;
  final String difficulty;
  final String hint;
  final String explanation;
  final int points;
  final String createdAt;
  final String updatedAt;
  final Map<String, dynamic>? frq;
  final Map<String, dynamic>? choice;
  final List<String> topicIds;

  const Question({
    required this.questionId,
    required this.prompt,
    required this.type,
    required this.difficulty,
    required this.hint,
    required this.explanation,
    required this.points,
    required this.createdAt,
    required this.updatedAt,
    this.frq,
    this.choice,
    required this.topicIds,
  });

  factory Question.fromJson(Map<String, dynamic> j) => Question(
        questionId:  j['question_id'] as String? ?? j['_id']?.toString() ?? '',
        prompt:      j['prompt']      as String? ?? '',
        type:        j['type']        as String? ?? '',
        difficulty:  j['difficulty']  as String? ?? '',
        hint:        j['hint']        as String? ?? '',
        explanation: j['explanation'] as String? ?? '',
        points:      (j['points']     as num?)?.toInt() ?? 100,
        createdAt:   j['createdAt']   as String? ?? '',
        updatedAt:   j['updatedAt']   as String? ?? '',
        frq:         j['frq']         as Map<String, dynamic>?,
        choice:      j['choice']      as Map<String, dynamic>?,
        topicIds:    (j['topic_ids']  as List<dynamic>?)
                        ?.map((e) => e.toString()).toList() ?? [],
      );
}

Color _diffColor(String d) => switch (d) {
  'EASY'   => const Color(0xFF4ADE80),
  'MEDIUM' => const Color(0xFFFBBF24),
  'HARD'   => const Color(0xFFF87171),
  _        => AppTheme.textMuted,
};

Color _typeColor(String t) => switch (t) {
  'MCQ' => const Color(0xFF60A5FA),
  'TF'  => const Color(0xFFA78BFA),
  'FRQ' => const Color(0xFF34D399),
  _     => AppTheme.textMuted,
};

String _fmt(String iso) {
  if (iso.isEmpty) return '—';
  try {
    final d = DateTime.parse(iso).toLocal();
    return '${d.month}/${d.day}/${d.year}';
  } catch (_) { return iso; }
}

class QuestionsPage extends StatefulWidget {
  const QuestionsPage({super.key});

  @override
  State<QuestionsPage> createState() => _QuestionsPageState();
}

class _QuestionsPageState extends State<QuestionsPage> {
  List<Question> _all     = [];
  List<Topic>    _topics  = [];
  bool           _loading = true;
  String?        _error;
  String         _search  = '';
  final TextEditingController _searchCtrl = TextEditingController();
  Timer?         _searchDebounce;
  int            _questionsRequestId = 0;

  @override
  void initState() {
    super.initState();
    _loadAll();
    _searchCtrl.addListener(_handleSearchChanged);
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchCtrl.dispose();
    super.dispose();
  }

  void _handleSearchChanged() {
    final nextSearch = _searchCtrl.text;
    if (_search == nextSearch) return;

    setState(() => _search = nextSearch);
    _searchDebounce?.cancel();
    _searchDebounce = Timer(
      const Duration(milliseconds: 300),
      () => _loadQuestions(showLoading: true),
    );
  }

  Future<void> _loadAll() async {
    setState(() { _loading = true; _error = null; });
    await Future.wait([_loadQuestions(), _loadTopics()]);
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _loadQuestions({bool showLoading = false}) async {
    final requestId = ++_questionsRequestId;
    final query = _search.trim();

    if (showLoading && mounted) {
      setState(() { _loading = true; _error = null; });
    }

    final res = query.isEmpty
        ? await ApiService.postRaw('questions/all', {})
        : await ApiService.postRaw('questions/search', {'query': query});

    if (!mounted || requestId != _questionsRequestId) return;

    if (res.ok) {
      final raw  = res.rawBody;
      final list = raw is List ? raw
          : (raw is Map && raw['body'] is List ? raw['body'] as List : []);
      setState(() {
        _all = list.map((e) => Question.fromJson(e as Map<String, dynamic>)).toList();
        _loading = false;
        _error = null;
      });
    } else {
      setState(() { _error = res.message; _loading = false; });
    }
  }

  Future<void> _loadTopics() async {
    final res = await ApiService.getRaw('topics/all');
    if (!mounted) return;
    if (res.ok) {
      final raw  = res.rawBody;
      final list = raw is List ? raw
          : (raw is Map && raw['body'] is List ? raw['body'] as List : []);
      setState(() {
        _topics = list.map((e) => Topic.fromJson(e as Map<String, dynamic>)).toList();
      });
    }
  }

  Future<void> _delete(String id) async {
    final res = await ApiService.delete_('questions/delete', {'question_id': id});
    if (!mounted) return;
    if (res.ok) {
      await _loadQuestions(showLoading: true);
      _snack('Question deleted', false);
    } else {
      _snack(res.message, true);
    }
  }

  void _snack(String msg, bool err) => ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(msg),
        backgroundColor: err ? AppTheme.error : const Color(0xFF4ADE80),
        behavior: SnackBarBehavior.floating));

  void _openCreate() => _openForm(null);
  void _openEdit(Question q) => _openForm(q);

  void _openForm(Question? initial) => showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppTheme.surface,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
    builder: (_) => _QuestionForm(
      initial: initial,
      topics: _topics,
      onSave: (body) async {
        if (initial == null) {
          final res = await ApiService.post('questions/create', body);
          if (!mounted) return;
          if (res.ok) {
            Navigator.pop(context);
            await _loadQuestions(showLoading: true);
            await _loadTopics();
            _snack('Question created', false);
          }
          else _snack(res.message, true);
        } else {
          final res = await ApiService.patch('questions/update',
              {'question_id': initial.questionId, ...body});
          if (!mounted) return;
          if (res.ok) {
            Navigator.pop(context);
            await _loadQuestions(showLoading: true);
            await _loadTopics();
            _snack('Question updated', false);
          }
          else _snack(res.message, true);
        }
      },
    ),
  );

  void _openView(Question q) => showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppTheme.surface,
    shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
    builder: (_) => _QuestionView(
      question: q,
      topics: _topics,
      onEdit:   () { Navigator.pop(context); _openEdit(q); },
      onDelete: () { Navigator.pop(context); _confirmDelete(q); },
    ),
  );

  void _confirmDelete(Question q) => showDialog(
    context: context,
    builder: (_) => AlertDialog(
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: const Text('Delete question', style: TextStyle(
          color: AppTheme.textPrimary, fontWeight: FontWeight.w700)),
      content: const Text(
          'Are you sure you want to delete this question? This cannot be undone.',
          style: TextStyle(color: AppTheme.textMuted, fontSize: 14, height: 1.5)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted))),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
          onPressed: () { Navigator.pop(context); _delete(q.questionId); },
          child: const Text('Delete'),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      drawer: const AppDrawer(currentRoute: '/questions'),
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        leading: Builder(builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded, color: AppTheme.textPrimary),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        )),
        title: const Text('Questions', style: TextStyle(
            color: AppTheme.textPrimary, fontWeight: FontWeight.w700, fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh_rounded, color: AppTheme.textMuted),
              onPressed: _loadAll),
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
                  ElevatedButton(onPressed: _loadAll, child: const Text('Retry')),
                ]))
              : Column(children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                    child: TextField(
                      controller: _searchCtrl,
                      style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Search by prompt, type, difficulty...',
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
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      child: Text(
                        '${_all.length} result${_all.length == 1 ? '' : 's'} for "$_search"',
                        style: const TextStyle(
                            fontSize: 12, color: AppTheme.textMuted),
                      ),
                    ),
                  const SizedBox(height: 4),
                  Expanded(
                    child: _all.isEmpty
                        ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                            const Icon(Icons.help_outline_rounded, size: 48,
                                color: AppTheme.textMuted),
                            const SizedBox(height: 12),
                            Text(_search.isEmpty
                                    ? 'No questions yet'
                                    : 'No questions match "$_search"',
                                style: const TextStyle(color: AppTheme.textMuted)),
                            if (_search.isEmpty) ...[
                              const SizedBox(height: 12),
                              ElevatedButton.icon(onPressed: _openCreate,
                                  icon: const Icon(Icons.add, size: 16),
                                  label: const Text('New Question')),
                            ],
                          ]))
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(16, 4, 16, 80),
                            itemCount: _all.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 8),
                            itemBuilder: (_, i) => _QuestionCard(
                              question: _all[i],
                              onTap:    () => _openView(_all[i]),
                              onEdit:   () => _openEdit(_all[i]),
                              onDelete: () => _confirmDelete(_all[i]),
                            ),
                          ),
                  ),
                ]),
    );
  }
}

class _QuestionCard extends StatelessWidget {
  final Question question;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _QuestionCard({
    required this.question,
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
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                _Badge(question.type,       _typeColor(question.type)),
                const SizedBox(width: 6),
                _Badge(question.difficulty, _diffColor(question.difficulty)),
                const Spacer(),
                Text('${question.points} pts',
                    style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ]),
              const SizedBox(height: 8),
              Text(question.prompt, style: const TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w500,
                  color: AppTheme.textPrimary),
                  maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 8),
              Text(_fmt(question.createdAt),
                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
            ],
          )),
          const SizedBox(width: 10),
          Column(mainAxisSize: MainAxisSize.min, children: [
            _IconBtn(icon: Icons.edit_outlined,  onTap: onEdit),
            const SizedBox(height: 6),
            _IconBtn(icon: Icons.delete_outline, onTap: onDelete, danger: true),
          ]),
        ]),
      ),
    );
  }
}

class _QuestionView extends StatelessWidget {
  final Question question;
  final List<Topic> topics;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _QuestionView({
    required this.question,
    required this.topics,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final topicNames = question.topicIds
        .map((id) => topics
            .firstWhere((t) => t.topicId == id,
                orElse: () => Topic(
                    topicId: id, name: id, description: '',
                    questions: 0, createdAt: '', updatedAt: ''))
            .name)
        .join(', ');

    return DraggableScrollableSheet(
      expand: false, initialChildSize: 0.6, maxChildSize: 0.95,
      builder: (_, ctrl) => ListView(
        controller: ctrl,
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        children: [
          Center(child: Container(width: 40, height: 4,
              decoration: BoxDecoration(color: AppTheme.border,
                  borderRadius: BorderRadius.circular(2)))),
          const SizedBox(height: 16),
          Row(children: [
            _Badge(question.type,       _typeColor(question.type)),
            const SizedBox(width: 8),
            _Badge(question.difficulty, _diffColor(question.difficulty)),
            const Spacer(),
            Text('${question.points} pts',
                style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
          ]),
          const SizedBox(height: 14),
          Text(question.prompt, style: const TextStyle(
              fontSize: 16, fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary)),
          const SizedBox(height: 16),
          if (question.hint.isNotEmpty)        _vr('Hint',        question.hint),
          if (question.explanation.isNotEmpty) _vr('Explanation', question.explanation),
          if (topicNames.isNotEmpty)           _vr('Topics',      topicNames),
          if (question.frq != null) ...[
            _vr('Kind', question.frq!['kind']?.toString() ?? ''),
            if (question.frq!['tolerance'] != null)
              _vr('Tolerance', question.frq!['tolerance'].toString()),
            if ((question.frq!['accepted_numbers'] as List?)?.isNotEmpty == true)
              _vr('Accepted Numbers',
                  (question.frq!['accepted_numbers'] as List).join(', ')),
            if ((question.frq!['accepted_texts'] as List?)?.isNotEmpty == true)
              _vr('Accepted Texts',
                  (question.frq!['accepted_texts'] as List).join(', ')),
          ],
          if (question.choice != null) ...[
            if ((question.choice!['options'] as List?)?.isNotEmpty == true)
              _vr('Options',
                  (question.choice!['options'] as List).join(', ')),
            if ((question.choice!['answers'] as Map?)?['single'] != null)
              _vr('Answer',
                  question.choice!['answers']['single'].toString()),
            if ((question.choice!['answers'] as Map?)?['multiple'] != null)
              _vr('Answers',
                  (question.choice!['answers']['multiple'] as List).join(', ')),
          ],
          _vr('Created', _fmt(question.createdAt)),
          _vr('Updated', _fmt(question.updatedAt)),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(child: OutlinedButton.icon(
              onPressed: onEdit,
              icon: const Icon(Icons.edit_outlined, size: 16),
              label: const Text('Edit'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.textPrimary,
                side: const BorderSide(color: AppTheme.border),
              ),
            )),
            const SizedBox(width: 12),
            Expanded(child: OutlinedButton.icon(
              onPressed: onDelete,
              icon: const Icon(Icons.delete_outline, size: 16),
              label: const Text('Delete'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.error,
                side: BorderSide(color: AppTheme.error.withOpacity(0.5)),
              ),
            )),
          ]),
        ],
      ),
    );
  }

  Widget _vr(String label, String value) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      SizedBox(width: 110, child: Text(label, style: const TextStyle(
          fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w500))),
      Expanded(child: Text(value, style: const TextStyle(
          fontSize: 13, color: AppTheme.textPrimary))),
    ]),
  );
}

class _QuestionForm extends StatefulWidget {
  final Question? initial;
  final List<Topic> topics;
  final Future<void> Function(Map<String, dynamic>) onSave;

  const _QuestionForm({
    this.initial,
    required this.topics,
    required this.onSave,
  });

  @override
  State<_QuestionForm> createState() => _QuestionFormState();
}

class _QuestionFormState extends State<_QuestionForm> {
  final _promptCtrl      = TextEditingController();
  final _hintCtrl        = TextEditingController();
  final _explanationCtrl = TextEditingController();
  final _pointsCtrl      = TextEditingController();
  final _toleranceCtrl   = TextEditingController();
  final _answersCtrl     = TextEditingController();

  String      _type       = 'FRQ';
  String      _difficulty = 'EASY';
  String      _frqKind    = 'NUMBER';
  String      _tfAnswer   = 'True';
  bool        _saving     = false;
  Set<String> _selTopics  = {};

  @override
  void initState() {
    super.initState();
    final q = widget.initial;
    if (q != null) {
      _promptCtrl.text      = q.prompt;
      _hintCtrl.text        = q.hint;
      _explanationCtrl.text = q.explanation;
      _pointsCtrl.text      = q.points.toString();
      _type                 = q.type;
      _difficulty           = q.difficulty;
      _selTopics            = Set.from(q.topicIds);
      if (q.frq != null) {
        _frqKind            = q.frq!['kind'] as String? ?? 'NUMBER';
        _toleranceCtrl.text = (q.frq!['tolerance'] ?? 0).toString();
        final nums = q.frq!['accepted_numbers'] as List?;
        final txts = q.frq!['accepted_texts']   as List?;
        _answersCtrl.text   = (nums ?? txts ?? []).join(', ');
      }
      if (q.choice != null) {
        final ans         = q.choice!['answers'] as Map?;
        _tfAnswer         = ans?['single'] as String? ?? 'True';
        final opts        = q.choice!['options'] as List?;
        _answersCtrl.text = (opts ?? []).join(', ');
      }
    } else {
      _pointsCtrl.text    = '100';
      _toleranceCtrl.text = '0';
    }
  }

  @override
  void dispose() {
    _promptCtrl.dispose(); _hintCtrl.dispose();
    _explanationCtrl.dispose(); _pointsCtrl.dispose();
    _toleranceCtrl.dispose(); _answersCtrl.dispose();
    super.dispose();
  }

  List<String> get _answerList =>
      _answersCtrl.text.split(',').map((s) => s.trim())
          .where((s) => s.isNotEmpty).toList();

  Map<String, dynamic> _build() {
    final base = <String, dynamic>{
      'prompt':      _promptCtrl.text.trim(),
      'type':        _type,
      'difficulty':  _difficulty,
      'hint':        _hintCtrl.text.trim(),
      'explanation': _explanationCtrl.text.trim(),
      'points':      int.tryParse(_pointsCtrl.text) ?? 100,
      'topic_ids':   _selTopics.toList(),
    };
    if (_type == 'FRQ') {
      base['frq'] = {
        'kind':      _frqKind,
        'tolerance': double.tryParse(_toleranceCtrl.text) ?? 0,
        if (_frqKind == 'NUMBER')
          'accepted_numbers': _answerList
              .map((s) => double.tryParse(s) ?? 0).toList()
        else
          'accepted_texts': _answerList,
      };
    } else if (_type == 'TF') {
      base['choice'] = {'answers': {'single': _tfAnswer}};
    } else {
      base['choice'] = {
        'options': _answerList,
        'answers': {'multiple': _answerList},
      };
    }
    return base;
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;
    return DraggableScrollableSheet(
      expand: false, initialChildSize: 0.9, maxChildSize: 0.95,
      builder: (_, ctrl) => ListView(
        controller: ctrl,
        padding: EdgeInsets.fromLTRB(24, 16, 24, 24 + bottom),
        children: [
          Center(child: Container(width: 40, height: 4,
              decoration: BoxDecoration(color: AppTheme.border,
                  borderRadius: BorderRadius.circular(2)))),
          const SizedBox(height: 16),
          Text(widget.initial == null ? 'Create a question' : 'Edit question',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary)),
          const SizedBox(height: 20),

          _FF('Topics', _TopicPicker(
            topics: widget.topics,
            selected: _selTopics,
            onChanged: (ids) => setState(() => _selTopics = ids),
          )),
          _FF('Question\'s prompt', TextField(
            controller: _promptCtrl, maxLines: 3,
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
            decoration: _inputDec('What is the result of 1 + 1?'),
          )),
          _FF('Question\'s difficulty', _Seg(
            options: const ['EASY', 'MEDIUM', 'HARD'],
            value: _difficulty,
            colors: [const Color(0xFF4ADE80), const Color(0xFFFBBF24),
                     const Color(0xFFF87171)],
            onChanged: (v) => setState(() => _difficulty = v),
          )),
          _FF('Question\'s points', TextField(
            controller: _pointsCtrl, keyboardType: TextInputType.number,
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
            decoration: _inputDec('100'),
          )),
          _FF('Question\'s hint', TextField(
            controller: _hintCtrl,
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
            decoration: _inputDec('Hint (optional)'),
          )),
          _FF('Question\'s explanation', TextField(
            controller: _explanationCtrl,
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
            decoration: _inputDec('Explanation (optional)'),
          )),
          _FF('Question\'s type', _Seg(
            options: const ['FRQ', 'MCQ', 'TF'],
            labels: const ['Free Response', 'Multiple Choice', 'True / False'],
            value: _type,
            onChanged: (v) => setState(() { _type = v; _answersCtrl.clear(); }),
          )),

          if (_type == 'FRQ') ...[
            _FF('Kind', _Seg(
              options: const ['NUMBER', 'TEXT'],
              value: _frqKind,
              onChanged: (v) => setState(() { _frqKind = v; _answersCtrl.clear(); }),
            )),
            if (_frqKind == 'NUMBER')
              _FF('Tolerance', TextField(
                controller: _toleranceCtrl, keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                decoration: _inputDec('0'),
              )),
            _FF(
              _frqKind == 'NUMBER'
                  ? 'Accepted numbers (comma separated)'
                  : 'Accepted texts (comma separated)',
              TextField(
                controller: _answersCtrl,
                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                decoration: _inputDec(_frqKind == 'NUMBER' ? '42, 43' : 'yes, correct'),
              ),
            ),
          ],

          if (_type == 'TF')
            _FF('Answer', _Seg(
              options: const ['True', 'False'],
              value: _tfAnswer,
              onChanged: (v) => setState(() => _tfAnswer = v),
            )),

          if (_type == 'MCQ')
            _FF('Options / Answers (comma separated)', TextField(
              controller: _answersCtrl,
              style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
              decoration: _inputDec('Option A, Option B'),
            )),

          const SizedBox(height: 24),
          Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel',
                  style: TextStyle(color: AppTheme.textMuted)),
            ),
            const SizedBox(width: 10),
            ElevatedButton(
              onPressed: _saving ? null : () async {
                if (_selTopics.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Please select at least one topic'),
                    backgroundColor: AppTheme.error,
                    behavior: SnackBarBehavior.floating,
                  ));
                  return;
                }
                setState(() => _saving = true);
                await widget.onSave(_build());
                if (mounted) setState(() => _saving = false);
              },
              child: _saving
                  ? const SizedBox(width: 18, height: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : const Text('Save'),
            ),
          ]),
        ],
      ),
    );
  }

  InputDecoration _inputDec(String hint) => InputDecoration(
    hintText: hint, filled: true, fillColor: AppTheme.surfaceHover,
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide.none),
    hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
  );
}

class _TopicPicker extends StatelessWidget {
  final List<Topic> topics;
  final Set<String> selected;
  final ValueChanged<Set<String>> onChanged;

  const _TopicPicker({
    required this.topics,
    required this.selected,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    if (topics.isEmpty) {
      return const Text('No topics available — create one first',
          style: TextStyle(color: AppTheme.textMuted, fontSize: 13));
    }
    return Wrap(spacing: 8, runSpacing: 8,
      children: topics.map((t) {
        final active = selected.contains(t.topicId);
        return GestureDetector(
          onTap: () {
            final next = Set<String>.from(selected);
            active ? next.remove(t.topicId) : next.add(t.topicId);
            onChanged(next);
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: active
                  ? AppTheme.primary.withOpacity(0.2)
                  : AppTheme.surfaceHover,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                  color: active
                      ? AppTheme.primary.withOpacity(0.6)
                      : Colors.transparent),
            ),
            child: Text(t.name, style: TextStyle(fontSize: 13,
                fontWeight: FontWeight.w500,
                color: active ? AppTheme.primary : AppTheme.textMuted)),
          ),
        );
      }).toList(),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  const _Badge(this.label, this.color);

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(6)),
    child: Text(label, style: TextStyle(fontSize: 11,
        fontWeight: FontWeight.w600, color: color)),
  );
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

Widget _FF(String label, Widget child) => Padding(
  padding: const EdgeInsets.only(bottom: 16),
  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted,
        fontWeight: FontWeight.w500)),
    const SizedBox(height: 6),
    child,
  ]),
);

class _Seg extends StatelessWidget {
  final List<String> options;
  final List<String>? labels;
  final String value;
  final ValueChanged<String> onChanged;
  final List<Color>? colors;

  const _Seg({
    required this.options, required this.value, required this.onChanged,
    this.labels, this.colors,
  });

  @override
  Widget build(BuildContext context) => Wrap(spacing: 6, runSpacing: 6,
    children: options.asMap().entries.map((e) {
      final active = e.value == value;
      final color  = colors?[e.key] ?? AppTheme.primary;
      final label  = labels?[e.key] ?? e.value;
      return GestureDetector(
        onTap: () => onChanged(e.value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: active ? color.withOpacity(0.2) : AppTheme.surfaceHover,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
                color: active ? color.withOpacity(0.6) : Colors.transparent),
          ),
          child: Text(label, style: TextStyle(fontSize: 12,
              fontWeight: FontWeight.w600,
              color: active ? color : AppTheme.textMuted)),
        ),
      );
    }).toList(),
  );
}
