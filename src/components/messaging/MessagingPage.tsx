import React, { useState } from 'react';
import { MessageSquare, Users, Search } from 'lucide-react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { type Chat } from '../../services/chat';

export function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Messages
          </h2>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-12 h-12 mb-4" />
            <p className="text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}