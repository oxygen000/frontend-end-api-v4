import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import type { FormData } from '../types/types';

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
        {t('registration.primaryContact', 'Primary Contact')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.phoneNumber', 'Phone Number')}
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            {t('registration.phoneCompany', 'Telecom Company')}
          </label>
          <select
            name="phone_company"
            value={formData.phone_company}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 text-white py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          >
            <option value="" className="text-black bg-white">
              {t('contact.selectCompany', 'Select Phone Company')}
            </option>
            <option value="Vodafone" className="text-black bg-white">
              {t('contact.vodafone', 'Vodafone')}
            </option>
            <option value="Orange" className="text-black bg-white">
              {t('contact.orange', 'Orange')}
            </option>
            <option value="Etisalat " className="text-black bg-white">
              {t('contact.Etisalat', 'Etisalat')}
            </option>
            <option value="WE" className="text-black bg-white">
              {t('contact.WE', 'WE')}
            </option>
          </select>
        </div>

        <Input
          label={t('registration.landlineNumber', 'Landline Number')}
          name="landline_number"
          type="tel"
          value={formData.landline_number || ''}
          onChange={handleInputChange}
        />
        <Input
          label={t('registration.serviceProvider', 'Service Provider')}
          name="service_provider"
          type="text"
          value={formData.service_provider || ''}
          onChange={handleInputChange}
        />

       

        <Input
          label={t('registration.secondPhoneNumber', 'second Phone Number')}
          name="second_phone_number"
          type="tel"
          value={formData.second_phone_number || ''}
          onChange={handleInputChange}
        />
      </div>

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default ContactInfoSection;
