import React from 'react';
import {
  Bike,
  Swimming,
  Dumbbell,
  Mountain,
  Waves,
  Footprints,
  Snowflake,
  Tennis,
  Heart,
  Flame,
  Shirt,
  Timer,
  Compass,
  Wind
} from 'lucide-react';

export const activityTypes = [
  { id: 'running', label: 'Running', icon: Footprints },
  { id: 'cycling', label: 'Cycling', icon: Bike },
  { id: 'swimming', label: 'Swimming', icon: Swimming },
  { id: 'hiking', label: 'Hiking', icon: Mountain },
  { id: 'strength', label: 'Strength Training', icon: Dumbbell },
  { id: 'surfing', label: 'Surfing', icon: Waves },
  { id: 'winter-sports', label: 'Winter Sports', icon: Snowflake },
  { id: 'tennis', label: 'Tennis', icon: Tennis },
  { id: 'cardio', label: 'Cardio', icon: Heart },
  { id: 'hiit', label: 'HIIT', icon: Flame },
  { id: 'crossfit', label: 'CrossFit', icon: Shirt },
  { id: 'meditation', label: 'Meditation', icon: Wind },
  { id: 'interval', label: 'Interval Training', icon: Timer },
  { id: 'outdoor', label: 'Outdoor Activities', icon: Compass }
];

interface ActivityTypeProps {
  onSelect?: (activityType: string) => void;
  selected?: string;
}

export function ActivityTypeSelector({ onSelect, selected }: ActivityTypeProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {activityTypes.map((activity) => {
        const Icon = activity.icon;
        return (
          <button
            key={activity.id}
            onClick={() => onSelect?.(activity.id)}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              selected === activity.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{activity.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ActivityIcon({ type }: { type: string }) {
  const activity = activityTypes.find(a => a.id === type);
  if (!activity) return null;
  
  const Icon = activity.icon;
  return <Icon className="w-5 h-5" />;
}