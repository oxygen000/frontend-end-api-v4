import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';
import TextArea from '../../../../components/Textarea';

interface CriminalRecordSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleToggleCriminalRecord: () => void;
  prevSection: () => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const CriminalRecordSection: React.FC<CriminalRecordSectionProps> = ({
  formData,
  handleInputChange,
  prevSection,
  nextSection,
  t,
}) => {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {t('registration.criminalRecord', 'Criminal Record Status')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.caseNumber', 'Case Number')}
          name="case_number"
          value={formData.case_number || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.policeStation', 'Police Station')}
          name="police_station"
          value={formData.police_station || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.recordNumber', 'Record Number')}
          name="record_number"
          value={formData.record_number || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.dossierNumber', 'Dossier Number')}
          name="dossier_number"
          value={formData.dossier_number || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.charge', 'Charge')}
          name="charge"
          value={formData.charge || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.accusation', 'Accusation/Charges')}
          name="accusation"
          value={formData.accusation || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.sentence', 'Sentence')}
          name="sentence"
          value={formData.sentence || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.courtGovernorate', 'Court Governorate')}
          name="court_governorate"
          value={formData.court_governorate || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('registration.judgment', 'Judgment/Sentence')}
          name="judgment"
          value={formData.judgment || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-2">
        <TextArea
          name="case_details"
          value={formData.case_details || ''}
          onChange={handleInputChange}
          label={t('registration.caseDetails', 'Additional Case Details')}
          className="w-full px-3 sm:px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base text-white min-h-[80px] resize-y"
        />
      </div>

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default CriminalRecordSection;
