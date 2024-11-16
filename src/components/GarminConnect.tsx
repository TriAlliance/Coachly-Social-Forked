import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, X, Settings } from 'lucide-react';
import { GarminService } from '../services/garmin';

const garminService = new GarminService();

// Initialize with your credentials
const defaultCredentials = {
  username: 'trialliance',
  password: 'Y9NMKCq!kffv@rA'
};

export function GarminConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('garmin_credentials');
    if (stored) {
      const { username } = JSON.parse(stored);
      setUsername(username);
      setIsConnected(true);
    } else {
      // Auto-connect with default credentials
      handleConnect();
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await garminService.setCredentials(defaultCredentials);
      setUsername(defaultCredentials.username);
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect to Garmin. Please check your credentials.');
      console.error('Garmin connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await garminService.disconnect();
    setIsConnected(false);
    setUsername(null);
    localStorage.removeItem('garmin_credentials');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ActivityIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Garmin Connect</h3>
            <p className="text-sm text-gray-500">
              {isConnected
                ? `Connected as ${username}`
                : 'Connect to import your activities'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isConnected && showSettings && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600">Auto-sync new activities</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-600">Include private activities</span>
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