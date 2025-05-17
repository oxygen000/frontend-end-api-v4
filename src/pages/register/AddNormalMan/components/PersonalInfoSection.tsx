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
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  nextSection,
}) => {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <Input
        label="Nickname"
        name="nickname"
        value={formData.nickname}
        onChange={handleInputChange}
      />
      <Input
        label="Date of Birth"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleInputChange}
      />
      <Input
        label="National ID"
        name="national_id"
        value={formData.national_id}
        onChange={handleInputChange}
      />
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />
      <Input
        label="Job"
        name="job"
        value={formData.job}
        onChange={handleInputChange}
      />
      <SectionButtons onNext={nextSection} />
    </motion.div>
  );
};

export default PersonalInfoSection;
