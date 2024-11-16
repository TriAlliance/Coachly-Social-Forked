import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Users, DollarSign, Tag, MessageCircle } from 'lucide-react';
import { EventRating } from './EventRating';
import { useAuth } from '../context/AuthContext';
import { Event, getUserEventRating } from '../services/events';
import { EventsMap } from './EventsMap';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
  onRegister?: (eventId: string) => void;
}

export function EventDetails({ event, onClose, onRegister }: EventDetailsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'discussion'>('details');
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadUserRating();
    }
  }, [user, event.id]);

  const loadUserRating = async () => {
    if (!user) return;
    try {
      const rating = await getUserEventRating(event.id, user.uid);
      setUserRating(rating);
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  };

  const handleRegister = async () => {
    if (onRegister) {
      try {
        await onRegister(event.id);
      } catch (error) {
        console.error('Error registering for event:', error);
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // Add comment logic here
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
                </span>
                {event.price && (
                  <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    ${event.price}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleRegister}
              className={`px-6 py-2 rounded-lg font-medium ${
                event.isRegistered
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {event.isRegistered ? 'Registered' : 'Register Now'}
            </button>
          </div>

          <div className="flex gap-4 border-b mb-6">
            {['details', 'participants', 'discussion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>
                    {event.participants} {event.participantLimit ? `/ ${event.participantLimit}` : ''} participants
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div className="h-64">
                <EventsMap 
                  events={[event]} 
                  center={event.location.coordinates}
                  zoom={13}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Event Rating</h3>
                <EventRating
                  eventId={event.id}
                  averageRating={event.averageRating}
                  totalRatings={event.totalRatings}
                  onRatingUpdate={loadUserRating}
                  size="lg"
                />
              </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-4">
              {event.registeredParticipants?.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-gray-500">Joined {new Date(participant.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add to the discussion..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Post
                </button>
              </form>

              {event.comments?.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{comment.userName}</p>
                      <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}