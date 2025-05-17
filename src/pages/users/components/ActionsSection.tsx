import { motion } from 'framer-motion';
import { FiActivity, FiFileText, FiTrash2 } from 'react-icons/fi';
import type { TranslationFunction } from '../types/types';
import type { User } from '../types/types';

interface ActionsSectionProps {
  user: User;
  isRTL: boolean;
  t: TranslationFunction;
  onDeleteClick: () => void;
  navigate: (path: string) => void;
}

function ActionsSection({
  user,
  isRTL,
  t,
  onDeleteClick,
  navigate,
}: ActionsSectionProps) {
  // Determine the correct edit path based on form type
  const getEditPath = () => {
    if (user.form_type === 'child') {
      return `/register/child?edit=${user.id}`;
    } else if (user.form_type === 'disabled') {
      return `/register/disabled?edit=${user.id}`;
    } else {
      // For all adult types (man, woman, adult)
      return `/register/man?edit=${user.id}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiActivity
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-white`}
          size={20}
        />
        {t('users.actions', 'Actions')}
      </h2>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate(getEditPath())}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600/70 to-green-700/70 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
        >
          <FiFileText className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('users.editInformation', 'Edit Information')}
        </button>

        <button
          onClick={onDeleteClick}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600/70 to-red-700/70 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
        >
          <FiTrash2 className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('common.delete', 'Delete Record')}
        </button>
      </div>
    </motion.div>
  );
}

export default ActionsSection;
