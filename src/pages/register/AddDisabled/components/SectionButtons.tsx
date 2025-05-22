import React from 'react';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface SectionButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  loading?: boolean;
}

const SectionButtons: React.FC<SectionButtonsProps> = ({
  onPrev,
  onNext,
  loading = false,
}) => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="flex justify-between mt-8">
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="inline-flex items-center px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          {t('common.back', 'Previous')}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ml-auto disabled:opacity-60 text-sm font-medium shadow-lg shadow-purple-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {t('common.next', 'Next')}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 ml-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SectionButtons;
