import { useTranslation } from 'react-i18next';

/**
 * A hook that extends react-i18next's useTranslation to provide missing translation indicators
 * in development environment and handle multiple namespaces
 */
export const useTranslationWithFallback = (ns?: string | string[]) => {
  const { t, i18n, ready } = useTranslation(ns);

  // Enhanced translation function with missing translation indicator
  const translate = (key: string, options?: any): string => {
    // If the key contains a namespace prefix (e.g., 'common:back'), use it directly
    const translation = t(key, { ...options, defaultValue: null });

    if (process.env.NODE_ENV === 'development' && translation === key) {
      console.warn(`Missing translation for key: ${key}`);
      return t('errors:missingTranslation', { key, ...options }) as string;
    }

    return translation as string;
  };

  return {
    t: translate,
    i18n,
    ready,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    isRTL: i18n.dir() === 'rtl',
  };
};

export default useTranslationWithFallback;
