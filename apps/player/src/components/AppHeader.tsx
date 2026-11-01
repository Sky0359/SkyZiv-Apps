import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  MapPin,
  ChevronDown,
  Bell,
} from 'lucide-react-native';

import { colors, radii, spacing } from '@skyziv/shared';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.brandName}>SkyZiv</Text>
      </View>

      {/* Location and notification */}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select location, currently Navi Mumbai"
          style={styles.location}
          onPress={() => {
            // Connect the location picker here later.
          }}
        >
          <MapPin
            size={17}
            color={colors.primary}
            strokeWidth={2.5}
          />

          <View style={styles.locationDetails}>
            <View style={styles.locationValue}>
              <Text style={styles.locationName} numberOfLines={1}>
                Navi Mumbai
              </Text>
              <ChevronDown
                size={13}
                color={colors.text}
              />
            </View>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications, unread notifications"
          style={styles.notificationButton}
          onPress={() => {
            // Navigate to notifications here later.
          }}
        >
          <Bell
            size={23}
            color={colors.text}
            strokeWidth={1.8}
          />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
        width: '100%',
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,

        // Light shadow below header
        borderBottomWidth: 0,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,

        zIndex: 10,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: colors.textOnPrimary,
    fontSize: 22,
    fontWeight: '800',
  },

  brandName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
    paddingVertical: spacing.xs,
  },

  locationDetails: {
    flexShrink: 1,
  },

  locationCaption: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: colors.textSecondary,
  },

  locationValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },

  locationName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },

  notificationButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },

  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  
});