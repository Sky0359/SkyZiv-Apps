
// 1. Imports
import * as SecureStore from 'expo-secure-store';
import { configureApi } from '@skyziv/shared';import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme,Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

// 2. API configuration
configureApi({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  clientApplication: 'OWNER',
  clientVersion: '1.0.0',
  clientPlatform:
    Platform.OS === 'ios'
      ? 'iOS'
      : Platform.OS === 'web'
        ? 'Web'
        : 'Android',
  getAccessToken: () =>
    SecureStore.getItemAsync('access_token'),
});

// 3. Your existing RootLayout component
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
