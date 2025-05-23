import { motion } from 'framer-motion';
import {
  FiAlertCircle,
  FiFileText,
  FiShield,
  FiMapPin,
  FiHash,
} from 'react-icons/fi';
import type { User, MaskSensitiveInfoFunction } from '../../types/types';
import InfoRow from '../../../../components/InfoRow';

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
      <div className='flex flex-col'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
      
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiAlertCircle className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
        {t('users.caseInfo', 'Case Information')}
      </h2>
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiAlertCircle className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
        {t('users.caseInfo', 'Case Information')}
      </h2>
</div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>

      

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
        {/* Record Number */}
        {user.record_number && (
          <InfoRow
            label={t('registration.recordNumber', 'Record Number:')}
            value={maskSensitiveInfo(user.record_number)}
            icon={<FiHash className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Governorate */}
        {user.court_governorate && (
          <InfoRow
            label={t('registration.court_governorate', 'Court Governorate:')}
            value={maskSensitiveInfo(user.court_governorate)}
            icon={<FiMapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Case Number */}
        {user.case_number && (
          <InfoRow
            label={t('users.caseNumber', 'Case Number:')}
            value={maskSensitiveInfo(user.case_number)}
            icon={<FiFileText className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Dossier Number */}
        {user.dossier_number && (
          <InfoRow
            label={t('registration.dossierNumber', 'Dossier Number:')}
            value={maskSensitiveInfo(user.dossier_number)}
            icon={<FiFileText className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-3'>
{/* Charge */}
{(user.charge || user.accusation) && (
          <InfoRow
            label={t('registration.charge', 'Charge:')}
            value={maskSensitiveInfo(user.charge || user.accusation)}
            icon={<FiShield className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Judgment */}
        {user.judgment && (
          <InfoRow
            label={t('users.judgment', 'Judgment:')}
            value={maskSensitiveInfo(user.judgment)}
            icon={<FiShield className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Sentence */}
        {user.sentence && (
          <InfoRow
            label={t('registration.sentence', 'Sentence:')}
            value={maskSensitiveInfo(user.sentence)}
            icon={<FiShield className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

      </div>
      </div>
      </div>
    </motion.div>
  );
};

export default CaseInfoSection;
