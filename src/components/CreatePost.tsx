import React, { useState } from 'react';
import { Camera, Upload, Plus, MapPin, Clock, ArrowUp } from 'lucide-react';
import { ActivityTypeIcon } from './ActivityTypeIcon';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import { ActivitySelectionModal } from './ActivitySelectionModal';
import { ImportActivityModal } from './ImportActivityModal';
import { RichTextInput } from './RichTextInput';
import type { ActivityType } from '../types';

interface ImportedActivity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  duration: number;
  distance?: number;
  elevation?: number;
  mapUrl?: string;
}

interface PostData {
  title: string;
  description: string;
  activityType: ActivityType;
  duration: number;
  distance?: number;
  elevation?: number;
  images: string[];
  mapUrl?: string;
  mentions: string[];
  hashtags: string[];
}

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [duration, setDuration] = useState<number>(0);
  const [distance, setDistance] = useState<string>('');
  const [elevation, setElevation] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedActivity, setImportedActivity] = useState<ImportedActivity | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImportActivity = (activity: ImportedActivity) => {
    setImportedActivity(activity);
    setTitle(activity.title);
    setActivityType(activity.type);
    setDuration(activity.duration);
    if (activity.distance) setDistance(activity.distance.toString());
    if (activity.elevation) setElevation(activity.elevation.toString());
    if (activity.mapUrl) setImages([activity.mapUrl]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload these to a server
    // For demo purposes, we'll use local URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const handleMention = (username: string) => {
    if (!mentions.includes(username)) {
      setMentions([...mentions, username]);
    }
  };

  const handleHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!title.trim()) return false;
    if (!description.trim()) return false;
    if (!activityType) return false;
    if (duration <= 0) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const postData: PostData = {
      title,
      description,
      activityType,
      duration,
      distance: distance ? parseFloat(distance) : undefined,
      elevation: elevation ? parseFloat(elevation) : undefined,
      images,
      mapUrl: importedActivity?.mapUrl,
      mentions,
      hashtags
    };

    try {
      // In a real app, you would send this to your API
      console.log('Submitting post:', postData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setActivityType('run');
      setDuration(0);
      setDistance('');
      setElevation('');
      setImages([]);
      setImportedActivity(null);
      setMentions([]);
      setHashtags([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Create Post</h2>
        <button
          type="button"
          onClick={() => setShowActivityModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Activity</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <ActivityTypeIcon type={activityType} size="lg" withLabel />
        </div>
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="mt-4">
          <RichTextInput
            value={description}
            onChange={setDescription}
            onMention={handleMention}
            onHashtag={handleHashtag}
            placeholder="What's on your mind? Use @ to mention people and # for tags"
            className="h-24 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={duration || ''}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {(mentions.length > 0 || hashtags.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mentions.map((mention) => (
              <span
                key={mention}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                @{mention}
              </span>
            ))}
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {importedActivity && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700">Imported Activity</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Duration: {Math.floor(importedActivity.duration / 60)}m</p>
              {importedActivity.distance && (
                <p>Distance: {importedActivity.distance.toFixed(2)}km</p>
              )}
              {importedActivity.elevation && (
                <p>Elevation: {importedActivity.elevation}m</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-4">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Camera className="w-5 h-5" />
            <span>Add Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Import Activity</span>
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!validateForm() || isSubmitting}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Activity'}
        </button>
      </form>

      <ActivitySelectionModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSelect={setActivityType}
      />

      <ImportActivityModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSelect={handleImportActivity}
      />
    </div>
  );
}