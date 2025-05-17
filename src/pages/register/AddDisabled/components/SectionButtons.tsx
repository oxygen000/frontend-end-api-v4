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
    <div className="flex justify-between mt-6">
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {t('common.back', 'Previous')}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ml-auto disabled:opacity-50"
        >
          {t('common.next', 'Next')}
        </button>
      )}
    </div>
  );
};

export default SectionButtons;
