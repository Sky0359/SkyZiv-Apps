
import { getApiConfig } from './config';
import { ApiError } from './ApiError';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  endpoint: string,
  method: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const config = getApiConfig();

  const token = await config.getAccessToken?.();

  // Common headers automatically added to EVERY request.
  const headers: Record<string, string> = {
    Accept: 'application/json',

    'X-Client-Application': config.clientApplication,
    'X-Client-Version': config.clientVersion,
    'X-Client-Platform': config.clientPlatform,

    ...options.headers,
  };

  // Automatically attach JWT token.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;

  if (options.body !== undefined) {
    if (
      typeof FormData !== 'undefined' &&
      options.body instanceof FormData
    ) {
      body = options.body as FormData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(
    `${config.baseUrl}/${endpoint.replace(/^\/+/, '')}`,
    {
      method,
      headers,
      body,
      signal: options.signal,
    },
  );

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : `API request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) =>
    request<T>(endpoint, 'GET', options),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) => request<T>(endpoint, 'POST', { ...options, body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) => request<T>(endpoint, 'PUT', { ...options, body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) => request<T>(endpoint, 'PATCH', { ...options, body }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    request<T>(endpoint, 'DELETE', options),
};