import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  date: string;
  type: 'run' | 'cycle' | 'swim' | 'workout';
  title: string;
}

const MOCK_EVENTS: Event[] = [
  { date: '2024-03-15', type: 'run', title: 'Morning Run' },
  { date: '2024-03-18', type: 'cycle', title: 'Hill Training' },
  { date: '2024-03-20', type: 'swim', title: 'Pool Session' }
];

export function TrainingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    return MOCK_EVENTS.filter(event => event.date === date);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Training Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {previousMonthDays.map(day => (
          <div key={`prev-${day}`} className="aspect-square p-1">
            <div className="w-full h-full rounded-lg bg-gray-50 text-gray-400 text-sm flex items-center justify-center">
              {day}
            </div>
          </div>
        ))}
        
        {days.map(day => {
          const events = getEventsForDay(day);
          return (
            <div key={day} className="aspect-square p-1">
              <div className={`w-full h-full rounded-lg ${
                events.length > 0 ? 'bg-blue-50' : 'bg-gray-50'
              } p-1`}>
                <div className="text-sm font-medium mb-1">{day}</div>
                {events.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {events.map((event, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-500"
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}