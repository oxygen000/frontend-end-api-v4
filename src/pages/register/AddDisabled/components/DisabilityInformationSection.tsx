import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface DisabilityInformationSectionProps {
  personDetails: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DisabilityInformationSection: React.FC<
  DisabilityInformationSectionProps
> = ({ personDetails, handleInputChange, onNext, onPrev }) => {
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
        {t('forms.disabled.disabilityInfo', 'Disability Information')}
      </h3>
      <div>
        <label className="block font-medium mb-1">
          {t('forms.disabled.disabilityType', 'Disability Type')}
        </label>
        <select
          name="disability_type"
          value={personDetails.disability_type}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white/10 border text-black border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">
            {t('common.select', 'Select Disability Type')}
          </option>
          <option value="physical">{t('physical', 'Physical')}</option>
          <option value="visual">{t('visual', 'Visual')}</option>
          <option value="hearing">{t('hearing', 'Hearing')}</option>
          <option value="cognitive">{t('cognitive', 'Cognitive')}</option>
          <option value="multiple">
            {t('multiple', 'Multiple Disabilities')}
          </option>
          <option value="other">{t('common.other', 'Other')}</option>
        </select>
      </div>
      <Textarea
        label={t('forms.disabled.disabilityDetails', 'Disability Details')}
        name="disability_description"
        value={personDetails.disability_description}
        onChange={handleInputChange}
      />
      <Textarea
        label={t(
          'forms.disabled.medicalConditions',
          'Medical Conditions (Optional)'
        )}
        name="medical_condition"
        value={personDetails.medical_condition}
        onChange={handleInputChange}
      />
      <Input
        label={t('forms.disabled.specialNeeds', 'Additional Notes (Optional)')}
        name="special_needs"
        value={personDetails.special_needs}
        onChange={handleInputChange}
      />

      <SectionButtons onPrev={onPrev} onNext={onNext} />
    </motion.div>
  );
};

export default DisabilityInformationSection;
