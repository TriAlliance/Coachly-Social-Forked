import React, { useState } from 'react';
import { ArrowLeft, Settings, Users, Calendar, Trophy, MapPin, Plus } from 'lucide-react';

interface GroupDetailsProps {
  group: any;
  onBack: () => void;
  onLeave: (groupId: string) => void;
}

export function GroupDetails({ group, onBack, onLeave }: GroupDetailsProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'members' | 'achievements'>('feed');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-64">
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {group.isAdmin && (
            <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {group.memberCount} members
              </div>
              {group.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {group.location}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex gap-4 p-4">
            {['feed', 'events', 'members', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Group Feed</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Post
                </button>
              </div>
              <p className="text-gray-500 text-center py-8">No posts yet</p>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Group Members</h2>
                {group.isAdmin && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    Invite Members
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-center py-8">Loading members...</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Group Achievements</h2>
              <p className="text-gray-500 text-center py-8">No achievements yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}