import { motion } from 'framer-motion';
import type {
  User,
  FormatDateFunction,
  MaskSensitiveInfoFunction,
} from '../types/types';
import InfoRow from '../../../components/InfoRow';

interface PhoneNumbersSectionProps {
  user: User;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
  formatDate: FormatDateFunction;
}

const PhoneNumbersSection = ({
  user,
  t,
  maskSensitiveInfo,
  formatDate,
}: PhoneNumbersSectionProps) => {
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-blue-500/30 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl justify-center font-semibold text-white mb-3 sm:mb-4 flex items-center">
        {t('users.phoneNumbers', 'Phone Numbers')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <InfoRow
          label={t('users.landlineNumber', 'Landline Number:')}
          value={maskSensitiveInfo(user.landline_number) || 'N/A'}
          icon={<></>}
        />

        {/* Primary Phone */}
        {user.phone_number && (
          <InfoRow
            label={t('users.primaryPhone', 'Primary Phone:')}
            value={maskSensitiveInfo(user.phone_number)}
            icon={<></>}
          />
        )}

        {/* Secondary Phone */}
        {user.second_phone_number && (
          <InfoRow
            label={t('users.secondaryPhone', 'Secondary Phone:')}
            value={maskSensitiveInfo(user.second_phone_number)}
            icon={<></>}
          />
        )}
         {/* Phone Provider */}
         <InfoRow
          label={t('users.phoneProvider', 'Phone Provider:')}
          value={maskSensitiveInfo(user.service_provider) || 'N/A'}
          icon={<></>}
        />

        {/* Last Number */}
        {user.last_number && (
          <InfoRow
            label={t('users.lastNumber', 'Last Number:')}
            value={maskSensitiveInfo(user.last_number)}
            icon={<></>}
          />
        )}
        {user.phone_company && (
          <InfoRow
            label={t('users.phoneCompany', 'Phone Company:')}
            value={user.phone_company}
            icon={<></>}
          />
        )}

       

       
       
      

       

       

       

        {/* Registration Date */}
        {user.created_at && (
          <InfoRow
            label={t('users.registeredOn', 'Registered On:')}
            value={formatDate(user.created_at)}
            icon={<></>}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PhoneNumbersSection;
