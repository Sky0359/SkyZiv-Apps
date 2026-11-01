
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { authService } from '@skyziv/shared';
import type { Country } from '@skyziv/shared';

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

export default function LoginScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [search, setSearch] = useState('');

  const [showCountries, setShowCountries] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);

      const response = await authService.getCountries();
      const countryList = response.data ?? [];

      setCountries(countryList);

      const india = countryList.find(
        (country) => country.iso2Code === 'IN'
      );

      setSelectedCountry(india ?? countryList[0] ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load countries.'
      );
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setMobileNumber('');
    setError('');
    setShowCountries(false);
    setSearch('');
  };

  const handleMobileChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const maxLength = selectedCountry?.mobileNumberMaxLength ?? 15;

    setMobileNumber(digits.slice(0, maxLength));
    setError('');
  };

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    setError('');

    if (!selectedCountry) {
      setError('Please select your country.');
      return;
    }

    const minLength = selectedCountry.mobileNumberMinLength;
    const maxLength = selectedCountry.mobileNumberMaxLength;

    if (
      mobileNumber.length < minLength ||
      mobileNumber.length > maxLength
    ) {
      setError(
        `Please enter a valid mobile number (${minLength} digits required).`
      );
      return;
    }

    try {
      setLoading(true);

      const response = await authService.sendOtp({
        countryGuidId: selectedCountry.countryGuidId,
        countryCode: selectedCountry.phoneCode,
        mobileNumber,
      });

      if (!response.success) {
        setError(response.message || 'Unable to send OTP.');
        return;
      }

        router.push({
        pathname: '/(auth)/otp',
        params: {
            countryGuidId: selectedCountry.countryGuidId,
            countryCode: selectedCountry.iso3Code,
            phoneCode: selectedCountry.phoneCode,
            mobileNumber,
        },
        });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter((country) => {
    const query = search.toLowerCase();

    return (
      country.name.toLowerCase().includes(query) ||
      country.phoneCode.toLowerCase().includes(query) ||
      country.iso2Code.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>

          <Text style={styles.title}>Welcome to SkyZiv</Text>

          <Text style={styles.subtitle}>
            Enter your mobile number to continue
          </Text>
        </View>

        {/* Mobile number */}
        <Text style={styles.label}>Mobile number</Text>

        <View style={[styles.phoneInput, error ? styles.inputError : null]}>
          {/* Country dropdown inside phone input */}
          <Pressable
            style={styles.countryButton}
            onPress={() => setShowCountries(true)}
            disabled={loadingCountries}
          >
            {loadingCountries ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Text style={styles.countryText}>
                  {selectedCountry?.iso2Code ?? 'IN'}
                </Text>
                <Text style={styles.countryCode}>
                  {selectedCountry?.phoneCode ?? '+91'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </>
            )}
          </Pressable>

          <View style={styles.inputDivider} />

          <TextInput
            style={styles.mobileInput}
            value={mobileNumber}
            onChangeText={handleMobileChange}
            placeholder="Enter mobile number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={selectedCountry?.mobileNumberMaxLength ?? 15}
            editable={!loading}
          />
        </View>

        <Text style={styles.helperText}>
          {selectedCountry
            ? `Enter ${selectedCountry.mobileNumberMinLength} digits.`
            : 'Select your country to continue.'}
        </Text>

        {/* Validation */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {/* Send OTP */}
        <Pressable
          style={[
            styles.sendButton,
            (loading || !selectedCountry) && styles.disabledButton,
          ]}
          onPress={handleSendOtp}
          disabled={loading || !selectedCountry}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send OTP</Text>
          )}
        </Pressable>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms & Conditions and Privacy Policy.
        </Text>

        <Text style={styles.footerText}>Your game starts here.</Text>
      </View>

      {/* Country selection modal */}
      <Modal
        visible={showCountries}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountries(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select country</Text>

              <Pressable onPress={() => setShowCountries(false)}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country or calling code"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.countryGuidId}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.countryName}>{item.name}</Text>

                  <Text style={styles.countryPhoneCode}>
                    {item.phoneCode}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No countries found.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 42,
  },
  logo: {
    height: 64,
    width: 64,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 11,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  countryButton: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  countryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dropdownArrow: {
    fontSize: 10,
    color: COLORS.secondary,
  },
  inputDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  mobileInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    outlineStyle: 'none',
  } as any,
  helperText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 9,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 10,
  },
  sendButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 11,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 18,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  modalContainer: {
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 12,
    color: COLORS.text,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryName: {
    fontSize: 15,
    color: COLORS.text,
  },
  countryPhoneCode: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.secondary,
    marginTop: 30,
  },
});