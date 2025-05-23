import { motion } from 'framer-motion';
import { FiPhone, FiUser, FiCalendar, FiHome } from 'react-icons/fi';
import type {
  User,
  FormatDateFunction,
  MaskSensitiveInfoFunction,
} from '../types/types';
import InfoRow from '../../../components/InfoRow';

interface PhoneNumbersSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
  formatDate: FormatDateFunction;
}

const PhoneNumbersSection = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  formatDate,
}: PhoneNumbersSectionProps) => {
  const hasPhoneInfo = Boolean(
    user.phone_number ||
      user.second_phone_number ||
      user.phone_company ||
      user.service_provider ||
      user.landline_number ||
      user.last_number ||
      user.emergency_phone ||
      user.guardian_phone ||
      user.reporter_phone ||
      user.reporter_secondary_phone ||
      user.emergency_contact
  );

  if (!hasPhoneInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-blue-500/30 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiPhone
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-blue-400`}
          size={20}
        />
        {t('users.phoneNumbers', 'Phone Numbers')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Primary Phone */}
        {user.phone_number && (
          <InfoRow
            label={t('users.primaryPhone', 'Primary Phone:')}
            value={maskSensitiveInfo(user.phone_number)}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Secondary Phone */}
        {user.second_phone_number && (
          <InfoRow
            label={t('users.secondaryPhone', 'Secondary Phone:')}
            value={maskSensitiveInfo(user.second_phone_number)}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Landline Number */}
        {user.landline_number && (
          <InfoRow
            label={t('users.landlineNumber', 'Landline Number:')}
            value={maskSensitiveInfo(user.landline_number)}
            icon={<FiHome className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Last Number */}
        {user.last_number && (
          <InfoRow
            label={t('users.lastNumber', 'Last Number:')}
            value={maskSensitiveInfo(user.last_number)}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}
        {user.phone_company && (
          <InfoRow
            label={t('users.phoneCompany', 'Phone Company:')}
            value={user.phone_company}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Phone Provider */}
        {(user.service_provider ) && (
          <InfoRow
            label={t('users.phoneProvider', 'Phone Provider:')}
            value={maskSensitiveInfo(
              user.service_provider 
            )}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Emergency Phone */}
        {user.emergency_phone && (
          <InfoRow
            label={t('users.emergencyPhone', 'Emergency Phone:')}
            value={maskSensitiveInfo(user.emergency_phone)}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Guardian Phone */}
        {user.guardian_phone && (
          <InfoRow
            label={t('users.guardianPhone', 'Guardian Phone:')}
            value={maskSensitiveInfo(user.guardian_phone)}
            icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}


        {/* Emergency Contact */}
        {user.emergency_contact && (
          <InfoRow
            label={t('users.emergencyContact', 'Emergency Contact:')}
            value={maskSensitiveInfo(user.emergency_contact)}
            icon={<FiPhone className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
        )}

        {/* Registration Date */}
        <InfoRow
          label={t('users.registeredOn', 'Registered On:')}
          value={formatDate(user.created_at)}
          icon={<FiCalendar className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      </div>
    </motion.div>
  );
};

export default PhoneNumbersSection;
