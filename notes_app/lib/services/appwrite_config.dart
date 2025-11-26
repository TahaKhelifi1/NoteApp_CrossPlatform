import 'package:appwrite/appwrite.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppwriteConfig {
  // Singleton instance
  static final AppwriteConfig _instance = AppwriteConfig._internal();
  factory AppwriteConfig() => _instance;
  AppwriteConfig._internal();

  // Appwrite client
  static late Client client;
  
  // Configuration getters
  static String get endpoint => dotenv.env['APPWRITE_ENDPOINT'] ?? '';
  static String get projectId => dotenv.env['APPWRITE_PROJECT_ID'] ?? '';
  static String get databaseId => dotenv.env['APPWRITE_DATABASE_ID'] ?? '';
  static String get collectionId => dotenv.env['APPWRITE_COLLECTION_ID'] ?? '';

  // Initialize Appwrite client
  static void initialize() {
    client = Client()
        .setEndpoint(endpoint)
        .setProject(projectId);
  }
}

// Legacy function for backward compatibility
Client getClient() {
  return AppwriteConfig.client;
}
