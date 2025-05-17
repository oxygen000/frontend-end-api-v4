import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';

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
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">
        {t('registration.vehicleInfo', 'Vehicle Information')}
      </h3>

      <div className="flex items-center space-x-3 sm:space-x-4 mb-2">
        <input
          type="checkbox"
          checked={formData.has_vehicle}
          onChange={handleToggleVehicle}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
        <label className="text-sm sm:text-base">
          {t('registration.hasVehicle', 'Has Vehicle Information')}
        </label>
      </div>

      {formData.has_vehicle && (
        <>
          <Input
            label={t('registration.vehicleModel', 'Vehicle Model')}
            name="vehicle_model"
            type="text"
            value={formData.vehicle_model}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.vehicleColor', 'Vehicle Color')}
            name="vehicle_color"
            value={formData.vehicle_color}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.chassisNumber', 'Chassis Number')}
            name="chassis_number"
            value={formData.chassis_number}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.vehicleNumber', 'Vehicle Number')}
            name="vehicle_number"
            type="text"
            value={formData.vehicle_number}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.yearmanufacture', 'Year of manufacture')}
            name="manufacture_year"
            type="date"
            value={formData.manufacture_year}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.licenseExpiration', 'License Expiration')}
            name="license_expiration"
            type="date"
            value={formData.license_expiration}
            onChange={handleInputChange}
          />
        </>
      )}

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default VehicleInfoSection;
