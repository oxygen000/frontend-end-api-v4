import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { DisabledFormData } from '../types/disabled-form';

interface PoliceReportSectionProps {
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

const PoliceReportSection: React.FC<PoliceReportSectionProps> = ({
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
      <h3 className="text-base sm:text-lg font-semibold">
        {t('forms.child.policeReport', 'Police Report Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.absenceReportNumber', 'Absence Report Number')}
          name="absence_report_number"
          value={formData.absence_report_number || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('forms.child.absenceReportDate', 'Report Date')}
          name="absence_report_date"
          type="date"
          value={formData.absence_report_date || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Location information */}
      <h4 className="text-base font-medium mt-4 text-blue-200">
        {t('forms.child.missingLocation', 'Missing Location')}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.policeStation', 'Police Station')}
          name="police_station"
          value={formData.police_station || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('forms.child.securityDirectorate', 'Security Directorate')}
          name="security_directorate"
          value={formData.security_directorate || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.governorate', 'Governorate')}
          name="governorate"
          value={formData.governorate || ''}
          onChange={handleInputChange}
        />
      </div>
      <SectionButtons onPrev={onPrev} onNext={onNext} />
    </motion.div>
  );
};

export default PoliceReportSection;
