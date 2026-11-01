
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const COLORS = {
  primary: '#087A49',
  primaryDark: '#064E3B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  mint: '#F0FAF4',
  text: '#111827',
  secondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
};

type Gender = 'Male' | 'Female' | 'Other';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  const [image, setImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selectProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow photo library access to select a profile image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch {
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must contain at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (dateOfBirth.trim()) {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
        newErrors.dateOfBirth = 'Use DD/MM/YYYY format.';
      } else {
        const [day, month, year] = dateOfBirth.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month - 1 ||
          date.getDate() !== day ||
          date > new Date()
        ) {
          newErrors.dateOfBirth = 'Please enter a valid date of birth.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    Keyboard.dismiss();

    if (!validateForm()) return;

    // Backend integration will be added after confirming
    // POST /api/players/user-profile request fields.

    Alert.alert(
      'Profile UI ready',
      'Your details are validated. Profile API integration is the next step.'
    );
  };

  const handleSkip = () => {
    router.replace('/(main)');
  };

  const handleBack = () => {
    router.back();
  };

  const updateField = (
    field: string,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Top navigation */}
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            <Text style={styles.topBarTitle}>PLAYER PROFILE</Text>

            <View style={styles.topBarSpacer} />
          </View>

          {/* Profile image */}
          <View style={styles.imageSection}>
            <Pressable
              style={styles.avatarContainer}
              onPress={selectProfileImage}
            >
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={styles.avatarInitial}>S</Text>
                </View>
              )}

              <View style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>+</Text>
              </View>
            </Pressable>

            <Pressable onPress={selectProfileImage}>
              <Text style={styles.addPhotoText}>
                {image ? 'Change profile photo' : 'Add profile photo'}
              </Text>
            </Pressable>

            <Text style={styles.photoHint}>
              Optional · JPG or PNG
            </Text>
          </View>

          {/* Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Add your details to get started with SkyZiv.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              Personal information
            </Text>

            {/* Full name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full name *</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.fullName ? styles.inputError : null,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={(value) =>
                  updateField('fullName', value, setFullName)
                }
                autoCapitalize="words"
              />

              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email address *</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.email ? styles.inputError : null,
                ]}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(value) =>
                  updateField('email', value, setEmail)
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Date of birth */}
            <View style={styles.field}>
              <Text style={styles.label}>Date of birth</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.dateOfBirth ? styles.inputError : null,
                ]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={dateOfBirth}
                onChangeText={(value) =>
                  updateField(
                    'dateOfBirth',
                    value,
                    setDateOfBirth
                  )
                }
                keyboardType="numeric"
                maxLength={10}
              />

              {errors.dateOfBirth ? (
                <Text style={styles.errorText}>
                  {errors.dateOfBirth}
                </Text>
              ) : null}
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <Text style={styles.label}>Gender</Text>

              <View style={styles.genderContainer}>
                {(['Male', 'Female', 'Other'] as Gender[]).map(
                  (item) => {
                    const selected = gender === item;

                    return (
                      <Pressable
                        key={item}
                        style={[
                          styles.genderButton,
                          selected && styles.genderSelected,
                        ]}
                        onPress={() => setGender(item)}
                      >
                        <Text
                          style={[
                            styles.genderText,
                            selected && styles.genderSelectedText,
                          ]}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>
          </View>

          {/* Save button */}
          <Pressable
            style={[
              styles.saveButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                Save & Continue
              </Text>
            )}
          </Pressable>

          {/* Skip */}
          <Pressable
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Your game starts here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: COLORS.text,
  },
  topBarTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.secondary,
  },
  topBarSpacer: {
    width: 36,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    marginBottom: 12,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.surface,
  },
  defaultAvatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.mint,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  photoHint: {
    marginTop: 5,
    fontSize: 11,
    color: COLORS.secondary,
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: -4,
  },
  field: {
    gap: 9,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  } as any,
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  genderSelected: {
    backgroundColor: COLORS.mint,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  genderSelectedText: {
    color: COLORS.primary,
  },
  saveButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
    marginBottom: 16,
  },
});
