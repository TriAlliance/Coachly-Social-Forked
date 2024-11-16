export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: 'race' | 'training' | 'social' | 'competition';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  capacity?: number;
  participants: number;
  participantLimit?: number;
  createdBy: string;
  createdAt: string;
  averageRating: number;
  totalRatings: number;
  price?: number;
  distance?: number;
  image?: string;
  tags: string[];
  isRegistered?: boolean;
}