import 'package:appwrite/appwrite.dart';
import 'package:appwrite/models.dart';
import 'appwrite_config.dart';

class NoteService {
  late final Databases _databases;

  NoteService() {
    _databases = Databases(AppwriteConfig.client);
  }

  // Get all notes, potentially filtered by userId
  Future<List<Document>> getNotes({String? userId}) async {
    try {
      // Create query list - initially empty
      List<String> queries = [];

      // If userId is provided, add a filter
      if (userId != null) {
        queries.add(Query.equal('userId', userId));
      }

      // Add sorting by createdAt descending
      queries.add(Query.orderDesc('createdAt'));

      // Fetch documents from the database
      final response = await _databases.listDocuments(
        databaseId: AppwriteConfig.databaseId,
        collectionId: AppwriteConfig.collectionId,
        queries: queries,
      );

      return response.documents;
    } catch (e) {
      print('Error getting notes: $e');
      rethrow;
    }
  }

  // Create a new note
  Future<Document> createNote(Map<String, dynamic> data) async {
    try {
      // Add timestamps to the note data
      final noteData = {
        ...data,
        'createdAt': DateTime.now().toIso8601String(),
        'updatedAt': DateTime.now().toIso8601String(),
      };

      // Create a document in the database
      final response = await _databases.createDocument(
        databaseId: AppwriteConfig.databaseId,
        collectionId: AppwriteConfig.collectionId,
        documentId: ID.unique(),
        data: noteData,
      );

      return response;
    } catch (e) {
      print('Error creating note: $e');
      rethrow;
    }
  }

  // Delete a note by ID
  Future<void> deleteNote(String noteId) async {
    try {
      await _databases.deleteDocument(
        databaseId: AppwriteConfig.databaseId,
        collectionId: AppwriteConfig.collectionId,
        documentId: noteId,
      );
    } catch (e) {
      print('Error deleting note: $e');
      rethrow;
    }
  }

  // Update an existing note
  Future<Document> updateNote(String noteId, Map<String, dynamic> data) async {
    try {
      final noteData = {
        ...data,
        'updatedAt': DateTime.now().toIso8601String(),
      };

      final response = await _databases.updateDocument(
        databaseId: AppwriteConfig.databaseId,
        collectionId: AppwriteConfig.collectionId,
        documentId: noteId,
        data: noteData,
      );

      return response;
    } catch (e) {
      print('Error updating note: $e');
      rethrow;
    }
  }
}
