import { motion } from 'framer-motion';
import {  FiPhone } from 'react-icons/fi';
import type { User, FormatDateFunction, MaskSensitiveInfoFunction } from '../types/types';

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
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.primaryPhone', 'Primary Phone:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.phone_number)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.secondaryPhone', 'Secondary Phone:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.second_phone_number)}
          </span>
        </div>
        {user.landline_number && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('users.landlineNumber', 'Landline Number:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.landline_number)}
            </span>
          </div>
        )}
        {user.last_number && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('users.lastNumber', 'Last Number:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.last_number)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.phoneProvider', 'Phone Provider:')}
          </span>
          <span className="text-white font-medium text-sm">
            {maskSensitiveInfo(user.service_provider || user.phone_company)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.registrationDate', 'Registration Date:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.registration_date || user.created_at)}
          </span>
        </div>
        {/* Emergency Phone */}
        {user.emergency_phone && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">{t('users.emergencyPhone', 'Emergency Phone:')}</span>
            <span className="text-white font-medium text-sm">{maskSensitiveInfo(user.emergency_phone)}</span>
          </div>
        )}
        {/* Guardian Phone */}
        {user.guardian_phone && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">{t('users.guardianPhone', 'Guardian Phone:')}</span>
            <span className="text-white font-medium text-sm">{maskSensitiveInfo(user.guardian_phone)}</span>
          </div>
        )}
        {/* Reporter Phone */}
        {user.reporter_phone && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">{t('users.reporterPhone', 'Reporter Phone:')}</span>
            <span className="text-white font-medium text-sm">{maskSensitiveInfo(user.reporter_phone)}</span>
          </div>
        )}
        {/* Reporter Secondary Phone */}
        {user.reporter_secondary_phone && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">{t('users.reporterSecondaryPhone', 'Reporter Secondary Phone:')}</span>
            <span className="text-white font-medium text-sm">{maskSensitiveInfo(user.reporter_secondary_phone)}</span>
          </div>
        )}
        {/* Emergency Contact */}
        {user.emergency_contact && (
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">{t('users.emergencyContact', 'Emergency Contact:')}</span>
            <span className="text-white font-medium text-sm">{maskSensitiveInfo(user.emergency_contact)}</span>
          </div>
        )}
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.registeredOn', 'Registered On:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneNumbersSection;
