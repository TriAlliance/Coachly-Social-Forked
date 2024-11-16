import React, { useState } from 'react';
import { Send, Heart, Reply, MoreHorizontal } from 'lucide-react';
import type { Comment } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onAddComment: (content: string, parentId?: string) => void;
  level?: number;
}

function CommentItem({ comment, onReply, onAddComment, level = 0 }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onAddComment(replyContent, comment.id);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className={`${level > 0 ? 'ml-8 mt-3' : 'mt-4'} group`}>
      <div className="flex space-x-3">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
          alt={comment.username}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{comment.username}</span>
              <button className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 ml-2">
            <span className="text-xs text-gray-500">
              {new Date(comment.date).toLocaleDateString()}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                liked ? 'text-blue-500' : 'text-gray-500'
              } hover:text-blue-600 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>

          {showReplyInput && (
            <form onSubmit={handleSubmitReply} className="flex items-center mt-2 space-x-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {comment.replies?.length > 0 && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onAddComment={onAddComment}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="border-t">
      <div className="p-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(id) => setReplyingTo(id)}
            onAddComment={onAddComment}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center p-4 space-x-2 border-t">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}