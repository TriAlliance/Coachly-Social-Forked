import React from 'react';
import { activityTypes } from '../types/activities';

interface ActivityTypeIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  withLabel?: boolean;
  className?: string;
}

export function ActivityTypeIcon({ type, size = 'md', withLabel = false, className = '' }: ActivityTypeIconProps) {
  const activity = activityTypes.find(a => a.id === type);
  if (!activity) return null;

  const Icon = activity.icon;
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${containerClasses[size]} rounded-lg ${activity.color} bg-opacity-10`}>
        <Icon className={`${sizeClasses[size]} ${activity.color.replace('bg-', 'text-')}`} />
      </div>
      {withLabel && (
        <span className="font-medium text-gray-700">{activity.label}</span>
      )}
    </div>
  );
}