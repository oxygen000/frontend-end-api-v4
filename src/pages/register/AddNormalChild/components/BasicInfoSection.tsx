import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { FormData } from '../types/types';
interface BasicInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleInputChange,
  nextSection,
  t,
}) => {
  // Debug log to check form data values
  console.log('🔍 BasicInfoSection - Received formData:', formData);
  console.log('📝 BasicInfoSection - Key fields:', {
    full_name: formData.full_name,
    name: formData.name,
    dob: formData.dob,
    national_id: formData.national_id,
    gender: formData.gender,
    address: formData.address,
  });

  // Calculate age when DOB changes
  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    handleInputChange(e);

    if (dob) {
      try {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        // Create a synthetic event to update the age field
        const ageEvent = {
          target: {
            name: 'age',
            value: age.toString(),
          },
        } as React.ChangeEvent<HTMLInputElement>;

        handleInputChange(ageEvent);
      } catch (error) {
        console.error('Error calculating age:', error);
      }
    }
  };

  return (
<motion.div
  variants={sectionVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={transition}
  className="space-y-6 sm:space-y-8"
>
  <h3 className="text-base sm:text-lg md:text-xl font-semibold">
    {t('sections.personal', 'Personal Information')}
  </h3>

  {/* Basic Personal Information */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label={t('childFullName', 'Full Name')}
      name="full_name"
      value={formData.full_name || ''}
      onChange={handleInputChange}
      required
    />

    <Input
      label={t('dateOfBirth', 'Date of Birth')}
      name="dob"
      type="date"
      value={formData.dob}
      onChange={handleDOBChange}
      required
    />

    <Input
      label={t('childId', 'National ID')}
      name="national_id"
      value={formData.national_id}
      onChange={handleInputChange}
    />

    <div className="mt-2 sm:mt-1">
      <label htmlFor="gender" className="block text-sm sm:text-base font-medium text-white mb-1">
        {t('registration.selectGender', 'Select Gender')}
      </label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-white bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        required
      >
        <option value="" className="text-black">
          {t('registration.selectGender', 'Select Gender')}
        </option>
        <option value="male" className="text-black">
          {t('registration.male', 'Male')}
        </option>
        <option value="female" className="text-black">
          {t('registration.female', 'Female')}
        </option>
      </select>
    </div>
  </div>

  {/* Address and Reason */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label={t('registration.address', 'Current Address')}
      name="address"
      value={formData.address}
      onChange={handleInputChange}
      required
    />

    
  </div>

  <div className="flex justify-end mt-4">
    <SectionButtons onNext={nextSection} />
  </div>
</motion.div>

  );
};

export default BasicInfoSection;
