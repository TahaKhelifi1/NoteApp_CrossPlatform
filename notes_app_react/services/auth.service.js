// src/services/auth.service.js
import { ID } from "appwrite";
import { account } from "./appwrite-config";

class AuthService {
  // Reference to Appwrite Account service
  account;

  constructor() {
    this.account = account;
  }

  // Register a new user
  async createAccount(email, password, name) {
    try {
      // Create a new account using Appwrite SDK
      const userAccount = await this.account.create(
        ID.unique(), // Generate a unique ID
        email,
        password,
        name
      );

      // If account creation is successful, automatically log the user in
      if (userAccount) {
        return this.login(email, password);
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Log in an existing user
  async login(email, password) {
    try {
      // Create an email session using Appwrite SDK
      // Try createEmailPasswordSession (newer SDK) or createEmailSession (older SDK)
      const createSession = this.account.createEmailPasswordSession || this.account.createEmailSession;
      return await createSession.call(this.account, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get current session/user
  async getCurrentUser() {
    try {
      // Get current account information
      return await this.account.get();
    } catch (error) {
      // No user logged in - this is expected for guests, not an error
      return null;
    }
  }

  // Log out the current user
  async logout() {
    try {
      // Delete all sessions for the current user
      return await this.account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
