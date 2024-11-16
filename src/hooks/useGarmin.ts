import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { garminService } from '../services/garmin/GarminService';

export function useGarmin() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    try {
      const connected = await garminService.isConnected(user.uid);
      setIsConnected(connected);
    } catch (err) {
      console.error('Error checking Garmin connection:', err);
    }
  };

  const connectGarmin = useCallback(async () => {
    if (!user) {
      setError('Must be logged in to connect Garmin');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const authUrl = await garminService.connectGarmin(user.uid);
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Garmin');
      console.error('Error connecting to Garmin:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const disconnectGarmin = useCallback(async () => {
    if (!user) {
      setError('Must be logged in to disconnect Garmin');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await garminService.disconnectGarmin(user.uid);
      setIsConnected(false);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect from Garmin');
      console.error('Error disconnecting from Garmin:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const getActivities = useCallback(async (startDate?: Date, limit?: number) => {
    if (!user) {
      setError('Must be logged in to fetch activities');
      return [];
    }

    try {
      const activities = await garminService.getActivities(user.uid, startDate, limit);
      return activities;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities from Garmin');
      console.error('Error fetching Garmin activities:', err);
      return [];
    }
  }, [user]);

  return {
    connectGarmin,
    disconnectGarmin,
    getActivities,
    isConnecting,
    isConnected,
    error
  };
}