import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';
import Textarea from '../../../../components/Textarea';
interface MissingInformationSectionProps {
  formData: DisabledFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MissingInformationSection: React.FC<MissingInformationSectionProps> = ({
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
      {/* Disappearance details */}
      <h4 className="text-base font-medium text-purple-200 mt-4 mb-3 border-b border-purple-400/30 pb-2">
        {t('missing.disappearanceDetails', 'Disappearance Details')}
      </h4>

      {/* Date and time information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('forms.child.dateOfDisappearance', 'Date of Disappearance')}
          name="disappearance_date"
          type="date"
          value={formData.disappearance_date || ''}
          onChange={handleInputChange}
          required
        />

        <Input
          label={t('forms.child.timeOfDisappearance', 'Time of Disappearance')}
          name="disappearance_time"
          type="time"
          value={formData.disappearance_time || ''}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Location information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t(
            'forms.child.disappearanceLocation',
            'Area of Disappearance'
          )}
          name="area_of_disappearance"
          value={formData.area_of_disappearance || ''}
          onChange={handleInputChange}
          required
        />

        <Input
          label={t(
            'forms.child.reasonForLocation',
            'Reason for Being at That Location'
          )}
          name="reason_for_location"
          value={formData.reason_for_location || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Description information */}
      <div className="grid grid-cols-1 gap-4">
        <Input
          label={t('forms.child.clothes', 'Clothes Worn When Last Seen')}
          name="clothes_description"
          value={formData.clothes_description || ''}
          onChange={handleInputChange}
          required
        />

        <Textarea
          label={t('forms.child.lastSighting', 'Last Sighting Description')}
          name="last_sighting"
          value={formData.last_sighting || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            {t(
              'forms.child.wasAccompanied',
              'Was the Person Accompanied by Someone?'
            )}
          </label>
          <select
            name="was_accompanied"
            value={formData.was_accompanied || ''}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 text-white bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="" className="text-black">
              {t('common.select', 'Select an option')}
            </option>
            <option value="yes" className="text-black">
              {t('common.yes', 'Yes')}
            </option>
            <option value="no" className="text-black">
              {t('common.no', 'No')}
            </option>
            <option value="unknown" className="text-black">
              {t('common.unknown', 'Unknown')}
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            {t(
              'forms.child.goneMissingBefore',
              'Has the Child Gone Missing Before?'
            )}
          </label>
          <select
            name="gone_missing_before"
            value={formData.gone_missing_before || ''}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 text-white bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="" className="text-black">
              {t('common.select', 'Select an option')}
            </option>
            <option value="yes" className="text-black">
              {t('common.yes', 'Yes')}
            </option>
            <option value="no" className="text-black">
              {t('common.no', 'No')}
            </option>
            <option value="unknown" className="text-black">
              {t('common.unknown', 'Unknown')}
            </option>
          </select>
        </div>
      </div>

      {/* Additional information */}
      <div className="grid grid-cols-1 gap-4">
        <Textarea
          label={t(
            'forms.child.previousDisputes',
            'Previous Disputes or Issues'
          )}
          name="previous_disputes"
          value={formData.previous_disputes || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default MissingInformationSection;
