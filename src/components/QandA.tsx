import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Filter, Search, Plus, Tag, MessageSquare, Award } from 'lucide-react';
import { ActivityTypeSelector } from './ActivityTypeSelector';
import type { ActivityType } from '../types';
import { AskQuestionModal } from './AskQuestionModal';

interface Question {
  id: string;
  title: string;
  content: string;
  activityType: ActivityType;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  date: string;
  votes: number;
  answers: number;
  views: number;
  isVoted: boolean;
  isSaved: boolean;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'How to prevent shin splints during long runs?',
    content: 'I\'ve been increasing my running distance but keep getting shin splints. Any tips for prevention?',
    activityType: 'run',
    tags: ['injury-prevention', 'running-form', 'training'],
    author: {
      name: 'JohnRunner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnRunner',
      reputation: 1250
    },
    date: '2024-03-15T08:30:00Z',
    votes: 24,
    answers: 8,
    views: 156,
    isVoted: false,
    isSaved: false
  },
  {
    id: '2',
    title: 'Best cycling cadence for endurance rides?',
    content: 'What\'s the optimal cadence range for long-distance cycling to maintain efficiency?',
    activityType: 'cycle',
    tags: ['technique', 'endurance', 'efficiency'],
    author: {
      name: 'CyclingPro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyclingPro',
      reputation: 3420
    },
    date: '2024-03-14T10:15:00Z',
    votes: 18,
    answers: 5,
    views: 98,
    isVoted: true,
    isSaved: true
  }
];

export function QandA() {
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'unanswered'>('recent');
  const [showAskModal, setShowAskModal] = useState(false);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || question.activityType === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'votes') {
      return b.votes - a.votes;
    } else {
      return a.answers - b.answers;
    }
  });

  const handleVote = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          isVoted: !q.isVoted,
          votes: q.isVoted ? q.votes - 1 : q.votes + 1
        };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Questions & Answers</h2>
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="votes">Most Votes</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Activity Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Questions
              </button>
              <ActivityTypeSelector
                selectedType={selectedType === 'all' ? 'run' : selectedType}
                onSelect={(type) => setSelectedType(type)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVote(question.id)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    question.isVoted
                      ? 'bg-blue-100 text-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${question.isVoted ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{question.votes}</span>
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold hover:text-blue-500 cursor-pointer">
                    {question.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {question.answers} answers
                    </span>
                    <span>{question.views} views</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{question.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    question.activityType === 'run' ? 'bg-green-100 text-green-800' :
                    question.activityType === 'cycle' ? 'bg-blue-100 text-blue-800' :
                    question.activityType === 'swim' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {question.activityType}
                  </span>
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={question.author.avatar}
                      alt={question.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium">{question.author.name}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="w-4 h-4 text-yellow-500 mr-1" />
                      {question.author.reputation}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    asked {new Date(question.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AskQuestionModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={(question) => {
          setQuestions([
            {
              ...question,
              id: String(questions.length + 1),
              date: new Date().toISOString(),
              votes: 0,
              answers: 0,
              views: 0,
              isVoted: false,
              isSaved: false,
              author: {
                name: 'CurrentUser',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
                reputation: 100
              }
            },
            ...questions
          ]);
          setShowAskModal(false);
        }}
      />
    </div>
  );
}