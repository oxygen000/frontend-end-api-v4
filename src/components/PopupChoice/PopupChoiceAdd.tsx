import React from 'react';
import { FaMale, FaFemale, FaChild, FaWheelchair } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PERSON_CATEGORIES } from '../../config/constants';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';

interface PopupChoiceAddProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  cancelText: string;
}

const PopupChoiceAdd: React.FC<PopupChoiceAddProps> = ({
  isOpen,
  onClose,
  title,
  cancelText,
}) => {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslationWithFallback();

  if (!isOpen) return null;

  const handleFinalChoice = (category: string) => {
    switch (category) {
      case PERSON_CATEGORIES.MAN:
        navigate('/register/man');
        break;
      case PERSON_CATEGORIES.WOMAN:
        navigate('/register/woman');
        break;
      case PERSON_CATEGORIES.CHILD:
        navigate('/register/child');
        break;
      case PERSON_CATEGORIES.DISABLED:
        navigate('/register/disabled');
        break;
      default:
        navigate('/register');
    }
    onClose();
  };

  const iconButtonStyle =
    'w-full flex items-center justify-center gap-2 px-4 py-4 text-white rounded-lg font-semibold shadow transition-all duration-200 hover:scale-[1.02] text-xl';

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-center border-b border-white/10 pb-2">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleFinalChoice(PERSON_CATEGORIES.MAN)}
            className={`${iconButtonStyle} bg-blue-700 hover:bg-blue-800`}
            aria-label={t('forms:man.title')}
          >
            <FaMale />
            <span className="text-sm">{t('search:formTypes.man')}</span>
          </button>
          <button
            onClick={() => handleFinalChoice(PERSON_CATEGORIES.WOMAN)}
            className={`${iconButtonStyle} bg-pink-600 hover:bg-pink-700`}
            aria-label={t('forms:woman.title')}
          >
            <FaFemale />
            <span className="text-sm">{t('search:formTypes.woman')}</span>
          </button>
          <button
            onClick={() => handleFinalChoice(PERSON_CATEGORIES.CHILD)}
            className={`${iconButtonStyle} bg-yellow-600 hover:bg-yellow-700`}
            aria-label={t('forms:child.title')}
          >
            <FaChild />
            <span className="text-sm">{t('search:formTypes.child')}</span>
          </button>
          <button
            onClick={() => handleFinalChoice(PERSON_CATEGORIES.DISABLED)}
            className={`${iconButtonStyle} bg-purple-600 hover:bg-purple-700`}
            aria-label={t('forms:disabled.title')}
          >
            <FaWheelchair />
            <span className="text-sm">{t('search:formTypes.disabled')}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg font-semibold transition"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default PopupChoiceAdd;
