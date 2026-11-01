import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Search,
  SlidersHorizontal,
} from 'lucide-react-native';

import {
  SportsHeroSearch,
  VenueCard,
  ResponsiveContainer,
  ResponsiveGrid,
  colors,
  spacing,
  radii,
  typography,
} from '@skyziv/shared';

import { heroSlides } from '@/features/home/data/heroSlides';
import { router } from 'expo-router';

const sports = [
  { name: 'Football', emoji: '⚽' },
  { name: 'Badminton', emoji: '🏸' },
  { name: 'Cricket', emoji: '🏏' },
  { name: 'Tennis', emoji: '🎾' },
];

const venues = [
  {
    id: '1',
    name: 'Greenfield Sports Arena',
    image: {
      uri: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900',
    },
    rating: 4.8,
    reviewCount: 120,
    location: 'Andheri West, Mumbai',
    hourlyPrice: 800,
    sports: ['Football', 'Futsal'],
    amenities: ['Floodlights', 'Parking', 'Changing room'],
  },
  {
    id: '2',
    name: 'Elite Badminton Club',
    image: {
      uri: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900',
    },
    rating: 4.7,
    reviewCount: 86,
    location: 'Powai, Mumbai',
    hourlyPrice: 500,
    sports: ['Badminton'],
    amenities: ['Indoor court', 'Parking', 'Equipment'],
  },
];

export default function HomeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);

  const [draftSport, setDraftSport] = useState('All');
  const [draftMaxPrice, setDraftMaxPrice] = useState<number | null>(null);
  const [draftMinRating, setDraftMinRating] = useState(0);

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const onFilterPress = () => {
      // TODO: Filter modal baad mein implement karenge.
      console.log('Open venue filters');
    };
  const filteredVenues = venues.filter((venue) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm) ||
      venue.location.toLowerCase().includes(searchTerm) ||
      venue.sports.some((sport) =>
        sport.toLowerCase().includes(searchTerm),
      );

    const matchesSport =
      selectedSport === 'All' ||
      venue.sports.includes(selectedSport);

    const matchesPrice = maxPrice === null || venue.hourlyPrice <= maxPrice;

    const matchesRating = venue.rating >= minRating;

    return (
      matchesSearch &&
      matchesSport &&
      matchesPrice &&
      matchesRating
    );
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedSport('All');
  };

  
