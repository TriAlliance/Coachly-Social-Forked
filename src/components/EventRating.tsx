import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { rateEvent, getUserEventRating } from '../services/events';
import { useAuth } from '../context/AuthContext';

interface EventRatingProps {
  eventId: string;
  averageRating?: number;
  totalRatings?: number;
  onRatingUpdate?: () => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function EventRating({ 
  eventId, 
  averageRating = 0, 
  totalRatings = 0, 
  onRatingUpdate,
  size = 'md',
  readonly = false
}: EventRatingProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !readonly) {
      loadUserRating();
    }
  }, [user, eventId, readonly]);

  const loadUserRating = async () => {
    if (!user) return;
    try {
      const rating = await getUserEventRating(eventId, user.uid);
      setUserRating(rating);
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!user || isSubmitting || readonly) return;

    setIsSubmitting(true);
    try {
      await rateEvent(eventId, user.uid, rating);
      setUserRating(rating);
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const renderStar = (position: number) => {
    const isFilled = isHovering 
      ? position <= hoverRating
      : position <= (userRating || averageRating);

    return (
      <Star
        key={position}
        className={`${starSizes[size]} cursor-pointer transition-colors ${
          isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        } ${readonly ? 'cursor-default' : ''}`}
        onClick={() => !readonly && handleRating(position)}
        onMouseEnter={() => {
          if (!readonly) {
            setIsHovering(true);
            setHoverRating(position);
          }
        }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex gap-0.5"
        onMouseLeave={() => {
          if (!readonly) {
            setIsHovering(false);
            setHoverRating(0);
          }
        }}
      >
        {[1, 2, 3, 4, 5].map(position => renderStar(position))}
      </div>
      <div className={`${textSizes[size]} text-gray-500`}>
        {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
      </div>
      {!user && !readonly && (
        <p className={`${textSizes[size]} text-gray-500`}>Sign in to rate</p>
      )}
    </div>
  );
}