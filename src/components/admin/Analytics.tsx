import React from 'react';
import { BarChart2, TrendingUp, Users, Calendar, Activity } from 'lucide-react';

export function Analytics() {
  const stats = [
    {
      label: 'Total Users',
      value: '2,845',
      change: '+12.5%',
      trend: 'up',
      icon: Users
    },
    {
      label: 'Active Events',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar
    },
    {
      label: 'Active Groups',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: Activity
    },
    {
      label: 'Monthly Growth',
      value: '23.4%',
      change: '+4.1%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Add charts and graphs here */}
    </div>
  );
}