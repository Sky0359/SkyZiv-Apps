export interface SendOtpRequest {
  countryGuidId: string;
  countryCode: string;
  mobileNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOtpRequest {
  countryGuidId: string;
  countryCode: string;
  mobileNumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  isExistUser: boolean;
  success: boolean;
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
    expiresOn: string;
  };
}

export interface Country {
  countryGuidId: string;
  name: string;
  iso2Code: string;
  iso3Code: string;
  phoneCode: string;
  currencyCode: string;
  currencySymbol: string;
  mobileNumberMinLength: number;
  mobileNumberMaxLength: number;
}