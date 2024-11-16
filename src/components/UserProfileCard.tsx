import React, { useState } from 'react';
import { MapPin, Users, Activity } from 'lucide-react';
import type { User } from '../types';

interface UserProfileCardProps {
  user: User;
  onFollow?: (userId: string) => void;
}

export function UserProfileCard({ user, onFollow }: UserProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followers);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    onFollow?.(user.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          alt={user.username}
          className="w-16 h-16 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{user.username}</h3>
              {user.bio && (
                <p className="text-gray-600 text-sm mt-1">{user.bio}</p>
              )}
            </div>
            
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {user.stats?.totalActivities || 0} activities
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                <b>{followersCount}</b> followers
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                <b>{user.following}</b> following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}