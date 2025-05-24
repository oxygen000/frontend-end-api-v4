import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ContactInformationSectionProps {
  formData: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  formData,
  handleInputChange,
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

      {/* Missing person contact information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.phoneNumber', 'Phone Number')}
          name="emergency_phone"
          value={formData.emergency_phone || ''}
          onChange={handleInputChange}
        />

        <div>
          <label className="block font-medium text-white mb-1 text-sm sm:text-base">
            {t('registration.phoneCompany', 'Telecom Company')}
          </label>
          <select
            name="phone_company"
            value={formData.phone_company}
            onChange={handleInputChange}
            className="w-full px-3  sm:px-4 py-2 text-white bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
      </div>

      {/* Personal details related to contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.education', 'Education Level (Optional)')}
          name="missing_person_education"
          value={formData.missing_person_education || ''}
          onChange={handleInputChange}
        />
        <Input
          label={t('registration.distinctive_mark', 'Distinctive Mark ')}
          name="distinctive_mark"
          value={formData.distinctive_mark || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.firstFriend', "Friend's Name")}
          name="first_friend"
          value={formData.first_friend || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('forms.child.firstFriendPhone', "Friend's Phone")}
          name="first_friend_phone"
          value={formData.first_friend_phone || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.secondFriend', "Second Friend's Name")}
          name="second_friend"
          value={formData.second_friend || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('forms.child.secondFriendPhone', "Second Friend's Phone")}
          name="second_friend_phone"
          value={formData.second_friend_phone || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default ContactInformationSection;
