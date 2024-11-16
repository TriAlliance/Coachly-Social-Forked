import React from 'react';
import { Award, Calendar, Trophy } from 'lucide-react';

interface AchievementHistoryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'bronze' | 'silver' | 'gold';
  icon: string;
}

const MOCK_HISTORY: AchievementHistoryItem[] = [
  {
    id: '1',
    title: 'Century Rider',
    description: 'Completed first 100km bike ride',
    date: '2024-03-15',
    type: 'gold',
    icon: '🚴'
  },
  {
    id: '2',
    title: 'Early Bird',
    description: 'Completed 5 activities before 7am',
    date: '2024-03-12',
    type: 'silver',
    icon: '🌅'
  },
  {
    id: '3',
    title: 'Mountain Climber',
    description: 'Reached 500m elevation gain',
    date: '2024-03-08',
    type: 'bronze',
    icon: '⛰️'
  }
];

const TYPE_STYLES = {
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  silver: 'bg-gray-100 text-gray-800 border-gray-200',
  bronze: 'bg-orange-100 text-orange-800 border-orange-200'
};

export function AchievementHistory() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold">Achievement History</h2>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_HISTORY.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center gap-4 p-4 rounded-lg border ${TYPE_STYLES[achievement.type]}`}
          >
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(achievement.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}