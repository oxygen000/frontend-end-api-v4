import React from 'react';

interface NoResultsFoundProps {
  t: (key: string, fallback: string) => string;
}

const NoResultsFound: React.FC<NoResultsFoundProps> = ({ t }) => {
  return (
    <div className="text-center py-10 text-white">
      <svg
        className="mx-auto h-12 w-12 text-white/50"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="mt-4 text-xl">No results found</p>
      <p className="text-white/70">
        {t('search.tryDifferent', 'Try a different search term or adjust filters')}
      </p>
    </div>
  );
};

export default NoResultsFound; 