import { useState, useCallback } from 'react';
import { FirestoreService } from '../services/firestore';
import type { Post, Comment } from '../types';

const firestoreService = new FirestoreService();

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosts = useCallback(async (limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const posts = await firestoreService.getPosts(limit);
      return posts;
    } catch (err) {
      setError('Failed to fetch posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (post: Omit<Post, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const postId = await firestoreService.createPost(post);
      return postId;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComments = useCallback(async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      const comments = await firestoreService.getComments(postId);
      return comments;
    } catch (err) {
      setError('Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId: string, comment: Omit<Comment, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const commentId = await firestoreService.addComment(postId, comment);
      return commentId;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getPosts,
    createPost,
    getComments,
    addComment
  };
}