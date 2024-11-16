export interface User {
  id: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  coverPhotoURL?: string;
  bio?: string;
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals?: string[];
  preferredActivities?: string[];
  privacySettings?: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityVisibility: 'public' | 'private' | 'friends';
    statsVisibility: 'public' | 'private' | 'friends';
    locationVisibility: 'public' | 'private' | 'friends';
  };
  createdAt?: string;
  updatedAt?: string;
  // Health metrics
  healthMetrics?: {
    restingHeartRate?: number;
    vo2Max?: number;
    bodyFatPercentage?: number;
    bmi?: number;
  };
  // Activity stats
  stats?: {
    totalActivities: number;
    totalDistance: number;
    totalDuration: number;
    weeklyGoal?: number;
    monthlyGoal?: number;
  };
  // Social
  followers?: number;
  following?: number;
  isFollowing?: boolean;
}