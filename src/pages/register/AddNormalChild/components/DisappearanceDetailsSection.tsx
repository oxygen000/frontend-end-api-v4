import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { FormData } from '../types/types';

interface DisappearanceDetailsSectionProps {
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

const DisappearanceDetailsSection: React.FC<
  DisappearanceDetailsSectionProps
> = ({ formData, handleInputChange, prevSection, nextSection, t }) => {
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
        {t('forms.child.missingPersonInfo', 'Missing Person Info')}
      </h3>
      <Input
        label={t('forms.child.dateOfDisappearance', 'Date of Disappearance')}
        name="last_seen_time"
        type="datetime-local"
        value={formData.last_seen_time}
        onChange={handleInputChange}
      />
      <Input
        label={t('forms.child.disappearanceLocation', 'Last Known Location')}
        name="last_seen_location"
        value={formData.last_seen_location}
        onChange={handleInputChange}
      />
      <Textarea
        label={t('forms.child.clothes', 'Clothes Worn When Last Seen')}
        name="last_seen_clothes"
        value={formData.last_seen_clothes}
        onChange={handleInputChange}
      />
      <Textarea
        label={t('forms.child.medicalHistory', 'Medical History')}
        name="medical_condition"
        value={formData.medical_condition}
        onChange={handleInputChange}
      />
      <Textarea
        label={t('forms.child.distinguishingMark', 'Distinguishing Mark')}
        name="physical_description"
        value={formData.physical_description}
        onChange={handleInputChange}
      />
      <Textarea
        label={t('forms.child.additionalData', 'Additional Data')}
        name="additional_data"
        value={formData.additional_data}
        onChange={handleInputChange}
      />
      <Textarea
        label={t('forms.child.previousDisputes', 'Previous Disputes')}
        name="additional_notes"
        value={formData.additional_notes}
        onChange={handleInputChange}
      />
      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default DisappearanceDetailsSection;
