import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Post, User, Comment } from '../types';

export class FirestoreService {
  // Posts
  async getPosts(limitCount: number = 10): Promise<Post[]> {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async createPost(post: Omit<Post, 'id'>): Promise<string> {
    try {
      const postsRef = collection(db, 'posts');
      const docRef = await addDoc(postsRef, {
        ...post,
        date: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(postId: string, data: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, data);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async addComment(postId: string, comment: Omit<Comment, 'id'>): Promise<string> {
    try {
      const commentsRef = collection(db, 'comments');
      const docRef = await addDoc(commentsRef, {
        ...comment,
        postId,
        date: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Users
  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDocs(userRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Activity Stats
  async getUserStats(userId: string): Promise<DocumentData | null> {
    try {
      const statsRef = doc(db, 'stats', userId);
      const docSnap = await getDocs(statsRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async updateUserStats(userId: string, data: DocumentData): Promise<void> {
    try {
      const statsRef = doc(db, 'stats', userId);
      await updateDoc(statsRef, data);
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
}