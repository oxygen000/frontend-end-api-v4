import { motion } from 'framer-motion';
import { FiUser, FiInfo, FiMapPin } from 'react-icons/fi';
import type { User } from '../../types/types';
import InfoRow from '../../../../components/InfoRow';

interface ChildInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: (value: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
  calculateAge: (date: string) => string;
  showEmptyFields: boolean;
}

const ChildInfoSection = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  formatDate,
}: ChildInfoSectionProps) => (
  <>
    {/* 1. Reporter's Information */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-amber-500/30 shadow-lg`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiUser
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-amber-400`}
          size={20}
        />
        {t('forms.child.reporterInfo', "Reporter's Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InfoRow
          label={t('users.reporterName', "Reporter's Name:")}
          value={maskSensitiveInfo(user.reporter_name || user.guardian_name)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterNationalId', 'National ID:')}
          value={maskSensitiveInfo(user.reporter_national_id || user.guardian_id)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterAddress', 'Address:')}
          value={maskSensitiveInfo(user.reporter_address || user.address)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterPhone', 'Phone Number:')}
          value={maskSensitiveInfo(user.reporter_phone || user.guardian_phone)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterSecondaryPhone', 'Additional Phone:')}
          value={maskSensitiveInfo(
            user.reporter_secondary_phone || user.second_phone_number
          )}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t(
            'forms.child.relationshipToMissing',
            'Relationship to Missing Person:'
          )}
          value={maskSensitiveInfo(user.reporter_relationship || user.category)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterOccupation', 'Reporter Occupation:')}
          value={maskSensitiveInfo(user.reporter_occupation)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.reporterEducation', 'Reporter Education:')}
          value={maskSensitiveInfo(user.reporter_education)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      </div>
    </motion.div>

    {/* 2. Missing Person Information */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-amber-500/30 shadow-lg mt-4`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiInfo
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-amber-400`}
          size={20}
        />
        {t('forms.child.missingPersonInfo', "Missing Person's Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InfoRow
          label={t('users.fullName', 'Full Name:')}
          value={maskSensitiveInfo(user.full_name || user.name)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.nationalId', 'National ID:')}
          value={maskSensitiveInfo(user.national_id)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.gender', 'Gender:')}
          value={maskSensitiveInfo(user.gender)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.dateOfBirth', 'Date of Birth:')}
          value={formatDate(user.dob || user.date_of_birth)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.distinctiveMark', 'Distinctive Marks:')}
          value={maskSensitiveInfo(user.distinctive_mark)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.clothes', 'Clothes Description:')}
          value={maskSensitiveInfo(user.clothes_description)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      </div>
    </motion.div>

    {/* 3. Location of Disappearance */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-amber-500/30 shadow-lg mt-4`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiMapPin
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-amber-400`}
          size={20}
        />
        {t('forms.child.disappearanceDetails', 'Disappearance Details')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InfoRow
          label={t('users.areaOfDisappearance', 'Area of Disappearance:')}
          value={maskSensitiveInfo(user.area_of_disappearance)}
          icon={<FiMapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.disappearanceDate', 'Disappearance Date:')}
          value={formatDate(user.disappearance_date)}
          icon={<FiMapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.disappearanceTime', 'Disappearance Time:')}
          value={maskSensitiveInfo(user.disappearance_time)}
          icon={<FiMapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('users.governorate', 'Governorate:')}
          value={maskSensitiveInfo(user.governorate)}
          icon={<FiMapPin className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      </div>
    </motion.div>
  </>
);

export default ChildInfoSection;
