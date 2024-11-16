import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '../types/post';
import { ActivityIcon } from './ActivityIcon';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <img
          src={post.userAvatar}
          alt={post.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{post.username}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <ActivityIcon type={post.activityType} className="w-4 h-4 mr-1" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.images.length > 0 && (
        <div className="mb-4">
          <img
            src={post.images[0]}
            alt="Post content"
            className="rounded-lg w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="flex items-center space-x-6 text-gray-500">
        <button className="flex items-center space-x-2 hover:text-blue-600">
          <Heart className="w-5 h-5" />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-600">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-600">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}