import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface SystemActivity {
  id: string;
  type: string;
  action: string;
  userId?: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export function ActivityMonitor() {
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activitiesRef = collection(db, 'system_activity');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SystemActivity[];
      setActivities(activityData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: SystemActivity['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Activity Monitor</h2>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.type}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {activity.action}
              </p>
              {activity.userId && (
                <p className="text-sm text-gray-500 mb-1">
                  User: {activity.userId}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {activity.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}