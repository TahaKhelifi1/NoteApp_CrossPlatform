import 'package:flutter/material.dart';
import 'package:appwrite/models.dart';
import '../services/note_service.dart';
import '../widgets/note_item.dart';
import '../widgets/add_note_modal.dart';

class NotesScreenAppwrite extends StatefulWidget {
  const NotesScreenAppwrite({super.key});

  @override
  _NotesScreenAppwriteState createState() => _NotesScreenAppwriteState();
}

class _NotesScreenAppwriteState extends State<NotesScreenAppwrite> {
  final NoteService _noteService = NoteService();
  List<Document> _notes = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchNotes();
  }

  Future<void> _fetchNotes() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final fetchedNotes = await _noteService.getNotes();

      setState(() {
        _notes = fetchedNotes;
        _isLoading = false;
      });
    } catch (e) {
      print('Error fetching notes: $e');
      setState(() {
        _error = 'Failed to load notes. Please try again.';
        _isLoading = false;
      });
    }
  }

  void _showAddNoteDialog() {
    showDialog(
      context: context,
      builder: (context) => AddNoteModal(onNoteAdded: _handleNoteAdded),
    );
  }

  void _handleNoteAdded(Map<String, dynamic> noteData) {
    final newNote = Document(
      $id: noteData['\$id'] ?? 'temp-id',
      $collectionId: 'notes',
      $databaseId: 'NotesDB',
      $createdAt: DateTime.now().toIso8601String(),
      $updatedAt: DateTime.now().toIso8601String(),
      $permissions: [],
      data: noteData,
    );

    setState(() {
      _notes = [newNote, ..._notes];
    });
  }

  void _handleNoteDeleted(String noteId) {
    setState(() {
      _notes = _notes.where((note) => note.$id != noteId).toList();
    });
  }

  void _handleNoteUpdated(Document updated) {
    setState(() {
      _notes = _notes.map((n) => n.$id == updated.$id ? updated : n).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'My Notes',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
                ElevatedButton(onPressed: _showAddNoteDialog, child: const Text('+ Add Note')),
              ],
            ),
            const SizedBox(height: 16),

            if (_isLoading && _notes.isEmpty) const Center(child: CircularProgressIndicator()),

            if (_error != null && _notes.isEmpty)
              Center(child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 16))),

            if (!_isLoading || _notes.isNotEmpty)
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _fetchNotes,
                  child: ListView.builder(
                    itemCount: _notes.length,
                    itemBuilder: (context, index) {
                      return NoteItem(
                        note: _notes[index],
                        onNoteDeleted: _handleNoteDeleted,
                        onNoteUpdated: _handleNoteUpdated,
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
