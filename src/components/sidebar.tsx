import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';
import { useState } from 'react';
import i18n from 'i18next';
import { FiGlobe } from 'react-icons/fi';
import PopupChoiceAdd from './PopupChoice/PopupChoiceAdd';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, isRTL } = useTranslationWithFallback();
  const [isPopupAddOpen, setIsPopupAddOpen] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageOptions(false);
  };
  const closePopup = () => setIsPopupAddOpen(false);

  const currentLanguage = i18n.language;

  const navigate = useNavigate();
  // Define RTL-specific sidebar variants
  const sidebarVariants = {
    hidden: { x: isRTL ? '100%' : '-100%' },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-gray-800 text-white shadow-lg z-40 md:w-72`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex flex-col h-full p-6 relative">
              {/* Logo / Title */}
              <div className="mb-10">
                <h2
                  className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                >
                   {t('home.title', 'SMART FACE ID POLICE EDITION')}
                </h2>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-4">
                <Link
                  to="/identification"
                  className={`block px-3 py-2 rounded hover:bg-gray-700 transition ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('home.identificationButton', 'Identification Of Unidentified')}
                </Link>
                <Link
                  to="/identification"
                  className={`block px-3 py-2 rounded hover:bg-gray-700 transition ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('home.searchButton', 'Search For Missing Persons')}
                </Link>
                <button
                  onClick={() => setIsPopupAddOpen(true)}
                  className={`block px-3 py-2 rounded w-full hover:bg-gray-700 transition ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('home.addButton', 'Add New Data')}
                </button>
                <Link
                  to="/search"
                  className={`block px-3 py-2 rounded hover:bg-gray-700 transition ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('home.bigDataButton', 'Big Data')}
                </Link>

                {/* Language Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                    className={`flex items-center w-full px-3 py-2 rounded hover:bg-gray-700 transition ${isRTL ? 'text-right justify-between' : 'text-left'}`}
                  >
                    <FiGlobe className={isRTL ? 'ml-2' : 'mr-2'} />
                    {currentLanguage === 'ar' ? 'العربية' : 'English'}
                  </button>

                  {showLanguageOptions && (
                    <div
                      className={`absolute w-full mt-1 bg-gray-700 rounded-md shadow-lg overflow-hidden z-10 ${isRTL ? 'right-0' : 'left-0'}`}
                    >
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 hover:bg-gray-600 transition ${currentLanguage === 'en' ? 'bg-blue-600/40' : ''}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage('ar')}
                        className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 hover:bg-gray-600 transition ${currentLanguage === 'ar' ? 'bg-blue-600/40' : ''}`}
                      >
                        العربية
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Logout Button */}
              <div className="pt-6 border-t border-gray-700">
                <button
                onClick={() => navigate('/login')}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded hover:bg-red-600 transition`}
                >
                  {t('auth.logout', 'Logout')}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
       {/* النوافذ المنبثقة */}
       <PopupChoiceAdd
        isOpen={isPopupAddOpen}
        onClose={closePopup}
        title={t('popups.addTitle', 'Select the type of data to add')}
        cancelText={t('common.cancel', 'cancel')}
      />

    </AnimatePresence>
     

  );
  
}


export default Sidebar;
