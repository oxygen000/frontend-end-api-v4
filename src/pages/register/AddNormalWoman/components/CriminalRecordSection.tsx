import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';

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
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {t('registration.criminalRecord', 'Criminal Record Status')}
      </h3>

      <div className="flex items-center space-x-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <input
          type="checkbox"
          checked={formData.has_criminal_record}
          onChange={handleToggleCriminalRecord}
          className="h-4 w-4 sm:h-5 sm:w-5 accent-blue-500"
        />
        <label className="text-sm sm:text-base">
          {t('registration.hasCriminalRecord', 'Has Criminal Record')}
        </label>
      </div>

      {formData.has_criminal_record && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    className="space-y-4 pt-2"
  >
  

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label={t('registration.caseNumber', 'Case Number')}
        name="case_number"
        value={formData.case_number || ''}
        onChange={handleInputChange}
        
      />

      <Input
        label={t('registration.judgment', 'judgment ')}
        name="judgment"
        value={formData.judgment || ''}
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

  
    </div>

  
  </motion.div>
)}


      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default CriminalRecordSection;
