import type { FormData } from '../types/types';

export const validateForm = (
  formData: FormData,
  currentSection: number,
  capturedImage: string | null
): string[] => {
  const errors: string[] = [];

  // Validation logic depending on the current step in the form wizard

  if (currentSection === 1) {
    // Section 1: Basic Information - required for identification
    if (!formData.full_name) {
      errors.push("Child's Name is required");
    }
    if (!formData.dob) {
      errors.push('Date of Birth is required');
    }
    if (!formData.gender) {
      errors.push('Gender is required');
    }
    if (!formData.address) {
      errors.push('Address is required');
    }
    if (
      formData.national_id &&
      formData.national_id.length > 0 &&
      formData.national_id.length < 14
    ) {
      errors.push('National ID should be 14 digits');
    }

  }  else if (currentSection === 3) {
    // Section 3: Reporter Information - mandatory for case follow-up
    if (!formData.reporter_name) {
      errors.push("Reporter's Name is required");
    }
    if (!formData.reporter_phone) {
      errors.push("Reporter's Phone is required");
    }
    if (!formData.reporter_relationship) {
      errors.push('Relationship to Reporter is required');
    }
    if (
      formData.reporter_phone &&
      formData.reporter_phone.length < 11
    ) {
      errors.push("Reporter's Phone should be 11 digits");
    }
    if (!formData.reporter_address) {
      errors.push("Reporter's Address is required");
    }

  } else if (currentSection === 4) {
    // Section 4: Medical Information - optional, limited to 500 characters
    if (
      formData.medical_condition &&
      formData.medical_condition.length > 500
    ) {
      errors.push('Medical History is too long (max 500 characters)');
    }

  } else if (currentSection === 5) {
    // Section 5: Disappearance Details - required for investigation
    if (!formData.disappearance_date) {
      errors.push('Date of Disappearance is required');
    }
    if (!formData.clothes_description) {
      errors.push('Clothes Worn is required');
    }
    if (!formData.area_of_disappearance) {
      errors.push('Last Known Location is required');
    }

  } else if (currentSection === 6) {
    // Section 6: Police Report - optional, no validation required currently

  } else if (currentSection === 7) {
    // Section 7: Image Upload - required for identification
    if (!capturedImage && !formData.image) {
      errors.push("Child's Photo is required");
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.push('Image size should be less than 5MB');
    }
  }

  return errors;
};
