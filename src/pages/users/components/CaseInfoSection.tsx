import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

// Define a minimal User type for the required fields
interface User {
  has_criminal_record: number;
  case_details?: string | null;
  police_station?: string | null;
  case_number?: string | null;
  judgment?: string | null;
  accusation?: string | null;
}

interface CaseInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: (value: string | null | undefined) => string;
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
    user.accusation;

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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.hasCriminalRecord', 'Has Criminal Record:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.has_criminal_record === 1
              ? t('common.yes', 'Yes')
              : t('common.no', 'No')}
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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.policeStation', 'Police Station:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.police_station)}
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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.judgment', 'Judgment:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.judgment)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.accusation', 'Accusation:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.accusation)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseInfoSection;
