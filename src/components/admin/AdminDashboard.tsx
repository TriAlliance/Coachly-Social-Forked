import React, { useState } from 'react';
import { Shield, Users, Calendar, UsersRound, Settings, Database, Activity, BarChart, Globe, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserManagement } from './UserManagement';
import { EventManagement } from './EventManagement';
import { GroupManagement } from './GroupManagement';
import { SystemSettings } from './SystemSettings';
import { DataScraping } from './DataScraping';
import { ActivityMonitor } from './ActivityMonitor';
import { Analytics } from './Analytics';
import { SecurityLogs } from './SecurityLogs';
import { ApiManagement } from './ApiManagement';

export function AdminDashboard() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart, component: Analytics },
    { id: 'users', label: 'Users', icon: Users, component: UserManagement },
    { id: 'events', label: 'Events', icon: Calendar, component: EventManagement },
    { id: 'groups', label: 'Groups', icon: UsersRound, component: GroupManagement },
    { id: 'scraping', label: 'Data Scraping', icon: Database, component: DataScraping },
    { id: 'activity', label: 'Activity Monitor', icon: Activity, component: ActivityMonitor },
    { id: 'security', label: 'Security Logs', icon: Lock, component: SecurityLogs },
    { id: 'api', label: 'API Management', icon: Globe, component: ApiManagement },
    { id: 'settings', label: 'System Settings', icon: Settings, component: SystemSettings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}