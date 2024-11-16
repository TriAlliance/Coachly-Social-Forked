import React from 'react';
import { Filter, SortDesc, Calendar } from 'lucide-react';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import type { ActivityType } from '../types';

interface FeedFiltersProps {
  selectedType: ActivityType | 'all';
  onTypeSelect: (type: ActivityType | 'all') => void;
  sortBy: 'recent' | 'popular';
  onSortChange: (sort: 'recent' | 'popular') => void;
  timeRange: 'all' | 'week' | 'month';
  onTimeRangeChange: (range: 'all' | 'week' | 'month') => void;
}

export function FeedFilters({
  selectedType,
  onTypeSelect,
  sortBy,
  onSortChange,
  timeRange,
  onTimeRangeChange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <select
          value={selectedType}
          onChange={(e) => onTypeSelect(e.target.value as ActivityType | 'all')}
          className="bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 pr-8 py-0 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium"
        >
          <option value="all">All Activities</option>
          <option value="run">Running</option>
          <option value="cycle">Cycling</option>
          <option value="swim">Swimming</option>
          <option value="hike">Hiking</option>
          <option value="workout">Workout</option>
        </select>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <SortDesc className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'recent' | 'popular')}
          className="bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 pr-8 py-0 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as 'all' | 'week' | 'month')}
          className="bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 pr-8 py-0 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
}