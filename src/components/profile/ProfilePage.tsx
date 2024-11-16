import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Pencil, X, Check, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ImageEditor } from './ImageEditor';
import { LocationField } from './LocationField';
import { ChangePasswordModal } from './ChangePasswordModal';
import { updateProfile } from '../../services/profile';

export function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        displayName,
        bio
      });
      await updateUserProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Photo Section */}
        <div className="relative h-64">
          <img
            src={user.coverPhotoURL || 'https://images.unsplash.com/photo-1504025468847-0e438279542c?auto=format&fit=crop&w=1200'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setShowCoverEditor(true)}
            className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white/90 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || user.email}`}
                alt={user.displayName || 'User'}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <button
                onClick={() => setShowAvatarEditor(true)}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 mb-8">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{displayName || 'No name set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{user.email}</p>
                {!user.emailVerified && (
                  <span className="text-sm text-amber-600">Not verified</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <LocationField isEditing={isEditing} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{bio || 'No bio set'}</p>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <Mail className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAvatarEditor && (
        <ImageEditor
          type="avatar"
          onClose={() => setShowAvatarEditor(false)}
          onSave={updateUserProfile}
        />
      )}

      {showCoverEditor && (
        <ImageEditor
          type="cover"
          onClose={() => setShowCoverEditor(false)}
          onSave={updateUserProfile}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}