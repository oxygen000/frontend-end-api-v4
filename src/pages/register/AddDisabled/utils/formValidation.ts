import type {
  DisabledFormData,
  DisabledFormSection,
} from '../types/disabled-form';

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
  capturedImage: string | null
): string[] => {
  const errors: string[] = [];

  // Section 1: Basic Information
  if (currentSection === 1) {
    if (!personDetails.full_name?.trim())
      errors.push(
        "Please enter the person's name. You cannot proceed without it."
      );

    if (!personDetails.dob)
      errors.push('Date of birth is required. Please select it to continue.');

    if (!personDetails.gender)
      errors.push(
        'Gender is required. Please select male or female to proceed.'
      );
  }

  // Section 3: Reporter Info
  else if (currentSection === 3) {
    if (
      personDetails.reporter_phone &&
      !/^[0-9]{10,11}$/.test(personDetails.reporter_phone.replace(/\D/g, ''))
    ) {
      errors.push(
        "Reporter's phone number is invalid. It must contain 11 digits."
      );
    }

    if (
      personDetails.reporter_secondary_phone &&
      !/^[0-9]{10,11}$/.test(
        personDetails.reporter_secondary_phone.replace(/\D/g, '')
      )
    ) {
      errors.push(
        'Secondary phone number of the reporter is invalid. Please check and correct it.'
      );
    }
  }

  // Section 4: Missing Information
  else if (currentSection === 2) {
    if (
      personDetails.disappearance_date &&
      !/^\d{4}-\d{2}-\d{2}$/.test(personDetails.disappearance_date)
    ) {
      errors.push(
        'Disappearance date is invalid. Please use format: YYYY-MM-DD (e.g., 2024-05-22).'
      );
    }

    if (
      personDetails.disappearance_time &&
      !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(personDetails.disappearance_time)
    ) {
      errors.push(
        'Disappearance time is invalid. Please use format: HH:MM (e.g., 14:30).'
      );
    }

    if (
      personDetails.first_friend_phone &&
      !/^[0-9]{10,11}$/.test(
        personDetails.first_friend_phone.replace(/\D/g, '')
      )
    ) {
      errors.push(
        "First friend's phone number is invalid. It must contain 11 digits."
      );
    }

    if (
      personDetails.second_friend_phone &&
      !/^[0-9]{10,11}$/.test(
        personDetails.second_friend_phone.replace(/\D/g, '')
      )
    ) {
      errors.push(
        "Second friend's phone number is invalid. It must contain 11 digits."
      );
    }
  }

  // Section 5: Image Upload
  else if (currentSection === 7) {
    if (!personDetails.image && !capturedImage) {
      errors.push(
        'A personal photo is required. You cannot proceed without uploading or capturing a photo.'
      );
    }

    if (personDetails.image && personDetails.image.size > 5 * 1024 * 1024) {
      errors.push(
        'The uploaded image is too large. Maximum size allowed is 5MB.'
      );
    }

    if (personDetails.image && !personDetails.image.type.startsWith('image/')) {
      errors.push(
        'Invalid file type. Please upload an image file (e.g., JPG or PNG).'
      );
    }
  }

  return errors;
};

// Define the type for user data
interface UserData {
  // Unique ID and form type
  unique_id: string;
  form_type: string;
  category: string;

  // Basic user information
  full_name: string;
  name: string;
  date_of_birth: string;
  dob: string;
  national_id: string;
  address: string;
  gender: string;
  age?: string;

  // Contact information
  phone_number: string;
  service_provider: string;
  phone_company: string;
  secondary_phone: string;
  second_phone_number: string;

  // Disability information (required fields)
  disability_type: string;
  disability_details: string;
  disability_description: string;
  medical_history: string;
  special_needs: string;
  emergency_contact: string;
  emergency_phone: string;

  // Guardian/Reporter information (required fields)
  reporter_name: string;
  reporter_phone: string;
  reporter_relationship: string;
  relationship: string;
  reporter_address: string;

  // Additional reporter fields
  reporter_occupation: string;
  reporter_education: string;
  reporter_secondary_phone: string;
  reporter_national_id: string;

  // Medical information
  distinctive_mark: string;
  treating_physician: string;
  physician_phone: string;
  medication: string;

  // Missing person information (optional)
  area_of_disappearance: string;
  last_sighting: string;
  clothes_description: string;
  disappearance_date: string;
  disappearance_time: string;
  was_accompanied: string;
  friends: string;
  first_friend: string;
  second_friend: string;
  first_friend_phone: string;
  second_friend_phone: string;
  previous_incidents: string;
  previous_disputes: string;
  missing_person_occupation: string;
  missing_person_education: string;
  gone_missing_before: string;
  reason_for_location: string;

  // Police report information (optional)
  absence_report_number: string;
  absence_report_date: string;
  police_station: string;
  security_directorate: string;
  governorate: string;

