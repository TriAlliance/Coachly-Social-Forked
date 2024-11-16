import React from 'react';
import { Award, Lock } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: string;
  unlocked: boolean;
}

const MOCK_BADGES: Badge[] = [
  {
    id: '1',
    title: 'Early Riser',
    description: 'Complete 10 morning workouts',
    progress: 7,
    total: 10,
    icon: '🌅',
    unlocked: false
  },
  {
    id: '2',
    title: 'Marathon Master',
    description: 'Run your first marathon',
    progress: 1,
    total: 1,
    icon: '🏃',
    unlocked: true
  },
  {
    id: '3',
    title: 'Mountain Goat',
    description: 'Climb 5000m in elevation',
    progress: 3200,
    total: 5000,
    icon: '⛰️',
    unlocked: false
  }
];

export function AchievementBadges() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Achievement Badges</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-lg border ${
              badge.unlocked
                ? 'border-purple-200 bg-purple-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{badge.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{badge.title}</h3>
                  {!badge.unlocked && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{badge.progress} / {badge.total}</span>
                    <span>{Math.round((badge.progress / badge.total) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        badge.unlocked ? 'bg-purple-500' : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(badge.progress / badge.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}