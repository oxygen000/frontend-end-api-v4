import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';

// Define a minimal User type for the required fields
interface User {
  vehicle_model?: string | null;
  license_plate?: string | null;
  vehicle_color?: string | null;
  chassis_number?: string | null;
  vehicle_number?: string | null;
  license_expiration?: string | null;
  form_type: string;
}

interface VehicleInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
}

const VehicleInfoSection = ({ user, isRTL, t }: VehicleInfoSectionProps) => {
  // Check if user is an adult type
  const isAdult =
    user.form_type === 'adult' ||
    user.form_type === 'man' ||
    user.form_type === 'woman';

  // Only return null if the user is not an adult type
  // Always show vehicle info for adult users, even if they have no vehicle data
  if (!isAdult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br ${user.form_type === 'woman' ? 'from-pink-500/20 to-pink-500/10' : 'from-blue-500/20 to-blue-500/10'} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${user.form_type === 'woman' ? 'border-pink-500/30' : 'border-blue-500/30'} shadow-lg`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FaCar
          className={`${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'} ${user.form_type === 'woman' ? 'text-pink-400' : 'text-blue-400'}`}
          size={20}
        />
        {t('users.vehicleInfo', 'Vehicle Information')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.licensePlate', 'License Plate:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.license_plate || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.vehicleModel', 'Vehicle Model:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.vehicle_model || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.vehicleColor', 'Vehicle Color:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.vehicle_color || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.chassisNumber', 'Chassis Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.chassis_number || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.vehicleNumber', 'Vehicle Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.vehicle_number || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('registration.licenseExpiration', 'License Expiration:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.license_expiration || t('users.notAvailable', 'N/A')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleInfoSection;
