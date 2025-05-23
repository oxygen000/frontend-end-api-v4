import { motion } from 'framer-motion';
import { FaFingerprint } from 'react-icons/fa';
import {
  FiUser,
  FiBriefcase,
  FiBook,
  FiFileText,
  FiMap,
  FiCalendar,
} from 'react-icons/fi';
import type {
  User,
  FormatDateFunction,
  MaskSensitiveInfoFunction,
} from '../../types/types';
import InfoRow from '../../../../components/InfoRow';

interface DataAdultUser {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  showEmptyFields: boolean;
  maskSensitiveInfo: MaskSensitiveInfoFunction;
  formatDate: FormatDateFunction;
}

const DataAdultUser = ({
  user,
  isRTL,
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
    
    <div className='flex flex-col'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>     
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
      <FaFingerprint
        className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-blue-400`}
        size={20}
      />
      {t('users.personalInfo', 'Personal Information')}
    </h2>
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
      <FaFingerprint
        className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-blue-400`}
        size={20}
      />
      {t('users.personalInfo', 'Personal Information')}
    </h2>
    
    </div>

<div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>

    <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
{user.full_name && (
  <InfoRow
    label={t('registration.fullName', 'Full Name:')}
    value={user.full_name}
    icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
  />
)}

{user.dob && (
  <InfoRow
    label={t('registration.dateOfBirth', 'Date of Birth:')}
    value={formatDate(user.dob)}
    icon={<FiCalendar className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
  />
)}
{user.nickname && (
  <InfoRow
    label={t('registration.nickname', 'Nickname:')}
    value={user.nickname}
    icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
  />
)}
      
       {(user.mothers_name || showEmptyFields) && (
        <InfoRow
          label={t('registration.mothersName', "Mother's Name:")}
          value={maskSensitiveInfo(user.mothers_name)}
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}
{(user.marital_status || showEmptyFields) && (
        <InfoRow
          label={t('registration.maritalStatus', 'Marital Status:')}
          value={ maskSensitiveInfo(user.marital_status)
          }
          icon={<FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}
      

     
    </div>

    <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">

 {(user.educational_qualification || showEmptyFields) && (
        <InfoRow
          label={t('registration.education', 'Education:')}
          value={maskSensitiveInfo(user.educational_qualification)}
          icon={<FiBook className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}


      
     {(user.occupation || showEmptyFields) && (
        <InfoRow
          label={t('users.occupation', 'Occupation:')}
          value={maskSensitiveInfo(user.occupation)}
          icon={<FiBriefcase className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}

{user.governorate && (
        <InfoRow
          label={t('users.governorate', 'Governorate:')}
          value={user.governorate || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}
      

{user.address && (
        <InfoRow
          label={t('registration.address', 'Address:')}
          value={user.address}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}
      

      {(user.issuing_authority || showEmptyFields) && (
        <InfoRow
          label={t('registration.issuingAuthority', 'Issuing Authority:')}
          value={maskSensitiveInfo(user.issuing_authority)}
          icon={<FiFileText className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}

      {(user.issue_date || showEmptyFields) && (
        <InfoRow
          label={t('registration.issueDate', 'Issue Date:')}
          value={formatDate(user.issue_date)}
          icon={<FiCalendar className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
      )}



   

     
    </div>
    </div>
    </div>
  </motion.div>
);



export default DataAdultUser;
