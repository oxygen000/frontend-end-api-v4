import type { FormData } from '../types/types';

export const validateForm = (
  formData: FormData,
  currentSection: number,
  capturedImage: string | null,
  t: (key: string, fallback: string) => string
): string[] => {
  const errors: string[] = [];

  // Validate based on current section
  if (currentSection === 1) {
    if (!formData.name) {
      errors.push(
        t('forms.child.childFullName', "Child's Name") +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.dob) {
      errors.push(
        t('forms.child.age', 'Date of Birth') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.gender) {
      errors.push(
        t('registration.gender', 'Gender') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
  } else if (currentSection === 2) {
    if (!formData.guardian_name) {
      errors.push(
        t('forms.child.reporterName', "Guardian's Name") +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.guardian_phone) {
      errors.push(
        t('forms.child.reporterPhone', "Guardian's Phone") +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.relationship) {
      errors.push(
        t('forms.child.relationshipToMissing', 'Relationship to child') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.phone_company) {
      errors.push(
        t('registration.phoneCompany', 'Telecom Company') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
  } else if (currentSection === 3) {
    if (!formData.last_seen_time) {
      errors.push(
        t('forms.child.dateOfDisappearance', 'Last Seen (Date & Time)') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.last_seen_clothes) {
      errors.push(
        t('forms.child.clothes', 'Clothes Worn') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
    if (!formData.last_seen_location) {
      errors.push(
        t('forms.child.disappearanceLocation', 'Last Known Location') +
          ' ' +
          t('validation.required', 'is required')
      );
    }
  } else if (currentSection === 4) {
    if (!capturedImage && !formData.image) {
      errors.push(
        t('forms.child.recentPhoto', "Child's Photo") +
          ' ' +
          t('validation.required', 'is required')
      );
    }

    // Validate image size if exists
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.push(
        t('validation.imageSizeLimit', 'Image size should be less than 5MB')
      );
    }
  }

  return errors;
};
