import React, { useState } from 'react';
import { Search, Filter, Play, Clock, Target, BarChart } from 'lucide-react';

interface Workout {
  id: string;
  title: string;
  description: string;
  type: 'run' | 'cycle' | 'swim' | 'strength';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  targets: string[];
  video?: string;
}

const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'Interval Running',
    description: 'High-intensity interval training for runners',
    type: 'run',
    duration: 45,
    difficulty: 'intermediate',
    equipment: ['None'],
    targets: ['Speed', 'Endurance'],
    video: 'https://example.com/workout1.mp4'
  },
  {
    id: '2',
    title: 'Hill Climbs',
    description: 'Cycling workout focusing on hill climbing technique',
    type: 'cycle',
    duration: 60,
    difficulty: 'advanced',
    equipment: ['Bike', 'Heart Rate Monitor'],
    targets: ['Power', 'Climbing']
  },
  {
    id: '3',
    title: 'Core Strength',
    description: 'Essential core exercises for athletes',
    type: 'strength',
    duration: 30,
    difficulty: 'beginner',
    equipment: ['Mat', 'Resistance Band'],
    targets: ['Core', 'Stability']
  }
];

export function WorkoutLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | Workout['type']>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Workout['difficulty']>('all');

  const filteredWorkouts = MOCK_WORKOUTS.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || workout.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="run">Running</option>
          <option value="cycle">Cycling</option>
          <option value="swim">Swimming</option>
          <option value="strength">Strength</option>
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout) => (
          <div key={workout.id} className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                workout.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
              </span>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{workout.duration} min</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2">{workout.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{workout.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-2">
                {workout.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {workout.targets.map((target, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {target}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Play className="w-4 h-4" />
              Start Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}