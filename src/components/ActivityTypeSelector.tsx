import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { activityTypes, type ActivityType } from '../types/activities';

interface ActivityTypeSelectorProps {
  selectedType: ActivityType;
  onSelect: (type: ActivityType) => void;
  className?: string;
}

export function ActivityTypeSelector({
  selectedType,
  onSelect,
  className = ''
}: ActivityTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedActivity = activityTypes.find(activity => activity.id === selectedType);

  const filteredActivities = activityTypes.filter(activity =>
    activity.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selectedActivity && (
            <>
              <selectedActivity.icon className="w-5 h-5" />
              <span>{selectedActivity.label}</span>
            </>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => {
                  onSelect(activity.id as ActivityType);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors ${
                  selectedType === activity.id ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <activity.icon className="w-5 h-5" />
                <span>{activity.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}