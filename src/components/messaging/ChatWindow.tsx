import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { subscribeToChat, sendMessage, type Message, type Chat } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chat || !user) return;

    const unsubscribe = subscribeToChat(chat.id, chat.type, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [chat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(
        chat.id,
        newMessage.trim(),
        user.uid,
        user.displayName || 'Unknown User',
        chat.type
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === user.uid;
          return (
            <div
              key={message.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isSender
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!isSender && (
                  <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                )}
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {format(message.timestamp.toDate(), 'h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}