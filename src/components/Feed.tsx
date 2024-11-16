import React, { useEffect, useRef, useCallback } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { CreatePostModal } from './CreatePostModal';
import { FeedFilters } from './FeedFilters';
import { FeaturedCarousel } from './FeaturedCarousel';
import { useFeed } from '../hooks/useFeed';
import { useAuth } from '../context/AuthContext';
import type { ActivityType } from '../types';

export function Feed() {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<ActivityType | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'recent' | 'popular'>('recent');
  const [timeRange, setTimeRange] = React.useState<'all' | 'week' | 'month'>('all');
  
  const { user } = useAuth();
  const { posts, loading, error, hasMore, loadMore } = useFeed(
    selectedType === 'all' ? undefined : { type: selectedType }
  );

  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    setSelectedType('all');
    setSortBy('recent');
    setTimeRange('all');
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view the feed.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Activity Feed
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See what's happening in your fitness community
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Share Activity
          </button>
        </div>

        <div className="sticky top-[4.5rem] z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <FeedFilters
            selectedType={selectedType}
            onTypeSelect={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      </div>

      {/* Featured Carousel */}
      <FeaturedCarousel />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center justify-center">
          <span className="animate-pulse">⚠️</span>
          <span className="ml-2">{error.message}</span>
        </div>
      )}

      {/* Posts Grid */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : undefined}
            className="transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
          >
            <ActivityCard post={post} />
          </div>
        ))}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-blue-300 border-t-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No posts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to share your activity!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </button>
          </div>
        )}

        {/* End of Feed Indicator */}
        {!loading && posts.length > 0 && !hasMore && (
          <div className="text-center py-8">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-auto"></div>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-4">You're all caught up! ✨</p>
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          setSelectedType('all');
        }}
      />
    </div>
  );
}