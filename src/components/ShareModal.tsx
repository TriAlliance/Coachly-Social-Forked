import React from 'react';
import { X, Link2, Twitter, Facebook, Mail, MessageCircle } from 'lucide-react';
import type { Post } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/activity/${post.id}`;
  const shareText = `Check out ${post.username}'s ${post.activityType} activity: ${post.title}`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Link2,
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
      },
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1DA1F2] text-white hover:bg-[#1a8cd8]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#4267B2] text-white hover:bg-[#365899]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-[#25D366] text-white hover:bg-[#22bf5b]',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`Check out this ${post.activityType} activity`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      color: 'bg-gray-500 text-white hover:bg-gray-600',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Share Activity</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Activity Details</h3>
            <p className="text-gray-600">{post.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              option.href ? (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${option.color}`}
                >
                  <option.icon className="w-5 h-5" />
                  <span>{option.name}</span>
                </a>
              ) : (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${option.color}`}
                >
                  <option.icon className="w-5 h-5" />
                  <span>{option.name}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}