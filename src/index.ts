import ExpoVeriffModule from "./ExpoVeriffModule";
import type { VeriffError } from "./ExpoVeriffModule";

export async function launchVeriff(token: string): Promise<string> {
  try {
    const result = await ExpoVeriffModule.launchVeriff(token);
    
    // Check if result is an error object
    if (typeof result === 'object' && result !== null && 'code' in result) {
      throw new Error(`Veriff error: ${(result as VeriffError).message}`);
    }
    
    return result as string;
  } catch (error) {
    // Re-throw with better error context
    if (error instanceof Error) {
      throw new Error(`Veriff verification failed: ${error.message}`);
    }
    throw new Error('Veriff verification failed with unknown error');
  }
}

export { VeriffError } from "./ExpoVeriffModule";

export default {
  launchVeriff
};
