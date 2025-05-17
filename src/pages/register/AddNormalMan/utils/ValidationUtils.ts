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
    // Personal Info validation
    if (!formData.name.trim()) {
      errors.push(t('validation.nameRequired', 'Name is required'));
    } else if (formData.name.length < 2) {
      errors.push(
        t('validation.nameLength', 'Name must be at least 2 characters long')
      );
    }

    if (!formData.dob) {
      errors.push(t('validation.dobRequired', 'Date of Birth is required'));
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        errors.push(
          t('validation.ageMinimum', 'Must be at least 18 years old')
        );
      }
      if (dob > today) {
        errors.push(
          t('validation.dobFuture', 'Date of Birth cannot be in the future')
        );
      }
    }

    if (!formData.national_id.trim()) {
      errors.push(
        t('validation.nationalIdRequired', 'National ID is required')
      );
    } else if (!/^\d{14}$/.test(formData.national_id)) {
      errors.push(
        t('validation.nationalIdDigits', 'National ID must be 14 digits')
      );
    }

    if (!formData.category.trim()) {
      errors.push(t('validation.categoryRequired', 'Category is required'));
    }
  } else if (currentSection === 2) {
    // Contact Info validation
    if (!formData.phone_number.trim()) {
      errors.push(t('validation.phoneRequired', 'Phone Number is required'));
    } else if (!/^\d{11}$/.test(formData.phone_number)) {
      errors.push(
        t('validation.phoneDigits', 'Phone Number must be 11 digits')
      );
    }

    if (!formData.phone_company) {
      errors.push(
        t('validation.phoneCompanyRequired', 'Telecom Company is required')
      );
    }

    if (
      formData.second_phone_number &&
      !/^\d{11}$/.test(formData.second_phone_number)
    ) {
      errors.push(
        t(
          'validation.secondPhoneDigits',
          'Second Phone Number must be 11 digits'
        )
      );
    }
  } else if (currentSection === 3) {
    // Criminal record validation
    if (formData.has_criminal_record) {
      if (!formData.case_details.trim()) {
        errors.push(
          t(
            'validation.caseDetailsRequired',
            'Case Details are required when criminal record exists'
          )
        );
      }
      if (!formData.police_station.trim()) {
        errors.push(
          t(
            'validation.policeStationRequired',
            'Police Station is required when criminal record exists'
          )
        );
      }
      if (!formData.case_number.trim()) {
        errors.push(
          t(
            'validation.caseNumberRequired',
            'Case Number is required when criminal record exists'
          )
        );
      }
    }
  } else if (currentSection === 4) {
    // Vehicle info validation
    if (formData.has_motorcycle) {
      if (!formData.license_plate.trim()) {
        errors.push(
          t(
            'validation.licensePlateRequired',
            'License Plate is required for motorcycle'
          )
        );
      }
      if (!formData.vehicle_model.trim()) {
        errors.push(
          t(
            'validation.vehicleModelRequired',
            'Vehicle Model is required for motorcycle'
          )
        );
      }
      if (!formData.license_expiration) {
        errors.push(
          t(
            'validation.licenseExpirationRequired',
            'License Expiration Date is required for motorcycle'
          )
        );
      } else {
        const expDate = new Date(formData.license_expiration);
        const today = new Date();
        if (expDate < today) {
          errors.push(t('validation.licenseExpired', 'License has expired'));
        }
      }
    }
  } else if (currentSection === 6) {
    // Image validation
    if (!formData.image && !capturedImage) {
      errors.push(t('validation.photoRequired', 'Photo is required'));
    } else {
      const imageToCheck = formData.image || capturedImage;
      if (imageToCheck instanceof File) {
        if (imageToCheck.size > 6 * 1024 * 1024) {
          errors.push(
            t('validation.imageSizeLimit', 'Image size should be less than 5MB')
          );
        }
        if (
          !['image/jpeg', 'image/png', 'image/jpg'].includes(imageToCheck.type)
        ) {
          errors.push(
            t(
              'validation.imageTypeInvalid',
              'Please upload a valid image file (JPEG, PNG)'
            )
          );
        }
      }
    }
  }

  return errors;
};
