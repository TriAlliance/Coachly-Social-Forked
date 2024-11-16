import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Flag, Loader2 } from 'lucide-react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useAuth } from '../../context/AuthContext';
import { subscribeToChats } from '../../services/chat';
import type { Chat } from '../../types/message';

export function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [filter, setFilter] = useState<'all' | 'direct' | 'group' | 'team'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = subscribeToChats(user.uid, (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredChats = chats.filter(chat => 
    filter === 'all' || chat.type === filter
  );

  if (!user) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please sign in to view your messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setFilter('group')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                filter === 'group'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Groups
            </button>
            <button
              onClick={() => setFilter('team')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                filter === 'team'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Flag className="w-4 h-4" />
              Teams
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <ChatList
            chats={filteredChats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}