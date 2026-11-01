import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as NativeTextInput,
  View,
  type TextInputProps as NativeTextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  borders,
  colors,
  radii,
  spacing,
  typography,
} from '../../theme';

export interface TextInputProps
  extends Omit<NativeTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: NativeTextInputProps['style'];
}

export function TextInput({
  label,
  error,
  helperText,
  secureTextEntry,
  editable = true,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...inputProps
}: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          hasError && styles.errorBorder,
          !editable && styles.disabled,
        ]}
      >
        <NativeTextInput
          {...inputProps}
          editable={editable}
          secureTextEntry={
            secureTextEntry && !isPasswordVisible
          }
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
          style={[styles.input, inputStyle]}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityState={{ disabled: !editable }}
            disabled={!editable}
            onPress={() => {
              setIsPasswordVisible((visible) => !visible);
            }}
            style={styles.passwordToggle}
          >
            <Text style={styles.toggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {hasError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.xs,
  },

  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },

  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.width,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },

  input: {
    flex: 1,
    minHeight: 46,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.body,
  },

  focused: {
    borderColor: colors.primary,
    borderWidth: borders.focusedWidth,
  },

  errorBorder: {
    borderColor: colors.error,
  },

  disabled: {
    backgroundColor: colors.surface,
    opacity: 0.7,
  },

  passwordToggle: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
  },

  toggleText: {
    color: colors.primary,
    fontWeight: '600',
  },

  errorText: {
    ...typography.caption,
    color: colors.error,
  },

  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});