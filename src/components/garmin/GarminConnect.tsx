import React, { useState, useEffect } from 'react';
import { Activity, Settings, RefreshCw } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';

export function GarminConnect() {
  const { connectGarmin, disconnectGarmin, getActivities, isConnecting, error } = useGarmin();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const recentActivities = await getActivities(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        5 // Limit to 5 activities
      );
      setActivities(recentActivities);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Garmin Connect</h3>
            <p className="text-sm text-gray-500">
              Sync your activities from Garmin
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={connectGarmin}
            disabled={isConnecting}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting...
              </div>
            ) : (
              'Connect'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-4 space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.activityId}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{activity.activityName}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.startTimeLocal).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {activity.activityType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSettings && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600">
                Auto-sync new activities
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600">
                Include private activities
              </span>
            </label>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}