import React from 'react';
import { Clock, MapPin, Heart, MessageCircle, Share2 } from 'lucide-react';
import { ActivityTypeIcon } from './ActivityTypeIcon';
import type { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`}
              alt={post.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{post.username}</h3>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <ActivityTypeIcon type={post.activityType} size="md" withLabel />
        </div>
        
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(post.duration / 60)}m {post.duration % 60}s
          </div>
          {post.distance && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {post.distance.toFixed(2)} km
            </div>
          )}
          {post.elevation && (
            <div className="flex items-center">
              <span className="mr-1">↗️</span>
              {post.elevation}m
            </div>
          )}
        </div>
      </div>

      {post.images.length > 0 && (
        <div className="flex gap-1 overflow-x-auto">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Activity ${index + 1}`}
              className="h-64 w-auto object-cover"
            />
          ))}
        </div>
      )}

      {post.mapUrl && (
        <div className="h-48 bg-gray-100">
          <img
            src={post.mapUrl}
            alt="Activity map"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 border-t flex justify-between">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <Heart className="w-5 h-5" />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}