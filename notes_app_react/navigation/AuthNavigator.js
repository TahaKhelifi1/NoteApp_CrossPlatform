// src/navigation/AuthNavigator.js
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

// Import screens
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import NotesScreen from "../screens/NotesScreen";

const Stack = createStackNavigator();

// Auth stack - screens for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Auth"
      component={AuthScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// App stack - screens for authenticated users
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Notes App",
        headerStyle: {
          backgroundColor: "#3498db",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Stack.Screen
      name="Notes"
      component={NotesScreen}
      options={{
        title: "My Notes",
        headerStyle: {
          backgroundColor: "#3498db",
        },
        headerTintColor: "#fff",
      }}
    />
  </Stack.Navigator>
);

// Main navigator component
const AuthNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AuthNavigator;
