import React, { useState } from 'react';
import { Loader2, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { garminService } from '../../services/garmin/GarminService';
import { useAuth } from '../../context/AuthContext';

export function GarminTest() {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    if (!user) {
      setError('Please log in first');
      return;
    }

    setTesting(true);
    setError(null);
    
    try {
      // First, try to connect to Garmin
      const authUrl = await garminService.connectGarmin(user.uid);
      console.log('Auth URL:', authUrl);
      
      // Redirect to Garmin auth
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message);
      setConnected(false);
      console.error('Connection test failed:', err);
    } finally {
      setTesting(false);
    }
  };

  const fetchActivities = async () => {
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const activities = await garminService.getActivities(
        user.uid,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        10 // Limit to 10 activities
      );
      setActivities(activities);
      setConnected(true);
    } catch (err: any) {
      setError(err.message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Garmin Connect Test</h3>
            <p className="text-sm text-gray-500">
              Test connection to Garmin Connect API
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            disabled={testing}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {testing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </div>
            ) : (
              'Connect to Garmin'
            )}
          </button>
          <button
            onClick={fetchActivities}
            disabled={loading || !connected}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : (
              'Fetch Activities'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {connected !== null && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          connected ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {connected ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Successfully connected to Garmin Connect
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              Failed to connect to Garmin Connect
            </>
          )}
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-4">Recent Activities</h4>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.activityId}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{activity.activityName}</h5>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.startTimeLocal).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {activity.activityType}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <br />
                    {Math.round(activity.duration / 60)} minutes
                  </div>
                  {activity.distance && (
                    <div>
                      <span className="text-gray-500">Distance:</span>
                      <br />
                      {(activity.distance / 1000).toFixed(2)} km
                    </div>
                  )}
                  {activity.elevationGain && (
                    <div>
                      <span className="text-gray-500">Elevation:</span>
                      <br />
                      {activity.elevationGain} m
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}