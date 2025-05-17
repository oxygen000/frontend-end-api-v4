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
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-3 sm:space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold">
        {t('forms.child.missingPersonInfo', 'Missing Person Info')}
      </h3>
      <Input
        label={t('forms.child.childFullName', 'Child Full Name')}
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />

      <Input
        label={t('forms.child.age', 'Age')}
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleInputChange}
      />
      <div>
        <label className="block font-medium mb-1 text-sm sm:text-base">
          {t('registration.gender', 'Gender')}
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2 bg-white/10 border text-black border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <option value="">
            {t('registration.selectGender', 'Select Gender')}
          </option>
          <option value="male">{t('registration.male', 'Male')}</option>
          <option value="female">{t('registration.female', 'Female')}</option>
        </select>
      </div>
      <Input
        label={t('forms.child.childId', 'Child ID')}
        name="national_id"
        value={formData.national_id}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.address', 'Address')}
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />
      <SectionButtons onNext={nextSection} />
    </motion.div>
  );
};

export default BasicInfoSection;
