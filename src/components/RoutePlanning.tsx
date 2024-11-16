import React, { useState } from 'react';
import { Map, Route, Bookmark, Share2, Plus, Search, Filter } from 'lucide-react';

interface SavedRoute {
  id: string;
  name: string;
  distance: number;
  elevation: number;
  type: 'run' | 'cycle' | 'hike';
  difficulty: 'easy' | 'moderate' | 'hard';
  imageUrl: string;
  likes: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
}

const MOCK_ROUTES: SavedRoute[] = [
  {
    id: '1',
    name: 'Sunrise Mountain Loop',
    distance: 12.5,
    elevation: 450,
    type: 'run',
    difficulty: 'moderate',
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800',
    likes: 245,
    shares: 42,
    isLiked: false,
    isSaved: true
  },
  {
    id: '2',
    name: 'Coastal Cycling Path',
    distance: 28.3,
    elevation: 120,
    type: 'cycle',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7c8f1b?auto=format&fit=crop&w=800',
    likes: 189,
    shares: 35,
    isLiked: true,
    isSaved: false
  },
  {
    id: '3',
    name: 'Forest Trail Adventure',
    distance: 8.7,
    elevation: 320,
    type: 'hike',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?auto=format&fit=crop&w=800',
    likes: 156,
    shares: 28,
    isLiked: false,
    isSaved: true
  }
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export function RoutePlanning() {
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [activeView, setActiveView] = useState<'discover' | 'saved'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'run' | 'cycle' | 'hike'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || route.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || route.difficulty === selectedDifficulty;
    const matchesView = activeView === 'discover' || (activeView === 'saved' && route.isSaved);
    return matchesSearch && matchesType && matchesDifficulty && matchesView;
  });

  const handleLike = (routeId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          isLiked: !route.isLiked,
          likes: route.isLiked ? route.likes - 1 : route.likes + 1
        };
      }
      return route;
    }));
  };

  const handleSave = (routeId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          isSaved: !route.isSaved
        };
      }
      return route;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Route Planning</h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Route
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('discover')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeView === 'discover'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveView('saved')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeView === 'saved'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Saved Routes
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="run">Running</option>
              <option value="cycle">Cycling</option>
              <option value="hike">Hiking</option>
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-48">
              <img
                src={route.imageUrl}
                alt={route.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleSave(route.id)}
                  className={`p-2 rounded-full ${
                    route.isSaved
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{route.name}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {route.distance} km
                </span>
                <span className="px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-800">
                  {route.elevation}m elevation
                </span>
                <span className={`px-2 py-1 text-sm rounded-full ${difficultyColors[route.difficulty]}`}>
                  {route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <button
                  onClick={() => handleLike(route.id)}
                  className={`flex items-center gap-1 ${
                    route.isLiked ? 'text-blue-500' : ''
                  }`}
                >
                  <Route className="w-5 h-5" />
                  <span>{route.likes}</span>
                </button>
                <button className="flex items-center gap-1">
                  <Share2 className="w-5 h-5" />
                  <span>{route.shares}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}