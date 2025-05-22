import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  successVariants,
  successAnimationStyles,
  transition,
  customAnimationConfig,
} from '../config/animations';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';

interface SuccessAnimationProps {
  title?: string;
  message?: string;
  subtitle?: string;
  id?: string | null;
  idLabel?: string;
  idNote?: string;
  redirectPath?: string;
  redirectTimeout?: number;
}

/**
 * A reusable success animation component for form submission
 * Uses consistent styling and animations across all forms
 */
const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title,
  message,
  subtitle,
  id = null,
  idLabel,
  idNote,
  redirectPath,
  redirectTimeout = 5000,
}) => {
  const { t, isRTL } = useTranslationWithFallback();
  const [progress, setProgress] = useState(0);

  // Handle redirection if path is provided
  useEffect(() => {
    if (redirectPath) {
      const timer = setTimeout(() => {
        window.location.href = redirectPath;
      }, redirectTimeout);

      return () => clearTimeout(timer);
    }
  }, [redirectPath, redirectTimeout]);

  // Animate progress bar
  useEffect(() => {
    if (redirectPath) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / (redirectTimeout / 100);
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [redirectPath, redirectTimeout]);

  // Use translations or fallback to props
  const translatedTitle =
    title || t('common:registrationSuccess', 'Registration Successful!');
  const translatedMessage =
    message ||
    t(
      'common:successMessage',
      'The information has been recorded successfully.'
    );
  const translatedSubtitle =
    subtitle ||
    t('common:startingNewRegistration', 'Starting new registration in a moment...');
  const translatedIdLabel =
    idLabel || t('common:registrationId', 'Registration ID:');
  const translatedIdNote =
    idNote ||
    t('common:saveIdNote', 'Please save this ID for future reference');

  // Icon animation variants
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.3, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { delay: 0.3, duration: 0.2 },
      },
    },
  };

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.2, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { delay: 0.2, duration: 0.2 },
      },
    },
  };

  return (
    <motion.div
      variants={successVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className={successAnimationStyles.container}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        className={successAnimationStyles.icon.wrapper}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={customAnimationConfig.spring}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-12 w-12 ${successAnimationStyles.icon.color}`}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M30 52.5L45 67.5L70 37.5"
            strokeWidth="6"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </motion.div>

      <motion.h3
        className={successAnimationStyles.title}
        variants={customAnimationConfig.delayedAppearance(0.5)}
        initial="hidden"
        animate="visible"
      >
        {translatedTitle}
      </motion.h3>

      <motion.p
        className={successAnimationStyles.message}
        variants={customAnimationConfig.delayedAppearance(0.7)}
        initial="hidden"
        animate="visible"
      >
        {translatedMessage}
      </motion.p>

      <div className={successAnimationStyles.progressBar.container}>
        <motion.div
          className={successAnimationStyles.progressBar.indicator}
          initial={{ width: 0 }}
          animate={{ width: redirectPath ? `${progress}%` : '100%' }}
          transition={
            redirectPath ? { duration: 0 } : { duration: 3, ease: 'linear' }
          }
        />
      </div>

      <motion.p
        className={successAnimationStyles.subtitle}
        variants={customAnimationConfig.delayedAppearance(0.9)}
        initial="hidden"
        animate="visible"
      >
        {translatedSubtitle}
      </motion.p>

      {id && (
        <motion.div
          className={successAnimationStyles.idContainer}
          variants={customAnimationConfig.delayedAppearance(1.1)}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <p className={successAnimationStyles.idTitle}>
              {translatedIdLabel}
            </p>
          </div>
          <p className={successAnimationStyles.idValue}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.3,
                staggerChildren: 0.05,
                delayChildren: 1.3,
              }}
              className="inline-block bg-white/10 px-3 py-1.5 rounded-lg border border-white/20"
            >
              {id}
            </motion.span>
          </p>
          <p className={successAnimationStyles.idNote}>{translatedIdNote}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SuccessAnimation;
