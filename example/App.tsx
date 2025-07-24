import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState } from 'react';

import * as ExpoVeriff from 'expo-veriff';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLaunchVeriff = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const veriffResult = await ExpoVeriff.launchVeriff(
        "https://alchemy.veriff.com/v1/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjY5NTM0NTIsInNlc3Npb25faWQiOiIwYWY5NTcwNi05ZTExLTRlZDQtYTliNi03OWM3MzUyZDRmNjkiLCJpaWQiOiIxNWRiNTI1ZS01ODg4LTQ1ZmMtYTdjMy1lMTJhN2RiODM1NWEifQ.R9nhk9xbjWXfS1duhG3McFwn5Oxp1YSiGgYUi2jY3jc"
      );
      
      setResult(`Success: ${veriffResult}`);
      console.log("Veriff success:", veriffResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult(`Error: ${errorMessage}`);
      console.error("Veriff error:", error);
      Alert.alert("Veriff Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Veriff Example</Text>
      <Text style={styles.subtitle}>React 19 + Expo SDK 53</Text>
      
      <Button
        title={isLoading ? "Loading..." : "Launch Veriff"}
        onPress={handleLaunchVeriff}
        disabled={isLoading}
      />
      
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});
