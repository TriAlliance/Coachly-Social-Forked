import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Check, X, Move, ZoomIn, ZoomOut, RotateCw, Sparkles } from 'lucide-react';

interface Filter {
  id: string;
  name: string;
  style: React.CSSProperties;
}

const filters: Filter[] = [
  { id: 'normal', name: 'Normal', style: {} },
  { id: 'grayscale', name: 'B&W', style: { filter: 'grayscale(100%)' } },
  { id: 'sepia', name: 'Sepia', style: { filter: 'sepia(100%)' } },
  { id: 'contrast', name: 'Contrast', style: { filter: 'contrast(150%)' } },
  { id: 'bright', name: 'Bright', style: { filter: 'brightness(120%)' } },
  { id: 'warm', name: 'Warm', style: { filter: 'sepia(50%)' } },
  { id: 'cool', name: 'Cool', style: { filter: 'saturate(150%) hue-rotate(30deg)' } },
  { id: 'vintage', name: 'Vintage', style: { filter: 'sepia(50%) contrast(120%)' } }
];

interface ImageEditorProps {
  image: File;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  type: 'avatar' | 'cover';
}

export function ImageEditor({ image, onSave, onCancel, type }: ImageEditorProps) {
  const editorRef = useRef<AvatarEditor | null>(null);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [editMode, setEditMode] = useState<'move' | 'filter'>('move');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsUploading(true);

    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      
      // Apply selected filter
      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = canvas.width;
      filteredCanvas.height = canvas.height;
      const ctx = filteredCanvas.getContext('2d');
      
      if (ctx) {
        ctx.filter = selectedFilter.style.filter || 'none';
        ctx.drawImage(canvas, 0, 0);
        
        // Convert to blob with optimized quality
        const blob = await new Promise<Blob>((resolve) => {
          filteredCanvas.toBlob((blob) => {
            resolve(blob!);
          }, 'image/jpeg', type === 'avatar' ? 0.8 : 0.9);
        });

        onSave(blob);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const dimensions = type === 'avatar' 
    ? { width: 300, height: 300, border: 50, borderRadius: 150 }
    : { width: 800, height: 400, border: 20, borderRadius: 0 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-[900px] w-full m-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Edit {type === 'avatar' ? 'Profile Picture' : 'Cover Image'}
          </h3>
          <p className="text-sm text-gray-500">
            Adjust your image using the controls below
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className={type === 'avatar' ? 'rounded-full overflow-hidden' : 'rounded-lg overflow-hidden'}>
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={dimensions.width}
              height={dimensions.height}
              border={dimensions.border}
              borderRadius={dimensions.borderRadius}
              color={[0, 0, 0, 0.6]}
              scale={scale}
              rotate={rotate}
              style={selectedFilter.style}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode('move')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                editMode === 'move'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Move className="w-4 h-4" />
              <span>Move & Zoom</span>
            </button>
            <button
              onClick={() => setEditMode('filter')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                editMode === 'filter'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Filters */}
          {editMode === 'filter' && (
            <div className="grid grid-cols-4 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    selectedFilter.id === filter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          )}

          {/* Zoom Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setScale(s => Math.max(1, s - 0.1))}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rotate Button */}
          <button
            onClick={() => setRotate(r => r + 90)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full"
          >
            <RotateCw className="w-5 h-5" />
            <span>Rotate 90°</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isUploading ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}