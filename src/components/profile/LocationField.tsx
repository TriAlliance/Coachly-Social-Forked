import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateLocation } from '../../services/profile';

interface LocationFieldProps {
  isEditing: boolean;
}

export function LocationField({ isEditing }: LocationFieldProps) {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.location?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.location?.address) {
      setAddress(user.location.address);
    }
  }, [user]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const formattedAddress = data.display_name;
          setAddress(formattedAddress);

          await updateLocation({
            latitude,
            longitude,
            address: formattedAddress
          });

        } catch (err) {
          console.error('Error getting location:', err);
          setError('Failed to get location. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Failed to get your location. Please check your permissions.');
        setLoading(false);
      }
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your location"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {loading && (
          <p className="text-sm text-gray-500">Getting your location...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-900">
      <MapPin className="w-4 h-4 text-gray-500" />
      <span>{address || 'No location set'}</span>
    </div>
  );
}