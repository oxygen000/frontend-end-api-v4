import { motion } from 'framer-motion';

// Define a minimal User type for the required fields
interface User {
  employee_id?: string | null;
  form_type: string;
  date_of_birth?: string | null;
  address?: string | null;
  occupation?: string | null;
  has_criminal_record?: number;
}

interface IdentityVerificationSectionProps {
  user: User;
  isIdentityRevealed: boolean;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  hasVehicleInfo: boolean;
}

const IdentityVerificationSection = ({
  user,
  isIdentityRevealed,
  t,
  hasVehicleInfo,
}: IdentityVerificationSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/30 shadow-lg"
  >
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
      {/* Icon can be added here if needed */}
      {t('users.identityVerification', 'Identity Verification')}
    </h2>
    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
      <div className="flex justify-between items-center">
        <span className="text-white/70">
          {t('users.idVerified', 'ID Verified:')}
        </span>
        <span className="text-white font-medium">
          {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-white/70">
          {t('users.faceIdVerified', 'Face ID Verified:')}
        </span>
        <span className="text-white font-medium">
          {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
        </span>
      </div>
      {user.employee_id && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.employeeIdVerified', 'Employee ID Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-white/70">
          {t('users.formTypeVerified', 'Form Type Verified:')}
        </span>
        <span className="text-white font-medium">
          {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
        </span>
      </div>
      {user.date_of_birth && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.dateOfBirthVerified', 'Date of Birth Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
      {user.address && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.addressVerified', 'Address Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
      {user.occupation && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.occupationVerified', 'Occupation Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
      {user.has_criminal_record === 1 && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.criminalRecordVerified', 'Criminal Record Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
      {hasVehicleInfo && (
        <div className="flex justify-between items-center">
          <span className="text-white/70">
            {t('users.vehicleInfoVerified', 'Vehicle Info Verified:')}
          </span>
          <span className="text-white font-medium">
            {isIdentityRevealed ? t('common.yes', 'Yes') : t('common.no', 'No')}
          </span>
        </div>
      )}
    </div>
  </motion.div>
);

export default IdentityVerificationSection;
