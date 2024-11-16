import { useState, useCallback, useEffect } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { searchEvents, Event } from '../services/events';

interface UseEventsParams {
  location?: { lat: number; lng: number };
  radius?: number;
  type?: string;
  difficulty?: string;
}

export function useEvents(params: UseEventsParams) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await searchEvents({
        location: params.location ? {
          lat: params.location.lat,
          lng: params.location.lng,
          radius: params.radius
        } : undefined,
        type: params.type,
        difficulty: params.difficulty,
        lastDoc: isLoadMore ? lastDoc : undefined
      });

      setEvents(prev => isLoadMore ? [...prev, ...result.events] : result.events);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }, [params.location, params.radius, params.type, params.difficulty, lastDoc]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchEvents(false);
  }, [fetchEvents]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchEvents(true);
    }
  }, [loading, hasMore, fetchEvents]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    events,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}