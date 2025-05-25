import { motion } from 'framer-motion';
import type { User, MaskSensitiveInfoFunction } from '../../types/types';
import InfoRow from '../../../../components/InfoRow';

interface CaseInfoSectionProps {
  user: User;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
}

const CaseInfoSection = ({
  user,
  t,
  maskSensitiveInfo,
}: CaseInfoSectionProps) => {
  const hasCaseInfo =
    user.has_criminal_record === 1 ||
    user.case_details ||
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
      <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold justify-center text-white mb-3 sm:mb-4 flex items-center">
            {t('users.caseInfo', 'Case Information')} <span className='ml-2'>{t('users.caseInfo2', 'Case Information')}</span>
          </h2>
         

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* العمود الأول */}
  <div className="flex flex-col gap-4 w-full">
    {/* Record Number */}
    {user.record_number && (
      <InfoRow
        label={t('registration.recordNumber', 'Record Number:')}
        value={maskSensitiveInfo(user.record_number)}
        icon={<></>}
      />
    )}

    {/* Governorate */}
    {user.court_governorate && (
      <InfoRow
        label={t('registration.court_governorate', 'Court Governorate:')}
        value={maskSensitiveInfo(user.court_governorate)}
        icon={<></>}
      />
    )}

    {/* Case Number */}
    {user.case_number && (
      <InfoRow
        label={t('users.caseNumber', 'Case Number:')}
        value={maskSensitiveInfo(user.case_number)}
        icon={<></>}
      />
    )}

    {/* Dossier Number */}
    {user.dossier_number && (
      <InfoRow
        label={t('registration.dossierNumber', 'Dossier Number:')}
        value={maskSensitiveInfo(user.dossier_number)}
        icon={<></>}
      />
    )}
  </div>

  {/* العمود الثاني */}
  <div className="flex flex-col gap-4 w-full">
    {/* Charge */}
    {user.charge && (
      <InfoRow
        label={t('registration.charge', 'Charge:')}
        value={maskSensitiveInfo(user.charge)}
        icon={<></>}
      />
    )}

    {/* Judgment */}
    {user.judgment && (
      <InfoRow
        label={t('users.judgment', 'Judgment:')}
        value={maskSensitiveInfo(user.judgment)}
        icon={<></>}
      />
    )}

    {/* Sentence */}
    {user.sentence && (
      <InfoRow
        label={t('registration.sentence', 'Sentence:')}
        value={maskSensitiveInfo(user.sentence)}
        icon={<></>}
      />
    )}
  </div>
</div>

      </div>
    </motion.div>
  );
};

export default CaseInfoSection;
