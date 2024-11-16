import React, { useState, useCallback } from 'react';
import { X, Image, Plus, MapPin, Clock, ArrowUp } from 'lucide-react';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import { useAuth } from '../context/AuthContext';
import { createPost, uploadPostImage } from '../services/posts';
import type { ActivityType } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [duration, setDuration] = useState<number>(0);
  const [distance, setDistance] = useState<string>('');
  const [elevation, setElevation] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const resetForm = useCallback(() => {
    setContent('');
    setActivityType('run');
    setDuration(0);
    setDistance('');
    setElevation('');
    setImages([]);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImages(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(file => uploadPostImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Error uploading images:', err);
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        content,
        activityType,
        duration,
        distance: distance ? parseFloat(distance) : undefined,
        elevation: elevation ? parseFloat(elevation) : undefined,
        images,
        likes: 0,
        comments: 0
      };

      await createPost(postData);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <ActivityTypeSelector
            selectedType={activityType}
            onSelect={setActivityType}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (min)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={duration || ''}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Elevation (m)
              </label>
              <div className="relative">
                <ArrowUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="hidden"
              />
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-blue-500 cursor-pointer">
                {uploadingImages ? (
                  <div className="text-gray-400">Uploading...</div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Image className="w-8 h-8 mb-2" />
                    <span>Add Photos</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImages}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}