import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  const [user, setUser] = useState(undefined);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2a6fdb" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="privacySecurity"
          options={{
            headerShown: false,
            presentation: 'card'
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
