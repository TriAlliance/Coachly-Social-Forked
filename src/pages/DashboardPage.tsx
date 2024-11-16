import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, Plus } from 'lucide-react';
import { Statistics } from '../components/Statistics';
import { ProgressTracking } from '../components/ProgressTracking';
import { WeatherWidget } from '../components/WeatherWidget';
import { TrainingCalendar } from '../components/TrainingCalendar';
import { GoalTracker } from '../components/GoalTracker';
import { GarminWidget } from '../components/garmin/GarminWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  title: string;
  component: React.ComponentType;
  minW: number;
  minH: number;
  defaultW: number;
  defaultH: number;
}

const availableWidgets: Widget[] = [
  { id: 'statistics', title: 'Statistics', component: Statistics, minW: 2, minH: 2, defaultW: 2, defaultH: 2 },
  { id: 'progress', title: 'Progress', component: ProgressTracking, minW: 2, minH: 2, defaultW: 2, defaultH: 2 },
  { id: 'weather', title: 'Weather', component: WeatherWidget, minW: 1, minH: 2, defaultW: 1, defaultH: 2 },
  { id: 'calendar', title: 'Training Calendar', component: TrainingCalendar, minW: 2, minH: 3, defaultW: 2, defaultH: 3 },
  { id: 'goals', title: 'Goal Tracker', component: GoalTracker, minW: 1, minH: 2, defaultW: 1, defaultH: 2 },
  { id: 'garmin', title: 'Garmin Connect', component: GarminWidget, minW: 2, minH: 2, defaultW: 2, defaultH: 2 }
];

const defaultLayouts = {
  lg: [
    { i: 'statistics', x: 0, y: 0, w: 2, h: 2 },
    { i: 'progress', x: 2, y: 0, w: 2, h: 2 },
    { i: 'weather', x: 4, y: 0, w: 1, h: 2 },
    { i: 'calendar', x: 0, y: 2, w: 2, h: 3 },
    { i: 'goals', x: 2, y: 2, w: 1, h: 2 },
    { i: 'garmin', x: 3, y: 2, w: 2, h: 2 }
  ],
  md: [
    { i: 'statistics', x: 0, y: 0, w: 2, h: 2 },
    { i: 'progress', x: 2, y: 0, w: 2, h: 2 },
    { i: 'weather', x: 0, y: 2, w: 1, h: 2 },
    { i: 'calendar', x: 1, y: 2, w: 2, h: 3 },
    { i: 'goals', x: 0, y: 5, w: 1, h: 2 },
    { i: 'garmin', x: 1, y: 5, w: 2, h: 2 }
  ],
  sm: [
    { i: 'statistics', x: 0, y: 0, w: 2, h: 2 },
    { i: 'progress', x: 0, y: 2, w: 2, h: 2 },
    { i: 'weather', x: 0, y: 4, w: 1, h: 2 },
    { i: 'calendar', x: 0, y: 6, w: 2, h: 3 },
    { i: 'goals', x: 0, y: 9, w: 1, h: 2 },
    { i: 'garmin', x: 0, y: 11, w: 2, h: 2 }
  ]
};

export function DashboardPage() {
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
  });

  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(() => {
    const savedWidgets = localStorage.getItem('enabledWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : availableWidgets.map(w => w.id);
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
      localStorage.setItem('enabledWidgets', JSON.stringify(enabledWidgets));
    }
  }, [layouts, enabledWidgets, mounted]);

  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const toggleWidget = (widgetId: string) => {
    setEnabledWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else {
        const widget = availableWidgets.find(w => w.id === widgetId);
        if (!widget) return prev;

        const lgLayout = layouts.lg || [];
        let maxY = 0;
        lgLayout.forEach(item => {
          const itemBottom = item.y + item.h;
          if (itemBottom > maxY) maxY = itemBottom;
        });

        const newLayouts = {
          lg: [
            ...layouts.lg.filter(l => l.i !== widgetId),
            { i: widgetId, x: 0, y: maxY, w: widget.defaultW, h: widget.defaultH }
          ],
          md: [
            ...layouts.md.filter(l => l.i !== widgetId),
            { i: widgetId, x: 0, y: maxY, w: widget.defaultW, h: widget.defaultH }
          ],
          sm: [
            ...layouts.sm.filter(l => l.i !== widgetId),
            { i: widgetId, x: 0, y: maxY, w: widget.defaultW, h: widget.defaultH }
          ]
        };
        setLayouts(newLayouts);
        return [...prev, widgetId];
      }
    });
  };

  if (!mounted) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isCustomizing
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          {isCustomizing ? 'Done' : 'Customize'}
        </button>
      </div>

      {isCustomizing && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Customize Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {availableWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  enabledWidgets.includes(widget.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus className={`w-4 h-4 ${
                  enabledWidgets.includes(widget.id) ? 'rotate-45' : ''
                } transition-transform`} />
                <span>{widget.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 6, md: 4, sm: 2 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        isDraggable={isCustomizing}
        isResizable={isCustomizing}
        draggableHandle=".widget-handle"
        margin={[16, 16]}
      >
        {availableWidgets
          .filter(widget => enabledWidgets.includes(widget.id))
          .map(widget => {
            const Widget = widget.component;
            const layout = layouts.lg.find(l => l.i === widget.id);
            
            if (!layout) return null;

            return (
              <div
                key={widget.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                data-grid={{
                  x: layout.x,
                  y: layout.y,
                  w: layout.w,
                  h: layout.h,
                  minW: widget.minW,
                  minH: widget.minH
                }}
              >
                {isCustomizing && (
                  <div className="widget-handle bg-gray-50 p-2 cursor-move border-b flex items-center justify-between">
                    <span className="text-sm font-medium">{widget.title}</span>
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                )}
                <div className="p-4 h-[calc(100%-3rem)]">
                  <Widget />
                </div>
              </div>
            );
          })}
      </ResponsiveGridLayout>
    </div>
  );
}