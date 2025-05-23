import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { DisabledFormData } from '../types/disabled-form';

interface MedicalInfoSectionProps {
  formData: DisabledFormData;
  onChange: (
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
  onChange,
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
      <h3 className="text-base sm:text-lg font-semibold">
        {t('forms.child.medicalSection', 'Medical Information')}
      </h3>

      {/* Medical conditions */}
      <div className="grid grid-cols-1 gap-4">
        <Textarea
          label={t('forms.child.medicalHistory', 'Medical History')}
          name="medical_condition"
          value={formData.medical_condition || ''}
          onChange={onChange}
        />

        <Textarea
          label={t('registration.medicalHistory', 'Additional Medical History')}
          name="medical_history"
          value={formData.medical_history || ''}
          onChange={onChange}
        />
      </div>

      {/* Physician information */}
      <h4 className="text-base font-medium mt-4 text-blue-200">
        {t('forms.child.physicianInfo', 'Physician Information')}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t(
            'forms.child.treatingPhysician',
            'Treating Physician/Doctor'
          )}
          name="treating_physician"
          value={formData.treating_physician || ''}
          onChange={onChange}
        />

        <Input
          label={t('forms.child.physicianPhone', "Physician's Contact Number")}
          name="physician_phone"
          value={formData.physician_phone || ''}
          onChange={onChange}
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
            onChange={onChange}
        />
      </div>

      <SectionButtons onPrev={onPrev} onNext={onNext} />
    </motion.div>
  );
};

export default MedicalInfoSection;
