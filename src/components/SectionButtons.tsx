import React from 'react';
import { motion } from 'framer-motion';
import { buttonHoverAnimation, transition } from '../config/animations';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';

interface SectionButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  isSubmit?: boolean;
}

/**
 * Reusable component for section navigation buttons in multi-step forms
 * with consistent design across all registration forms
 */
const SectionButtons: React.FC<SectionButtonsProps> = ({
  onPrev,
  onNext,
  isSubmitting = false,
  prevLabel,
  nextLabel,
  submitLabel,
  isSubmit = false,
}) => {
  const { t } = useTranslationWithFallback();
  
  return (
    <div className="flex justify-between mt-6 sm:mt-8 gap-4">
      {onPrev && (
        <motion.button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          whileHover={buttonHoverAnimation}
          whileTap={{ scale: 0.98 }}
          transition={transition}
          className="px-5 sm:px-7 py-2 sm:py-2.5 
                    bg-white/10 hover:bg-white/20 
                    text-white rounded-xl 
                    transition-all duration-200 
                    border border-white/20 hover:border-white/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-sm sm:text-base font-medium
                    backdrop-blur-sm shadow-sm"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {prevLabel || t('common.back', 'Back')}
          </span>
        </motion.button>
      )}
      
      {onNext && (
        <motion.button
          type={isSubmit ? "submit" : "button"}
          onClick={isSubmit ? undefined : onNext}
          disabled={isSubmitting}
          whileHover={buttonHoverAnimation}
          whileTap={{ scale: 0.98 }}
          transition={transition}
          className="px-5 sm:px-7 py-2 sm:py-2.5 
                    bg-gradient-to-r from-pink-500 to-purple-600 
                    hover:from-pink-600 hover:to-purple-700
                    text-white rounded-xl 
                    transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-sm sm:text-base font-medium
                    ml-auto shadow-md shadow-pink-500/20
                    flex items-center justify-center min-w-[100px]"
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isSubmit ? (
            <span className="flex items-center">
              {submitLabel || t('common:submit', 'Submit')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          ) : (
            <span className="flex items-center">
              {nextLabel || t('common.next', 'Next')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default SectionButtons;
