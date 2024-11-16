import React from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import type { Event } from '../types/event';
import { EventRating } from './EventRating';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    race: 'bg-purple-100 text-purple-800',
    training: 'bg-blue-100 text-blue-800',
    social: 'bg-pink-100 text-pink-800',
    competition: 'bg-orange-100 text-orange-800'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative h-48">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[event.type]}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 text-sm rounded-full ${difficultyColors[event.difficulty]}`}>
            {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
          </span>
          {event.distance && (
            <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {event.distance} km
            </span>
          )}
          {event.price && (
            <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
              ${event.price}
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location.address}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-2" />
            {event.participants} {event.participantLimit ? `/ ${event.participantLimit}` : ''} participants
          </div>
        </div>

        <div className="flex items-center justify-between">
          <EventRating
            eventId={event.id}
            averageRating={event.averageRating}
            totalRatings={event.totalRatings}
            size="sm"
            readonly
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle registration logic
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              event.isRegistered
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {event.isRegistered ? 'Registered' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}