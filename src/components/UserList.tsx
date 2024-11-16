import React from 'react';
import { UserProfileCard } from './UserProfileCard';
import type { User } from '../types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'JohnRunner',
    bio: 'Marathon enthusiast | Trail runner',
    followers: 245,
    following: 182,
    stats: {
      totalActivities: 156,
      totalDistance: 1250.5,
      totalDuration: 360000,
    },
  },
  {
    id: '2',
    username: 'CyclingPro',
    bio: 'Professional cyclist | Mountain bike lover',
    followers: 1893,
    following: 524,
    stats: {
      totalActivities: 312,
      totalDistance: 8750.2,
      totalDuration: 720000,
    },
  },
];

interface UserListProps {
  onFollow?: (userId: string) => void;
}

export function UserList({ onFollow }: UserListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Suggested Athletes</h2>
      {MOCK_USERS.map((user) => (
        <UserProfileCard
          key={user.id}
          user={user}
          onFollow={onFollow}
        />
      ))}
    </div>
  );
}