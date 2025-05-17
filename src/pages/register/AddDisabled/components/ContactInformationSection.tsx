import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ContactInformationSectionProps {
  personDetails: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  personDetails,
  handleInputChange,
  onNext,
  onPrev,
}) => {
  const { t } = useTranslationWithFallback();

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold">
        {t('registration.contactInfo', 'Contact Information')}
      </h3>
      <Input
        label={t('registration.phoneNumber', 'Phone Number')}
        name="phone_number"
        value={personDetails.phone_number}
        onChange={handleInputChange}
      />
      <div>
        <label className="block font-medium mb-1">
          {t('registration.phoneCompany', 'Telecom Company')}
        </label>
        <select
          name="phone_company"
          value={personDetails.phone_company}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white/10 text-black border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('common.select', 'Select Company')}</option>
          <option value="Orange">Orange</option>
          <option value="Etisalat">Etisalat</option>
          <option value="Vodafone">Vodafone</option>
          <option value="WE">WE</option>
        </select>
      </div>
      <Textarea
        label={t('registration.address', 'Address')}
        name="address"
        value={personDetails.address}
        onChange={handleInputChange}
      />
      <SectionButtons onPrev={onPrev} onNext={onNext} />
    </motion.div>
  );
};

export default ContactInformationSection;
