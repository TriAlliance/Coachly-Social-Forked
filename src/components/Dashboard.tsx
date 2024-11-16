import React, { useState } from 'react';
import { Gauge, Calendar, Cloud, Target, Plus, GripHorizontal } from 'lucide-react';
import { Statistics } from './Statistics';
import { ProgressTracking } from './ProgressTracking';
import { Feed } from './Feed';
import { WeatherWidget } from './WeatherWidget';
import { TrainingCalendar } from './TrainingCalendar';
import { GoalTracker } from './GoalTracker';
import { ProfileHeader } from './ProfileHeader';
import { CreatePostButton } from './CreatePostButton';
import { HealthConnect } from './HealthConnect';
import { useAuth } from '../context/AuthContext';

const mockProfile = {
  coverImage: "https://images.unsplash.com/photo-1504025468847-0e438279542c?auto=format&fit=crop&w=1200&q=80",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  name: "Admin User",
  username: "admin",
  bio: "Fitness enthusiast | Trail runner | Adventure seeker",
  stats: {
    followers: 1234,
    following: 567,
    activities: 89
  },
  badges: [
    { id: 1, name: "Early Adopter", icon: "🌟" },
    { id: 2, name: "Marathon Finisher", icon: "🏃" },
    { id: 3, name: "Trail Master", icon: "🏔️" }
  ]
};

export function Dashboard() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { user } = useAuth();
  
  const [widgets, setWidgets] = useState([
    { id: 'statistics', title: 'Statistics', icon: Gauge, enabled: true },
    { id: 'calendar', title: 'Training Calendar', icon: Calendar, enabled: true },
    { id: 'weather', title: 'Weather', icon: Cloud, enabled: true },
    { id: 'goals', title: 'Goal Tracking', icon: Target, enabled: true }
  ]);

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader 
        coverImage={mockProfile.coverImage}
        avatar={mockProfile.avatar}
        name={mockProfile.name}
        username={mockProfile.username}
        bio={mockProfile.bio}
        stats={mockProfile.stats}
        badges={mockProfile.badges}
      />

      {/* Health Connect Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Connect Health Apps</h2>
        <HealthConnect />
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <CreatePostButton />
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isCustomizing
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isCustomizing ? 'Done' : 'Customize'}
          </button>
        </div>
      </div>

      {isCustomizing && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Customize Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {widgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  widget.enabled
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <widget.icon className="w-5 h-5" />
                <span>{widget.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {widgets.find(w => w.id === 'statistics')?.enabled && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Statistics />
          </div>
        )}

        {widgets.find(w => w.id === 'calendar')?.enabled && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <TrainingCalendar />
          </div>
        )}

        {widgets.find(w => w.id === 'weather')?.enabled && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <WeatherWidget />
          </div>
        )}

        {widgets.find(w => w.id === 'goals')?.enabled && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <GoalTracker />
          </div>
        )}
      </div>
    </div>
  );
}