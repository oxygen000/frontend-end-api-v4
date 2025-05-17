import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';

interface PersonalInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  nextSection,
  t,
}) => {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      <Input
        label={t('registration.fullName', 'Name')}
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.nickname', 'Nickname')}
        name="nickname"
        value={formData.nickname}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.dateOfBirth', 'Date of Birth')}
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.nationalId', 'National ID')}
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
      <Input
        label={t('registration.job', 'Job')}
        name="job"
        value={formData.job}
        onChange={handleInputChange}
      />
      <SectionButtons onNext={nextSection} />
    </motion.div>
  );
};

export default PersonalInfoSection;
