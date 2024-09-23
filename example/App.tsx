import { StyleSheet, Text, View } from 'react-native';

import * as ExpoVeriff from 'expo-veriff';
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    ExpoVeriff.launchVeriff("https://alchemy.veriff.com/v1/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjY5NTM0NTIsInNlc3Npb25faWQiOiIwYWY5NTcwNi05ZTExLTRlZDQtYTliNi03OWM3MzUyZDRmNjkiLCJpaWQiOiIxNWRiNTI1ZS01ODg4LTQ1ZmMtYTdjMy1lMTJhN2RiODM1NWEifQ.R9nhk9xbjWXfS1duhG3McFwn5Oxp1YSiGgYUi2jY3jc")
      .then((d) => console.warn("Suc", d))
      .catch((d) => console.error("Err", d))
  }, []);

  return (
    <View style={styles.container}>
      <Text>Wait..</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
