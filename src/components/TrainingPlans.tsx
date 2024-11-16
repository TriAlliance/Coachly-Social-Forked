import React, { useState } from 'react';
import { Book, Calendar, Users, Play, Filter, Search, Plus, ChevronRight, Clock, Target, BarChart } from 'lucide-react';
import { WorkoutLibrary } from './WorkoutLibrary';
import { TrainingSchedule } from './TrainingSchedule';
import { CoachSection } from './CoachSection';

interface Program {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  type: 'run' | 'cycle' | 'triathlon' | 'strength';
  workoutsPerWeek: number;
  coach: string;
  rating: number;
  enrolled: number;
  image: string;
  price?: number;
}

const MOCK_PROGRAMS: Program[] = [
  {
    id: '1',
    title: 'Marathon Training Program',
    description: 'Complete 16-week marathon preparation program for intermediate runners',
    level: 'intermediate',
    duration: 16,
    type: 'run',
    workoutsPerWeek: 5,
    coach: 'Sarah Johnson',
    rating: 4.8,
    enrolled: 1250,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800',
    price: 49.99
  },
  {
    id: '2',
    title: 'Cycling Performance',
    description: 'Advanced cycling program focusing on power and endurance',
    level: 'advanced',
    duration: 12,
    type: 'cycle',
    workoutsPerWeek: 6,
    coach: 'Mike Peterson',
    rating: 4.9,
    enrolled: 856,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800',
    price: 59.99
  },
  {
    id: '3',
    title: 'Beginner Triathlon',
    description: 'Introduction to triathlon training with balanced focus on all three disciplines',
    level: 'beginner',
    duration: 8,
    type: 'triathlon',
    workoutsPerWeek: 4,
    coach: 'Lisa Chen',
    rating: 4.7,
    enrolled: 623,
    image: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=800',
    price: 39.99
  }
];

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export function TrainingPlans() {
  const [activeTab, setActiveTab] = useState<'programs' | 'schedule' | 'library' | 'coaches'>('programs');
  const [selectedType, setSelectedType] = useState<'all' | Program['type']>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | Program['level']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = MOCK_PROGRAMS.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || program.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    return matchesSearch && matchesType && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Training Plans</h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        </div>

        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'programs'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Workout Library
          </button>
          <button
            onClick={() => setActiveTab('coaches')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'coaches'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Coaches
          </button>
        </div>

        {activeTab === 'programs' && (
          <>
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search training programs..."
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
                  <option value="triathlon">Triathlon</option>
                  <option value="strength">Strength</option>
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                  <div className="relative h-48">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-lg text-sm font-medium ${levelColors[program.level]}`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {program.duration} weeks
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {program.workoutsPerWeek}/week
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Target className="w-4 h-4 mr-1" />
                        {program.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {program.enrolled}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${program.coach}`}
                          alt={program.coach}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">{program.coach}</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{program.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {program.price ? (
                        <span className="text-lg font-bold">${program.price}</span>
                      ) : (
                        <span className="text-lg font-bold text-green-500">Free</span>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        View Plan
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'schedule' && <TrainingSchedule />}
        {activeTab === 'library' && <WorkoutLibrary />}
        {activeTab === 'coaches' && <CoachSection />}
      </div>
    </div>
  );
}