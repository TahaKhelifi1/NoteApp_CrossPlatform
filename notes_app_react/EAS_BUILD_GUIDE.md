# EAS Build Setup Guide

## Prerequisites
- EAS CLI is now installed globally ✅
- eas.json configuration file created ✅
- app.json updated with bundle identifiers ✅

## Step-by-Step Instructions

### 1. Login to Expo Account
Before building, you need to authenticate with your Expo account:

```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev/signup

### 2. Configure Your Project with Expo
Link your project to an Expo account and get a project ID:

```bash
eas build:configure
```

This will update the `projectId` in your app.json automatically.

### 3. Build Your App

#### For Android Preview (APK)
Build a preview APK that can be installed directly on Android devices:

```bash
eas build -p android --profile preview
```

#### For Android Production (App Bundle)
Build an optimized app bundle for Google Play Store:

```bash
eas build -p android --profile production
```

#### For iOS Production
Build for Apple App Store:

```bash
eas build -p ios --profile production
```

Note: iOS builds require an Apple Developer account ($99/year)

### 4. Monitor Build Progress
- Builds run on Expo's cloud servers
- You'll receive a link to monitor progress
- Download the build artifact when complete

### 5. Submit to App Stores

#### Submit to Google Play Store
```bash
eas submit -p android --latest
```

Requirements:
- Google Play Developer account ($25 one-time fee)
- Have completed at least one manual upload to create the app listing

#### Submit to Apple App Store
```bash
eas submit -p ios --latest
```

Requirements:
- Apple Developer account ($99/year)
- App Store Connect listing created

## Build Profiles Explained

### Development Profile
- `developmentClient: true` - Includes dev tools
- `distribution: internal` - For testing only
- Use: `eas build -p android --profile development`

### Preview Profile
- Builds APK files (not app bundles)
- Easy to share and install for testing
- Use: `eas build -p android --profile preview`

### Production Profile
- Optimized for app store submission
- Android: Creates app bundle (.aab)
- iOS: Creates IPA with Release configuration
- Use: `eas build -p android --profile production`

## Configuration Files

### eas.json
Contains build profiles and settings for different build types.

### app.json
Updated with:
- `bundleIdentifier` (iOS): com.notesapp.mobile
- `package` (Android): com.notesapp.mobile
- `assetBundlePatterns`: Includes all assets
- `updates`: Fallback configuration for OTA updates

## Important Notes

1. **Bundle Identifiers**: The identifiers in app.json must be unique:
   - iOS: `com.notesapp.mobile`
   - Android: `com.notesapp.mobile`
   
   Change these to match your organization/company name.

2. **First Build**: The first build may take 15-30 minutes as Expo sets up the build environment.

3. **Credentials**: EAS will help you manage certificates and provisioning profiles for iOS automatically.

4. **Environment Variables**: For Appwrite credentials, use EAS Secrets:
   ```bash
   eas secret:create --scope project --name APPWRITE_ENDPOINT --value "your-endpoint"
   eas secret:create --scope project --name APPWRITE_PROJECT_ID --value "your-project-id"
   ```

## Testing the Build

### Android APK
1. After build completes, download the APK
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install and test

### iOS (requires Mac for local testing)
1. Download the IPA file
2. Use TestFlight for distribution to testers
3. Or use Xcode to install on device

## Troubleshooting

### Build Failed?
- Check build logs in the Expo dashboard
- Verify all dependencies are compatible
- Ensure app.json has valid configuration

### Cannot Install APK?
- Enable "Install from Unknown Sources" on Android
- Check if device meets minimum Android version

### iOS Build Issues?
- Verify Apple Developer account is active
- Check bundle identifier is registered in App Store Connect

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo Dashboard](https://expo.dev/)

## Quick Reference Commands

```bash
# Login
eas login

# Configure project (run once)
eas build:configure

# Build for Android preview
eas build -p android --profile preview

# Build for production
eas build -p android --profile production
eas build -p ios --profile production

# Submit to stores
eas submit -p android --latest
eas submit -p ios --latest

# Check build status
eas build:list

# View build details
eas build:view [build-id]
```
