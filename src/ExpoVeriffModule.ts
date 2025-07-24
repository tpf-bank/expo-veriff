import { requireNativeModule } from 'expo-modules-core';

// Define error types for better type safety
export interface VeriffError {
  code: string;
  message: string;
}

export type VeriffResult = string | VeriffError;

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const ExpoVeriffModule = requireNativeModule('ExpoVeriff');

export default ExpoVeriffModule;
