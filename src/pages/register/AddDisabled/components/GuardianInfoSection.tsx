import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ReporterInformationSectionProps {
  formData: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ReporterInformationSection: React.FC<ReporterInformationSectionProps> = ({
  formData,
  handleInputChange,
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('reporterName', 'Reporter Name')}
          name="reporter_name"
          value={formData.reporter_name || ''}
          onChange={handleInputChange}
          required
        />
        <Input
          label={t('reporterNationalId', 'National ID')}
          name="reporter_national_id"
          value={formData.reporter_national_id || ''}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            {t('relationshipToMissing', 'Relationship to Reporter')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            name="reporter_relationship"
            value={formData.reporter_relationship || ''}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 text-white bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
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
      </div>

      {/* Reporter address */}
      <div className="grid grid-cols-1 gap-4">
        <Input
          label={t('reporterAddress', 'Address')}
          name="reporter_address"
          value={formData.reporter_address || ''}
          onChange={handleInputChange}
          required
        />
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('reporterPhone', 'Primary Phone')}
          name="reporter_phone"
          value={formData.reporter_phone || ''}
          onChange={handleInputChange}
          required
        />

        <Input
          label={t('reporterSecondaryPhone', 'Secondary Phone (Optional)')}
          name="reporter_secondary_phone"
          value={formData.reporter_secondary_phone || ''}
          onChange={handleInputChange}
        />
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('reporterOccupation', 'Occupation')}
          name="reporter_occupation"
          value={formData.reporter_occupation || ''}
          onChange={handleInputChange}
        />

        <Input
          label={t('reporterEducation', 'Education Level')}
          name="reporter_education"
          value={formData.reporter_education || ''}
          onChange={handleInputChange}
        />
      </div>


      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default ReporterInformationSection;
