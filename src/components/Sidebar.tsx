import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Medal, 
  Award, 
  Map,
  Home,
  UsersRound,
  Flag,
  Calendar,
  MessageCircle,
  Book,
  User,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  category: 'social' | 'dashboard' | 'training' | 'account' | 'admin';
}

export function Sidebar() {
  const location = useLocation();
  const { user, isSuperAdmin } = useAuth();

  const navItems: NavItem[] = [
    // Social Category
    { id: 'feed', label: 'Social Feed', icon: Home, path: '/', category: 'social' },
    { id: 'teams', label: 'Teams', icon: Flag, path: '/teams', category: 'social' },
    { id: 'groups', label: 'Groups', icon: UsersRound, path: '/groups', category: 'social' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/events', category: 'social' },
    { id: 'qanda', label: 'Q&A', icon: MessageCircle, path: '/qanda', category: 'social' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', category: 'social' },
    
    // Dashboard Category
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', category: 'dashboard' },
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/overview', category: 'dashboard' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress', category: 'dashboard' },
    { id: 'records', label: 'Records', icon: Medal, path: '/records', category: 'dashboard' },
    { id: 'achievements', label: 'Achievements', icon: Award, path: '/achievements', category: 'dashboard' },
    { id: 'routes', label: 'Routes', icon: Map, path: '/routes', category: 'dashboard' },
    
    // Training Category
    { id: 'training', label: 'Training Plans', icon: Book, path: '/training', category: 'training' },

    // Account Category
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', category: 'account' },

    // Admin Category (only shown to super admins)
    ...(isSuperAdmin ? [
      { id: 'admin', label: 'Admin Dashboard', icon: Shield, path: '/admin', category: 'admin' }
    ] : [])
  ];

  const renderNavSection = (category: 'social' | 'dashboard' | 'training' | 'account' | 'admin') => {
    const categoryItems = navItems.filter(item => item.category === category);
    
    if (categoryItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {categoryItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-brand text-white dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-24 transition-colors">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <span 
            className="text-lg font-bold text-gradient" 
            data-text="Coachly"
          >
            Coachly
          </span>
        </div>
        
        <nav className="space-y-8">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
              Social
            </h2>
            {renderNavSection('social')}
          </div>
          
          <div>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
              Dashboard
            </h2>
            {renderNavSection('dashboard')}
          </div>
          
          <div>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
              Training
            </h2>
            {renderNavSection('training')}
          </div>

          <div>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
              Account
            </h2>
            {renderNavSection('account')}
          </div>

          {isSuperAdmin && (
            <div>
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
                Administration
              </h2>
              {renderNavSection('admin')}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}