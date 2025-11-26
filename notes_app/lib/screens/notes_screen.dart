import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:appwrite/models.dart';
import '../components/note_item.dart';
import '../components/note_input_dialog.dart';
import '../providers/auth_provider.dart';
import '../services/note_service.dart';
import '../widgets/logout_button.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _NotesScreenState createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  // Note service
  final NoteService _noteService = NoteService();
  
  // Notes list from Appwrite
  List<Document> notes = [];
  
  // Loading state
  bool isLoading = true;

  // Controllers and state variables
  TextEditingController noteController = TextEditingController();
  String? editingNoteId;

  @override
  void initState() {
    super.initState();
    _fetchNotes();
  }

  // Fetch notes from Appwrite
  Future<void> _fetchNotes() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.user == null) {
      setState(() {
        isLoading = false;
      });
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      // Get user ID
      String userId = authProvider.user.$id;
      
      // Fetch notes for this user
      final fetchedNotes = await _noteService.getNotes(userId: userId);
      setState(() {
        notes = fetchedNotes;
        isLoading = false;
      });
    } catch (e) {
      print('Failed to fetch notes: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  // Function to save a new or updated note
  Future<void> saveNote() async {
    if (noteController.text.trim().isEmpty) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.user == null) return;

    try {
      String userId = authProvider.user.$id;
      
      if (editingNoteId != null) {
        // Update existing note
        final updatedNote = await _noteService.updateNote(
          editingNoteId!,
          {
            'content': noteController.text,
            'userId': userId,
          },
        );
        
        setState(() {
          int index = notes.indexWhere((note) => note.$id == editingNoteId);
          if (index != -1) {
            notes[index] = updatedNote;
          }
          editingNoteId = null;
        });
      } else {
        // Add new note
        final newNote = await _noteService.createNote({
          'content': noteController.text,
          'userId': userId,
        });
        
        setState(() {
          notes.insert(0, newNote);
        });
      }
      
      noteController.clear();
      Navigator.of(context).pop(); // Close the dialog
    } catch (e) {
      print('Failed to save note: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to save note: $e')),
      );
    }
  }

  // Function to delete a note
  Future<void> deleteNote(String id) async {
    try {
      await _noteService.deleteNote(id);
      setState(() {
        notes.removeWhere((note) => note.$id == id);
      });
    } catch (e) {
      print('Failed to delete note: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete note: $e')),
      );
    }
  }

  // Function to open edit mode
  void editNote(Map<String, dynamic> note) {
    editingNoteId = note['\$id'];
    noteController.text = note['content'] ?? '';
    showNoteDialog();
  }

  // Show dialog for adding/editing notes
  void showNoteDialog() {
    showDialog(
      context: context,
      builder: (context) => NoteInputDialog(
        controller: noteController,
        isEditing: editingNoteId != null,
        onSave: saveNote,
      ),
    );
  }

  // Convert Document to Map for compatibility with NoteItem widget
  Map<String, dynamic> _documentToMap(Document doc) {
    return {
      '\$id': doc.$id,
      'id': doc.$id,
      'content': doc.data['content'] ?? '',
      'createdAt': doc.data['createdAt'] ?? DateTime.now().toIso8601String(),
      'updatedAt': doc.data['updatedAt'],
    };
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Notes'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: const [
          LogoutButton(),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notes.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "You don't have any notes yet.",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "Tap the + button to create your first note!",
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchNotes,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(15),
                    itemCount: notes.length,
                    itemBuilder: (context, index) {
                      return NoteItem(
                        note: _documentToMap(notes[index]),
                        onEdit: editNote,
                        onDelete: (id) => deleteNote(id),
                      );
                    },
                  ),
                ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () {
          editingNoteId = null;
          noteController.clear();
          showNoteDialog();
        },
      ),
    );
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed
    noteController.dispose();
    super.dispose();
  }
}