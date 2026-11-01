
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';

export interface VenueCardProps {
  name: string;
  image: ImageSourcePropType;
  rating: number;
  reviewCount: number;
  location: string;
  hourlyPrice: number;
  sports: string[];
  amenities: string[];
  onPress: () => void;
}

export function VenueCard({
  name,
  image,
  rating,
  reviewCount,
  location,
  hourlyPrice,
  sports,
  amenities,
  onPress,
}: VenueCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, rated ${rating} out of 5, ₹${hourlyPrice} per hour`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {/* Venue image */}
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`${name} venue`}
        />

        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeText}>SPORTS VENUE</Text>
        </View>

        <View style={styles.imagePrice}>
          <Text style={styles.imagePriceAmount}>
            ₹{hourlyPrice.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.imagePriceUnit}>/ hour</Text>
        </View>
      </View>

      {/* Venue details */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>

          <View style={styles.rating}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>
              {rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.reviewCount}>
          {reviewCount} reviews
        </Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>⌖</Text>
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>

        {/* Sports */}
        {sports.length > 0 && (
          <View style={styles.tags}>
            {sports.slice(0, 3).map((sport) => (
              <View key={sport} style={styles.sportTag}>
                <Text style={styles.sportText} numberOfLines={1}>
                  {sport}
                </Text>
              </View>
            ))}

            {sports.length > 3 && (
              <Text style={styles.moreText}>
                +{sports.length - 3}
              </Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* Amenities */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.amenitiesHeading}>
            AMENITIES
          </Text>

          <View style={styles.amenities}>
            {amenities.slice(0, 2).map((amenity) => (
              <View key={amenity} style={styles.amenityItem}>
                <Text style={styles.amenityCheck}>✓</Text>
                <Text
                  style={styles.amenityText}
                  numberOfLines={1}
                >
                  {amenity}
                </Text>
              </View>
            ))}

            {amenities.length > 2 && (
              <Text style={styles.moreText}>
                +{amenities.length - 2}
              </Text>
            )}
          </View>
        </View>

        {/* Booking action */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{hourlyPrice.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.perHour}>/ hour</Text>
            </View>
          </View>

          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>
              View venue
            </Text>
            <Text style={styles.bookArrow}>›</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
  },

  imageBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.primary,
  },

  imagePrice: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },

  imagePriceAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },

  imagePriceUnit: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  name: {
    ...typography.subtitle,
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontWeight: '800',
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMint,
  },

  star: {
    fontSize: 14,
    color: '#F59E0B',
  },

  ratingText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text,
  },

  reviewCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  locationIcon: {
    fontSize: 17,
    color: colors.primary,
  },

  location: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textSecondary,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },

  sportTag: {
    maxWidth: '100%',
    backgroundColor: colors.surfaceMint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },

  sportText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },

  moreText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  amenitiesSection: {
    gap: spacing.sm,
  },

  amenitiesHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },

  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },

  amenityItem: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  amenityCheck: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },

  amenityText: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xs,
  },

  priceContainer: {
    flexShrink: 1,
    gap: 2,
  },

  priceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 3,
  },

  price: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '800',
  },

  perHour: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  bookButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
  },

  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },

  bookArrow: {
    fontSize: 20,
    lineHeight: 22,
    color: colors.textOnPrimary,
  },

  pressed: {
    opacity: 0.85,
  },
});