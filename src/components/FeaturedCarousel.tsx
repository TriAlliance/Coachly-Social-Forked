import React, { useState, useRef } from 'react';
import { Users, Calendar, MessageCircle, UsersRound, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedItem {
  id: string;
  type: 'team' | 'group' | 'event' | 'question';
  title: string;
  image: string;
  link: string;
  engagement: number;
  date: string;
}

const MOCK_FEATURED: FeaturedItem[] = [
  {
    id: '1',
    type: 'team',
    title: 'Elite Running Squad Training',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800',
    link: '/teams/1',
    engagement: 156,
    date: '2024-03-15'
  },
  {
    id: '2',
    type: 'event',
    title: 'City Marathon 2024 Registration',
    image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800',
    link: '/events/2',
    engagement: 324,
    date: '2024-03-20'
  },
  {
    id: '3',
    type: 'group',
    title: 'Morning Trail Runners Club',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800',
    link: '/groups/3',
    engagement: 89,
    date: '2024-03-18'
  },
  {
    id: '4',
    type: 'question',
    title: 'Best Recovery Techniques Discussion',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800',
    link: '/qanda/4',
    engagement: 45,
    date: '2024-03-16'
  },
  {
    id: '5',
    type: 'event',
    title: 'Trail Running Workshop',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800',
    link: '/events/5',
    engagement: 178,
    date: '2024-03-22'
  },
  {
    id: '6',
    type: 'team',
    title: 'Cycling Performance Squad',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800',
    link: '/teams/6',
    engagement: 234,
    date: '2024-03-19'
  },
  {
    id: '7',
    type: 'group',
    title: 'Urban Fitness Community',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800',
    link: '/groups/7',
    engagement: 145,
    date: '2024-03-21'
  },
  {
    id: '8',
    type: 'question',
    title: 'Pre-Race Nutrition Tips',
    image: 'https://images.unsplash.com/photo-1547226647-daf2391dce0c?auto=format&fit=crop&w=800',
    link: '/qanda/8',
    engagement: 67,
    date: '2024-03-17'
  }
];

const typeIcons = {
  team: Users,
  group: UsersRound,
  event: Calendar,
  question: MessageCircle
};

export function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 160; // Width of card + gap
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Featured</h2>
        <div className="flex gap-1 md:hidden lg:flex">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        {MOCK_FEATURED.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <Link
              key={item.id}
              to={item.link}
              className={`flex-none w-[140px] h-[200px] relative rounded-lg overflow-hidden group ${
                isDragging ? 'pointer-events-none' : ''
              }`}
              onClick={(e) => isDragging && e.preventDefault()}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="flex items-center gap-1 mb-1.5">
                  <Icon className="w-3 h-3" />
                  <span className="text-xs font-medium capitalize">
                    {item.type}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold mb-1 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span>{item.engagement}</span>
                  <span>•</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}