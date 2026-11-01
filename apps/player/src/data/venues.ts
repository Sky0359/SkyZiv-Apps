
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

export const venues: Venue[] = [
  {
    id: '1',
    name: 'Greenfield Sports Arena',
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200',
    rating: 4.8,
    reviewCount: 120,
    location: 'Andheri West, Mumbai',
    hourlyPrice: 800,
    sports: ['Football', 'Futsal'],
    amenities: ['Floodlights', 'Parking', 'Changing room'],
  },
  {
    id: '2',
    name: 'Elite Badminton Club',
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200',
    rating: 4.7,
    reviewCount: 86,
    location: 'Powai, Mumbai',
    hourlyPrice: 500,
    sports: ['Badminton'],
    amenities: ['Indoor court', 'Parking', 'Equipment'],
  },
];
