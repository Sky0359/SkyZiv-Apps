import { apiClient } from '../api/client';

import type {
  PlayerProfile,
  CreatePlayerProfileRequest,
  CreatePlayerProfileResponse,
} from '../types/profile.types';

import type { ApiResponse } from '../types/api.types';

export const profileService = {
  getMyProfile: () =>
    apiClient.get<ApiResponse<PlayerProfile>>(
      '/api/players/profile',
    ),

  createProfile: (payload: CreatePlayerProfileRequest) =>
    apiClient.post<ApiResponse<CreatePlayerProfileResponse>>(
      '/api/players/user-profile',
      payload,
    ),
};