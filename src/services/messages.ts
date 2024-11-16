import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Message, Chat } from '../types/message';

export async function getChats(userId: string): Promise<Chat[]> {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
}

export async function getMessages(chatId: string, limit = 50): Promise<Message[]> {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
    } as Message));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessage(chatId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const chatRef = doc(db, 'chats', chatId);

    const messageData = {
      ...message,
      timestamp: serverTimestamp(),
      readBy: [message.senderId]
    };

    // Add message
    const docRef = await addDoc(messagesRef, messageData);

    // Update chat's last message and timestamp
    await updateDoc(chatRef, {
      lastMessage: messageData,
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function createChat(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const chatsRef = collection(db, 'chats');
    const chatData = {
      ...chat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(chatsRef, chatData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(
      messagesRef,
      where('readBy', 'not-in', [userId])
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map(doc =>
      updateDoc(doc.ref, {
        readBy: arrayUnion(userId)
      })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

export function subscribeToChat(chatId: string, callback: (messages: Message[]) => void): () => void {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
    } as Message));
    callback(messages);
  });
}

export function subscribeToChats(userId: string, callback: (chats: Chat[]) => void): () => void {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));
    callback(chats);
  });
}