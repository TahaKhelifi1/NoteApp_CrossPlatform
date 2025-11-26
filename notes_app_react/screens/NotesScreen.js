import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import NoteItem from "../components/NoteItem";
import NoteInput from "../components/NoteInput";
import { useAuth } from "../contexts/AuthContext";
import { getNotes, createNote, deleteNote as deleteNoteService, updateNote as updateNoteService } from "../services/note-service";

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect unauthenticated users to Auth screen
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.replace("Auth");
    }
  }, [isAuthenticated, loading, navigation]);

  // Fetch notes when user is available
  const fetchNotes = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Pass the user ID when fetching notes
      const fetchedNotes = await getNotes(user.$id);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // Function to add or update a note
  const saveNote = async () => {
    if (noteText.trim() === "") return;

    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = await updateNoteService(editingNote.id, {
          content: noteText,
        });
        setNotes(notes.map((note) => (note.id === editingNote.id ? updatedNote : note)));
        setEditingNote(null);
      } else {
        // Add new note with user ID
        const newNote = await createNote({
          content: noteText,
          userId: user.$id,
        });
        setNotes([newNote, ...notes]);
      }

      setNoteText("");
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // Function to delete a note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteService(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Function to open edit mode
  const editNote = (note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setNoteText("");
    setEditingNote(null);
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any notes yet.</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to create your first note!
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem note={item} onEdit={editNote} onDelete={handleDeleteNote} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={notes.length === 0 ? { flex: 1 } : styles.notesList}
          ListEmptyComponent={renderEmptyComponent()}
        />
      )}

      <NoteInput
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveNote}
        noteText={noteText}
        setNoteText={setNoteText}
        isEditing={!!editingNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 100,
    backgroundColor: "#3498db",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#3498db",
    fontWeight: "bold",
    marginTop: -2,
  },
  notesList: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});