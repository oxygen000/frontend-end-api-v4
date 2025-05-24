import type { FormData } from '../types/types';

export const validateForm = (
  formData: FormData,
  currentSection: number,
  capturedImage: string | null
): string[] => {
  const errors: string[] = [];

  // Validate based on current section
  if (currentSection === 1) {
    // Personal Info validation
    if (!formData.name.trim()) {
      errors.push('Name is required');
    } else if (formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.dob) {
      errors.push('Date of Birth is required');
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        errors.push('Must be at least 18 years old');
      }
      if (dob > today) {
        errors.push('Date of Birth cannot be in the future');
      }
    }

    if (!formData.national_id.trim()) {
      errors.push('National ID is required');
    } else if (!/^\d{14}$/.test(formData.national_id)) {
      errors.push('National ID must be 14 digits');
    }

    if (!formData.category) {
      errors.push('Category is required');
    }
  } else if (currentSection === 2) {
    // Contact Info validation
    if (!formData.phone_number.trim()) {
      errors.push('Phone Number is required');
    } else if (!/^\d{11}$/.test(formData.phone_number)) {
      errors.push('Phone Number must be 11 digits');
    }

    if (!formData.phone_company) {
      errors.push('Telecom Company is required');
    }

    if (
      formData.second_phone_number &&
      !/^\d{11}$/.test(formData.second_phone_number)
    ) {
      errors.push('Second Phone Number must be 11 digits');
    }
  } else if (currentSection === 3) {
    // Criminal record validation
    if (formData.has_criminal_record) {
    
      if (!formData.case_number) {
        errors.push('Case Number is required when criminal record exists');
      }
    }
  } else if (currentSection === 4) {
    // Vehicle info validation
    if (formData.has_vehicle) {
      if (!formData.license_plate) {
        errors.push('License Plate is required for vehicle');
      }
      if (!formData.vehicle_model) {
        errors.push('Vehicle Model is required for vehicle');
      }
      if (!formData.license_expiration) {
        errors.push('License Expiration Date is required for vehicle');
      } else {
        const expDate = new Date(formData.license_expiration);
        const today = new Date();
        if (expDate < today) {
          errors.push('License has expired');
        }
      }
    }
  } else if (currentSection === 6) {
    // Image validation
    if (!formData.image && !capturedImage) {
      errors.push('Photo is required');
    } else {
      const imageToCheck = formData.image || capturedImage;
      if (imageToCheck instanceof File) {
        if (imageToCheck.size > 6 * 1024 * 1024) {
          errors.push('Image size should be less than 5MB');
        }
        if (
          !['image/jpeg', 'image/png', 'image/jpg'].includes(imageToCheck.type)
        ) {
          errors.push('Please upload a valid image file (JPEG, PNG)');
        }
      }
    }
  }

  return errors;
};
