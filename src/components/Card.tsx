import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';

// Define the User type for props
interface User {
  id: string;
  full_name: string;
  name: string;
  nickname?: string; 
  department?: string;
  role?: string;
  image_path?: string;
  image_url?: string;
  created_at?: string;
  form_type?: string;
  category?: string;
  phone_number?: string;
  national_id?: string;
  address?: string;


}

interface CardProps {
  user: User;
}

const Card: React.FC<CardProps> = ({ user }) => {
  const { t, isRTL } = useTranslationWithFallback();
  const [imageKey, setImageKey] = useState(Date.now());

  // Update image key when user image changes to force refresh
  useEffect(() => {
    setImageKey(Date.now());
  }, [user.image_path, user.image_url]);

  const getImageUrl = () => {
    if (user.image_path) {
      // Check if image_path already contains the full URL
      if (user.image_path.startsWith('http')) {
        // Add cache-busting parameter
        const separator = user.image_path.includes('?') ? '&' : '?';
        return `${user.image_path}${separator}v=${imageKey}`;
      }

      // If image_path doesn't contain 'uploads/' prefix, add it
      const imagePath = user.image_path.includes('uploads/')
        ? user.image_path
        : `uploads/${user.image_path}`;

      // Ensure we don't have double slashes in the URL and add cache-busting
      return `https://backend-fast-api-ai.fly.dev/${imagePath.replace(/^\/?/, '')}?v=${imageKey}`;
    }
    if (user.image_url) {
      // Add cache-busting parameter
      const separator = user.image_url.includes('?') ? '&' : '?';
      return `${user.image_url}${separator}v=${imageKey}`;
    }
    // Return default avatar based on user name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&v=${imageKey}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Generate new fallback URL with cache-busting
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&v=${Date.now()}`;
  };

  return (
    <div
      className="bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 w-full border border-white/30 hover:shadow-xl transition-all duration-300 hover:bg-white/30"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
        <img
          key={`${user.id}-${imageKey}`}
          src={getImageUrl()}
          alt={user.full_name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">{user.full_name}</h3>
        {user.nickname && (
          <p className="text-white/70 text-sm mt-1">({user.nickname})</p>
        )}
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-white/70">{t('card.Number', 'Number:')}</p>
          <p className="font-bold text-white">
              {user.phone_number || t('card.notAvailable', 'N/A')}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-white/70">{t('card.id', 'ID:')}</p>
          <p className="font-bold text-white">
            {user.national_id || t('card.notAvailable', 'N/A')}
          </p>
        </div>

        {user.address && (
          <div className="flex justify-between items-center">
            <p className="text-white/70">{t('card.address', 'Address:')}</p>
            <p className="font-bold text-white text-right">{user.address}</p>
          </div>
        )}
      </div>

      <Link
        to={`/users/${user.id}`}
        className="w-full mt-4 py-2 text-center bg-blue-600/70 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
      >
        {t('card.viewDetails', 'View Details')}
      </Link>
    </div>
  );
};

export default Card;