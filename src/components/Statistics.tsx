import React from 'react';
import { Activity, Clock, Route, Dumbbell } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`ml-2 text-sm ${trendColor}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export function Statistics() {
  const stats = [
    {
      title: 'Total Activities',
      value: '24',
      change: '+12% vs last month',
      icon: Activity,
      trend: 'up' as const
    },
    {
      title: 'Active Minutes',
      value: '1,248',
      change: '+8% vs last month',
      icon: Clock,
      trend: 'up' as const
    },
    {
      title: 'Distance Covered',
      value: '284 km',
      change: '+15% vs last month',
      icon: Route,
      trend: 'up' as const
    },
    {
      title: 'Calories Burned',
      value: '12,450',
      change: '+5% vs last month',
      icon: Dumbbell,
      trend: 'up' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}