import { motion } from 'framer-motion';
import { FaCar, FaMotorcycle } from 'react-icons/fa';
import type { User } from '../../types/types';
import InfoRow from '../../../../components/InfoRow';
import { FiMap } from 'react-icons/fi';

interface VehicleInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
}

const VehicleInfoSection = ({ user, isRTL, t }: VehicleInfoSectionProps) => {
  const isAdult = ['adult', 'man', 'woman'].includes(user.form_type || '');

  // Helper: Get value directly or from vehicle_info


  // Vehicle data
  const hasVehicle = user.has_vehicle === 1;
  const hasMotorcycle = user.has_motorcycle === 1;



  

  if (!isAdult || !hasVehicle) return null;

  const VehicleIcon = hasMotorcycle ? FaMotorcycle : FaCar;
  const gradient = user.form_type === 'woman' ? 'from-pink-500/20 to-pink-500/10' : 'from-blue-500/20 to-blue-500/10';
  const border = user.form_type === 'woman' ? 'border-pink-500/30' : 'border-blue-500/30';
  const iconColor = user.form_type === 'woman' ? 'text-pink-400' : 'text-blue-400';

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br ${gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${border} shadow-lg`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
        <VehicleIcon
          className={`${isRTL ? 'ml-3' : 'mr-3'} ${iconColor}`}
          size={20}
        />
        {t(
          'users.vehicleInfo',
          hasMotorcycle ? 'Motorcycle Information' : 'Vehicle Information'
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Info */}

        <InfoRow
          label={t('registration.vehicleType', 'Vehicle Type:')}
          value={user.vehicle_type  || ''} 
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.brand', 'Brand:')}
          value={user.brand || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.vehicleModel', 'Vehicle Model:')}
          value={user.vehicle_model || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.manufactureYear', 'Manufacture Year:')}
          value={user.manufacture_year || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.vehicleColor', 'Vehicle Color:')}
          value={user.vehicle_color || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.chassisNumber', 'Chassis Number:')}
          value={user.chassis_number || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.vehicleNumber', 'Vehicle Number:')}
            value={user.vehicle_number || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />





        {/* License Info */}
        
          <InfoRow
          label={t('registration.licensePlate', 'licensePlate')}
          value={user.license_plate || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.licenseExpiration', 'licenseExpiration')}
          value={user.license_expiration || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.expirationYear', 'Expiration Year')}
          value={user.expiration_year || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />

        {/* Traffic Info */}
        
        <InfoRow
          label={t('registration.trafficDepartment', 'Traffic Department:')}
          value={user.traffic_department || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
        />
        <InfoRow
          label={t('registration.trafficUnit', 'Traffic Unit:')}
            value={user.traffic_unit || ''}
          icon={<FiMap className={`${isRTL ? 'ml-2' : 'mr-2'}`} />}
          />
      </div>
    </motion.div>
  );
};

export default VehicleInfoSection;
