import { useState } from 'react';
import { motion } from 'framer-motion';
import PopupChoiceAdd from '../../components/PopupChoice/PopupChoiceAdd';
import PopupChoiceIdentification from '../../components/PopupChoice/PopupChoiceIdentification';
import PopupChoiceSearch from '../../components/PopupChoice/PopupChoiceSearch';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';
import { Link } from 'react-router-dom';

function Home() {
  const { t } = useTranslationWithFallback();

  const [isPopupAddOpen, setIsPopupAddOpen] = useState(false);
  const [isPopupSearchOpen, setIsPopupSearchOpen] = useState(false);
  const [isPopupIdentificationOpen, setIsPopupIdentificationOpen] =
    useState(false);

  const openPopup = () => setIsPopupAddOpen(true);
  const closePopup = () => setIsPopupAddOpen(false);
  const openPopupSearch = () => setIsPopupSearchOpen(true);
  const closePopupSearch = () => setIsPopupSearchOpen(false);
  const openPopupIdentification = () => setIsPopupIdentificationOpen(true);
  const closePopupIdentification = () => setIsPopupIdentificationOpen(false);

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  };

  const buttons = [
    {
      id: 1,
      onClick: openPopupIdentification,
      label: t('home.identificationButton'),
    },
    {
      id: 2,
      onClick: openPopupSearch,
      label: t('home.searchButton'),
    },
    {
      id: 3,
      label: t('home.bigDataButton'),
      isLink: true,
      linkTo: '/search',
    },
    {
      id: 4,
      onClick: openPopup,
      label: t('home.addButton'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        className="text-center mb-12"
        initial="initial"
        animate="animate"
        variants={titleVariants}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          {t('home.title')}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {buttons.map(({ id, onClick, label, isLink, linkTo }, index) => {
          const isRTL = document.dir === 'rtl'; // أو استخدم i18n.language === 'ar'
          return (
            <motion.div
              key={id}
              className="relative flex flex-col items-center"
              initial="initial"
              animate="animate"
              variants={buttonVariants}
              transition={{ duration: 0.5, delay: (id - 1) * 0.2 }}
            >
              {/* الدائرة */}
              <div className="bg-white w-16 h-16 flex justify-center items-center rounded-full border-2 border-gray-800 z-10 mb-4">
                <span className="text-2xl font-semibold text-gray-800">
                  {id}
                </span>
              </div>

              {/* الزر أو الرابط */}
              {isLink ? (
                <Link
                  to={linkTo}
                  className="px-8 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300 w-64"
                >
                  {label}
                </Link>
              ) : (
                <motion.button
                  onClick={onClick}
                  className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300 w-48"
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  {label}
                </motion.button>
              )}

              {/* الخط العمودي أسفل الزر للشاشات الصغيرة */}
              {id < 4 && (
                <motion.div
                  className="w-1 h-10 bg-white mt-4 rounded block sm:hidden"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.4, delay: id * 0.2 }}
                />
              )}

              {/* الخط الأفقي بين الأعمدة للشاشات الكبيرة */}
              {index < buttons.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-8 w-full h-1 bg-white z-0"
                  style={{
                    [isRTL ? 'left' : 'right']: '-50%',
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4, delay: id * 0.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* النوافذ المنبثقة */}
      <PopupChoiceAdd
        isOpen={isPopupAddOpen}
        onClose={closePopup}
        title={t('popups.addTitle')}
        cancelText={t('common.cancel')}
      />

      <PopupChoiceIdentification
        isOpen={isPopupIdentificationOpen}
        onClose={closePopupIdentification}
        title={t('popups.identificationTitle')}
        cancelText={t('common.cancel')}
      />

      <PopupChoiceSearch
        isOpen={isPopupSearchOpen}
        onClose={closePopupSearch}
        title={t('popups.searchTitle')}
        cancelText={t('common.cancel')}
      />
    </div>
  );
}

export default Home;
