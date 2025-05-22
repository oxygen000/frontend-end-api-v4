import React from 'react';
import { motion } from 'framer-motion';
import { errorVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface FormErrorDisplayProps {
  errors: string[];
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ errors }) => {
  const { t } = useTranslationWithFallback();

  if (!errors.length) return null;

  return (
    <motion.div
      variants={errorVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4"
    >
      <h4 className="text-red-400 font-medium mb-2">
        {t('form.errors.title', 'Please fix the following errors:')}
      </h4>
      <ul className="list-disc list-inside space-y-1 text-red-300">
        {errors.map((error, index) => (
          <li key={index}>{t(`form.errors.${error}`, error)}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FormErrorDisplay;
