import { useState } from 'react';
import { uploadProfileImage } from '../services/storage';

interface UseProfileImageReturn {
  uploading: boolean;
  error: string | null;
  uploadImage: (file: File, type: 'avatar' | 'cover') => Promise<string>;
}

export function useProfileImage(): UseProfileImageReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, type: 'avatar' | 'cover'): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      const url = await uploadProfileImage(file, type);
      return url;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload image';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadImage };
}