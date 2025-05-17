import React from 'react';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface SectionButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

const SectionButtons: React.FC<SectionButtonsProps> = ({
  onPrev,
  onNext,
  isSubmitting = false,
}) => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="flex justify-between mt-4 sm:mt-6">
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
        >
          {t('common.back')}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="px-4 sm:px-6 py-1.5 sm:py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors ml-auto disabled:opacity-50 text-sm sm:text-base"
        >
          {t('common.next')}
        </button>
      )}
    </div>
  );
};

export default SectionButtons;
