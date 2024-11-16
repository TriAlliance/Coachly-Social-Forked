import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus } from 'lucide-react';
import { EventsMap } from './EventsMap';
import { EventCard } from './EventCard';
import { EventDetails } from './EventDetails';
import { CreateEventModal } from './CreateEventModal';
import { useAuth } from '../context/AuthContext';

// Mock data to match the pattern used in Teams and Groups
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'City Marathon 2024',
    description: 'Annual city marathon with record participation expected',
    type: 'race',
    date: '2024-04-15',
    time: '08:00',
    location: {
      address: 'Central Park, New York',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    difficulty: 'intermediate',
    participants: 250,
    participantLimit: 500,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    averageRating: 4.5,
    totalRatings: 45,
    price: 50,
    distance: 42.2,
    image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800',
    tags: ['marathon', 'running', 'race'],
    isRegistered: false
  },
  {
    id: '2',
    title: 'Trail Running Workshop',
    description: 'Learn essential trail running techniques',
    type: 'training',
    date: '2024-03-20',
    time: '09:30',
    location: {
      address: 'Bear Mountain State Park',
      coordinates: { lat: 41.3127, lng: -73.9887 }
    },
    difficulty: 'beginner',
    participants: 15,
    participantLimit: 20,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    averageRating: 4.8,
    totalRatings: 12,
    price: 75,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800',
    tags: ['trail', 'running', 'workshop'],
    isRegistered: false
  },
  {
    id: '3',
    title: 'Evening Social Run',
    description: 'Casual group run followed by refreshments',
    type: 'social',
    date: '2024-03-18',
    time: '18:00',
    location: {
      address: 'Brooklyn Bridge Park',
      coordinates: { lat: 40.7024, lng: -73.9960 }
    },
    difficulty: 'beginner',
    participants: 28,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    averageRating: 4.6,
    totalRatings: 22,
    distance: 5,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800',
    tags: ['social', 'running', 'group'],
    isRegistered: false
  }
];

export function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC

  // Get user location
  React.useEffect(() => {
    if (user?.location) {
      setUserLocation(user.location);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // If geolocation fails, keep using default location
          console.log('Using default location');
        }
      );
    }
  }, [user]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || event.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, { 
      ...newEvent, 
      id: String(events.length + 1),
      createdAt: new Date().toISOString(),
      participants: 0,
      isRegistered: false,
      averageRating: 0,
      totalRatings: 0
    }]);
    setShowCreateModal(false);
  };

  const handleRegister = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isRegistered: !event.isRegistered,
          participants: event.isRegistered ? 
            event.participants - 1 : 
            event.participants + 1
        };
      }
      return event;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Events</h2>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="race">Races</option>
              <option value="training">Training</option>
              <option value="social">Social</option>
              <option value="competition">Competition</option>
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <EventsMap 
            events={filteredEvents}
            center={userLocation}
            onEventSelect={setSelectedEvent}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={() => handleRegister(selectedEvent.id)}
        />
      )}

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}