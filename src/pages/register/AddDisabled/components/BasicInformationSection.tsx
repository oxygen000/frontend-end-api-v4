import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface BasicInformationSectionProps {
  personDetails: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  personDetails,
  handleInputChange,
  onNext,
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
        {t('registration.personalInfo', 'Basic Information')}
      </h3>
      <Input
        label={t('registration.fullName', 'Full Name')}
        name="name"
        value={personDetails.name}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.dateOfBirth', 'Date of Birth')}
        name="dob"
        type="date"
        value={personDetails.dob}
        onChange={handleInputChange}
      />
      <div>
        <label className="block font-medium mb-1">
          {t('registration.gender', 'Gender')}
        </label>
        <select
          name="gender"
          value={personDetails.gender}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white/10 border text-black border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">
            {t('registration.selectGender', 'Select Gender')}
          </option>
          <option value="male">{t('registration.male', 'Male')}</option>
          <option value="female">{t('registration.female', 'Female')}</option>
        </select>
      </div>
      <Input
        label={t('registration.nationalId', 'National ID')}
        name="national_id"
        value={personDetails.national_id}
        onChange={handleInputChange}
      />
      <SectionButtons onNext={onNext} />
    </motion.div>
  );
};

export default BasicInformationSection;
