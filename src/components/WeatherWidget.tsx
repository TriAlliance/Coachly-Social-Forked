import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<Weather>({
    temp: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12
  });

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Weather</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Sun className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{weather.temp}°C</div>
          <div className="text-gray-600">{weather.condition}</div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <Cloud className="w-4 h-4 mx-auto mb-1" />
              {weather.humidity}% Humidity
            </div>
            <div>
              <Wind className="w-4 h-4 mx-auto mb-1" />
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}