import { motion } from 'framer-motion';
import type { User } from '../../types/types';
import InfoRow from '../../../../components/InfoRow';


interface VehicleInfoSectionProps {
  user: User;
  t: (key: string, defaultText?: string) => string;
}

  const VehicleInfoSection = ({ user, t }: VehicleInfoSectionProps) => {
  const isAdult = ['adult', 'man', 'woman'].includes(user.form_type || '');

  // Helper: Get value directly or from vehicle_info


  // Vehicle data
  const hasVehicle = user.has_vehicle === 1;
  const hasMotorcycle = user.has_motorcycle === 1;



  

  if (!isAdult || !hasVehicle) return null;

  const gradient = user.form_type === 'woman' ? 'from-pink-500/20 to-pink-500/10' : 'from-blue-500/20 to-blue-500/10';
  const border = user.form_type === 'woman' ? 'border-pink-500/30' : 'border-blue-500/30';

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br ${gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${border} shadow-lg`}
    >

      
      <h2 className="text-lg sm:text-xl justify-center text-center font-semibold text-white mb-4 flex items-center">
    
        
        {t(
          'users.vehicleInfo',
          hasMotorcycle ? 'Motorcycle Information' : 'Vehicle Information'
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <InfoRow
          label={t('registration.vehicleNumber', 'Vehicle Number:')}
            value={user.vehicle_number || ''}
          icon={<></>}
        />

        
        
         <InfoRow
          label={t('registration.trafficUnit', 'Traffic Unit:')}
            value={user.traffic_unit || ''}
          icon={<></>}
          />





       
       
       
       
       

      


        {/* License Info */}
        
          <InfoRow
          label={t('registration.licensePlate', 'licensePlate')}
          value={user.license_type  || ''}
          icon={<></>}
        />
        <InfoRow
          label={t('registration.licenseExpiration', 'licenseExpiration')}
          value={user.license_expiration || ''}
          icon={<></>}
        />
      

      
      <InfoRow
          label={t('registration.brand', 'Brand:')}
          value={user.brand || ''}
          icon={<></>}
        />
          <InfoRow
          label={t('registration.chassisNumber', 'Chassis Number:')}
          value={user.chassis_number || ''}
          icon={<></>}
        />
       <InfoRow
          label={t('registration.vehicleModel', 'Vehicle Model:')}
          value={user.vehicle_model || ''}
          icon={<></>}
        />
         <InfoRow
          label={t('registration.vehicleColor', 'Vehicle Color:')}
          value={user.vehicle_color || ''}
          icon={<></>}
        />
        <InfoRow
          label={t('registration.manufactureYear', 'Manufacture Year:')}
          value={user.manufacture_year || ''}
          icon={<></>}
        />
       
       <InfoRow
          label={t('registration.engineNumber', 'Engine Number:')}
          value={user.license_governorate || ''}
          icon={<></>}
        />
       
      </div>
      

        
  
      
    </motion.div>
  );
};

export default VehicleInfoSection;
