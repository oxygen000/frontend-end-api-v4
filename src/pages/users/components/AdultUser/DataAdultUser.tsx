import { motion } from 'framer-motion';

import type {
  User,
  FormatDateFunction,
  MaskSensitiveInfoFunction,
} from '../../types/types';
import InfoRow from '../../../../components/InfoRow';

interface DataAdultUser {
  user: User;
  t: (key: string, defaultText?: string) => string;
  showEmptyFields: boolean;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
  formatDate: FormatDateFunction;
}

const DataAdultUser = ({
  user,
  t,
  showEmptyFields,
  maskSensitiveInfo,
  formatDate,
}: DataAdultUser) => (
  
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/30 shadow-lg"
  >
    
    <div className="flex flex-col">
        <h2 className="text-lg sm:text-xl justify-center  font-semibold text-white mb-3 sm:mb-4 flex items-center">
         
          {t('users.personalInfo', 'Personal Information')}<span className='ml-2'>{t('users.personalInfo2', 'Personal Information')}</span>
        </h2>
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* العمود الأول */}
  <div className="flex flex-col gap-4 w-full">
    {user.full_name && (
      <InfoRow
        label={t('users.fullName', 'Full Name:')}
        value={user.full_name}
        icon={<></>}
      />
    )}
    {user.dob && (
      <InfoRow
        label={t('users.dateOfBirth', 'Date of Birth:')}
        value={formatDate(user.dob)}
        icon={<></>}
      />
    )}
    {user.nickname && (
      <InfoRow
        label={t('users.nickname', 'Nickname:')}
        value={user.nickname}
        icon={<></>}
      />
    )}
    {(user.mothers_name || showEmptyFields) && (
      <InfoRow
        label={t('users.mothersName', "Mother's Name:")}
        value={maskSensitiveInfo(user.mothers_name)}
        icon={<></>}
      />
    )}
    {(user.marital_status || showEmptyFields) && (
      <InfoRow
        label={t('users.maritalStatus', 'Marital Status:')}
        value={maskSensitiveInfo(user.marital_status)}
        icon={<></>}
      />
    )}
  </div>

  {/* العمود الثاني */}
  <div className="flex flex-col gap-4 w-full">
    {(user.educational_qualification || showEmptyFields) && (
      <InfoRow
        label={t('users.educational_qualification', 'Educational Qualification:')}
        value={user.educational_qualification || ''}
        icon={<></>}
      />
    )}
    {(user.occupation || showEmptyFields) && (
      <InfoRow
        label={t('users.occupation', 'Occupation:')}
        value={maskSensitiveInfo(user.occupation)}
        icon={<></>}
      />
    )}
    {user.governorate && (
      <InfoRow
        label={t('users.governorate', 'Governorate:')}
        value={user.governorate || ''}
        icon={<></>}
      />
    )}
    {user.address && (
      <InfoRow
        label={t('users.address', 'Address:')}
        value={user.address}
        icon={<></>}
      />
    )}
    {(user.issuing_authority || showEmptyFields) && (
      <InfoRow
        label={t('users.issuingAuthority', 'Issuing Authority:')}
        value={maskSensitiveInfo(user.issuing_authority)}
        icon={<></>}
      />
    )}
    {(user.issue_date || showEmptyFields) && (
      <InfoRow
        label={t('users.issueDate', 'Issue Date:')}
        value={formatDate(user.issue_date)}
        icon={<></>}
      />
    )}
  </div>
</div>
    </div>
  </motion.div>
);

export default DataAdultUser;
