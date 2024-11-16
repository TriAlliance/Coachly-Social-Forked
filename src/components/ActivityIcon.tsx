import React from 'react';
import { ActivityType } from '../types/activity';
import { 
  Bike,
  Dumbbell,
  Mountain,
  Timer,
  Waves
} from 'lucide-react';

interface ActivityIconProps {
  type: ActivityType;
  className?: string;
}

export function ActivityIcon({ type, className = "w-6 h-6" }: ActivityIconProps) {
  switch (type) {
    case ActivityType.RUNNING:
      return <Timer className={className} />;
    case ActivityType.CYCLING:
      return <Bike className={className} />;
    case ActivityType.SWIM:
      return <Waves className={className} />;
    case ActivityType.HIKING:
      return <Mountain className={className} />;
    case ActivityType.YOGA:
      return <Waves className={className} />;
    case ActivityType.STRENGTH:
      return <Dumbbell className={className} />;
    default:
      return <Timer className={className} />;
  }
}