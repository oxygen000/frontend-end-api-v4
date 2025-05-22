import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ContactInformationSectionProps {
  formData: DisabledFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  formData,
  onChange,
  onNext,
  onPrev,
}) => {
  const { t } = useTranslationWithFallback('forms/disabled');

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-4 sm:space-y-5"
    >
      <h3 className="text-base text-white sm:text-lg font-semibold mb-3 border-b border-purple-400/30 pb-2">
        {t('sections.contact', 'Contact Information')}
      </h3>

      {/* Primary contact information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('contact.phoneNumber', 'Phone Number')}
          name="phone_number"
          value={formData.phone_number}
          onChange={onChange}
          required
          placeholder={t(
            'contact.phoneNumberPlaceholder',
            'Enter primary phone number'
          )}
        />

        <div>
          <label className="block text-white font-medium mb-1 text-sm sm:text-base">
            {t('contact.phoneCompany', 'Phone Company')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="phone_company"
            value={formData.phone_company}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 bg-white/10 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            style={{ colorScheme: 'dark' }}
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
          label={t('contact.secondPhoneNumber', 'Secondary Phone Number')}
          name="second_phone_number"
          value={formData.second_phone_number}
          onChange={onChange}
          placeholder={t(
            'contact.secondPhoneNumberPlaceholder',
            'Enter secondary phone number (optional)'
          )}
        />

        <Input
          label={t('contact.first_friend', 'First Friend')}
          name="first_friend"
          value={formData.first_friend || ''}
          onChange={onChange}
        />
        <Input
          label={t('contact.second_friend', 'Second Friend')}
          name="second_friend"
          value={formData.second_friend || ''}
          onChange={onChange}
        />
        <Input
          label={t('contact.first_friend_phone', 'First Friend Phone')}
          name="first_friend_phone"
          value={formData.first_friend_phone || ''}
          onChange={onChange}
        />
        <Input
          label={t('contact.second_friend_phone', 'Second Friend Phone')}
          name="second_friend_phone"
          value={formData.second_friend_phone || ''}
          onChange={onChange}
        />
        
        
        

       
      </div>

      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default ContactInformationSection;
