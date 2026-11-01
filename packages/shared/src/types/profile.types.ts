export interface PlayerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  email?: string;
  city?: string;
  profileImage?: string;
  isProfileComplete: boolean;
}

export interface CreatePlayerProfileRequest {
  fullName: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  email?: string;
  city?: string;
  profileImage?: string;
}

export interface CreatePlayerProfileResponse {
  success: boolean;
  message?: string;
  data?: PlayerProfile;
}