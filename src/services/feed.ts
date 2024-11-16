import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  // Add other post fields as needed
}

export async function getFeedPosts(
  userId: string,
  pageSize: number = 10,
  lastPostTimestamp?: Timestamp
): Promise<Post[]> {
  try {
    const postsRef = collection(db, 'posts');
    
    // Build query
    let feedQuery = query(
      postsRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // Add pagination if lastPostTimestamp exists
    if (lastPostTimestamp) {
      feedQuery = query(
        feedQuery,
        where('createdAt', '<', lastPostTimestamp)
      );
    }

    // Execute query
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(feedQuery);
    
    // Transform and return results
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];

  } catch (error) {
    console.error('Error fetching feed posts:', error);
    throw error;
  }
}