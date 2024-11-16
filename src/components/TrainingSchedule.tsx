import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ScheduledWorkout {
  id: string;
  title: string;
  type: 'run' | 'cycle' | 'swim' | 'strength';
  time: string;
  duration: number;
  completed: boolean;
}

interface DaySchedule {
  date: string;
  workouts: ScheduledWorkout[];
}

const MOCK_SCHEDULE: DaySchedule[] = [
  {
    date: '2024-03-15',
    workouts: [
      {
        id: '1',
        title: 'Morning Run',
        type: 'run',
        time: '07:00',
        duration: 45,
        completed: true
      }
    ]
  },
  {
    date: '2024-03-16',
    workouts: [
      {
        id: '2',
        title: 'Strength Training',
        type: 'strength',
        time: '18:00',
        duration: 60,
        completed: false
      }
    ]
  }
];

export function TrainingSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE);

  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  const getWorkoutsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedule.find(day => day.date === dateString)?.workouts || [];
  };

  const handleWorkoutComplete = (date: string, workoutId: string) => {
    setSchedule(schedule.map(day => {
      if (day.date === date) {
        return {
          ...day,
          workouts: day.workouts.map(workout => {
            if (workout.id === workoutId) {
              return { ...workout, completed: !workout.completed };
            }
            return workout;
          })
        };
      }
      return day;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Workout
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {daysInWeek.map((date) => {
          const workouts = getWorkoutsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={date.toISOString()}
              className={`border rounded-lg p-4 ${
                isToday ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-sm text-gray-500">
                  {date.toLocaleDateString('default', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className={`p-2 rounded-lg ${
                      workout.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{workout.title}</span>
                      <input
                        type="checkbox"
                        checked={workout.completed}
                        onChange={() => handleWorkoutComplete(date.toISOString().split('T')[0], workout.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-sm">
                      {workout.time} • {workout.duration} min
                    </div>
                  </div>
                ))}
                {workouts.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-4">
                    No workouts
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