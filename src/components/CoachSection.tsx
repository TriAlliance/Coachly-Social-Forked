import React from 'react';
import { Star, MessageCircle, Calendar, Users } from 'lucide-react';

interface Coach {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviews: number;
  clients: number;
  availability: 'available' | 'limited' | 'full';
  price: number;
  avatar: string;
  bio: string;
}

const MOCK_COACHES: Coach[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialties: ['Marathon Training', 'Recovery', 'Nutrition'],
    experience: 8,
    rating: 4.9,
    reviews: 124,
    clients: 45,
    availability: 'limited',
    price: 80,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Former Olympic athlete specializing in distance running and marathon preparation.'
  },
  {
    id: '2',
    name: 'Mike Peterson',
    specialties: ['Cycling', 'Power Training', 'Race Preparation'],
    experience: 12,
    rating: 4.8,
    reviews: 98,
    clients: 32,
    availability: 'available',
    price: 90,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Professional cycling coach with experience in both road and mountain biking.'
  },
  {
    id: '3',
    name: 'Lisa Chen',
    specialties: ['Triathlon', 'Swimming', 'Endurance'],
    experience: 6,
    rating: 4.7,
    reviews: 76,
    clients: 28,
    availability: 'full',
    price: 75,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    bio: 'Certified triathlon coach focusing on balanced training and race strategy.'
  }
];

const availabilityColors = {
  available: 'bg-green-100 text-green-800',
  limited: 'bg-yellow-100 text-yellow-800',
  full: 'bg-red-100 text-red-800'
};

export function CoachSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COACHES.map((coach) => (
          <div key={coach.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">{coach.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{coach.rating}</span>
                    <span>({coach.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-4">{coach.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {coach.experience} years exp.
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {coach.clients} active clients
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${availabilityColors[coach.availability]}`}>
                    {coach.availability.charAt(0).toUpperCase() + coach.availability.slice(1)}
                  </span>
                  <span className="font-bold">${coach.price}/hour</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}