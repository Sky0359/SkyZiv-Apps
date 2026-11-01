import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';

export interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message.trim()) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      style={styles.container}
    >
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  message: {
    ...typography.bodySmall,
    color: colors.error,
  },
});