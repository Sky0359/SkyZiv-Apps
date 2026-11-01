import { apiClient } from '../api/client';
import type { Venue } from '../types/venue.types';

export const venueService = {
  getAll: () => apiClient.get<Venue[]>('/api/venues'),

  getById: (id: string) =>
    apiClient.get<Venue>(
      `/api/venues/${encodeURIComponent(id)}`,
    ),
};