
import type { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { colors, spacing } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';

export interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function ResponsiveContainer({
  children,
  maxWidth = 1440,
  style,
}: ResponsiveContainerProps) {
  const { width } = useResponsive();

  const horizontalPadding =
    width < 600 ? spacing.md :
    width < 900 ? spacing.xl :
    spacing.xxl;

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth,
          paddingHorizontal: horizontalPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
});
