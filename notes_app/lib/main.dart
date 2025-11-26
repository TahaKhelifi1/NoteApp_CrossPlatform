// lib/main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'providers/auth_provider.dart';
import 'screens/auth_screen.dart';
import 'screens/home_screen.dart';
import 'screens/notes_screen.dart';
import 'services/appwrite_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load(fileName: ".env");
  
  // Initialize Appwrite
  AppwriteConfig.initialize();
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          // Show loading screen while checking auth status
          if (authProvider.loading) {
            return MaterialApp(
              home: Scaffold(
                body: Center(
                  child: CircularProgressIndicator(),
                ),
              ),
            );
          }

          return MaterialApp(
            title: 'Notes App',
            theme: ThemeData(
              primarySwatch: Colors.deepOrange,
              useMaterial3: true,
            ),
            initialRoute: authProvider.isAuthenticated ? '/' : '/auth',
            routes: {
              '/auth': (context) => const AuthScreen(),
              '/': (context) => const HomeScreen(),
              '/notes': (context) => const NotesScreen(),
            },
          );
        },
      ),
    );
  }
}
