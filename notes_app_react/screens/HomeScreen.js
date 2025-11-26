import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

export default function HomeScreen({ navigation }) {
  const { user, isAuthenticated, loading } = useAuth();

  // No need to manually redirect - AuthNavigator handles this automatically

  // Add LogoutButton to navigation header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton navigation={navigation} />,
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || "User"}!</Text>
        <Text style={styles.instructionText}>
          Keep your ideas, lists, and reminders in one place
        </Text>

        <TouchableOpacity
          style={styles.notesButton}
          onPress={() => navigation.navigate("Notes")}
        >
          <Text style={styles.buttonText}>View Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 40,
  },
  notesButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});