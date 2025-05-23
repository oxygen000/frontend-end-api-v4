import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ApiUser } from '../types';

interface ResultsListProps {
  displayedData: ApiUser[];
  getImageUrl: (
    imagePath: string | null | undefined,
    userName: string
  ) => string;
  gridItemVariants: Variants;
  NoResultsFound: React.FC;
  t: (key: string, defaultText?: string) => string;
}

const ResultsList: React.FC<ResultsListProps> = ({
  displayedData,
  getImageUrl,
  gridItemVariants,
  NoResultsFound,
  t,
}) => {
  return (
    <>
      {displayedData.length > 0 ? (
        displayedData.map((user, index) => (
          <motion.div
            key={user.id}
            custom={{ isGrid: false, index }}
            variants={gridItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap="tap"
            layoutId={user.id}
            className="bg-white/20 backdrop-blur-md rounded-lg p-4 border border-white/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-blue-500">
                {user.image_path || user.image_url ? (
                  <img
                    src={getImageUrl(
                      user.image_path || user.image_url,
                      user.name
                    )}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white">
                  {user.name}
                </h3>
                {user.category && (
                  <p className="text-white/70 text-sm">{user.category}</p>
                )}
                {user.department && (
                  <p className="text-white/70 text-sm">{user.department}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-white font-medium">
                  {user.phone_number || 'N/A'}
                </p>
                <p className="text-white/70 text-sm">
                  ID: {user.national_id || user.employee_id || 'N/A'}
                </p>
              </div>
              <Link
                to={`/users/${user.id}`}
                className="ml-4 px-4 py-2 bg-blue-600/70 cursor-pointer hover:bg-blue-700 text-white rounded transition-colors duration-300 flex-shrink-0"
              >
                {t('card.viewDetails', 'View Details')}
              </Link>
            </div>
          </motion.div>
        ))
      ) : (
        <NoResultsFound />
      )}
    </>
  );
};

export default ResultsList;
