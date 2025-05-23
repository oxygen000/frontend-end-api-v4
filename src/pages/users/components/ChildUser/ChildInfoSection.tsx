import { motion } from 'framer-motion';
import { FiUser, FiInfo, FiMapPin } from 'react-icons/fi';
import type { User } from '../../types/types';

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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterName', "Reporter's Name:")}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_name || user.guardian_name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterNationalId', 'National ID:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_national_id || user.guardian_id)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterAddress', 'Address:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_address || user.address)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterPhone', 'Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_phone || user.guardian_phone)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterSecondaryPhone', 'Additional Phone:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.reporter_secondary_phone || user.second_phone_number
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t(
              'forms.child.relationshipToMissing',
              'Relationship to Missing Person:'
            )}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_relationship || user.category)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterOccupation', 'Reporter Occupation:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_occupation)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.reporterEducation', 'Reporter Education:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.reporter_education)}
          </span>
        </div>
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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.fullName', 'Full Name:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.full_name || user.name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.nationalId', 'National ID:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.national_id)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.gender', 'Gender:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.gender)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.dateOfBirth', 'Date of Birth:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.dob || user.date_of_birth)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.distinctiveMark', 'Distinctive Marks:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.distinctive_mark 
            )}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.clothes', 'Clothes Description:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.clothes_description)}
          </span>
        </div>
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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.areaOfDisappearance', 'Area of Disappearance:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.area_of_disappearance)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.disappearanceDate', 'Disappearance Date:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.disappearance_date)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.disappearanceTime', 'Disappearance Time:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.disappearance_time)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.governorate', 'Governorate:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.governorate)}
          </span>
        </div>
      </div>
    </motion.div>
  </>
);

export default ChildInfoSection;
