import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';

interface PersonalInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
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
      <h3 className="text-base sm:text-lg font-semibold mb-2">
        {t('registration.personalInfo', 'Personal Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.fullName', 'Full Name')}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          
        />
        <Input
          label={t('registration.dateOfBirth', 'Date of Birth')}
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />

        <Input
          label={t('registration.nickname', 'Nickname')}
          name="nickname"
          value={formData.nickname || ''}
          onChange={handleInputChange}

        />
        <Input
          label={t('registration.mothers_name', 'mother name')}
          name="mothers_name"
          value={formData.mothers_name || ''}
          onChange={handleInputChange}
          
        />
        <Input
          label={t('registration.marital_status', 'Marital Status')}
          name="marital_status"
          value={formData.marital_status || ''}
          onChange={handleInputChange}
        />
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-2 mt-6">
        {t('registration.personalInfo', 'Personal Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.nationalId', 'National ID')}
          name="national_id"
          value={formData.national_id}
          onChange={handleInputChange}
          required
          
        />
        <Input
          label={t(
            'registration.educational_qualification',
            'Educational Qualification'
          )}
          name="educational_qualification"
          value={formData.educational_qualification || ''}
          onChange={handleInputChange}
          required
        />
        <Input
          label={t('registration.occupation', 'Occupation')}
          name="occupation"
          value={formData.occupation || ''}
          onChange={handleInputChange}
          
        />
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-2 mt-6">
        {t('registration.location', 'Location & Occupation')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('registration.governorate', 'governorate')}
          name="governorate"
          value={formData.governorate || ''}
          onChange={handleInputChange}
        
        />

        <Input
          label={t('registration.address', 'Address')}
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
         
        />

        <Input
          label={t('registration.issuing_authority', 'Issuing Authority')}
          name="issuing_authority"
          value={formData.issuing_authority || ''}
          onChange={handleInputChange}
          
        />

        <Input
          label={t('registration.issue_date', 'Issue Date')}
          name="issue_date"
          type="date"
          value={formData.issue_date || ''}
          onChange={handleInputChange}
            
        />
        </div>

      <SectionButtons onNext={nextSection} />
    </motion.div>
  );
};

export default PersonalInfoSection;
