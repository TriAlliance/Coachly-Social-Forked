import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  dueDate: string;
  category: 'distance' | 'time' | 'frequency';
}

const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Monthly Running Distance',
    target: 100,
    current: 67.5,
    unit: 'km',
    dueDate: '2024-03-31',
    category: 'distance'
  },
  {
    id: '2',
    title: 'Weekly Active Minutes',
    target: 300,
    current: 210,
    unit: 'minutes',
    dueDate: '2024-03-17',
    category: 'time'
  },
  {
    id: '3',
    title: 'Monthly Workouts',
    target: 20,
    current: 12,
    unit: 'sessions',
    dueDate: '2024-03-31',
    category: 'frequency'
  }
];

export function GoalTracker() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Goal Tracker</h3>
        <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
          Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_GOALS.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-500">{daysLeft} days left</p>
                </div>
                <span className="text-sm font-medium">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="mt-2 text-right text-sm text-gray-500">
                {Math.round(progress)}% complete
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}