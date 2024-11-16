import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  GeoPoint,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Event } from '../types/event';

export async function fetchEvents(params?: {
  type?: string;
  difficulty?: string;
  location?: { lat: number; lng: number; radius?: number };
  lastDoc?: any;
  pageSize?: number;
}) {
  try {
    const eventsRef = collection(db, 'events');
    let q = query(eventsRef, orderBy('createdAt', 'desc'));

    if (params?.type && params.type !== 'all') {
      q = query(q, where('type', '==', params.type));
    }

    if (params?.difficulty && params.difficulty !== 'all') {
      q = query(q, where('difficulty', '==', params.difficulty));
    }

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];

    // Filter by location if provided
    if (params?.location) {
      const { lat, lng, radius = 50 } = params.location;
      return events.filter(event => {
        if (!event.location?.coordinates) return false;
        const distance = calculateDistance(
          lat,
          lng,
          event.location.coordinates.lat,
          event.location.coordinates.lng
        );
        return distance <= radius;
      });
    }

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt'>) {
  try {
    const { location, ...rest } = eventData;
    const geoPoint = new GeoPoint(
      location.coordinates.lat,
      location.coordinates.lng
    );

    const docRef = await addDoc(collection(db, 'events'), {
      ...rest,
      location: {
        ...location,
        coordinates: geoPoint
      },
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(eventId: string, updates: Partial<Event>) {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function getUserEventRating(eventId: string, userId: string): Promise<number | null> {
  try {
    const ratingId = `${userId}_${eventId}`;
    const ratingRef = doc(db, 'eventRatings', ratingId);
    const ratingDoc = await getDoc(ratingRef);
    
    return ratingDoc.exists() ? ratingDoc.data().rating : null;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }
}

export async function rateEvent(eventId: string, userId: string, rating: number): Promise<void> {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const eventRef = doc(db, 'events', eventId);
    const ratingId = `${userId}_${eventId}`;
    const userRatingRef = doc(db, 'eventRatings', ratingId);

    await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      const userRatingDoc = await transaction.get(userRatingRef);

      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      const currentRating = eventData.averageRating || 0;
      const currentCount = eventData.totalRatings || 0;
      let newRating: number;
      let newCount: number;

      if (userRatingDoc.exists()) {
        // Update existing rating
        const oldRating = userRatingDoc.data().rating;
        const totalRating = currentRating * currentCount;
        newRating = (totalRating - oldRating + rating) / currentCount;
        newCount = currentCount;
      } else {
        // Add new rating
        const totalRating = currentRating * currentCount;
        newCount = currentCount + 1;
        newRating = (totalRating + rating) / newCount;
      }

      transaction.set(userRatingRef, {
        userId,
        eventId,
        rating,
        timestamp: serverTimestamp()
      });

      transaction.update(eventRef, {
        averageRating: Number(newRating.toFixed(1)),
        totalRatings: newCount
      });
    });
  } catch (error) {
    console.error('Error rating event:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}