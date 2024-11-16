import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { getFeedPosts } from '../services/feed';
import { useAuth } from '../context/AuthContext';

interface UseFeedResult {
  posts: any[];
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useFeed(pageSize: number = 10): UseFeedResult {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastPostTimestamp, setLastPostTimestamp] = useState<Timestamp | undefined>();
  
  const { user } = useAuth();

  // Initial load
  useEffect(() => {
    if (!user) return;
    
    const loadInitialPosts = async () => {
      try {
        setLoading(true);
        const initialPosts = await getFeedPosts(user.uid, pageSize);
        setPosts(initialPosts);
        
        // Update pagination state
        if (initialPosts.length < pageSize) {
          setHasMore(false);
        } else {
          setLastPostTimestamp(initialPosts[initialPosts.length - 1].createdAt);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load posts'));
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [user, pageSize]);

  // Load more function
  const loadMore = async () => {
    if (!user || !hasMore || loading) return;

    try {
      setLoading(true);
      const newPosts = await getFeedPosts(user.uid, pageSize, lastPostTimestamp);
      
      setPosts(prev => [...prev, ...newPosts]);
      
      // Update pagination state
      if (newPosts.length < pageSize) {
        setHasMore(false);
      } else {
        setLastPostTimestamp(newPosts[newPosts.length - 1].createdAt);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more posts'));
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, loadMore, hasMore };
}