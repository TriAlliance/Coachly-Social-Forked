export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  attachments?: string[];
  readBy?: string[];
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'team';
  participants: string[];
  lastMessage?: Message;
  unreadCount?: number;
  name?: string; // For group/team chats
  avatar?: string; // For group/team chats
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
  typing?: boolean;
}