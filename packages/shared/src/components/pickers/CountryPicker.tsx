import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { authService } from '../../services/auth.service';
import type { Country } from '../../types/auth.types';

interface CountryPickerProps {
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
}

export function CountryPicker({
  selectedCountry,
  onSelect,
}: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await authService.getCountries();

        if (!response.success) {
          throw new Error(response.message || 'Unable to load countries');
        }

        if (active) {
          setCountries(response.data);

          const india = response.data.find(
            (country) => country.iso2Code === 'IN',
          );

          if (india && !selectedCountry) {
            onSelect(india);
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load countries',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, []);

  const filteredCountries = countries.filter((country) =>
    `${country.name} ${country.phoneCode} ${country.iso2Code}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const chooseCountry = (country: Country) => {
    onSelect(country);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <Pressable
        style={styles.selector}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedCountry
            ? `${selectedCountry.iso2Code} ${selectedCountry.phoneCode}  ▼`
            : 'Select country'}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select country</Text>

            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Search country or calling code"
            value={search}
            onChangeText={setSearch}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#087A49"
              style={styles.loader}
            />
          ) : error ? (
            <View style={styles.empty}>
              <Text style={styles.error}>{error}</Text>
              <Pressable
                onPress={() => {
                  setVisible(false);
                  setVisible(true);
                }}
              >
                <Text style={styles.retry}>Close and reopen picker</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.countryGuidId}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.countryRow}
                  onPress={() => chooseCountry(item)}
                >
                  <View>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryCode}>
                      {item.iso2Code}
                    </Text>
                  </View>

                  <Text style={styles.phoneCode}>
                    {item.phoneCode}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No countries found
                </Text>
              }
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },
  close: {
    color: '#087A49',
    fontWeight: '600',
  },
  selector: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  selectorText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  search: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: '#111827',
  },
  loader: {
    marginTop: 40,
  },
  countryRow: {
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  countryName: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  countryCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  phoneCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#087A49',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 30,
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
  },
  retry: {
    color: '#087A49',
    fontWeight: '600',
  },
});