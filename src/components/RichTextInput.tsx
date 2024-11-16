import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  type: 'user' | 'hashtag';
  avatar?: string;
}

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onMention?: (username: string) => void;
  onHashtag?: (tag: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextInput({
  value,
  onChange,
  onMention,
  onHashtag,
  placeholder,
  className = '',
}: RichTextInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'hashtag' | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Mock data - In a real app, this would come from your backend
  const mockUsers: Suggestion[] = [
    { id: '1', text: 'JohnRunner', type: 'user' },
    { id: '2', text: 'CyclingPro', type: 'user' },
    { id: '3', text: 'SwimChamp', type: 'user' },
  ];

  const mockTags: Suggestion[] = [
    { id: '1', text: 'running', type: 'hashtag' },
    { id: '2', text: 'cycling', type: 'hashtag' },
    { id: '3', text: 'training', type: 'hashtag' },
  ];

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      setSearchTerm(lastWord.slice(1));
      setSearchType('user');
      showSuggestions(e.target);
    } else if (lastWord.startsWith('#')) {
      setSearchTerm(lastWord.slice(1));
      setSearchType('hashtag');
      showSuggestions(e.target);
    } else {
      setSuggestions([]);
      setSearchType(null);
    }
  };

  const showSuggestions = (input: HTMLTextAreaElement) => {
    const { selectionStart } = input;
    const rect = input.getBoundingClientRect();
    const position = getCaretCoordinates(input, selectionStart);
    
    setCursorPosition({
      top: rect.top + position.top - input.scrollTop,
      left: rect.left + position.left,
    });
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!inputRef.current) return;

    const cursorPos = inputRef.current.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPos);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];
    const textAfterCursor = value.slice(cursorPos);

    const prefix = textBeforeCursor.slice(0, -lastWord.length);
    const newText = `${prefix}${suggestion.type === 'user' ? '@' : '#'}${suggestion.text} ${textAfterCursor}`;
    
    onChange(newText);
    setSuggestions([]);
    setSearchType(null);

    if (suggestion.type === 'user') {
      onMention?.(suggestion.text);
    } else {
      onHashtag?.(suggestion.text);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const filtered = searchType === 'user'
      ? mockUsers.filter(user => 
          user.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : mockTags.filter(tag =>
          tag.text.toLowerCase().includes(searchTerm.toLowerCase())
        );

    setSuggestions(filtered);
  }, [searchTerm, searchType]);

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
      
      {suggestions.length > 0 && (
        <div
          className="absolute z-10 bg-white rounded-lg shadow-lg border mt-1 max-h-48 overflow-y-auto"
          style={{
            top: cursorPosition.top + 20,
            left: cursorPosition.left,
          }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              {suggestion.type === 'user' ? (
                <>
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.text}`}
                    alt={suggestion.text}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>@{suggestion.text}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>#{suggestion.text}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to get caret coordinates
function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
  const { offsetLeft: elementLeft, offsetTop: elementTop } = element;
  const div = document.createElement('div');
  const styles = getComputedStyle(element);
  
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.font = styles.font;
  div.style.padding = styles.padding;
  div.style.width = styles.width;
  
  const text = element.value.slice(0, position);
  div.textContent = text;
  
  document.body.appendChild(div);
  const coordinates = {
    top: div.offsetHeight + elementTop,
    left: div.offsetWidth + elementLeft,
  };
  document.body.removeChild(div);
  
  return coordinates;
}