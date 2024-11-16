import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDoc, 
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Post } from '../types/post';

export async function createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  try {
    // Add server timestamp
    const postData = {
      ...post,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      likedBy: []
    };

    // Create post document
    const docRef = await addDoc(collection(db, 'posts'), postData);
    
    // Get the created post
    const postSnap = await getDoc(docRef);
    
    if (!postSnap.exists()) {
      throw new Error('Failed to create post');
    }

    // Return the created post with proper typing
    return {
      id: docRef.id,
      ...postSnap.data(),
      createdAt: new Date().toISOString() // Convert server timestamp to ISO string
    } as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function uploadPostImage(file: File): Promise<string> {
  try {
    // Create unique filename
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `posts/${filename}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as Post));
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error('Failed to get posts');
  }
}

export async function likePost(postId: string, userId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw new Error('Failed to unlike post');
  }
}