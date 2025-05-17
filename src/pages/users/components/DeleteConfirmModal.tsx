import { motion } from 'framer-motion';
import type { TranslationFunction } from '../types/types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: TranslationFunction;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  t,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          {t('users.confirmDeletion', 'Confirm Deletion')}
        </h3>
        <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
          {t(
            'users.deleteWarning',
            'Are you sure you want to delete this record? This action cannot be undone.'
          )}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600/70 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600/70 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            {t('common.delete', 'Delete')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteConfirmModal;
