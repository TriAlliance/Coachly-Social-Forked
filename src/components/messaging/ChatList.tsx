import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getChats, type Chat } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      try {
        const userChats = await getChats(user.uid);
        setChats(userChats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm">Start a new chat to begin messaging</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chats.map((chat) => {
        const otherParticipant = chat.participants.find(id => id !== user?.uid);
        const otherParticipantName = otherParticipant ? chat.participantNames[otherParticipant] : 'Unknown';

        return (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors ${
              selectedChatId === chat.id ? 'bg-blue-50' : ''
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipantName}`}
              alt={otherParticipantName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{otherParticipantName}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(chat.lastMessage.timestamp), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage.senderId === user?.uid ? 'You: ' : ''}
                  {chat.lastMessage.content}
                </p>
              )}
              {chat.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}