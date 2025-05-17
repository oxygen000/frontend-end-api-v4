import React from 'react';

interface LoadMoreTriggerProps {
  hasMore: boolean;
  loading: boolean;
}

const LoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({ hasMore, loading }) => {
  if (!hasMore) return null;
  
  return (
    <div
      id="load-more-trigger"
      className="h-10 w-full flex justify-center items-center"
    >
      {loading && (
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-300"></div>
      )}
    </div>
  );
};

export default LoadMoreTrigger; 