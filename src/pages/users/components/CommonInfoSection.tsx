import { motion } from 'framer-motion';
import {
  FiInfo,
  FiUser,
  FiCalendar,
  FiHash,
  FiHome,
  FiTag,
} from 'react-icons/fi';

interface User {
  name: string;
  nickname?: string | null;
  dob?: string | null;
  date_of_birth?: string | null;
  national_id?: string | null;
  address?: string | null;
  category?: string | null;
}

interface CommonInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: (value: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
}

const CommonInfoSection = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  formatDate,
}: CommonInfoSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="bg-gradient-to-br from-teal-500/20 to-teal-500/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-teal-500/30 shadow-lg"
  >
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
      <FiInfo
        className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-teal-400`}
        size={20}
      />
      {t('users.commonInfo', 'Common Information')}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('registration.fullName', 'Full Name:')}
        </span>
        <span className="text-white font-medium text-sm">
          {maskSensitiveInfo(user.name)}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('registration.nickname', 'Nickname:')}
        </span>
        <span className="text-white font-medium text-sm">
          {maskSensitiveInfo(user.nickname)}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiCalendar className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('registration.dateOfBirth', 'Date of Birth:')}
        </span>
        <span className="text-white font-medium text-sm">
          {formatDate(user.dob || user.date_of_birth)}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiHash className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('registration.nationalId', 'National ID:')}
        </span>
        <span className="text-white font-medium text-sm">
          {maskSensitiveInfo(user.national_id)}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiHome className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('registration.address', 'Address:')}
        </span>
        <span className="text-white font-medium text-sm">
          {maskSensitiveInfo(user.address)}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/10 hover:bg-white/15 transition-colors duration-200 rounded-lg">
        <span className="text-white/70 flex items-center text-sm">
          <FiTag className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('users.category', 'Category:')}
        </span>
        <span className="text-white font-medium text-sm">
          {maskSensitiveInfo(user.category)}
        </span>
      </div>
    </div>
  </motion.div>
);

export default CommonInfoSection;
