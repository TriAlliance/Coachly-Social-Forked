import { 
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  limit,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Message, Chat } from '../types/message';

export async function getChats(userId: string): Promise<Chat[]> {
  try {
    // First, try to get chats without ordering
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId)
    );

    const snapshot = await getDocs(q);
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));

    // Sort chats client-side as fallback
    return chats.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
}

export async function createChat(participants: string[], type: 'direct' | 'group' | 'team' = 'direct'): Promise<string> {
  try {
    const chatRef = collection(db, type === 'direct' ? 'chats' : `${type}Chats`);
    const newChat = await addDoc(chatRef, {
      participants,
      type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
      unreadCount: {}
    });
    return newChat.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

export async function sendMessage(
  chatId: string,
  content: string,
  senderId: string,
  senderName: string,
  type: 'direct' | 'group' | 'team' = 'direct'
): Promise<string> {
  try {
    const chatRef = doc(db, type === 'direct' ? 'chats' : `${type}Chats`, chatId);
    const messagesRef = collection(chatRef, 'messages');
    
    // Add message
    const messageDoc = await addDoc(messagesRef, {
      content,
      senderId,
      senderName,
      timestamp: serverTimestamp(),
      read: false
    });

    // Update chat with last message
    await updateDoc(chatRef, {
      lastMessage: {
        content,
        timestamp: serverTimestamp(),
        senderId
      },
      updatedAt: serverTimestamp()
    });

    return messageDoc.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export function subscribeToChat(
  chatId: string,
  type: 'direct' | 'group' | 'team',
  callback: (messages: Message[]) => void
): () => void {
  const chatRef = doc(db, type === 'direct' ? 'chats' : `${type}Chats`, chatId);
  const messagesRef = collection(chatRef, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    })) as Message[];
    callback(messages);
  }, (error) => {
    console.error('Error in chat subscription:', error);
    callback([]);
  });
}

export function subscribeToChats(
  userId: string,
  callback: (chats: Chat[]) => void
): () => void {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat))
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    callback(chats);
  }, (error) => {
    console.error('Error in chats subscription:', error);
    callback([]);
  });
}

export async function markMessageAsRead(
  chatId: string,
  messageId: string,
  userId: string,
  type: 'direct' | 'group' | 'team' = 'direct'
): Promise<void> {
  try {
    const chatRef = doc(db, type === 'direct' ? 'chats' : `${type}Chats`, chatId);
    const messageRef = doc(collection(chatRef, 'messages'), messageId);

    await updateDoc(messageRef, { read: true });
    await updateDoc(chatRef, { [`unreadCount.${userId}`]: 0 });
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}