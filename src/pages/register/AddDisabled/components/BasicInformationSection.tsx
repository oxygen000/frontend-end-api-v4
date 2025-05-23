import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';
interface BasicInformationSectionProps {
  formData: DisabledFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev?: () => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  onChange,
  onNext,
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
        {t('sections.basic', 'Basic Information')}
      </h3>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('basic.fullName', 'Full Name')}
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder={t('basic.fullNamePlaceholder', 'Enter full name')}
        />
        <Input
          label={t('basic.nationalId', 'National ID')}
          name="national_id"
          value={formData.national_id}
          onChange={onChange}
          placeholder={t(
            'basic.nationalIdPlaceholder',
            'Enter national ID if available'
          )}
        />

        <Input
          label={t('basic.dateOfBirth', 'Date of Birth')}
          name="dob"
          type="date"
          value={formData.dob}
          onChange={onChange}
          required
        />
        <Input 
        label={t('basic.address', 'address')}
        name="age"
        value={formData.address}
        onChange={onChange}
        required
        placeholder={t('basic.addressPlaceholder', 'Enter address')}
        />

        <div>
          <label className="block text-white font-medium mb-1 text-sm sm:text-base">
            {t('basic.gender', 'Gender')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 bg-white/10 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            style={{ colorScheme: 'dark' }}
            required
          >
            <option value="" className="text-black bg-white">
              {t('basic.selectGender', 'Select Gender')}
            </option>
            <option value="male" className="text-black bg-white">
              {t('basic.male', 'Male')}
            </option>
            <option value="female" className="text-black bg-white">
              {t('basic.female', 'Female')}
            </option>
          </select>
        </div>

        
        <Input
          label={t('basic.reporter_occupation', 'Missing Person Occupation')}
          name="missing_person_occupation"
          value={formData.missing_person_occupation || ''}
          onChange={onChange}
          required
          placeholder={t('basic.reporter_occupation', 'Enter occupation')}
        />
        <Input
          label={t('basic.reporter_education', 'Missing Person Education')}
          name="missing_person_education"
          value={formData.missing_person_education || ''}
          onChange={onChange}
          required
          placeholder={t('basic.reporter_education', 'Enter education level')}
        />
      </div>

      <div className="mt-6">
        <SectionButtons onNext={onNext} />
      </div>
    </motion.div>
  );
};

export default BasicInformationSection;
