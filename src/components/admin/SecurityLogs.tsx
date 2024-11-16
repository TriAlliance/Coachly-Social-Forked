import React, { useState, useEffect } from 'react';
import { Lock, Search, AlertCircle, Shield, UserX } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface SecurityLog {
  id: string;
  type: 'auth' | 'access' | 'modification' | 'system';
  severity: 'info' | 'warning' | 'error';
  event: string;
  userId?: string;
  ip?: string;
  details: string;
  timestamp: string;
}

export function SecurityLogs() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'auth' | 'access' | 'system'>('all');

  useEffect(() => {
    const logsRef = collection(db, 'security_logs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SecurityLog[];
      setLogs(logData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getSeverityColor = (severity: SecurityLog['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getEventIcon = (type: SecurityLog['type']) => {
    switch (type) {
      case 'auth':
        return UserX;
      case 'access':
        return Shield;
      default:
        return AlertCircle;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Security Logs</h2>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search security logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          <option value="auth">Authentication</option>
          <option value="access">Access Control</option>
          <option value="system">System Events</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => {
          const EventIcon = getEventIcon(log.type);
          return (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 bg-white rounded-lg border"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <EventIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {log.event}
                </p>
                {log.userId && (
                  <p className="text-sm text-gray-500 mb-1">
                    User ID: {log.userId}
                  </p>
                )}
                {log.ip && (
                  <p className="text-sm text-gray-500 mb-1">
                    IP: {log.ip}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {log.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}