import React, { useState } from 'react';
import { X, Upload, MapPin, Globe, Lock } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'running' | 'cycling' | 'hiking' | 'general'>('general');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGroup({
      name,
      description,
      type,
      location,
      privacy,
      memberCount: 1,
      upcomingEvents: 0,
      achievements: 0,
      isAdmin: true,
      isMember: true,
      coverImage: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your group"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Fitness</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="hiking">Hiking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add location (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  privacy === 'public'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('private')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  privacy === 'private'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Private</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <button
              type="button"
              className="w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Upload cover image (optional)</span>
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}