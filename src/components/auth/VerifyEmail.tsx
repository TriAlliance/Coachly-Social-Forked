import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function VerifyEmail() {
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check verification status periodically
  useEffect(() => {
    if (!user || user.emailVerified) return;

    const checkVerification = setInterval(async () => {
      await reloadUser();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkVerification);
  }, [user, reloadUser]);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendVerificationEmail();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please verify your email address to access all features.
              {showSuccess && (
                <span className="ml-2 text-green-600">
                  Verification email sent! Check your inbox.
                </span>
              )}
              {error && (
                <span className="ml-2 text-red-600">
                  {error}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={handleResendVerification}
            disabled={isSending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Resend Verification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}