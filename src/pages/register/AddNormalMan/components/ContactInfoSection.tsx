import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants, transition } from '../../../../config/animations';

interface ContactInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  prevSection: () => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  handleInputChange,
  prevSection,
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
        {t('registration.contactInfo', 'Contact Information')}
      </h3>
      <Input
        label={t('registration.phoneNumber', 'Phone Number')}
        name="phone_number"
        value={formData.phone_number}
        onChange={handleInputChange}
      />
      <div>
        <label className="block font-medium mb-1 text-sm sm:text-base">
          {t('registration.phoneCompany', 'Telecom Company')}
        </label>
        <select
          name="phone_company"
          value={formData.phone_company}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2 bg-white/10 text-black border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <option value="">{t('common.select', 'Select Company')}</option>
          <option value="Orange">Orange</option>
          <option value="Etisalat">Etisalat</option>
          <option value="Vodafone">Vodafone</option>
          <option value="WE">WE</option>
        </select>
      </div>
      <Input
        label={t('registration.secondaryPhone', 'Secondary Phone (Optional)')}
        name="second_phone_number"
        value={formData.second_phone_number || ''}
        onChange={handleInputChange}
      />
      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default ContactInfoSection;
