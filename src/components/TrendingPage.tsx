import React, { useState } from 'react';
import { TrendingUp, Calendar, Users, UsersRound, MessageCircle, Search } from 'lucide-react';

type Category = 'all' | 'events' | 'teams' | 'groups' | 'people' | 'questions';

interface TrendingItem {
  id: string;
  type: Category;
  title: string;
  description: string;
  image?: string;
  stats: {
    members?: number;
    views?: number;
    likes?: number;
    participants?: number;
    responses?: number;
  };
  tags: string[];
  date: string;
}

const MOCK_TRENDING: TrendingItem[] = [
  {
    id: '1',
    type: 'events',
    title: 'City Marathon 2024',
    description: 'Annual city marathon with record participation expected',
    image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800',
    stats: {
      participants: 1250,
      likes: 450
    },
    tags: ['marathon', 'running', 'competition'],
    date: '2024-04-15'
  },
  {
    id: '2',
    type: 'teams',
    title: 'Elite Cycling Squad',
    description: 'Professional cycling team with multiple race victories',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800',
    stats: {
      members: 24,
      likes: 320
    },
    tags: ['cycling', 'professional', 'racing'],
    date: '2024-03-15'
  },
  {
    id: '3',
    type: 'questions',
    title: 'Best recovery practices after a marathon?',
    description: 'Comprehensive guide to post-marathon recovery techniques',
    stats: {
      views: 2800,
      responses: 45,
      likes: 156
    },
    tags: ['recovery', 'marathon', 'training'],
    date: '2024-03-14'
  }
];

export function TrendingPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const categories: { id: Category; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'groups', label: 'Groups', icon: UsersRound },
    { id: 'questions', label: 'Questions', icon: MessageCircle }
  ];

  const filteredItems = MOCK_TRENDING.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trending content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {item.image && (
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium bg-black bg-opacity-50 text-white`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  {item.stats.members && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.stats.members}
                    </span>
                  )}
                  {item.stats.participants && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.stats.participants}
                    </span>
                  )}
                  {item.stats.views && (
                    <span>{item.stats.views} views</span>
                  )}
                  {item.stats.responses && (
                    <span>{item.stats.responses} responses</span>
                  )}
                </div>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}