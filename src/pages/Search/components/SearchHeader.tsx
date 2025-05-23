import React from 'react';

interface SearchHeaderProps {
  t: (key: string, fallback: string) => string;
  handleRefresh: () => void;
  refreshing: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  t,
  handleRefresh,
  refreshing,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {t('title', 'All Registered Users')}
        </h2>
        <p className="text-white/70 mt-1">
          {t(
            'subtitle',
            'View and search through all registered profiles in the system'
          )}
        </p>
      </div>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={`px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${refreshing ? 'opacity-75' : ''}`}
      >
        {refreshing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            {t('refreshingText', 'Refreshing...')}
          </>
        ) : (
          t('refresh', 'Refresh')
        )}
      </button>
    </div>
  );
};

export default SearchHeader;
