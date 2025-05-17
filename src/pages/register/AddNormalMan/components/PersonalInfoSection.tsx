import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';

interface PersonalInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
  errors?: Record<string, string>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  nextSection,
  t,
  errors = {},
}) => {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.fullName', 'Full Name')}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={errors.name}
          placeholder={t('registration.fullName', 'Enter your full name')}
        />

        <Input
          label={t('registration.nickname', 'Nickname')}
          name="nickname"
          value={formData.nickname}
          onChange={handleInputChange}
          placeholder={t('registration.nickname', 'Enter your nickname')}
          error={errors.nickname}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.dateOfBirth', 'Date of Birth')}
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          required
          error={errors.dob}
        />

        <Input
          label={t('registration.nationalId', 'National ID')}
          name="national_id"
          value={formData.national_id}
          onChange={handleInputChange}
          required
          error={errors.national_id}
          placeholder={t('registration.nationalId', 'Enter your national ID')}
        />
      </div>

      <Input
        label={t('registration.address', 'Address')}
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        error={errors.address}
        placeholder={t('registration.address', 'Enter your full address')}
      />

      <Input
        label={t('registration.job', 'Occupation')}
        name="job"
        value={formData.job}
        onChange={handleInputChange}
        error={errors.job}
        placeholder={t('registration.job', 'Enter your occupation')}
      />

      <SectionButtons onNext={nextSection} />
    </motion.div>
  );
};

export default PersonalInfoSection;
