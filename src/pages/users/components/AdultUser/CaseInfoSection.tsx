import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import type { User, MaskSensitiveInfoFunction } from '../../types/types';

interface CaseInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
}

const CaseInfoSection = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
}: CaseInfoSectionProps) => {
  const hasCaseInfo =
    user.has_criminal_record === 1 ||
    user.case_details ||
    user.police_station ||
    user.case_number ||
    user.judgment ||
    user.accusation ||
    user.record_number ||
    user.governorate ||
    user.dossier_number ||
    user.charge ||
    user.sentence;

  if (!hasCaseInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-red-500/30 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiAlertCircle className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
        {t('users.caseInfo', 'Case Information')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      

        {/* Record Number */}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.recordNumber', 'Record Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.record_number)}
          </span>
        </div>

        {/* Governorate */}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.governorate', 'Governorate:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.governorate)}
          </span>
        </div>

      

        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.caseNumber', 'Case Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.case_number)}
          </span>
        </div>

        {/* Dossier Number */}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.dossierNumber', 'Dossier Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.dossier_number)}
          </span>
        </div>

        {/* Charge */}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.charge', 'Charge:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.charge || user.accusation)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.judgment', 'Judgment:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.judgment)}
          </span>
        </div>

        {/* Sentence */}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.sentence', 'Sentence:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.sentence)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.caseDetails', 'Case Details:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.case_details)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseInfoSection;
