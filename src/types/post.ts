export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  likedBy?: string[];
  activityType?: string;
  distance?: number;
  duration?: number;
  elevation?: number;
}