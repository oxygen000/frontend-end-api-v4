import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';

interface VehicleInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  prevSection: () => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
  handleToggleVehicle: () => void;
}

const VehicleInfoSection: React.FC<VehicleInfoSectionProps> = ({
  formData,
  handleInputChange,
  prevSection,
  nextSection,
  t,
  handleToggleVehicle,
}) => {
 

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {t('registration.vehicleInfo', 'Vehicle Information')}
      </h3>

      {/* Vehicle Information Toggle */}
      <div className="flex items-center space-x-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <input
          type="checkbox"
          id="has_vehicle"
          checked={formData.has_vehicle}
          onChange={handleToggleVehicle}
          className="h-4 w-4 sm:h-5 sm:w-5 accent-blue-500"
        />
        <label
          htmlFor="has_vehicle"
          className="text-sm sm:text-base cursor-pointer select-none"
        >
          {t(
            'registration.hasVehicle',
            'I have a vehicle and want to register its information'
          )}
        </label>
      </div>

      {formData.has_vehicle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-2"
        >
          <h4 className="text-sm sm:text-base font-medium text-blue-400 mt-4">
            {t('registration.vehicleDetails', 'Vehicle Details')}
          </h4>

          {/* Vehicle Type Select */}
          <div className="max-w-xs">
            <label
              htmlFor="vehicle_type"
              className="block mb-1 text-sm font-medium text-white"
            >
              {t('registration.vehicleType', 'Vehicle Type')}
            </label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={formData.vehicle_type || ''}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">
                {t('registration.selectVehicleType', 'Select vehicle type')}
              </option>
              <option value="car">{t('registration.car', 'Car')}</option>
              <option value="motorcycle">
                {t('registration.motorcycle', 'Motorcycle')}
              </option>
            </select>
          </div>

          {/* Basic Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.license_plate', 'License Plate')}
              name="license_plate"
              type="text"
              value={formData.license_plate || ''}
              onChange={handleInputChange}
                
            />
            <Input
              label={t('registration.traffic_unit', 'Traffic Unit')}
              name="traffic_unit"
              type="text"
              value={formData.traffic_unit || ''}
              onChange={handleInputChange}
              
            />

            <Input
              label={t('registration.license_expiration', 'License Expiration')}
              name="license_expiration"
              type="date"
              value={formData.license_expiration || ''}
              onChange={handleInputChange}
            />

            <Input
              label={t('registration.chassis_number', 'Chassis Number (VIN)')}
              name="chassis_number"
              type="number"
              value={formData.chassis_number || ''}
              onChange={handleInputChange}

            />

            <Input
              label={t('registration.trafficDpartment', 'Traffic Department')}
              name="traffic_department"
              type="text"
              value={formData.traffic_department || ''}
              onChange={handleInputChange}
              
            />
            <Input
              label={t('registration.brand', 'Vehicle Brand/Make')}
              name="brand"
              type="text"
              value={formData.brand || ''}
              onChange={handleInputChange}
              
            />
            <Input
              label={t('registration.vehicleColor', 'Vehicle Color')}
              name="vehicle_color"
              type="text"
              value={formData.vehicle_color || ''}
              onChange={handleInputChange}
             
            />
            <Input
              label={t('registration.vehicleModel', 'Vehicle Model')}
              name="vehicle_model"
              type="text"
              value={formData.vehicle_model || ''}
              onChange={handleInputChange}
             
            />
             <Input
              label={t('registration.vehicleNumber', 'Vehicle Number')}
              name="vehicle_number"
              type="number"
              value={formData.vehicle_number || ''}
              onChange={handleInputChange}
             
            />
             <Input
              label={t('registration.expirationYear', 'Expiration Year')}
              name="expiration_year"
              type="data"
              value={formData.expiration_year || ''}
              onChange={handleInputChange}
             
            />
            <Input
              label={t('registration.manufactureYear', 'Manufacture Year')}
              name="manufacture_year"
              type="data"
              value={formData.manufacture_year || ''}
              onChange={handleInputChange}
            />
            <Input
              label={t('registration.engineNumber', 'Engine Number')}
              name="license_governorate"
              type="number"
              value={formData.license_governorate || ''}
              onChange={handleInputChange}
              />
            
          </div>
        </motion.div>
      )}

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default VehicleInfoSection;
