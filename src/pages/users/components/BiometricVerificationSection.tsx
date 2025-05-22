import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import type { TranslationFunction, FormatDateFunction } from '../types/types';
import type { User } from '../types/types';

interface BiometricVerificationSectionProps {
  user: User;
  isIdentityRevealed: boolean;
  isRTL: boolean;
  t: TranslationFunction;
  formatDate: FormatDateFunction;
}

function BiometricVerificationSection({
  user,
  isIdentityRevealed,
  isRTL,
  t,
  formatDate,
}: BiometricVerificationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-purple-500/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/30 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiUser
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-purple-400`}
          size={20}
        />
        {t('users.biometricVerification', 'Biometric Verification')}
      </h2>

      <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.faceRecognition', 'Face Recognition:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed
              ? t('common.verified', 'Verified')
              : t('common.hidden', 'Hidden')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.fingerprint', 'Fingerprint:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed
              ? t('common.notAvailable', 'Not Available')
              : t('common.hidden', 'Hidden')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.lastVerification', 'Last Verification:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed
              ? formatDate(user.updated_at || user.created_at)
              : t('common.hidden', 'Hidden')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default BiometricVerificationSection;
