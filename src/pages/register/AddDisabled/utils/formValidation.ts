import type {
  DisabledFormData,
  DisabledFormSection,
} from '../types/disabled-form';

// Define TranslationFunction type based on useTranslationWithFallback hook
type TranslationFunction = (key: string, fallback?: string) => string;

/**
 * Validates the form based on the current section
 * @param personDetails Form data
 * @param currentSection Current form section
 * @param capturedImage Optional captured webcam image
 * @param t Translation function
 * @returns Array of validation errors
 */
export const validateForm = (
  personDetails: DisabledFormData,
  currentSection: DisabledFormSection,
  capturedImage: string | null,
  t: TranslationFunction
): string[] => {
  const errors: string[] = [];

  // Validate based on current section
  if (currentSection === 1) {
    if (!personDetails.name)
      errors.push(t('validation.required', "Person's Name is required"));
    if (!personDetails.dob)
      errors.push(t('validation.required', 'Date of Birth is required'));
    if (!personDetails.gender)
      errors.push(t('validation.required', 'Gender is required'));
  } else if (currentSection === 2) {
    if (!personDetails.phone_number)
      errors.push(t('validation.required', 'Phone Number is required'));
    if (!personDetails.address)
      errors.push(t('validation.required', 'Address is required'));
  } else if (currentSection === 3) {
    if (!personDetails.disability_type)
      errors.push(t('validation.required', 'Disability Type is required'));
  } else if (currentSection === 4) {
    if (!personDetails.image && !capturedImage)
      errors.push(t('validation.required', "Person's Photo is required"));
  }

  return errors;
};

/**
 * Builds form data for API submission
 * @param personDetails Form data
 * @param capturedImage Optional captured webcam image
 * @returns FormData object ready for submission
 */
export const buildSubmissionFormData = (
  personDetails: DisabledFormData,
  capturedImage: string | null
): FormData => {
  // Create a FormData object to handle file upload
  const formDataToSend = new FormData();

  // Log if capturedImage exists (avoids unused parameter warning)
  if (capturedImage !== null) {
    console.debug('Using captured image from webcam');
  }

  // Basic user fields - match exactly what the backend expects
  formDataToSend.append('name', personDetails.name);
  formDataToSend.append('nickname', personDetails.name.split(' ')[0] || '');
  formDataToSend.append('dob', personDetails.dob);
  formDataToSend.append('national_id', personDetails.national_id || '');
  formDataToSend.append('address', personDetails.address || '');
  formDataToSend.append('gender', personDetails.gender || '');

  // Ensure these fields are set, as they are required by the backend
  formDataToSend.append('phone_number', personDetails.phone_number || '');
  formDataToSend.append('phone_company', personDetails.phone_company || '');
  formDataToSend.append(
    'second_phone_number',
    personDetails.second_phone_number || ''
  );

  formDataToSend.append('category', 'disabled');
  formDataToSend.append('form_type', 'disabled');

  // Ensure bypass parameters are set to true
  formDataToSend.append('bypass_angle_check', 'true');
  formDataToSend.append('train_multiple', 'true');

  // Disability-specific fields
  formDataToSend.append('disability_type', personDetails.disability_type || '');
  formDataToSend.append(
    'disability_details',
    personDetails.disability_description || ''
  );
  formDataToSend.append(
    'disability_description',
    personDetails.disability_description || ''
  );
  formDataToSend.append(
    'medical_condition',
    personDetails.medical_condition || ''
  );
  formDataToSend.append('special_needs', personDetails.special_needs || '');
  formDataToSend.append(
    'emergency_contact',
    personDetails.emergency_contact || ''
  );
  formDataToSend.append('emergency_phone', personDetails.emergency_phone || '');
  formDataToSend.append(
    'additional_notes',
    personDetails.additional_notes || ''
  );

  // Do NOT send these fields to avoid conflicts with backend-generated values
  // formDataToSend.append('employee_id', '');
  // formDataToSend.append('department', '');
  // formDataToSend.append('role', '');

  // Create a complete data object and append as JSON
  const userData = {
    name: personDetails.name,
    nickname: personDetails.name.split(' ')[0] || '',
    dob: personDetails.dob,
    date_of_birth: personDetails.dob,
    national_id: personDetails.national_id || '',
    address: personDetails.address || '',
    category: 'disabled',
    form_type: 'disabled',
    phone_number: personDetails.phone_number || '',
    phone_company: personDetails.phone_company || '',
    second_phone_number: personDetails.second_phone_number || '',
    disability_type: personDetails.disability_type || '',
    disability_details: personDetails.disability_description || '',
    disability_description: personDetails.disability_description || '',
    medical_condition: personDetails.medical_condition || '',
    special_needs: personDetails.special_needs || '',
    emergency_contact: personDetails.emergency_contact || '',
    emergency_phone: personDetails.emergency_phone || '',
    additional_notes: personDetails.additional_notes || '',
    gender: personDetails.gender || '',
    // Remove these fields to avoid sending empty strings that might conflict with backend
    // employee_id: '',
    // department: '',
    // role: '',
  };

  // Append the complete user data in JSON format
  formDataToSend.append('user_data', JSON.stringify(userData));

  // For disabled_data, we need to ensure it's properly formatted JSON
  formDataToSend.append('disabled_data', JSON.stringify(userData));

  return formDataToSend;
};

/**
 * Prepares the image file for submission from either file upload or webcam capture
 * @param file Optional file from file input
 * @param capturedImage Optional captured webcam image
 * @returns Image file or null if no image is available
 */
export const prepareImageFile = (
  file: File | null,
  capturedImage: string | null
): File | null => {
  // If image was uploaded from file input
  if (file) {
    return file;
  }

  // If image was captured from webcam, convert base64 to file
  if (capturedImage) {
    try {
      // Extract the base64 part if it's a data URL
      let base64Data = capturedImage;
      if (base64Data.startsWith('data:image/jpeg;base64,')) {
        base64Data = capturedImage.split(',')[1];
      } else if (base64Data.startsWith('data:')) {
        // Handle other image formats
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          base64Data = matches[2];
        } else {
          console.error('Invalid data URL format');
          throw new Error('Invalid image format from webcam');
        }
      }

      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: 'image/jpeg' });
      return new File([blob], `webcam_capture_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      return null;
    }
  }

  // No image provided
  return null;
};
