import React from 'react';
import { X, Timer, Bike, Waves, Mountain, Dumbbell } from 'lucide-react';
import type { ActivityType } from '../types';

const activities: Array<{
  type: ActivityType;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}> = [
  {
    type: 'run',
    icon: Timer,
    title: 'Running',
    description: 'Track your runs, jogs, and sprints',
    color: 'bg-orange-500',
  },
  {
    type: 'cycle',
    icon: Bike,
    title: 'Cycling',
    description: 'Road biking, mountain biking, or casual rides',
    color: 'bg-blue-500',
  },
  {
    type: 'swim',
    icon: Waves,
    title: 'Swimming',
    description: 'Pool sessions or open water swimming',
    color: 'bg-cyan-500',
  },
  {
    type: 'hike',
    icon: Mountain,
    title: 'Hiking',
    description: 'Trail walks and mountain adventures',
    color: 'bg-green-500',
  },
  {
    type: 'workout',
    icon: Dumbbell,
    title: 'Workout',
    description: 'Strength training and gym sessions',
    color: 'bg-purple-500',
  },
];

interface ActivitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ActivityType) => void;
}

export function ActivitySelectionModal({
  isOpen,
  onClose,
  onSelect,
}: ActivitySelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Activity Type</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid gap-4">
            {activities.map(({ type, icon: Icon, title, description, color }) => (
              <button
                key={type}
                onClick={() => {
                  onSelect(type);
                  onClose();
                }}
                className="flex items-start p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className={`p-3 rounded-lg ${color} text-white mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}