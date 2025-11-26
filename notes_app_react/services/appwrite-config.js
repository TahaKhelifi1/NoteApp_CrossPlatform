import { Client, Account } from "appwrite";
import { Platform } from "react-native";

// Load environment variables
let APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
let APPWRITE_PROJECT_ID = "69158ea300037a4708e1";

try {
  // eslint-disable-next-line import/no-unresolved
  const env = require("@env");
  if (env.APPWRITE_ENDPOINT) APPWRITE_ENDPOINT = env.APPWRITE_ENDPOINT;
  if (env.APPWRITE_PROJECT_ID) APPWRITE_PROJECT_ID = env.APPWRITE_PROJECT_ID;
} catch (e) {
  // Use hardcoded defaults if env not available
  console.log("Using default Appwrite configuration");
}

// Initialize Appwrite client with platform-specific settings
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Set platform for web
if (Platform.OS === 'web') {
  client.setPlatform('web');
}

// Create Account service for authentication
const account = new Account(client);

export { client, account, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID };
