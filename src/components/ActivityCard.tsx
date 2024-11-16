import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock, MapPin, ArrowUp } from 'lucide-react';
import { Post } from '../types/post';
import { useAuth } from '../context/AuthContext';
import { likePost, unlikePost } from '../services/posts';

interface ActivityCardProps {
  post: Post;
}

export function ActivityCard({ post }: ActivityCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes > 0);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [sending, setSending] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      setSending(true);
      if (liked) {
        await unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`}
              alt={post.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {post.activityType && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              {post.activityType.charAt(0).toUpperCase() + post.activityType.slice(1)}
            </span>
          )}
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>

        {(post.distance || post.duration || post.elevation) && (
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            {post.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(post.duration / 60)}m {post.duration % 60}s
              </div>
            )}
            {post.distance && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {post.distance.toFixed(2)} km
              </div>
            )}
            {post.elevation && (
              <div className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                {post.elevation}m
              </div>
            )}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <img
                key={`${post.id}-image-${index}`}
                src={image}
                alt={`Post content ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
          <button
            onClick={handleLike}
            disabled={sending || !user}
            className={`flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
              liked ? 'text-blue-500 dark:text-blue-400' : ''
            } ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
          
          <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}