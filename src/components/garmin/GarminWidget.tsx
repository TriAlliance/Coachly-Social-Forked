import React, { useState, useEffect } from 'react';
import { Activity, Settings, RefreshCw, XCircle } from 'lucide-react';
import { useGarmin } from '../../hooks/useGarmin';
import { useAuth } from '../../context/AuthContext';

export function GarminWidget() {
  const { user } = useAuth();
  const { connectGarmin, disconnectGarmin, getActivities, isConnecting, isConnected, error } = useGarmin();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user && isConnected) {
      loadActivities();
    }
  }, [user, isConnected]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const recentActivities = await getActivities(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        3 // Limit to 3 activities
      );
      setActivities(recentActivities);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connectGarmin();
    } catch (err) {
      console.error('Error connecting to Garmin:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectGarmin();
      setActivities([]);
    } catch (err) {
      console.error('Error disconnecting from Garmin:', err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Garmin Connect</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Connect your Garmin account'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isConnected
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting...
              </div>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              'Connect'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-500 dark:text-blue-400 animate-spin" />
        </div>
      ) : activities.length > 0 ? (
        <div className="flex-1 space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.activityId}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm dark:text-gray-200">{activity.activityName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.startTimeLocal).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                  {activity.activityType}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="text-gray-500 dark:text-gray-500">Duration:</span>
                  <br />
                  {Math.round(activity.duration / 60)}m
                </div>
                {activity.distance && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Distance:</span>
                    <br />
                    {(activity.distance / 1000).toFixed(2)}km
                  </div>
                )}
                {activity.elevationGain && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Elevation:</span>
                    <br />
                    {activity.elevationGain}m
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          <Activity className="w-8 h-8 mb-2" />
          <p>Connect your Garmin account to sync activities</p>
        </div>
      )}

      {showSettings && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sync Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Auto-sync new activities
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Include private activities
              </span>
            </label>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}