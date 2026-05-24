import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
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
      <Stack.Screen name="detail" options={{ headerShown: true, title: 'Details' }} />
    </Stack>
  );
}