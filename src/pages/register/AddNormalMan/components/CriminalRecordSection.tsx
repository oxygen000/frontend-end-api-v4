import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';

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
  handleToggleCriminalRecord,
  prevSection,
  nextSection,
  t,
}) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <input
          type="checkbox"
          checked={formData.has_criminal_record}
          onChange={handleToggleCriminalRecord}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
        <label className="text-sm sm:text-base">
          {t('registration.hasCriminalRecord', 'Has Criminal Record')}
        </label>
      </div>
      {formData.has_criminal_record && (
        <>
          <Input
            label={t('registration.caseDetails', 'Case Details')}
            name="case_details"
            value={formData.case_details}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.policeStation', 'Police Station')}
            name="police_station"
            value={formData.police_station}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.caseNumber', 'Case Number')}
            name="case_number"
            value={formData.case_number}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.judgment', 'Judgment')}
            name="judgment"
            value={formData.judgment}
            onChange={handleInputChange}
          />
          <Input
            label={t('registration.accusation', 'Accusation')}
            name="accusation"
            value={formData.accusation}
            onChange={handleInputChange}
          />
        </>
      )}
      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default CriminalRecordSection;
