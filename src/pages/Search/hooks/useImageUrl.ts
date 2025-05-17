import { useMemo } from 'react';

export const useImageUrl = () => {
  return useMemo(() => {
    return (imagePath: string | null | undefined, userName: string) => {
      if (!imagePath) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
      }

      // Check if image_path already contains the full URL
      if (imagePath.startsWith('http')) {
        return imagePath;
      }

      // If image_path doesn't contain 'uploads/' prefix, add it
      const formattedPath = imagePath.includes('uploads/')
        ? imagePath
        : `uploads/${imagePath}`;

      return `https://backend-fast-api-ai.fly.dev/${formattedPath.replace(/^\//, '')}`;
    };
  }, []);
};

export default useImageUrl;
