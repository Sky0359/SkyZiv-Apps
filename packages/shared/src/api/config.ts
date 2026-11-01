
export type ClientApplication = 'PLAYER' | 'OWNER' | 'ADMIN';

export type ClientPlatform = 'Android' | 'iOS' | 'Web';

export interface ApiConfig {
  baseUrl: string;
  clientApplication: ClientApplication;
  clientVersion: string;
  clientPlatform: ClientPlatform;
  getAccessToken?: () => Promise<string | null>;
}

let apiConfig: ApiConfig | null = null;

export const configureApi = (config: ApiConfig) => {
  apiConfig = {
    ...config,
    baseUrl: config.baseUrl.replace(/\/+$/, ''),
  };
};

export const getApiConfig = (): ApiConfig => {
  if (!apiConfig) {
    throw new Error(
      'API is not configured. Call configureApi() before making API requests.',
    );
  }

  return apiConfig;
};