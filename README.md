# Expo Veriff Module

React Native module for Veriff integration with Expo.

## 🚨 Important: React 19 + Expo SDK 53 Compatibility

This module has been updated to support React 19 and Expo SDK 53. The main fixes include:

### Key Changes Made:

1. **Updated Dependencies**:
   - `@types/react`: `^18.0.25` → `^19.0.0`
   - iOS deployment target: `13.4` → `15.0`
   - Swift version: `5.4` → `5.9`

2. **Enhanced Error Handling**:
   - Added camera permission checks before starting Veriff
   - Better error messages and handling
   - Memory leak prevention with proper cleanup

3. **iOS Improvements**:
   - Added `AVFoundation` import for camera permissions
   - Proper async/await handling
   - Better session state management

4. **Android Improvements**:
   - Enhanced error handling with specific error messages
   - Better exception handling
   - Improved session lifecycle management

## 🛠 Development Setup

### For Windows Users

**Recommended**: Use WSL (Windows Subsystem for Linux) or Git Bash instead of CMD/PowerShell.

1. **Install WSL** (if not already installed):
   ```bash
   wsl --install
   ```

2. **Or use Git Bash** (comes with Git for Windows)

3. **Run commands in WSL/Git Bash**:
   ```bash
   # Install dependencies
   npm install
   
   # Build module
   npm run build
   
   # Run tests
   npm test
   ```

### For macOS/Linux Users

Standard setup works without issues:

```bash
npm install
npm run build
npm test
```

## 📱 Usage

```typescript
import { launchVeriff } from '@tpf-bank/expo-veriff';

try {
  const result = await launchVeriff('your-veriff-session-url');
  console.log('Veriff completed:', result);
} catch (error) {
  console.error('Veriff failed:', error.message);
}
```

## 🔧 Installation

```bash
npm install @tpf-bank/expo-veriff
```

## 🐛 Troubleshooting

### Camera Permission Issues
If the app crashes when requesting camera permissions:

1. Ensure you're using the latest version
2. Check that camera permissions are properly configured in your app
3. Test on a physical device (not simulator)

### Build Issues on Windows
If you encounter build issues on Windows:

1. Use WSL or Git Bash instead of CMD/PowerShell
2. Ensure Node.js version is 18+ 
3. Clear npm cache: `npm cache clean --force`

## 📋 Requirements

- React Native 0.76+
- Expo SDK 53+
- React 19+
- iOS 15.0+
- Android API 24+

## 🔄 Migration from Previous Versions

If you're upgrading from an older version:

1. Update your dependencies:
   ```json
   {
     "expo": "~53.0.0",
     "react": "19.0.0"
   }
   ```

2. Update your iOS deployment target to 15.0
3. Test camera permissions thoroughly

## 📄 License

MIT
