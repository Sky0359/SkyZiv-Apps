export interface Venue {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  hourlyPrice: number;
  sports: string[];
  amenities: string[];
}