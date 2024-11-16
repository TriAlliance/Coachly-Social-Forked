import React from 'react';
import { Medal, Timer, MapPin, TrendingUp } from 'lucide-react';

interface Record {
  id: string;
  category: string;
  type: string;
  value: string;
  date: string;
  previousBest?: string;
  improvement?: string;
}

const MOCK_RECORDS: Record[] = [
  {
    id: '1',
    category: 'Running',
    type: '5K Time',
    value: '19:45',
    date: '2024-03-15',
    previousBest: '20:12',
    improvement: '27s'
  },
  {
    id: '2',
    category: 'Cycling',
    type: 'Longest Ride',
    value: '120.5 km',
    date: '2024-03-10',
    previousBest: '105.2 km',
    improvement: '15.3 km'
  },
  {
    id: '3',
    category: 'Running',
    type: 'Half Marathon',
    value: '1:45:30',
    date: '2024-02-28',
    previousBest: '1:48:15',
    improvement: '2:45'
  },
  {
    id: '4',
    category: 'Cycling',
    type: 'Max Speed',
    value: '52.3 km/h',
    date: '2024-03-12',
    previousBest: '48.8 km/h',
    improvement: '3.5 km/h'
  }
];

export function PersonalRecords() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Medal className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold">Personal Records</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_RECORDS.map((record) => (
          <div
            key={record.id}
            className="relative overflow-hidden rounded-lg border border-orange-100 bg-orange-50 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  {record.category}
                </span>
                <h3 className="mt-2 font-semibold">{record.type}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{record.value}</span>
                  {record.improvement && (
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {record.improvement}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </div>
                {record.previousBest && (
                  <div className="mt-1 text-sm text-gray-500">
                    Previous: {record.previousBest}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
          View All Records →
        </button>
      </div>
    </div>
  );
}