import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VerifySuccess() {
  // Get name from URL parameters
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'User';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you {name} for verifying your email address. You now have full access to all features.
          </p>
          <Link
            to="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}