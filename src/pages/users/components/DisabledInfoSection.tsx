import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

interface User {
  form_type: string;
  guardian_name?: string | null;
  guardian_id?: string | null;
  address?: string | null;
  guardian_phone?: string | null;
  second_phone_number?: string | null;
  category?: string | null;
  name: string;
  date_of_birth?: string | null;
  dob?: string | null;
  national_id?: string | null;
  phone_number?: string | null;
  area_of_disappearance?: string | null;
  last_seen_time?: string | null;
  physical_description?: string | null;
  last_clothes?: string | null;
  additional_data?: string | null;
  medical_condition?: string | null;
  disability_type?: string | null;
  disability_description?: string | null;
  special_needs?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
}

interface DisabledInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: (value: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
  calculateAge: (date: string) => string;
  showEmptyFields: boolean;
}

const DisabledInfoSection = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  formatDate,
  calculateAge,
}: DisabledInfoSectionProps) => (
  <>
    {/* Reporter's Information */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/30 shadow-lg`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiUser
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-purple-400`}
          size={20}
        />
        {t('forms.disabled.reporterInfo', "Reporter's Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.reporterName', "Reporter's Name:")}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.reporterNationalId', 'National ID:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_id)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.reporterAddress', 'Address:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.address)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.reporterPhone', 'Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_phone)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.reporterAltPhone', 'Additional Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.second_phone_number || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t(
              'forms.disabled.relationshipToMissing',
              'Relationship to Missing Person:'
            )}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.category || t('users.notAvailable', 'N/A'))}
          </span>
        </div>
      </div>
    </motion.div>
    {/* Missing Person's Information */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/30 shadow-lg mt-4 sm:mt-6`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiUser
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-purple-400`}
          size={20}
        />
        {t('forms.disabled.missingPersonInfo', "Missing Person's Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.missingPersonName', 'Name:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.age', 'Age:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.date_of_birth || user.dob
              ? calculateAge(String(user.date_of_birth || user.dob))
              : t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.nationalId', 'National ID (if available):')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.national_id || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.phoneNumber', 'Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.phone_number || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t(
              'forms.disabled.disappearanceLocation',
              'Place of Disappearance:'
            )}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.area_of_disappearance || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.dateOfDisappearance', 'Date of Disappearance:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.last_seen_time) || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.lastSeenLocation', 'Last Seen Location:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.area_of_disappearance || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.distinguishingMark', 'Distinguishing Mark:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.physical_description || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.clothes', 'Clothing Description:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.last_clothes || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.previousDisputes', 'Previous Disputes:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.additional_data || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.medicalHistory', 'Medical History:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(
              user.medical_condition || t('users.notAvailable', 'N/A')
            )}
          </span>
        </div>
      </div>
      {/* Disability-specific information */}
      <h3 className="text-base sm:text-lg font-semibold text-white mt-4 mb-3">
        {t('forms.disabled.disabilityInfo', 'Disability Information')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.disabilityType', 'Disability Type:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.disability_type &&
              t(user.disability_type, maskSensitiveInfo(user.disability_type))}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.disabilityDetails', 'Disability Description:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.disability_description)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.specialNeeds', 'Special Needs:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.special_needs)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.disabled.emergencyContact', 'Emergency Contact:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.emergency_contact)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.emergencyPhone', 'Emergency Phone:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.emergency_phone)}
          </span>
        </div>
      </div>
    </motion.div>
  </>
);

export default DisabledInfoSection;
