
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { authService } from '@skyziv/shared';

const COLORS = {
  primary: '#087A49',
  primaryDark: '#064E3B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#111827',
  secondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
};

export default function OtpScreen() {
  const params = useLocalSearchParams<{
    countryGuidId: string;
    countryCode: string;
    mobileNumber: string;
  }>();

  const countryGuidId = params.countryGuidId ?? '';
  const countryCode = params.countryCode ?? '+91';
  const mobileNumber = params.mobileNumber ?? '';

  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');

 const otpInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, '').slice(0, 6));
    setMessage('');
  };

  // Resend OTP using existing API
  const handleResendOtp = async () => {
    if (seconds > 0 || resending) return;

    try {
      setResending(true);
      setMessage('');

      const response = await authService.sendOtp({
        countryGuidId,
        countryCode,
        mobileNumber,
      });

      if (response.success) {
        setSeconds(30);
        setOtp('');
        setMessage('A new verification code has been sent.');
      } else {
        setMessage(response.message || 'Unable to resend OTP.');
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to resend OTP.'
      );
    } finally {
      setResending(false);
    }
  };

  // Verification API will be connected after confirming its Swagger contract.
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage('Please enter the 6-digit verification code.');
      return;
    }

    Keyboard.dismiss();

    setVerifying(true);
    router.replace('/(auth)/profile');
  };

  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] || '');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        {/* Back navigation */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.messageIcon}>✉</Text>
          </View>

          <Text style={styles.title}>Verify your number</Text>

          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>

          <Text style={styles.phoneNumber}>
            {countryCode} {mobileNumber}
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpSection}>
          <Text style={styles.inputLabel}>Enter verification code</Text>

          <Pressable
            style={styles.otpBoxes}
            onPress={() => otpInputRef.current?.focus()}
          >
            {otpDigits.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  otp.length === index && styles.activeOtpBox,
                ]}
              >
                <Text style={styles.otpDigit}>
                  {digit || ''}
                </Text>
              </View>
            ))}

            <TextInput
              ref={otpInputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              style={styles.hiddenInput}
              caretHidden
            />
          </Pressable>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?
            </Text>

            {seconds > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in 00:{String(seconds).padStart(2, '0')}
              </Text>
            ) : (
              <Pressable
                onPress={handleResendOtp}
                disabled={resending}
              >
                <Text style={styles.resendLink}>
                  {resending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </Pressable>
            )}
          </View>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}
        </View>

        {/* Verify button */}
        <Pressable
          style={[
            styles.verifyButton,
            (otp.length !== 6 || verifying) && styles.disabledButton,
          ]}
          onPress={handleVerifyOtp}
          disabled={otp.length !== 6 || verifying}
        >
          {verifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>
              Verify & Continue
            </Text>
          )}
        </Pressable>

        {/* Change number */}
        <Pressable
          style={styles.changeNumberButton}
          onPress={() => router.back()}
        >
          <Text style={styles.changeNumberText}>
            Change mobile number
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Secure login powered by SkyZiv
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 36,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 30,
    color: COLORS.text,
    marginRight: 8,
    lineHeight: 32,
  },
  backText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F0FAF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  messageIcon: {
    fontSize: 30,
    color: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 8,
  },
  otpSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 14,
  },
  otpBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  otpBox: {
    width: '14%',
    maxWidth: 54,
    height: 58,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOtpBox: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#F0FAF4',
  },
  otpDigit: {
    fontSize: 23,
    fontWeight: '700',
    color: COLORS.text,
  },
  hiddenInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 58,
    opacity: 0.01,
    color: 'transparent',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  resendText: {
    fontSize: 13,
    color: COLORS.secondary,
    marginRight: 5,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  message: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  changeNumberButton: {
    alignItems: 'center',
    marginTop: 22,
    padding: 8,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 42,
  },
});
