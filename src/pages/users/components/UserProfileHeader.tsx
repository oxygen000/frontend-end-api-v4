import { motion } from 'framer-motion';
import {
  FiMaximize,
  FiCalendar,
  FiAlertCircle,
  FiSearch,
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import type { User } from '../types/types';

interface UserProfileHeaderProps {
  user: User;
  isChildRecord: boolean;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  setImageModalOpen: (open: boolean) => void;
  imageModalOpen: boolean;
  searchedPersonImage?: string | null;
  isSearching?: boolean;
  searchedPersonName?: string;
  setModalDefaultView?: (view: 'user' | 'searched') => void;
}

const UserProfileHeader = ({
  user,
  isChildRecord,
  isRTL,
  t,
  setImageModalOpen,
  searchedPersonImage,
  isSearching = false,
  searchedPersonName,
  setModalDefaultView,
}: UserProfileHeaderProps) => {
  const [imageKey, setImageKey] = useState(Date.now());
  const [cachedSearchedImage, setCachedSearchedImage] = useState<string | null>(
    null
  );

  // Update image key when user image changes to force refresh
  useEffect(() => {
    setImageKey(Date.now());
  }, [user.image_path]);

  // Cache the searched image when it's provided
  useEffect(() => {
    if (searchedPersonImage && isSearching) {
      // Store in sessionStorage for persistence across navigation
      const cacheKey = `searched_image_${user.id}_${Date.now()}`;
      sessionStorage.setItem(cacheKey, searchedPersonImage);
      setCachedSearchedImage(searchedPersonImage);

      // Clean up old cached images
      const allKeys = Object.keys(sessionStorage);
      allKeys.forEach((key) => {
        if (key.startsWith('searched_image_') && key !== cacheKey) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [searchedPersonImage, isSearching, user.id]);

  // Try to retrieve cached image on component mount
  useEffect(() => {
    if (!searchedPersonImage && !cachedSearchedImage) {
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
  }, [user.id, searchedPersonImage, cachedSearchedImage]);

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
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(searchedPersonName || 'مبحوث عنه')}&background=red&v=${Date.now()}`;
  };

  // دالة منفصلة للتعامل مع الصورة المبحوث بها
  const getSearchedImageUrl = (imagePath: string | null | undefined) => {
    // Use cached image if available
    if (cachedSearchedImage) {
      return cachedSearchedImage;
    }

    // If it's already a data URL (base64), return as is
    if (imagePath && imagePath.startsWith('data:')) {
      return imagePath;
    }

    // If it's a regular URL, return as is
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }

    // Fallback to avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(searchedPersonName || 'مبحوث عنه')}&background=dc2626&v=${Date.now()}`;
  };

  // مكون عرض الصورة
  const ImageDisplay = ({
    imagePath,
    userName,
    isSearchedPerson = false,
    showSearchIcon = false,
  }: {
    imagePath?: string | null;
    userName: string;
    isSearchedPerson?: boolean;
    showSearchIcon?: boolean;
  }) => (
    <div
      className={`w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br ${
        isSearchedPerson
          ? 'from-red-500 to-red-700'
          : 'from-blue-500 to-blue-700'
      } rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg border-2 border-white/30 cursor-pointer relative group`}
      onClick={() => {
        if (imagePath) {
          // تحديد نوع العرض حسب نوع الصورة
          if (setModalDefaultView) {
            setModalDefaultView(isSearchedPerson ? 'searched' : 'user');
          }
          setImageModalOpen(true);
        }
      }}
    >
      {showSearchIcon && (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
          <FiSearch className="text-white text-xs" />
        </div>
      )}
      {imagePath && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FiMaximize className="text-white text-lg" />
        </div>
      )}
      {imagePath ? (
        <img
          key={`${userName}-${imageKey}`}
          src={
            isSearchedPerson
              ? getSearchedImageUrl(imagePath)
              : getImageUrl(imagePath, userName)
          }
          alt={userName}
          className="w-full h-full object-cover"
          onError={
            isSearchedPerson ? handleSearchedImageError : handleImageError
          }
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {userName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/30 shadow-lg mb-4 sm:mb-6 ${
        isChildRecord
          ? 'from-amber-500/20 to-amber-500/10'
          : user.form_type == 'disabled'
            ? 'from-purple-500/20 to-purple-500/10'
            : ' '
      }`}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
        {/* عرض الصور */}
        <div className="flex items-center gap-4">
          {/* الصورة الأساسية */}
          <ImageDisplay imagePath={user?.image_path} userName={user.name} />
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {user.name}{' '}
            </h1>
          </div>
          <p className="text-white/70 mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
            {user.department && (
              <span className="bg-blue-500/30 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {user.department}
              </span>
            )}
            {isChildRecord && (
              <span className="bg-amber-500/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {t('users.childRecord', 'Child Record')}
              </span>
            )}
            {user.form_type == 'disabled' && (
              <span className="bg-purple-500/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {t('users.disabledPerson', 'Disabled Person')}
              </span>
            )}
            {user.form_type === 'man' && (
              <span className="bg-blue-600/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {t('users.man', 'Man')}
              </span>
            )}
            {user.form_type === 'woman' && (
              <span className="bg-pink-500/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {t('users.woman', 'Woman')}
              </span>
            )}
          </p>

          <p className="text-white/70 mt-2 flex items-center justify-center md:justify-start text-sm">
            <FiCalendar className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('users.registeredOn', 'Registered on')} {user.created_at}
          </p>
          {user.has_criminal_record === 1 && (
            <div className="w-full flex justify-center md:justify-start mt-3">
              <div
                className={`inline-flex items-center bg-red-500/30 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  isRTL ? 'flex-row-reverse' : 'flex-row'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <FiAlertCircle
                  className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`}
                />
                {t('users.hasCriminalRecord', 'Has Criminal Record')}
              </div>
            </div>
          )}
        </div>
        {/* الصورة المبحوث عنها - تظهر فقط عند البحث */}
        {(isSearching && searchedPersonImage) || cachedSearchedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <ImageDisplay
              imagePath={searchedPersonImage || cachedSearchedImage}
              userName={searchedPersonName || 'مبحوث عنه'}
              isSearchedPerson={true}
              showSearchIcon={true}
            />
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default UserProfileHeader;
