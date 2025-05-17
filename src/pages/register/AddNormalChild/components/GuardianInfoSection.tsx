import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { FormData } from '../types/types';

interface GuardianInfoSectionProps {
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

const GuardianInfoSection: React.FC<GuardianInfoSectionProps> = ({
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
      transition={transition}
      className="space-y-3 sm:space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold">
        {t('forms.child.reporterInfo', 'Reporter Info')}
      </h3>
      <Input
        label={t('forms.child.reporterName', 'Reporter Name')}
        name="guardian_name"
        value={formData.guardian_name}
        onChange={handleInputChange}
      />
      <Input
        label={t('forms.child.reporterPhone', 'Reporter Phone')}
        name="guardian_phone"
        value={formData.guardian_phone}
        onChange={handleInputChange}
      />
      <div>
        <label className="block font-medium mb-1 text-sm sm:text-base">
          {t('registration.phoneCompany', 'Phone Company')}
        </label>
        <select
          name="phone_company"
          value={formData.phone_company}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2 bg-white/10 text-black border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <option value="">Select Company</option>
          <option value="Orange">Orange</option>
          <option value="Etisalat">Etisalat</option>
          <option value="Vodafone">Vodafone</option>
          <option value="WE">WE</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {t(
            'forms.child.relationshipToMissing',
            'Relationship to Missing Person'
          )}
        </label>
        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2 text-black bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        >
          <option value="">
            {t('relationships.select', 'Select Relationship')}
          </option>
          <option value="parent">{t('relationships.parent', 'Parent')}</option>
          <option value="grandparent">
            {t('relationships.grandparent', 'Grandparent')}
          </option>
          <option value="sibling">
            {t('relationships.sibling', 'Sibling')}
          </option>
          <option value="aunt/uncle">
            {t('relationships.auntUncle', 'Aunt/Uncle')}
          </option>
        </select>
      </div>
      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default GuardianInfoSection;
