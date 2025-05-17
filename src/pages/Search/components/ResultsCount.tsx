import React from 'react';

interface ResultsCountProps {
  count: number;
  t: (key: string, fallback: string) => string;
}

const ResultsCount: React.FC<ResultsCountProps> = ({ count, t }) => {
  return (
    <div className="mb-4 text-white/70">
      {t('search.found', 'Found')}{' '}
      <span className="font-medium text-white">
        {count}
      </span>{' '}
      {count === 1
        ? t('search.userSingular', 'user')
        : t('search.userPlural', 'users')}
    </div>
  );
};

export default ResultsCount; 