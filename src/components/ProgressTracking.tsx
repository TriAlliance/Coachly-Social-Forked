import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

interface GoalProgress {
  title: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
}

const MOCK_GOALS: GoalProgress[] = [
  {
    title: 'Weekly Distance',
    current: 32,
    target: 40,
    unit: 'km',
    percentage: 80
  },
  {
    title: 'Monthly Activities',
    current: 18,
    target: 20,
    unit: 'activities',
    percentage: 90
  },
  {
    title: 'Active Minutes',
    current: 280,
    target: 300,
    unit: 'minutes',
    percentage: 93
  }
];

export function ProgressTracking() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold">Progress Tracking</h2>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_GOALS.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{goal.title}</span>
              <span className="text-sm text-gray-500">
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${goal.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}