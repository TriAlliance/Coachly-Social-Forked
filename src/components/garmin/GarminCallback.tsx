import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { garminService } from '../../services/garmin/GarminService';
import { XCircle, Loader2, CheckCircle } from 'lucide-react';

export function GarminCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const handleCallback = async () => {
      const oauthToken = searchParams.get('oauth_token');
      const oauthVerifier = searchParams.get('oauth_verifier');

      if (!oauthToken || !oauthVerifier) {
        setError('Invalid callback parameters');
        setLoading(false);
        return;
      }

      try {
        await garminService.handleCallback(user.uid, oauthToken, oauthVerifier);
        // Short delay to ensure state updates
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err: any) {
        console.error('Error handling Garmin callback:', err);
        setError(err.message || 'Failed to connect to Garmin');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [user, searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connecting to Garmin</h2>
            <p className="text-gray-600">Please wait while we complete the connection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Successfully Connected!</h2>
          <p className="text-gray-600 mb-6">Your Garmin account has been connected successfully.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}