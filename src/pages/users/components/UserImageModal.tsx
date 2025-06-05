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
  searchedPersonImage?: string | null;
  isSearching?: boolean;
  searchedPersonName?: string;
  defaultView?: 'user' | 'searched'; // تحديد الصورة المراد عرضها أولاً
  isRTL?: boolean; // دعم اللغة العربية
}

const UserImageModal = ({
  user,
  isChildRecord,
  t,
  imageModalOpen,
  setImageModalOpen,
  searchedPersonImage,
  isSearching,
  searchedPersonName,
  defaultView = 'user',
  isRTL = false,
}: UserImageModalProps) => {
  const [imageKey, setImageKey] = useState(Date.now());
  const [cachedSearchedImage, setCachedSearchedImage] = useState<string | null>(
    null
  );
  const [activeView, setActiveView] = useState<'user' | 'searched'>(
    defaultView
  );

  // Update image key when user image changes to force refresh
  useEffect(() => {
    setImageKey(Date.now());
  }, [user.image_path]);

  // Reset activeView when modal opens with a specific defaultView
  useEffect(() => {
    if (imageModalOpen) {
      setActiveView(defaultView);
    }
  }, [imageModalOpen, defaultView]);

  // Cache the searched image and retrieve from sessionStorage
  useEffect(() => {
    if (searchedPersonImage && isSearching) {
      setCachedSearchedImage(searchedPersonImage);
    } else {
      // Try to retrieve from sessionStorage
      const allKeys = Object.keys(sessionStorage);
      const userImageKey = allKeys.find((key) =>
        key.startsWith(`searched_image_${user.id}_`)
      );

      if (userImageKey) {
        const cachedImage = sessionStorage.getItem(userImageKey);
        if (cachedImage) {
          setCachedSearchedImage(cachedImage);
        }
      }
    }
  }, [searchedPersonImage, isSearching, user.id]);

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

  const handleSearchedImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(searchedPersonName || 'مبحوث عنه')}&background=dc2626&v=${Date.now()}`;
  };

  // دالة للتعامل مع الصورة المبحوث بها
  const getSearchedImageUrl = () => {
    if (cachedSearchedImage) {
      return cachedSearchedImage;
    }

    if (searchedPersonImage && searchedPersonImage.startsWith('data:')) {
      return searchedPersonImage;
    }

    if (searchedPersonImage && searchedPersonImage.startsWith('http')) {
      return searchedPersonImage;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(searchedPersonName || 'مبحوث عنه')}&background=dc2626&v=${Date.now()}`;
  };

  const hasSearchedImage = Boolean(searchedPersonImage || cachedSearchedImage);

  return (
    <AnimatePresence>
      {imageModalOpen && (user?.image_path || hasSearchedImage) && (
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
            className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg bg-white/10 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* زر الإغلاق */}
            <div
              className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-10`}
            >
              <button
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={() => setImageModalOpen(false)}
                aria-label={
                  isChildRecord ? t('forms.child.close') : t('common.cancel')
                }
              >
                <FiX size={24} />
              </button>
            </div>

            {/* أزرار التبديل بين الصور - في المنتصف */}
            {hasSearchedImage && user?.image_path && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                <div
                  className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeView === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setActiveView('user')}
                  >
                    {t('users.registeredImage', 'الصورة المسجلة')}
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeView === 'searched'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setActiveView('searched')}
                  >
                    {t('users.searchedImage', 'الصورة المبحوث بها')}
                  </button>
                </div>
              </div>
            )}

            {/* عرض الصورة */}
            <div className="flex items-center justify-center min-h-[70vh]">
              {activeView === 'user' && user?.image_path ? (
                <img
                  key={`${user.id}-modal-${imageKey}`}
                  src={getImageUrl(user.image_path, user.name)}
                  alt={user.name}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                  onError={handleImageError}
                />
              ) : activeView === 'searched' && hasSearchedImage ? (
                <img
                  key={`searched-modal-${imageKey}`}
                  src={getSearchedImageUrl()}
                  alt={searchedPersonName || ' '}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg border-2 border-red-500/50"
                  onError={handleSearchedImageError}
                />
              ) : null}
            </div>

            {/* معلومات الصورة */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
              <div
                className={`text-center ${isRTL ? 'font-arabic' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="font-medium text-lg">
                  {activeView === 'user'
                    ? user.name
                    : searchedPersonName || ' '}



                </div>

                <div className="text-sm opacity-70 mt-1">
                  {activeView === 'user'
                    ? t('users.registeredImage', 'الصورة المسجلة')
                    : t('users.searchedImage', 'الصورة المبحوث بها')}
                  {isChildRecord && activeView === 'user' && (
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                      {t('forms.child.viewImage')}
                    </span>
                  )}
                </div>

                {/* معلومات إضافية للأطفال المفقودين */}
                {user.missing_person_phone && activeView === 'user' && (
                  <div
                    className={`text-center mt-2 flex items-center justify-center text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span>
                      {t(
                        'users.missing_person_phone',
                        "Missing Person's Phone"
                      )}
                      : {user.missing_person_phone}
                    </span>
                  </div>
                )}

                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserImageModal;
