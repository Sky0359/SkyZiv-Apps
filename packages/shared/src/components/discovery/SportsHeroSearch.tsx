import { useRef, useState, ComponentRef  } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View,
         type ImageSourcePropType, type NativeScrollEvent, type NativeSyntheticEvent,
         type LayoutChangeEvent,} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing } from '../../theme';

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  highlight: string;
  description: string;
  buttonLabel: string;
  imageSource: ImageSourcePropType;
}

export interface SportsHeroSearchProps {
  slides: HeroSlide[];
  onBookNow: (slide: HeroSlide) => void;
}

export function SportsHeroSearch({
  slides,
  onBookNow,
}: SportsHeroSearchProps) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const handleCarouselLayout = (event: LayoutChangeEvent) => {
    const measuredWidth = event.nativeEvent.layout.width;

    if (measuredWidth > 0 && measuredWidth !== carouselWidth) {
      setCarouselWidth(measuredWidth);
    }
  };

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const pageWidth = event.nativeEvent.layoutMeasurement.width;

    if (pageWidth <= 0 || slides.length === 0) {
      return;
    }

    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / pageWidth,
    );

    setActiveIndex(
      Math.max(0, Math.min(nextIndex, slides.length - 1)),
    );
  };

  const goToSlide = (index: number) => {
    if (
      carouselWidth <= 0 ||
      index < 0 ||
      index >= slides.length
    ) {
      return;
    }

    scrollRef.current?.scrollTo({
      x: index * carouselWidth,
      animated: true,
    });

    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Hero carousel */}
      <View
        style={styles.carousel}
        onLayout={handleCarouselLayout}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {slides.map((slide) => (
            <ImageBackground
              key={slide.id}
              source={slide.imageSource}
              resizeMode="cover"
              style={[
                styles.banner,
                {
                  width: carouselWidth || '100%',
                },
              ]}
              imageStyle={styles.bannerImage}
            >
              {/* Dark overlay for readable text */}
              <View style={styles.bannerOverlay} />

              <View style={styles.bannerContent}>
                <Text style={styles.eyebrow}>
                  {slide.eyebrow ?? 'YOUR GAME. YOUR SPACE.'}
                </Text>

                <Text style={styles.bannerTitle}>
                  {slide.title}
                  {'\n'}
                  <Text style={styles.bannerHighlight}>
                    {slide.highlight}
                  </Text>
                </Text>

                <Text style={styles.bannerDescription}>
                  {slide.description}
                </Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => onBookNow(slide)}
                  style={({ pressed }) => [
                    styles.bookButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.bookButtonText}>
                    {slide.buttonLabel}
                  </Text>

                  <ArrowRight
                    size={17}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        {/* Carousel indicators */}
        {slides.length > 1 && (
          <View style={styles.dotsContainer}>
            {slides.map((slide, index) => (
              <Pressable
                key={slide.id}
                accessibilityRole="button"
                accessibilityLabel={`Show slide ${index + 1}`}
                accessibilityState={{
                  selected: activeIndex === index,
                }}
                onPress={() => goToSlide(index)}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.lg,
  },

  carousel: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radii.card,
    backgroundColor: colors.surfaceBlue,
  },

  banner: {
    minHeight: 270,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
  },

  bannerImage: {
    borderRadius: radii.card,
  },

  bannerOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(5, 20, 18, 0.58)',
},

  bannerContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'flex-start',
  },

  eyebrow: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
  },

  bannerHighlight: {
    color: '#86EFAC',
  },

  bannerDescription: {
    maxWidth: 280,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    color: '#F3F4F6',
    fontSize: 13,
    lineHeight: 20,
  },

  bookButton: {
    minHeight: 43,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  bookButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  dotsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },

  activeDot: {
    width: 21,
    backgroundColor: '#FFFFFF',
  },

  searchRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  searchBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 14,
  },

  filterButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMint,
  },
});