return (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ResponsiveContainer
        maxWidth={1440}
        style={styles.pageContent}
      >
        {/* Hero carousel only */}
        <View style={styles.hero}>
          <SportsHeroSearch
            slides={heroSlides}
            onBookNow={(slide) => {
              // TODO: Navigate to Explore or booking screen.
              console.log('Selected slide:', slide.id);
            }}
          />
        </View>

        {/* Search and filter row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search
              size={20}
              color={colors.textSecondary}
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search sports, venues..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.searchInput,
                Platform.OS === 'web' && {
                  outlineStyle: 'none',
                  outlineWidth: 0,
                  boxShadow: 'none',
                } as any,
              ]}
              returnKeyType="search"
              accessibilityLabel="Search sports and venues"
              underlineColorAndroid="transparent"
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter venues"
            onPress={() => {
              setDraftSport(selectedSport);
              setDraftMaxPrice(maxPrice);
              setDraftMinRating(minRating);
              setFilterVisible(true);
            }}
            style={({ pressed }) => [
              styles.filterButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <SlidersHorizontal
              size={21}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* Sports categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Play your sport
            </Text>
          </View>

          <View style={styles.sportsGrid}>
            {sports.map((sport) => {
              const isSelected = selectedSport === sport.name;

              return (
                <Pressable
                  key={sport.name}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setSelectedSport(
                      isSelected ? 'All' : sport.name,
                    );
                  }}
                  style={[
                    styles.sportCard,
                    isSelected && styles.sportCardSelected,
                  ]}
                >
                  <Text style={styles.sportEmoji}>
                    {sport.emoji}
                  </Text>

                  <Text
                    style={[
                      styles.sportName,
                      isSelected && styles.sportNameSelected,
                    ]}
                  >
                    {sport.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Featured venues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>
                Featured venues
              </Text>

              <Text style={styles.sectionSubtitle}>
                Great places to get in the game
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={resetFilters}
            >
              <Text style={styles.seeAll}>View all</Text>
            </Pressable>
          </View>

          {filteredVenues.length > 0 ? (
            <ResponsiveGrid
              data={filteredVenues}
              keyExtractor={(venue) => venue.id}
              gap={spacing.lg}
              renderItem={(venue) => (
                <VenueCard
                  {...venue}
                  onPress={() => {
                    // TODO: Navigate to venue details.
                    router.push({
                      pathname: '/venue/[id]',
                      params: { id: venue.id },
                    })
                  }}
                />
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                No venues found
              </Text>

              <Text style={styles.emptySubtitle}>
                Try another search or select a different sport.
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={resetFilters}
                style={({ pressed }) => [
                  styles.resetButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.resetButtonText}>
                  Clear filters
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer note */}
        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            Find your field. Bring your game. 💚
          </Text>
        </View>
      </ResponsiveContainer>
    </ScrollView>

    {/* Filter modal */}
    <Modal
      visible={filterVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFilterVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          style={styles.modalBackdrop}
          onPress={() => setFilterVisible(false)}
        />

        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Filter venues
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close filter modal"
              onPress={() => setFilterVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.filterLabel}>Sport</Text>

          <View style={styles.filterOptions}>
            {['All', ...sports.map((sport) => sport.name)].map(
              (sport) => {
                const selected = draftSport === sport;

                return (
                  <Pressable
                    key={sport}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setDraftSport(sport)}
                    style={[
                      styles.filterChip,
                      selected && styles.filterChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selected && styles.filterChipTextSelected,
                      ]}
                    >
                      {sport}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          <Text style={styles.filterLabel}>
            Maximum hourly price
          </Text>

          <View style={styles.filterOptions}>
            {[500, 800, 1000, 1500].map((price) => {
              const selected = draftMaxPrice === price;

              return (
                <Pressable
                  key={price}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() =>
                    setDraftMaxPrice(selected ? null : price)
                  }
                  style={[
                    styles.filterChip,
                    selected && styles.filterChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && styles.filterChipTextSelected,
                    ]}
                  >
                    ₹{price}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.filterLabel}>Minimum rating</Text>

          <View style={styles.filterOptions}>
            {[0, 3, 4, 4.5].map((rating) => {
              const selected = draftMinRating === rating;

              return (
                <Pressable
                  key={rating}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setDraftMinRating(rating)}
                  style={[
                    styles.filterChip,
                    selected && styles.filterChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && styles.filterChipTextSelected,
                    ]}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ ★`}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.modalActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDraftSport('All');
                setDraftMaxPrice(null);
                setDraftMinRating(0);
              }}
              style={[styles.modalButton, styles.clearModalButton]}
            >
              <Text style={styles.clearModalButtonText}>
                Clear
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSelectedSport(draftSport);
                setMaxPrice(draftMaxPrice);
                setMinRating(draftMinRating);
                setFilterVisible(false);
              }}
              style={[styles.modalButton, styles.applyModalButton]}
            >
              <Text style={styles.applyModalButtonText}>
                Apply filters
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 110,
    alignItems: 'center',
  },

  pageContent: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
  },

  // Hero
  hero: {
    width: '100%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  // Sections
  section: {
    width: '100%',
    marginBottom: spacing.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  sectionHeading: {
    flex: 1,
  },

  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
    color: colors.text,
    fontWeight: '800',
  },

  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  // Sports categories
  sportsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  sportCard: {
    flexGrow: 1,
    flexBasis: '21%',
    minWidth: 0,
    minHeight: 90,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },

  sportCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  sportEmoji: {
    fontSize: 29,
  },

  sportName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  sportNameSelected: {
    color: colors.primaryDark,
  },

  // Empty state
  emptyState: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },

  emptyTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '700',
  },

  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  resetButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  resetButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },

  // Footer
  bottomNote: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  bottomNoteText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  searchRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    marginBottom: spacing.xl,
  },

  searchBox: {
    flex: 1,
    minWidth: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 14,
  },

  filterButton: {
    width: 50,
    height: 50,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMint,
  },

  buttonPressed: {
    opacity: 0.7,
  },
  
  // Filter modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 24,
    paddingBottom: 32,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  modalCloseText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  filterChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 18,
  },
  clearModalButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  clearModalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  applyModalButton: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  applyModalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
});