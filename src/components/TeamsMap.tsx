import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../config/mapbox';

interface Team {
  id: string;
  name: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

interface TeamsMapProps {
  teams: Team[];
  onTeamSelect?: (team: Team) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function TeamsMap({ 
  teams,
  onTeamSelect,
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 11
}: TeamsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: [center.lng, center.lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when teams change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for teams with locations
    teams.forEach(team => {
      if (!team.coordinates) return;

      const { lat, lng } = team.coordinates;
      if (!lat || !lng) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer transform transition-transform hover:scale-110';
      el.innerHTML = '🏃';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${team.name}</h3>
          <p class="text-sm text-gray-600">${team.location || ''}</p>
        </div>
      `);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        if (onTeamSelect) {
          onTeamSelect(team);
        }
      });

      markers.current.push(marker);
    });
  }, [teams, onTeamSelect]);

  // Update center when it changes
  useEffect(() => {
    if (!map.current || !center) return;
    map.current.setCenter([center.lng, center.lat]);
  }, [center]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[400px] rounded-lg overflow-hidden shadow-md"
    />
  );
}