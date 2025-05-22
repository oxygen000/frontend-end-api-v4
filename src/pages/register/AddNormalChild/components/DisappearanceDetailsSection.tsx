import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import { sectionVariants, transition } from '../../../../config/animations';
import SectionButtons from './SectionButtons';
import type { FormData } from '../types/types';

interface DisappearanceDetailsSectionProps {
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

const DisappearanceDetailsSection: React.FC<
  DisappearanceDetailsSectionProps
> = ({ formData, handleInputChange, prevSection, nextSection, t }) => {
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
        {t('forms.child.disappearanceDetails', 'Disappearance Details')}
      </h3>

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

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default DisappearanceDetailsSection;
