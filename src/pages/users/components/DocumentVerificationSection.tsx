import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import type { TranslationFunction } from '../types/types';
import type { User } from '../types/types';

interface DocumentVerificationSectionProps {
  user: User;
  isIdentityRevealed: boolean;
  isRTL: boolean;
  t: TranslationFunction;
  hasVehicleInfo: boolean;
}

function DocumentVerificationSection({
  user,
  isIdentityRevealed,
  isRTL,
  t,
  hasVehicleInfo,
}: DocumentVerificationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-green-500/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-green-500/30 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiFileText
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-green-400`}
          size={20}
        />
        {t('users.documentVerification', 'Document Verification')}
      </h2>

      <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
        <div className="flex justify-between items-center">
          <span className="text-white/70">{t('users.idCard', 'ID Card:')}</span>
          <span className="text-white font-medium">
            {isIdentityRevealed
              ? user.employee_id
                ? t('common.verified', 'Verified')
                : t('common.notAvailable', 'Not Available')
              : t('common.hidden', 'Hidden')}
          </span>
        </div>

        {user.form_type === 'child' && (
          <div className="flex justify-between items-center">
            <span className="text-white/70">
              {t('users.birthCertificate', 'Birth Certificate:')}
            </span>
            <span className="text-white font-medium">
              {isIdentityRevealed
                ? t('common.notAvailable', 'Not Available')
                : t('common.hidden', 'Hidden')}
            </span>
          </div>
        )}

        {hasVehicleInfo && (
          <div className="flex justify-between items-center">
            <span className="text-white/70">
              {t('users.vehicleLicense', 'Vehicle License:')}
            </span>
            <span className="text-white font-medium">
              {isIdentityRevealed
                ? t('common.verified', 'Verified')
                : t('common.hidden', 'Hidden')}
            </span>
          </div>
        )}

        {user.has_criminal_record === 1 && (
          <div className="flex justify-between items-center">
            <span className="text-white/70">
              {t('users.caseDocuments', 'Case Documents:')}
            </span>
            <span className="text-white font-medium">
              {isIdentityRevealed
                ? t('common.verified', 'Verified')
                : t('common.hidden', 'Hidden')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DocumentVerificationSection;
