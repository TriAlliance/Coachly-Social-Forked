import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, ArrowUp } from 'lucide-react';
import type { ActivityType } from '../types';
import { GarminService } from '../services/garmin';
import { AppleHealthService } from '../services/appleHealth';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  duration: number;
  distance?: number;
  elevation?: number;
  mapUrl?: string;
}

interface ImportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (activity: Activity) => void;
}

const garminService = new GarminService();
const appleHealthService = new AppleHealthService();

export function ImportActivityModal({ isOpen, onClose, onSelect }: ImportActivityModalProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      loadActivities();
    }
  }, [isOpen]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const garminActivities = await garminService.isAuthenticated() 
        ? await garminService.getLatestActivities(10)
        : [];
      
      const appleHealthActivities = appleHealthService.isAvailable() && await appleHealthService.isAuthorized()
        ? await appleHealthService.getLatestWorkouts(10)
        : [];

      // Combine and format activities
      const formattedActivities = [...garminActivities, ...appleHealthActivities]
        .map(formatActivity)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(formattedActivities);
    } catch (err) {
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatActivity = (activity: any): Activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.name || 'Untitled Activity',
    date: activity.startTime || new Date().toISOString(),
    duration: activity.duration || 0,
    distance: activity.distance,
    elevation: activity.elevationGain,
    mapUrl: activity.mapUrl,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Import Activity</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : activities.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No recent activities found. Connect your fitness apps to import activities.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => {
                    onSelect(activity);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{activity.title}</h3>
                    <span className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(activity.duration / 60)}m
                    </span>
                    {activity.distance && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {activity.distance.toFixed(2)}km
                      </span>
                    )}
                    {activity.elevation && (
                      <span className="flex items-center">
                        <ArrowUp className="w-4 h-4 mr-1" />
                        {activity.elevation}m
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}