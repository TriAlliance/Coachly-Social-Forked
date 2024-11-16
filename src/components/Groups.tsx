import React, { useState } from 'react';
import { UsersRound, Plus, Search, MapPin, Calendar, Trophy, Settings, MoreHorizontal } from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupDetails } from './GroupDetails';
import { GroupsMap } from './GroupsMap';

// ... (keep existing interfaces and mock data)

export function Groups() {
  // ... (keep existing state and handlers)

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UsersRound className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Groups</h2>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Group
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  All Groups
                </button>
                <button
                  onClick={() => setFilter('my-groups')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'my-groups'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  My Groups
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Map */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Groups Near You</h3>
          <GroupsMap 
            groups={filteredGroups}
            onGroupSelect={setSelectedGroup}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="relative h-48">
                <img
                  src={group.coverImage}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {group.isAdmin && (
                    <button className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {group.privacy === 'private' && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-gray-900 bg-opacity-75 rounded-lg text-white text-sm">
                    Private Group
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{group.name}</h3>
                  <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                {group.location && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {group.location}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Users className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{group.memberCount}</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{group.upcomingEvents}</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Trophy className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{group.achievements}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </button>
                  {!group.isMember ? (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Join Group
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={(newGroup) => {
          setGroups([...groups, { ...newGroup, id: String(groups.length + 1) }]);
          setShowCreateModal(false);
        }}
      />
    </>
  );
}