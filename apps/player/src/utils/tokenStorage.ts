import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async saveToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async saveRefreshToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async removeTokens(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};