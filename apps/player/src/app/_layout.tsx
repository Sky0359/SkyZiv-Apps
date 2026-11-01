// 1. Imports
import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from 'expo-router';
import { Platform } from 'react-native';
import { tokenStorage } from '../utils/tokenStorage';
import { configureApi } from '@skyziv/shared';

// 2. API configuration
configureApi({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  clientApplication: 'PLAYER',
  clientVersion: '1.0.0',
  clientPlatform:
    Platform.OS === 'ios'
      ? 'iOS'
      : Platform.OS === 'web'
        ? 'Web'
        : 'Android',
  getAccessToken: tokenStorage.getToken,
});

// 3. Your existing RootLayout component
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  );
}