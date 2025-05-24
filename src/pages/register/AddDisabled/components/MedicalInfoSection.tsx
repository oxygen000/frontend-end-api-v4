import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { DisabledFormData } from '../types/disabled-form';

interface MedicalInfoSectionProps {
  formData: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onPrev: () => void;
  onNext: () => void;
  t: (key: string, fallback: string) => string;
}

const MedicalInfoSection: React.FC<MedicalInfoSectionProps> = ({
  formData,
  handleInputChange,
  onPrev,
  onNext,
  t,
}) => {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-4"
    >
      <h3 className="text-base text-white sm:text-lg font-semibold">
        {t('forms.child.medicalSection', 'Medical Information')}
      </h3>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
          label={t('registration.medicalHistory', 'Additional Medical History')}
          name="medical_history"
          value={formData.medical_history || ''}
          onChange={handleInputChange}
        />
        <Input
          label={t(
            'forms.child.treatingPhysician',
            'Treating Physician/Doctor'
          )}
          name="treating_physician"
          value={formData.treating_physician || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('forms.child.physicianPhone', "Physician's Contact Number")}
          name="physician_phone"
          value={formData.physician_phone || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Additional notes */}
      <div className="grid grid-cols-1 gap-4">
        <Textarea
          label={t(
            'forms.child.additionalData',
            'Additional Medical Information'
          )}
          name="additional_notes"
          value={formData.additional_notes || ''}
          onChange={handleInputChange}
        />
      </div>

      <SectionButtons onPrev={onPrev} onNext={onNext} />
    </motion.div>
  );
};

export default MedicalInfoSection;
