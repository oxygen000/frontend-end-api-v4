import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface MissingInformationSectionProps {
  formData: DisabledFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MissingInformationSection: React.FC<MissingInformationSectionProps> = ({
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
      

      {/* Disappearance details */}
      <h4 className="text-base font-medium text-purple-200 mt-4 mb-3 border-b border-purple-400/30 pb-2">
        {t('missing.disappearanceDetails', 'Disappearance Details')}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-4">
        <Input
          label={t('missing.disappearanceDate', 'Date of Disappearance')}
          name="disappearance_date"
          type="date"
          value={formData.disappearance_date || ''}
          onChange={onChange}
          placeholder={t(
            'missing.disappearanceDatePlaceholder',
            'Select date of disappearance'
          )}
        />

        <Input
          label={t('missing.disappearanceTime', 'Time of Disappearance')}
          name="disappearance_time"
          type="time"
          value={formData.disappearance_time || ''}
          onChange={onChange}
          placeholder={t(
            'missing.disappearanceTimePlaceholder',
            'Select time of disappearance'
          )}
        />

        <Input
          label={t('missing.areaOfDisappearance', 'Area of Disappearance')}
          name="area_of_disappearance"
          value={formData.area_of_disappearance || ''}
          onChange={onChange}
          placeholder={t(
            'missing.areaOfDisappearancePlaceholder',
            'Enter area where person disappeared'
          )}
        />

        <Input
          label={t('missing.lastSighting', 'Last Known Location')}
          name="last_sighting"
          value={formData.last_sighting || ''}
          onChange={onChange}
          placeholder={t(
            'missing.lastSightingPlaceholder',
            'Enter last known location'
          )}
        />

        <Input
          label={t('missing.clothesDescription', 'Clothes Description')}
          name="clothes_description"
          value={formData.clothes_description || ''}
          onChange={onChange}
          placeholder={t(
            'missing.clothesDescriptionPlaceholder',
            'Describe clothes worn at time of disappearance'
          )}
        />

        <Input
          label={t('missing.reasonForLocation', 'Reason for Being in Location')}
          name="reason_for_location"
          value={formData.reason_for_location || ''}
          onChange={onChange}
          placeholder={t(
            'missing.reasonForLocationPlaceholder',
            'Enter reason for being in the location'
          )}
        />
        
        <Input
          label={t('missing.lastSeenTime', 'last seen time')}
          name="last_seen_time"
          value={formData.last_seen_time|| ''}
          onChange={onChange}
          placeholder={t(
            'missing.reasonForLocationPlaceholder',
            'Enter reason for being in the location'
          )}
        />
        <Input
          label={t('missing.wasAccompanied', 'was accompanied')}
          name="was_accompanied"
          value={formData.was_accompanied|| ''}
          onChange={onChange}
          placeholder={t(
            'missing.reasonForLocationPlaceholder',
            'Enter reason for being in the location'
          )}
        />
 <Input
          label={t('missing.previousDisputes', 'previous disputes')}
          name="previous_disputes"
          value={formData.previous_disputes|| ''}
          onChange={onChange}
          placeholder={t(
            'missing.reasonForLocationPlaceholder',
            'Enter reason for being in the location'
          )}
        />
        
<div>
          <label className="block font-medium mb-1 text-white text-sm sm:text-base">
            {t(
              'missing.goneMissingBefore',
              'Has the Person Gone Missing Before?'
            )}
          </label>
          <select
            name="gone_missing_before"
            value={formData.gone_missing_before || ''}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 text-white bg-white/10 border  border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="" className="text-black ">
              {t('common.select', 'Select Option')}
            </option>
            <option value="yes" className="text-black">
              {t('common.yes', 'Yes')}
            </option>
            <option value="no" className="text-black">
              {t('common.no', 'No')}
            </option>
          </select>
        </div>
      </div>


      <div className="mt-6">
        <SectionButtons onNext={onNext} onPrev={onPrev} />
      </div>
    </motion.div>
  );
};

export default MissingInformationSection;
