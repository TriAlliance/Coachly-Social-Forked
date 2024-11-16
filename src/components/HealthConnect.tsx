import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Smartphone } from 'lucide-react';
import { GarminService } from '../services/garmin';
import { AppleHealthService } from '../services/appleHealth';

const garminService = new GarminService();
const appleHealthService = new AppleHealthService();

export function HealthConnect() {
  const [garminConnected, setGarminConnected] = useState(false);
  const [appleHealthConnected, setAppleHealthConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAppleHealthAvailability();
  }, []);

  const checkAppleHealthAvailability = async () => {
    if (appleHealthService.isAvailable()) {
      const isAuthorized = await appleHealthService.isAuthorized();
      setAppleHealthConnected(isAuthorized);
    }
  };

  const handleGarminConnect = async () => {
    setIsLoading(true);
    try {
      await garminService.initialize({
        consumerKey: 'mock_key',
        consumerSecret: 'mock_secret',
        accessToken: 'mock_token',
        accessTokenSecret: 'mock_token_secret'
      });
      setGarminConnected(true);
    } catch (error) {
      console.error('Failed to connect to Garmin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleHealthConnect = async () => {
    setIsLoading(true);
    try {
      const success = await appleHealthService.initialize();
      setAppleHealthConnected(success);
    } catch (error) {
      console.error('Failed to connect to Apple Health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ActivityIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Garmin Connect</h3>
            <p className="text-sm text-gray-500">
              {garminConnected
                ? 'Connected to Garmin Connect'
                : 'Connect to import your activities'}
            </p>
          </div>
        </div>
        <button
          onClick={handleGarminConnect}
          disabled={isLoading || garminConnected}
          className={`px-4 py-2 rounded-lg font-medium ${
            garminConnected
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isLoading ? 'Connecting...' : garminConnected ? 'Connected' : 'Connect'}
        </button>
      </div>

      {appleHealthService.isAvailable() && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Apple Health</h3>
              <p className="text-sm text-gray-500">
                {appleHealthConnected
                  ? 'Connected to Apple Health'
                  : 'Connect to sync your workouts'}
              </p>
            </div>
          </div>
          <button
            onClick={handleAppleHealthConnect}
            disabled={isLoading || appleHealthConnected}
            className={`px-4 py-2 rounded-lg font-medium ${
              appleHealthConnected
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Connecting...' : appleHealthConnected ? 'Connected' : 'Connect'}
          </button>
        </div>
      )}
    </div>
  );
}