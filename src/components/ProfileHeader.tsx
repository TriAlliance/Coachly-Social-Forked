import React from 'react';
import { MapPin, Calendar, Users, Settings } from 'lucide-react';

interface ProfileStats {
  followers: number;
  following: number;
  totalActivities: number;
  joinDate: string;
  location?: string;
}

interface ProfileHeaderProps {
  name: string;
  bio?: string;
  stats: ProfileStats;
}

export function ProfileHeader({ name, bio, stats }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="relative h-64">
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=1920"
          alt="Profile cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="absolute -bottom-12 left-8">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
              alt={name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-8 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">{name}</h1>
            {bio && <p className="text-gray-600 mb-4">{bio}</p>}
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {stats.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {stats.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {new Date(stats.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Edit Profile
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              Share Profile
            </button>
          </div>
        </div>

        <div className="flex gap-8 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.followers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.following}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}