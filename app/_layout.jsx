import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* Auth Flow */}
      <Stack.Screen name="(auth)" />

      {/* Main App */}
      <Stack.Screen name="(tabs)" />

      {/* Other screens */}
      <Stack.Screen name="detail" options={{ headerShown: true, title: 'Details' }} />

    </Stack>
  );
}