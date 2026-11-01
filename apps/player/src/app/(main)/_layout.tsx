import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Home,
  Compass,
  CalendarCheck,
  History,
  UserRound,
} from 'lucide-react-native';

import AppHeader from '@/components/AppHeader';
import { colors } from '@skyziv/shared';

const isWeb = Platform.OS === 'web';

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <AppHeader />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#737B87',


        tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,

            height: Platform.OS === 'web' ? 'auto' : 68,
            paddingTop: 10,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,

            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: colors.border,
            borderRadius: 0,

            elevation: 12,
             shadowColor: '#000000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,

                zIndex: 10,

            ...(Platform.OS === 'web'
                ? {
                    width: '100%',
                    maxWidth: '100%',
                    alignSelf: 'stretch' as const,
                }
                : {}),
        },
                                
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 3,
        },

        tabBarItemStyle: {
            paddingVertical: 2,
        },

        tabBarIconStyle: {
            marginTop: 0,
        },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Home
                color={color}
                size={size ?? 21}
                strokeWidth={focused ? 2.5 : 1.8}
                fill={focused ? color : 'none'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size, focused }) => (
              <Compass
                color={color}
                size={size ?? 21}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color, size, focused }) => (
              <CalendarCheck
                color={color}
                size={size ?? 21}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <History
                color={color}
                size={size ?? 21}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <UserRound
                color={color}
                size={size ?? 21}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});