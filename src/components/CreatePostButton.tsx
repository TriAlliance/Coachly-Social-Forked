import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';

export function CreatePostButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Create Post</span>
      </button>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}