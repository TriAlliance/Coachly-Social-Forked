import React from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface WeeklyProgress {
  week: string;
  distance: number;
  duration: number;
  activities: number;
  trend: number;
}

const MOCK_WEEKLY_PROGRESS: WeeklyProgress[] = [
  {
    week: '2024-03-11',
    distance: 42.5,
    duration: 240,
    activities: 5,
    trend: 10
  },
  {
    week: '2024-03-04',
    distance: 38.2,
    duration: 210,
    activities: 4,
    trend: 5
  },
  {
    week: '2024-02-26',
    distance: 36.8,
    duration: 200,
    activities: 4,
    trend: -2
  }
];

export function DetailedProgress() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Detailed Progress</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Week</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">Distance</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">Duration</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">Activities</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">Trend</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_WEEKLY_PROGRESS.map((week, index) => (
              <tr key={week.week} className="border-b last:border-b-0">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Week of {new Date(week.week).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-4 text-right">{week.distance} km</td>
                <td className="py-4 text-right">{week.duration} min</td>
                <td className="py-4 text-right">{week.activities}</td>
                <td className="py-4">
                  <div className={`flex items-center justify-end gap-1 ${
                    week.trend > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${
                      week.trend < 0 ? 'transform rotate-180' : ''
                    }`} />
                    <span>{Math.abs(week.trend)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}