import React, { useState } from 'react';
import { Users, Plus, Search, MapPin, Calendar, Trophy, Settings, MoreHorizontal } from 'lucide-react';
import { CreateTeamModal } from './CreateTeamModal';
import { TeamDetails } from './TeamDetails';
import { TeamsMap } from './TeamsMap';

interface Team {
  id: string;
  name: string;
  description: string;
  type: 'competitive' | 'recreational' | 'training' | 'club';
  memberCount: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
  coverImage: string;
  upcomingEvents: number;
  isAdmin: boolean;
  isMember: boolean;
  privacy: 'public' | 'private';
  achievements: number;
}

const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Elite Running Squad',
    description: 'Competitive running team for serious athletes',
    type: 'competitive',
    memberCount: 24,
    location: 'Central Park, NY',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800',
    upcomingEvents: 5,
    isAdmin: true,
    isMember: true,
    privacy: 'public',
    achievements: 18
  },
  {
    id: '2',
    name: 'City Cycling Team',
    description: 'Professional cycling team competing in local races',
    type: 'competitive',
    memberCount: 15,
    location: 'Brooklyn, NY',
    coordinates: { lat: 40.6782, lng: -73.9442 },
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800',
    upcomingEvents: 3,
    isAdmin: false,
    isMember: true,
    privacy: 'public',
    achievements: 12
  },
  {
    id: '3',
    name: 'Triathlon Training Club',
    description: 'Multi-sport training team for aspiring triathletes',
    type: 'training',
    memberCount: 32,
    location: 'Queens, NY',
    coordinates: { lat: 40.7282, lng: -73.7949 },
    coverImage: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?auto=format&fit=crop&w=800',
    upcomingEvents: 2,
    isAdmin: false,
    isMember: false,
    privacy: 'private',
    achievements: 8
  }
];

export function Teams() {
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'my-teams'>('all');

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'my-teams' && team.isMember);
    return matchesSearch && matchesFilter;
  });

  const handleJoinTeam = (teamId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          isMember: true,
          memberCount: team.memberCount + 1
        };
      }
      return team;
    }));
  };

  const handleLeaveTeam = (teamId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          isMember: false,
          memberCount: team.memberCount - 1
        };
      }
      return team;
    }));
  };

  if (selectedTeam) {
    return (
      <TeamDetails
        team={selectedTeam}
        onBack={() => setSelectedTeam(null)}
        onLeave={handleLeaveTeam}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teams</h2>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search teams..."
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
                  All Teams
                </button>
                <button
                  onClick={() => setFilter('my-teams')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === 'my-teams'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  My Teams
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Map */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Teams Near You</h3>
          <TeamsMap 
            teams={filteredTeams}
            onTeamSelect={setSelectedTeam}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="relative h-48">
                <img
                  src={team.coverImage}
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {team.isAdmin && (
                    <button className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {team.privacy === 'private' && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-gray-900 bg-opacity-75 rounded-lg text-white text-sm">
                    Private Team
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{team.name}</h3>
                  <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {team.description}
                </p>

                {team.location && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {team.location}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Users className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{team.memberCount}</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{team.upcomingEvents}</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Trophy className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{team.achievements}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </button>
                  {!team.isMember ? (
                    <button
                      onClick={() => handleJoinTeam(team.id)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Join Team
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLeaveTeam(team.id)}
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

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTeam={(newTeam) => {
          setTeams([...teams, { ...newTeam, id: String(teams.length + 1) }]);
          setShowCreateModal(false);
        }}
      />
    </>
  );
}