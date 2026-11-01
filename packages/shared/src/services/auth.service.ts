import { apiClient } from '../api/client';
import type { ApiResponse } from '../types/api.types';
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  Country
} from '../types/auth.types';

export const authService = {
  sendOtp: (payload: SendOtpRequest) =>
    apiClient.post<SendOtpResponse>(
      '/api/auth/send-player-otp',
      payload,
    ),

verifyOtp: (payload: VerifyOtpRequest) =>
  apiClient.post<ApiResponse<VerifyOtpResponse>>(
    '/api/auth/verify-otp',
    payload
  ),
  
  getCountries: () =>
    apiClient.get<ApiResponse<Country[]>>(
      '/api/auth/countries',
    ),
};