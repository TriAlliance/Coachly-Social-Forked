import {
  Timer,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Heart,
  Trophy,
  Footprints,
  Snowflake,
  Wind,
  Compass
} from 'lucide-react';

export type ActivityCategory = 'cardio' | 'outdoor' | 'strength' | 'winter' | 'water';

export type ActivityType = 
  | 'run'
  | 'trail-run'
  | 'cycle'
  | 'mountain-bike'
  | 'swim'
  | 'hike'
  | 'workout'
  | 'yoga'
  | 'crossfit'
  | 'pilates'
  | 'walk'
  | 'ski'
  | 'snowboard'
  | 'surf'
  | 'kayak'
  | 'climb'
  | 'skate'
  | 'trek'
  | 'cardio';

export const activityCategories = {
  cardio: {
    label: 'Cardio',
    icon: Heart,
    color: 'bg-rose-500',
    activities: ['run', 'trail-run', 'cycle', 'cardio', 'walk']
  },
  outdoor: {
    label: 'Outdoor',
    icon: Mountain,
    color: 'bg-emerald-500',
    activities: ['hike', 'trek', 'climb', 'mountain-bike']
  },
  strength: {
    label: 'Strength & Training',
    icon: Dumbbell,
    color: 'bg-purple-500',
    activities: ['workout', 'crossfit', 'yoga', 'pilates']
  },
  winter: {
    label: 'Winter Sports',
    icon: Snowflake,
    color: 'bg-sky-500',
    activities: ['ski', 'snowboard', 'skate']
  },
  water: {
    label: 'Water Sports',
    icon: Waves,
    color: 'bg-blue-500',
    activities: ['swim', 'surf', 'kayak']
  }
};

export const activityTypes = [
  {
    id: 'run',
    label: 'Running',
    icon: Timer,
    color: 'bg-orange-500',
    description: 'Road running, jogging, and sprints',
    category: 'cardio'
  },
  {
    id: 'trail-run',
    label: 'Trail Running',
    icon: Footprints,
    color: 'bg-green-500',
    description: 'Off-road and trail running',
    category: 'cardio'
  },
  {
    id: 'cycle',
    label: 'Cycling',
    icon: Bike,
    color: 'bg-blue-500',
    description: 'Road cycling and indoor biking',
    category: 'cardio'
  },
  {
    id: 'mountain-bike',
    label: 'Mountain Biking',
    icon: Bike,
    color: 'bg-brown-500',
    description: 'Off-road and trail cycling',
    category: 'outdoor'
  },
  {
    id: 'swim',
    label: 'Swimming',
    icon: Waves,
    color: 'bg-cyan-500',
    description: 'Pool and open water swimming',
    category: 'water'
  },
  {
    id: 'hike',
    label: 'Hiking',
    icon: Mountain,
    color: 'bg-emerald-500',
    description: 'Trail walking and mountain hiking',
    category: 'outdoor'
  },
  {
    id: 'workout',
    label: 'Strength Training',
    icon: Dumbbell,
    color: 'bg-purple-500',
    description: 'Weight training and bodyweight exercises',
    category: 'strength'
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: Wind,
    color: 'bg-indigo-500',
    description: 'Yoga and flexibility training',
    category: 'strength'
  },
  {
    id: 'crossfit',
    label: 'CrossFit',
    icon: Trophy,
    color: 'bg-red-500',
    description: 'High-intensity functional training',
    category: 'strength'
  },
  {
    id: 'pilates',
    label: 'Pilates',
    icon: Heart,
    color: 'bg-pink-500',
    description: 'Core strength and flexibility',
    category: 'strength'
  },
  {
    id: 'walk',
    label: 'Walking',
    icon: Footprints,
    color: 'bg-teal-500',
    description: 'Casual walking and power walking',
    category: 'cardio'
  },
  {
    id: 'ski',
    label: 'Skiing',
    icon: Snowflake,
    color: 'bg-sky-500',
    description: 'Downhill and cross-country skiing',
    category: 'winter'
  },
  {
    id: 'snowboard',
    label: 'Snowboarding',
    icon: Snowflake,
    color: 'bg-blue-600',
    description: 'All mountain and freestyle snowboarding',
    category: 'winter'
  },
  {
    id: 'surf',
    label: 'Surfing',
    icon: Waves,
    color: 'bg-cyan-600',
    description: 'Ocean surfing and water sports',
    category: 'water'
  },
  {
    id: 'kayak',
    label: 'Kayaking',
    icon: Wind,
    color: 'bg-blue-400',
    description: 'Kayaking and paddling sports',
    category: 'water'
  },
  {
    id: 'climb',
    label: 'Climbing',
    icon: Mountain,
    color: 'bg-stone-500',
    description: 'Rock climbing and bouldering',
    category: 'outdoor'
  },
  {
    id: 'skate',
    label: 'Skating',
    icon: Footprints,
    color: 'bg-violet-500',
    description: 'Skateboarding and roller skating',
    category: 'winter'
  },
  {
    id: 'trek',
    label: 'Trekking',
    icon: Compass,
    color: 'bg-amber-500',
    description: 'Multi-day hiking and expeditions',
    category: 'outdoor'
  },
  {
    id: 'cardio',
    label: 'Cardio',
    icon: Heart,
    color: 'bg-rose-500',
    description: 'General cardio and aerobic exercises',
    category: 'cardio'
  }
] as const;