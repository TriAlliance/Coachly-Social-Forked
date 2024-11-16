export type ActivityType = 'run' | 'cycle' | 'swim' | 'hike' | 'workout';

export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  stats?: {
    totalActivities: number;
    totalDistance: number;
    totalDuration: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  date: string;
  replies: Comment[];
  parentId?: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  activityType: ActivityType;
  title: string;
  description: string;
  date: string;
  duration: number;
  distance?: number;
  elevation?: number;
  calories?: number;
  images?: string[];
  likes: number;
  comments: Comment[];
  mapUrl?: string;
  user?: User;
}