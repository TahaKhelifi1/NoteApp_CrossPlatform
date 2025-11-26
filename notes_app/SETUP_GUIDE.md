# Notes App - Setup Guide

## ✅ Implementation Complete

Your Flutter notes app now has full authentication functionality implemented! Here's what has been added:

### Features Implemented

1. **Authentication Service** (`lib/services/auth_service.dart`)
   - User registration
   - User login
   - Get current user
   - Logout functionality

2. **Authentication Provider** (`lib/providers/auth_provider.dart`)
   - State management for authentication
   - Automatic session checking
   - Login/logout state management

3. **Authentication Screen** (`lib/screens/auth_screen.dart`)
   - Login and registration forms
   - Form validation
   - Error handling
   - Toggle between login and register modes

4. **User-Specific Notes**
   - Notes are now filtered by user ID
   - Each user only sees their own notes
   - Notes are associated with the logged-in user

5. **Logout Functionality**
   - Logout button in HomeScreen and NotesScreen
   - Confirmation dialog before logout
   - Automatic navigation to auth screen after logout

6. **Protected Routes**
   - Authentication checks on all screens
   - Automatic redirect to login if not authenticated
   - Loading state while checking authentication

## 📋 Appwrite Configuration Required

Before running the app, you need to configure your Appwrite backend:

### 1. Update .env File

Edit the `.env` file in the root of the notes_app directory with your Appwrite credentials:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-actual-project-id
APPWRITE_DATABASE_ID=your-actual-database-id
APPWRITE_COLLECTION_ID=your-actual-collection-id
```

### 2. Set Up Appwrite Collection

In your Appwrite console, make sure your collection has these attributes:

- **content** (String, Required) - The note content
- **userId** (String, Required) - The user who created the note
- **createdAt** (String, Required) - Creation timestamp
- **updatedAt** (String, Optional) - Last update timestamp

### 3. Set Up Collection Permissions

In Appwrite Console:
1. Go to your Database → Collection
2. Click on Settings → Permissions
3. Add these permissions:
   - **Read**: `user()`
   - **Create**: `user()`
   - **Update**: `user()`
   - **Delete**: `user()`

This ensures users can only access their own notes.

### 4. Create an Index (Optional but Recommended)

For better performance:
1. Go to your Collection → Indexes
2. Create a new index:
   - **Key**: `userId`
   - **Type**: Key
   - **Attributes**: `userId` (ASC)

## 🚀 Running the App

### Install Dependencies
```bash
cd notes_app
flutter pub get
```

### Run on Android
```bash
flutter run
```

### Run on iOS (Mac only)
```bash
flutter run
```

### Run on Web
```bash
flutter run -d chrome
```

## 🧪 Testing the App

1. **Register a New User**
   - Open the app
   - Click "Don't have an account? Register"
   - Enter name, email, and password (minimum 8 characters)
   - Click "Register"

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Create Notes**
   - Click the floating action button (+)
   - Enter your note content
   - Click "Save"

4. **Edit/Delete Notes**
   - Long press on a note to edit
   - Swipe to delete

5. **Logout**
   - Click the logout button in the app bar
   - Confirm logout

## 📱 Building for Production

### Android APK
```bash
flutter build apk --release
```
The APK will be at: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release
```
The AAB will be at: `build/app/outputs/bundle/release/app-release.aab`

### iOS (Mac only)
```bash
flutter build ios --release
```
Then open `ios/Runner.xcworkspace` in Xcode to archive and upload to App Store.

### Web
```bash
flutter build web --release
```
The web build will be at: `build/web/`

## 🔑 Android Signing (for Production)

To sign your Android app for release:

1. **Create a keystore**:
```bash
keytool -genkey -v -keystore android/app/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. **Create `android/key.properties`**:
```properties
storePassword=your-password
keyPassword=your-password
keyAlias=upload
storeFile=upload-keystore.jks
```

3. **Update `android/app/build.gradle`**:

Add before `android` block:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Update `buildTypes`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

## 🐛 Troubleshooting

### "No user logged in" error
- Make sure you've registered and logged in
- Check Appwrite console for authentication issues

### Notes not showing
- Verify your Appwrite DATABASE_ID and COLLECTION_ID in .env
- Check collection permissions in Appwrite console
- Make sure the collection has the required attributes

### Build errors
- Run `flutter clean` then `flutter pub get`
- Update Flutter: `flutter upgrade`
- Check that all dependencies are compatible

### Authentication fails
- Check APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID in .env
- Verify network connectivity
- Check Appwrite project settings

## 📚 Project Structure

```
lib/
├── main.dart                      # App entry point
├── providers/
│   └── auth_provider.dart        # Authentication state management
├── screens/
│   ├── auth_screen.dart          # Login/Register screen
│   ├── home_screen.dart          # Home screen with welcome message
│   └── notes_screen.dart         # Notes list and management
├── services/
│   ├── appwrite_config.dart      # Appwrite client configuration
│   ├── auth_service.dart         # Authentication API calls
│   ├── database_service.dart     # Database operations
│   └── note_service.dart         # Notes CRUD operations
├── widgets/
│   └── logout_button.dart        # Reusable logout button
└── components/
    ├── note_input_dialog.dart    # Note input dialog
    └── note_item.dart            # Note list item widget
```

## 🎯 Next Steps

1. **Configure Appwrite** - Update your .env file with real credentials
2. **Test Authentication** - Register and login with test accounts
3. **Test Notes** - Create, edit, and delete notes
4. **Customize UI** - Adjust colors, fonts, and styles to your preference
5. **Add Features** - Consider adding:
   - Note categories/tags
   - Search functionality
   - Rich text editing
   - Image attachments
   - Sharing notes
   - Dark mode

## 💡 Tips

- Always use environment variables for sensitive configuration
- Test on multiple devices and screen sizes
- Implement proper error handling for network issues
- Add offline support using local database (e.g., Hive, SQLite)
- Consider adding biometric authentication for enhanced security

## 📞 Support

If you encounter any issues:
1. Check the Appwrite documentation: https://appwrite.io/docs
2. Review Flutter documentation: https://flutter.dev/docs
3. Check console logs for error messages
4. Verify all environment variables are set correctly

---

**Happy Coding! 🚀**
