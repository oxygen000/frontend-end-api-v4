import React from 'react';

interface ErrorDisplayProps {
  error: string;
  handleRefresh: () => void;
  refreshing: boolean;
  t: (key: string, fallback: string) => string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  handleRefresh,
  refreshing,
  t,
}) => {
  return (
    <div className="p-6 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded flex items-center mx-auto ${refreshing ? 'opacity-75' : ''}`}
        >
          {refreshing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {t('retrying', 'Retrying...')}
            </>
          ) : (
            t('common:retry', 'Retry')
          )}
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
