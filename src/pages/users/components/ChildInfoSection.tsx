import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

// Define a minimal User type for the required fields
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
}

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
  calculateAge,
}: ChildInfoSectionProps) => (
  <>
    {/* Reporter's Information */}
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
            {t('users.guardianName', "Reporter's Name:")}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.guardianId', 'National ID:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_id)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.address', 'Address:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.address)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.guardianPhone', 'Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.guardian_phone)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.secondaryPhone', 'Additional Phone:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.second_phone_number)}
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
            {maskSensitiveInfo(user.category)}
          </span>
        </div>
      </div>
    </motion.div>
    {/* Missing Person's Information */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-amber-500/30 shadow-lg mt-4 sm:mt-6`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiUser
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-amber-400`}
          size={20}
        />
        {t('forms.child.missingPersonInfo', "Missing Person's Information")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.fullName', 'Name:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.name)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.age', 'Age:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.date_of_birth || user.dob
              ? calculateAge(String(user.date_of_birth || user.dob))
              : t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.nationalId', 'National ID (if available):')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.national_id)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.phoneNumber', 'Phone Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.phone_number)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.areaOfDisappearance', 'Place of Disappearance:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.area_of_disappearance)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.dateOfDisappearance', 'Date of Disappearance:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.last_seen_time)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.lastSeenLocation', 'Last Seen Location:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.area_of_disappearance)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.distinguishingMark', 'Distinguishing Mark:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.physical_description)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.lastClothes', 'Clothing Description:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.last_clothes)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.previousDisputes', 'Previous Disputes:')}
          </span>
          <span className="text-white font-medium text-sm" dir="auto">
            {/* Parse JSON if additional_data is a JSON string */}
            {(() => {
              try {
                if (
                  user.additional_data &&
                  user.additional_data.startsWith('{')
                ) {
                  const parsedData = JSON.parse(user.additional_data);
                  if (typeof parsedData === 'object') {
                    return (
                      parsedData.additional_notes ||
                      parsedData.additional_data ||
                      user.additional_data
                    );
                  }
                }
                return user.additional_data;
              } catch {
                return user.additional_data;
              }
            })() || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('forms.child.medicalHistory', 'Medical History:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.medical_condition)}
          </span>
        </div>
      </div>
    </motion.div>
  </>
);

export default ChildInfoSection;
