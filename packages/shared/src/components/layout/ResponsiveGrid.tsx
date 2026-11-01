import type { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { spacing } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';

export interface ResponsiveGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export function ResponsiveGrid<T>({
  data,
  renderItem,
  keyExtractor,
  gap = spacing.lg,
  style,
}: ResponsiveGridProps<T>) {
  const { columns } = useResponsive();

  const itemWidth = `${100 / columns}%` as const;

  return (
    <View style={[styles.grid, style]}>
      {data.map((item, index) => (
        <View
          key={keyExtractor(item, index)}
          style={{
            width: itemWidth,
            paddingHorizontal: gap / 2,
            marginBottom: gap,
          }}
        >
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});