  // Additional information
  additional_notes: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Builds form data for API submission
 * @param personDetails Form data
 * @param capturedImage Optional captured webcam image
 * @param editUserId Optional edit user ID for update operations
 * @returns FormData object ready for submission
 */
export const buildSubmissionFormData = (
  personDetails: DisabledFormData,
  capturedImage: string | null,
  editUserId?: string | null
): FormData => {
  // Create a FormData object to handle file upload
  const formDataToSend = new FormData();

  // Generate a unique ID for this submission
  const uniqueSubmissionId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  // Prepare form data for submission
  // Map frontend fields to backend expected fields
  const userData: UserData = {
    // Unique ID and form type
    unique_id: editUserId || uniqueSubmissionId,
    form_type: 'disabled',
    category: 'disabled',

    // Basic user information
    full_name: personDetails.full_name || personDetails.name || '',
    name: personDetails.full_name || personDetails.name || '', // Required for database NOT NULL constraint
    date_of_birth: personDetails.dob || '',
    dob: personDetails.dob || '', // Include both formats for compatibility
    national_id: personDetails.national_id || '',
    address: personDetails.address || '',
    gender: personDetails.gender || '',

    // Contact information
    phone_number: personDetails.phone_number || '',
    service_provider: personDetails.phone_company || '',
    phone_company: personDetails.phone_company || '', // Add both field names for compatibility
    secondary_phone: personDetails.second_phone_number || '',
    second_phone_number: personDetails.second_phone_number || '', // Add both field names for compatibility

    // Disability information (required fields)
    disability_type: personDetails.disability_type || 'physical',
    disability_details: personDetails.disability_description || '',
    disability_description: personDetails.disability_description || '',
    medical_history: personDetails.medical_history || '', // Include both for compatibility
    special_needs: personDetails.special_needs || '',
    emergency_contact: personDetails.emergency_contact || '',
    emergency_phone: personDetails.emergency_phone || '',

    // Guardian/Reporter information (required fields)
    reporter_name: personDetails.reporter_name || '',
    reporter_phone: personDetails.reporter_phone || '',
    reporter_relationship: personDetails.reporter_relationship || '',
    relationship: personDetails.relationship || '', // Add both field names for compatibility
    reporter_address: personDetails.reporter_address || '',

    // Additional reporter fields
    reporter_occupation: personDetails.reporter_occupation || '',
    reporter_education: personDetails.reporter_education || '',
    reporter_secondary_phone: personDetails.reporter_secondary_phone || '',
    reporter_national_id: personDetails.reporter_national_id || '',

    // Medical information
    distinctive_mark: personDetails.distinctive_mark || '',
    treating_physician: personDetails.treating_physician || '',
    physician_phone: personDetails.physician_phone || '',
    medication: personDetails.medication || '',

    // Missing person information (optional)
    area_of_disappearance: personDetails.area_of_disappearance || '',
    last_sighting: personDetails.last_sighting || '',
    clothes_description: personDetails.clothes_description || '',
    disappearance_date: personDetails.disappearance_date || '',
    disappearance_time: personDetails.disappearance_time || '',
    was_accompanied: personDetails.was_accompanied || '',
    friends: personDetails.friends || '',
    first_friend: personDetails.first_friend || '',
    second_friend: personDetails.second_friend || '',
    first_friend_phone: personDetails.first_friend_phone || '',
    second_friend_phone: personDetails.second_friend_phone || '',
    previous_incidents: personDetails.previous_incidents || '',
    previous_disputes: personDetails.previous_disputes || '',
    missing_person_occupation: personDetails.missing_person_occupation || '',
    missing_person_education: personDetails.missing_person_education || '',
    gone_missing_before: personDetails.gone_missing_before || '',
    reason_for_location: personDetails.reason_for_location || '',

    // Police report information (optional)
    absence_report_number: personDetails.absence_report_number || '',
    absence_report_date: personDetails.absence_report_date || '',
    police_station: personDetails.police_station || '',
    security_directorate: personDetails.security_directorate || '',
    governorate: personDetails.governorate || '',

    // Additional information
    additional_notes: personDetails.additional_notes || '',

    // Timestamps
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Calculate age if not provided
  const age = personDetails.age || calculateAgeFromDOB(personDetails.dob);
  if (age) {
    userData.age = age;
  }

  // Add form metadata
  formDataToSend.append('form_type', 'disabled');
  formDataToSend.append('category', 'disabled');

  // If this is an update operation, add the necessary fields
  if (editUserId) {
    formDataToSend.append('user_id', editUserId);
    formDataToSend.append('is_update', 'true');
    formDataToSend.append('operation_type', 'update');
  }

  // Append the complete user data in JSON format
  formDataToSend.append('user_data', JSON.stringify(userData));
  formDataToSend.append('disabled_data', JSON.stringify(userData));

  // Handle image upload
  if (personDetails.image) {
    formDataToSend.append('image', personDetails.image);
    formDataToSend.append('file', personDetails.image); // Add both field names for compatibility
  } else if (capturedImage) {
    const imageFile = prepareImageFile(null, capturedImage);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
      formDataToSend.append('file', imageFile); // Add both field names for compatibility
    }
  }

  // Add bypass parameters for face recognition
  formDataToSend.append('bypass_angle_check', 'true');
  formDataToSend.append('train_multiple', 'true');

  // Add direct field mappings for critical fields that must be present as form fields
  const nameValue = personDetails.full_name || personDetails.name || '';
  const dobValue = personDetails.dob || '';

  if (!nameValue) {
    throw new Error('Name is required but missing from form data');
  }

  formDataToSend.append('name', nameValue);
  formDataToSend.append('full_name', nameValue);
  formDataToSend.append('dob', dobValue);
  formDataToSend.append('date_of_birth', dobValue);
  formDataToSend.append('gender', personDetails.gender || '');
  formDataToSend.append(
    'disability_type',
    personDetails.disability_type || 'physical'
  );
  formDataToSend.append('unique_id', uniqueSubmissionId);

  return formDataToSend;
};

/**
 * Calculates age from a date of birth string
 * @param dob Date of birth in YYYY-MM-DD format
 * @returns Age as a string or empty string if invalid
 */
function calculateAgeFromDOB(dob: string): string {
  if (!dob) return '';

  try {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (error) {
    console.error('Error calculating age from DOB:', error);
    return '';
  }
}

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
