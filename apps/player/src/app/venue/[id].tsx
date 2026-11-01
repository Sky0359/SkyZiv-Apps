
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { venues } from '../../data/venues';


const dates = [
  { day: 'TODAY', date: '27' },
  { day: 'WED', date: '28' },
  { day: 'THU', date: '29' },
  { day: 'FRI', date: '30' },
  { day: 'SAT', date: '31' },
];

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '4:00 PM',
  '5:00 PM',
];

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const venue = venues.find((item) => item.id === id);

  const [selectedDate, setSelectedDate] = useState('27');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!venue) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Venue not found</Text>
        <Text style={styles.mutedText}>
          We couldn't find the venue you're looking for.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: venue.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {venue.rating}</Text>
            <Text style={styles.reviewText}>({venue.reviewCount})</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>SPORTS VENUE</Text>
          <Text style={styles.venueName}>{venue.name}</Text>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>⌖</Text>
            <Text style={styles.locationText}>{venue.location}</Text>
          </View>

          <View style={styles.priceCard}>
            <View>
              <Text style={styles.mutedText}>Starting from</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{venue.hourlyPrice}</Text>
                <Text style={styles.perHour}>/ hour</Text>
              </View>
            </View>
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>● Booking available</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sports available</Text>
            <View style={styles.chipRow}>
              {venue.sports.map((sport) => (
                <View key={sport} style={styles.chip}>
                  <Text style={styles.chipText}>{sport}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities & facilities</Text>
            <View style={styles.amenitiesGrid}>
              {venue.amenities.map((amenity) => (
                <View key={amenity} style={styles.amenityItem}>
                  <Text style={styles.amenityCheck}>✓</Text>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select a date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            >
              {dates.map((item) => {
                const isSelected = selectedDate === item.date;

                return (
                  <Pressable
                    key={item.date}
                    style={[
                      styles.dateCard,
                      isSelected && styles.dateCardSelected,
                    ]}
                    onPress={() => setSelectedDate(item.date)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {item.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNumber,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {item.date}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available time slots</Text>
            <Text style={styles.mutedText}>
              Select a time that works for you.
            </Text>

            <View style={styles.timeGrid}>
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;

                return (
                  <Pressable
                    key={time}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.mutedText}>Price per hour</Text>
          <Text style={styles.bottomPrice}>₹{venue.hourlyPrice}</Text>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            !selectedTime && styles.buttonDisabled,
          ]}
          disabled={!selectedTime}
          onPress={() => {
            console.log('Booking selection:', {
              venueId: venue.id,
              date: selectedDate,
              time: selectedTime,
            });
          }}
        >
          <Text style={styles.primaryButtonText}>
            {selectedTime ? 'Continue booking' : 'Select a time'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroContainer: {
    height: 280,
    position: 'relative',
    backgroundColor: '#F0FAF4',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#111827',
    fontSize: 34,
    lineHeight: 38,
    marginTop: -4,
  },
  ratingBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewText: {
    color: '#6B7280',
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
  eyebrow: {
    color: '#087A49',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  venueName: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 9,
  },
  locationIcon: {
    color: '#087A49',
    fontSize: 20,
  },
  locationText: {
    color: '#6B7280',
    fontSize: 14,
  },
  priceCard: {
    marginTop: 22,
    padding: 16,
    backgroundColor: '#F0FAF4',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mutedText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
  },
  price: {
    color: '#087A49',
    fontSize: 25,
    fontWeight: '800',
  },
  perHour: {
    color: '#6B7280',
    fontSize: 13,
    marginLeft: 4,
  },
  availableBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  availableText: {
    color: '#087A49',
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  chip: {
    backgroundColor: '#F0FAF4',
    borderColor: '#D1FAE5',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: {
    color: '#087A49',
    fontSize: 13,
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  amenityItem: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityCheck: {
    color: '#087A49',
    fontSize: 16,
    fontWeight: '700',
  },
  amenityText: {
    color: '#374151',
    fontSize: 13,
    flexShrink: 1,
  },
  dateList: {
    gap: 10,
    paddingRight: 4,
  },
  dateCard: {
    width: 66,
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dateCardSelected: {
    backgroundColor: '#087A49',
    borderColor: '#087A49',
  },
  dateDay: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
  },
  dateNumber: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  timeSlot: {
    width: '31%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 5,
  },
  timeSlotSelected: {
    backgroundColor: '#087A49',
    borderColor: '#087A49',
  },
  timeText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomPrice: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#087A49',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  notFoundTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
});
