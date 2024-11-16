import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { searchLocation } from '../config/mapbox';
import debounce from 'lodash/debounce';

interface LocationSearchProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  id: string;
  text: string;
  coordinates: [number, number];
  place_name: string;
}

export function LocationSearch({ onSelect, placeholder = 'Search location...', className = '' }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!searchQuery) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchLocation(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSelect({
      lat: suggestion.coordinates[1],
      lng: suggestion.coordinates[0],
      address: suggestion.place_name
    });
    setQuery(suggestion.place_name);
    setSuggestions([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <div className="font-medium">{suggestion.text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}