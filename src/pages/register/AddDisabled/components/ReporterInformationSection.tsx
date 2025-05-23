import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ReporterInformationSectionProps {
  formData: DisabledFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ReporterInformationSection: React.FC<ReporterInformationSectionProps> = ({
  formData,
  onChange,
  onNext,
  onPrev,
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
        {t('sections.reporter', 'Reporter Information')}
      </h3>

      {/* Basic reporter information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('reporter.name', 'Reporter Name')}
          name="guardian_name"
          value={formData.guardian_name || ''}
          onChange={onChange}
          
        />

        <div>
          <label className="block text-white font-medium mb-1 text-sm sm:text-base">
            {t('reporter.relationship', 'Relationship to Person')}
          </label>
          <select
            name="relationship"
            value={formData.relationship || ''}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 bg-white/10 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="text-black bg-white">
              {t('common.select', 'Select Relationship')}
            </option>
            <option value="father" className="text-black bg-white">
              {t('reporter.relationships.father', 'Father')}
            </option>
            <option value="mother" className="text-black bg-white">
              {t('reporter.relationships.mother', 'Mother')}
            </option>
            <option value="brother" className="text-black bg-white">
              {t('reporter.relationships.brother', 'Brother')}
            </option>
            <option value="sister" className="text-black bg-white">
              {t('reporter.relationships.sister', 'Sister')}
            </option>
            <option value="uncle" className="text-black bg-white">
              {t('reporter.relationships.uncle', 'Uncle')}
            </option>
            <option value="aunt" className="text-black bg-white">
              {t('reporter.relationships.aunt', 'Aunt')}
            </option>
            <option value="maternal_uncle" className="text-black bg-white">
              {t('reporter.relationships.maternal_uncle', 'Maternal Uncle')}
            </option>
            <option value="maternal_aunt" className="text-black bg-white">
              {t('reporter.relationships.maternal_aunt', 'Maternal Aunt')}
            </option>
            <option value="grandfather" className="text-black bg-white">
              {t('reporter.relationships.grandfather', 'Grandfather')}
            </option>
            <option value="grandmother" className="text-black bg-white">
              {t('reporter.relationships.grandmother', 'Grandmother')}
            </option>
          </select>
        </div>

        <Input
          label={t('reporter.occupation', 'Reporter Occupation')}
          name="reporter_occupation"
          value={formData.reporter_occupation || ''}
          onChange={onChange}

        />

        <Input
          label={t('reporter.education', 'Reporter Education')}
          name="reporter_education"
          value={formData.reporter_education || ''}
          onChange={onChange}
        />

        <Input
          label={t('reporter.reporterNationalId', 'Reporter National ID')}
          name="reporter_national_id"
          value={formData.reporter_national_id || ''}
          onChange={onChange}
          
        />
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('reporter.phoneNumber', 'Primary Phone Number')}
          name="guardian_phone"
          value={formData.guardian_phone || ''}
          onChange={onChange}
          
        />

        <Input
          label={t('reporter.reporterSecondaryPhone', 'Secondary Phone Number')}
          name="reporter_secondary_phone"
          value={formData.reporter_secondary_phone || ''}
          onChange={onChange}
        />

        <Input
          label={t('reporter.address', 'Address')}
          name="reporter_address"
          value={formData.reporter_address || ''}
          onChange={onChange}
          
        />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('reporter.absenceReportNumber', 'Absence Report Number')}
          name="absence_report_number"
          value={formData.absence_report_number || ''}
          onChange={onChange}
        />

        <Input
          label={t('reporter.absenceReportDate', 'Report Date')}
          name="absence_report_date"
          type="date"
          value={formData.absence_report_date || ''}
          onChange={onChange}
        />

        <Input
          label={t('reporter.policeStation', 'Police Station')}
          name="police_station"
          value={formData.police_station || ''}
          onChange={onChange}
        />

        <Input
          label={t('reporter.securityDirectorate', 'Security Directorate')}
          name="security_directorate"
          value={formData.security_directorate || ''}
          onChange={onChange}
        />
      </div>

      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default ReporterInformationSection;
