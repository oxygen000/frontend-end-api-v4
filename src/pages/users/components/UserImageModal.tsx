import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiPhone } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import type { User } from '../types/types';

interface UserImageModalProps {
  user: User;
  isChildRecord: boolean;
  t: (key: string, defaultText?: string) => string;
  imageModalOpen: boolean;
  setImageModalOpen: (open: boolean) => void;
}

const UserImageModal = ({
  user,
  isChildRecord,
  t,
  imageModalOpen,
  setImageModalOpen,
}: UserImageModalProps) => {
  const [imageKey, setImageKey] = useState(Date.now());

  // Update image key when user image changes to force refresh
  useEffect(() => {
    setImageKey(Date.now());
  }, [user.image_path]);

  const getImageUrl = (
    imagePath: string | null | undefined,
    userName: string
  ) => {
    if (!imagePath) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&v=${imageKey}`;
    }
    if (imagePath.startsWith('http')) {
      // Add cache-busting parameter
      const separator = imagePath.includes('?') ? '&' : '?';
      return `${imagePath}${separator}v=${imageKey}`;
    }
    const formattedPath = imagePath.includes('uploads/')
      ? imagePath
      : `uploads/${imagePath}`;
    return `https://backend-fast-api-ai.fly.dev/${formattedPath.replace(/^\/?/, '')}?v=${imageKey}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&v=${Date.now()}`;
  };

  return (
    <AnimatePresence>
      {imageModalOpen && user?.image_path && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={() => setImageModalOpen(false)}
              aria-label={
                isChildRecord ? t('forms.child.close') : t('common.cancel')
              }
            >
              <FiX size={24} />
            </button>
            <img
              key={`${user.id}-modal-${imageKey}`}
              src={getImageUrl(user.image_path, user.name)}
              alt={user.name}
              className="max-h-[85vh] max-w-full object-contain"
              onError={handleImageError}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
              <div className="text-center">
                {user.name}
                {isChildRecord && (
                  <span className="ml-2 text-sm opacity-70">
                    {t('forms.child.viewImage')}
                  </span>
                )}
              </div>
              {user.missing_person_phone && (
                <div className="text-center mt-1 flex items-center justify-center">
                  <FiPhone className="mr-2" />
                  <span>
                    {t('users.missing_person_phone', "Missing Person's Phone")}:{' '}
                    {user.missing_person_phone}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserImageModal;
