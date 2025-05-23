import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the namespaces for our split translation files
const namespaces = [
  'common',
  'forms/child',
  'forms/disabled',
  'forms/man',
  'forms/woman',
  'forms/missing-person',
  'auth',
  'search',
  'validation',
  'errors',
];

// Configure i18next
i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    lng: 'en',
    fallbackLng: 'en',

    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Load all namespaces by default
    ns: namespaces,
    defaultNS: 'common',
    fallbackNS: 'common',

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // Language detection settings
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    // Backend settings
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // React settings
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },

    // Performance optimization
    load: 'languageOnly', // Only load language, not region
    preload: ['en', 'ar'], // Preload these languages
    partialBundledLanguages: true, // Allow partial loading of languages
  })
  .then(() => {
    // Set document direction based on current language
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Add language change listener
    i18n.on('languageChanged', (lng) => {
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    });
  });

export default i18n;
