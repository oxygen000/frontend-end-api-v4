import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../../services/api';
import type { FormData } from '../types/types';
import axios, { AxiosError } from 'axios';

// Track registration requests to prevent duplicates
const pendingRegistrations = new Set<string>();

// Helper function to generate a truly unique ID that won't conflict
const generateUniqueId = () => {
  // Create a unique string with timestamp and random values
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${random}`;
};

export const submitForm = async (
  formData: FormData,
  capturedImage: string | null,
  t: (key: string, fallback: string) => string,
  editUserId?: string
): Promise<{ success: boolean; userId?: string; userName?: string }> => {
  // Generate a unique submission key for tracking
  const submissionKey = `${formData.name}-${formData.dob}-${Date.now()}`;

  // Check if this submission is already in progress
  if (pendingRegistrations.has(submissionKey)) {
    console.log('Registration already in progress, preventing duplicate');
    toast.error('Registration already in progress');
    return { success: false };
  }

  // Mark this submission as pending
  pendingRegistrations.add(submissionKey);

  try {
    console.log('Starting child registration process...');
    toast.loading('Registering child information...', { id: 'registration' });

    // Generate a unique ID for this submission to prevent conflicts
    const uniqueSubmissionId = generateUniqueId();
    console.log(`Generated unique submission ID: ${uniqueSubmissionId}`);

    // Handle image from file upload or webcam
    let imageFile: File | null = null;

    if (formData.image) {
      // If image was uploaded from file input
      imageFile = formData.image;
      console.log('Using uploaded image file:', imageFile.name, imageFile.size);
    } else if (capturedImage) {
      // If image was captured from webcam, convert base64 to file
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
          throw new Error('Invalid image format from webcam');
        }
      }

      try {
        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: 'image/jpeg' });
        imageFile = new File(
          [blob],
          `webcam_capture_${uniqueSubmissionId}.jpg`,
          {
            type: 'image/jpeg',
          }
        );
        console.log('Created image file from webcam capture:', imageFile.size);
      } catch (error) {
        console.error('Error converting base64 to file:', error);
        throw new Error(
          'Failed to process webcam image. Please try again or upload a file instead.'
        );
      }
    }

    if (!imageFile) {
      // No image was provided
      toast.dismiss('registration');
      pendingRegistrations.delete(submissionKey);
      throw new Error(t('validation.photoRequired', 'Please provide an image'));
    }

    // Create FormData for submission
    const formDataToSend = new FormData();

    // CRITICAL: Add full_name field first to ensure it's not removed
    console.log('DEBUG: Adding critical full_name field to form data');
    formDataToSend.append(
      'full_name',
      formData.name || formData.full_name || ''
    );

    // Basic child information - KEEP THESE SIMPLE TO MATCH BACKEND SCHEMA
    formDataToSend.append('name', formData.name);
    formDataToSend.append('nickname', formData.name.split(' ')[0] || '');
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('gender', formData.gender || '');
    formDataToSend.append('national_id', formData.national_id || '');
    formDataToSend.append('address', formData.address || '');

    // Calculate age from DOB if not provided
    if (!formData.age && formData.dob) {
      const age = calculateAgeFromDOB(formData.dob);
      formDataToSend.append('age', age);
    } else if (formData.age) {
      formDataToSend.append('age', formData.age);
    }

    // Form type identification - CRITICAL FOR BACKEND PROCESSING
    formDataToSend.append('form_type', 'child');
    formDataToSend.append('category', 'child');
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');

    // If in edit mode, add the user ID
    if (editUserId) {
      formDataToSend.append('user_id', editUserId);
      console.log('Adding user_id for edit mode:', editUserId);
    }

    // Reporter/Guardian information - SIMPLIFY TO MATCH BACKEND SCHEMA
    formDataToSend.append('guardian_name', formData.guardian_name || '');
    formDataToSend.append('guardian_phone', formData.guardian_phone || '');
    formDataToSend.append('guardian_id', formData.national_id || '');
    formDataToSend.append('relationship', formData.relationship || '');
    formDataToSend.append('phone_number', formData.guardian_phone || '');
    formDataToSend.append('phone_company', formData.phone_company || '');

    // Explicitly add reporter fields
    formDataToSend.append('reporter_name', formData.guardian_name || '');
    formDataToSend.append('reporter_phone', formData.guardian_phone || '');
    formDataToSend.append('reporter_national_id', formData.guardian_id || '');
    formDataToSend.append('reporter_relationship', formData.relationship || '');
    formDataToSend.append('reporter_address', formData.reporter_address || '');
    formDataToSend.append(
      'reporter_occupation',
      formData.reporter_occupation || ''
    );
    formDataToSend.append(
      'reporter_education',
      formData.reporter_education || ''
    );

    // Physical description fields - SIMPLIFY TO MATCH BACKEND SCHEMA
    formDataToSend.append(
      'physical_description',
      formData.physical_description || ''
    );
    formDataToSend.append('last_clothes', formData.last_seen_clothes || '');
    formDataToSend.append(
      'area_of_disappearance',
      formData.area_of_disappearance || ''
    );
    formDataToSend.append('last_seen_time', formData.last_seen_time || '');
    formDataToSend.append(
      'medical_condition',
      formData.medical_condition || ''
    );
    formDataToSend.append('additional_notes', formData.additional_notes || '');

    // Add potentially required fields
    const tempFaceId = `temp-face-${uniqueSubmissionId}`;
    formDataToSend.append('face_id', tempFaceId);
    formDataToSend.append('image_path', '/static/temp-image.jpg');

    // Add the image file
    formDataToSend.append('file', imageFile);

    // Debug logging for reporter fields
    console.log('Reporter fields before submission:');
    console.log('reporter_name:', formData.guardian_name || '');
    console.log('reporter_phone:', formData.guardian_phone || '');
    console.log('reporter_national_id:', formData.guardian_id || '');
    console.log('reporter_relationship:', formData.relationship || '');
    console.log('reporter_address:', formData.reporter_address || '');

    console.log('reporter_occupation:', formData.reporter_occupation || '');
    console.log('reporter_education:', formData.reporter_education || '');

    // Add missing fields that are in types.ts but not included in submission
    formDataToSend.append('age', formData.age || '');
    formDataToSend.append('reporter_name', formData.reporter_name || '');
    formDataToSend.append(
      'reporter_national_id',
      formData.reporter_national_id || ''
    );
    formDataToSend.append('reporter_relationship', formData.relationship || '');
    formDataToSend.append(
      'reporter_secondary_phone',
      formData.reporter_secondary_phone || ''
    );
    formDataToSend.append('date_of_birth', formData.dob || '');
    formDataToSend.append('last_sighting', formData.last_sighting || '');
    formDataToSend.append('phone_company', formData.phone_company || '');
    formDataToSend.append(
      'distinctive_mark',
      formData.physical_description || ''
    );
    formDataToSend.append(
      'clothes_description',
      formData.last_seen_clothes || ''
    );
    formDataToSend.append(
      'area_of_disappearance',
      formData.area_of_disappearance || ''
    );
    formDataToSend.append('disappearance_date', formData.last_seen_time || '');
    formDataToSend.append('disappearance_time', formData.last_seen_time || '');
    formDataToSend.append('medical_history', formData.medical_condition || '');
    formDataToSend.append(
      'treating_physician',
      formData.treating_physician || ''
    );
    formDataToSend.append('physician_phone', formData.physician_phone || '');
    formDataToSend.append('first_friend', formData.first_friend || '');
    formDataToSend.append('second_friend', formData.second_friend || '');
    formDataToSend.append(
      'first_friend_phone',
      formData.first_friend_phone || ''
    );
    formDataToSend.append(
      'second_friend_phone',
      formData.second_friend_phone || ''
    );
    formDataToSend.append(
      'previous_disputes',
      formData.previous_disputes || ''
    );
    formDataToSend.append(
      'gone_missing_before',
      formData.gone_missing_before || ''
    );
    formDataToSend.append(
      'reason_for_location',
      formData.reason_for_location || ''
    );
    formDataToSend.append('was_accompanied', formData.was_accompanied || '');
    formDataToSend.append(
      'missing_person_phone',
      formData.missing_person_phone || ''
    );
    formDataToSend.append(
      'missing_person_occupation',
      formData.missing_person_occupation || ''
    );
    formDataToSend.append(
      'missing_person_education',
      formData.missing_person_education || ''
    );
    formDataToSend.append('police_station', formData.police_station || '');
    formDataToSend.append(
      'security_directorate',
      formData.security_directorate || ''
    );
    formDataToSend.append('governorate', formData.governorate || '');
    formDataToSend.append(
      'absence_report_number',
      formData.absence_report_number || ''
    );
    formDataToSend.append(
      'absence_report_date',
      formData.absence_report_date || ''
    );
    formDataToSend.append('reporter_address', formData.reporter_address || '');
    formDataToSend.append(
      'reporter_occupation',
      formData.reporter_occupation || ''
    );
    formDataToSend.append(
      'reporter_education',
      formData.reporter_education || ''
    );

    // Add fields from ChildUser interface that might be missing
    formDataToSend.append('friends', formData.first_friend || '');
    formDataToSend.append(
      'previous_incidents',
      formData.previous_disputes || ''
    );

    formDataToSend.append(
      'clothes_description',
      formData.last_seen_clothes || ''
    );
    formDataToSend.append(
      'distinctive_mark',
      formData.physical_description || ''
    );
    formDataToSend.append('disappearance_time', formData.last_seen_time || '');
    formDataToSend.append('disappearance_date', formData.last_seen_time || '');

    // These fields don't exist in the backend schema - removing them
    // formDataToSend.append('school', formData.missing_person_education || '');
    // formDataToSend.append('grade', '');
    // formDataToSend.append('guardian_address', formData.reporter_address || '');
    // formDataToSend.append('guardian_job', formData.reporter_occupation || '');
    // formDataToSend.append('last_known_location', formData.last_seen_location || '');
    // formDataToSend.append('additional_data', formData.additional_data || '');

    // Create a child data object for JSON payload - match backend field names
    const childData = {
      name: formData.name,
      full_name: formData.name, // Use the full_name field from formData
      nickname: formData.name.split(' ')[0] || '',
      dob: formData.dob,
      gender: formData.gender || '',
      national_id: formData.national_id || '',
      address: formData.address || '',
      category: 'child',
      form_type: 'child',

      // Age calculation
      age: formData.age || calculateAgeFromDOB(formData.dob),

      // Guardian information
      guardian_name: formData.guardian_name || '',
      guardian_phone: formData.guardian_phone || '',
      guardian_id: formData.national_id || '',
      relationship: formData.relationship || '',
      phone_number: formData.guardian_phone || '',
      phone_company: formData.phone_company || '',

      // Physical description
      physical_description: formData.physical_description || '',
      last_clothes: formData.last_seen_clothes || '',
      area_of_disappearance: formData.area_of_disappearance || '',
      last_seen_time: formData.last_seen_time || '',
      medical_condition: formData.medical_condition || '',
      additional_notes: formData.additional_notes || '',

      // Add potentially required fields
      face_id: tempFaceId,
      image_path: '/static/temp-image.jpg',

      // Reporter information fields - matching database schema
      reporter_name: formData.reporter_name || '',
      reporter_phone: formData.reporter_phone || '',
      reporter_national_id: formData.reporter_national_id || '',
      reporter_relationship: formData.reporter_relationship || '',
      reporter_secondary_phone: formData.reporter_secondary_phone || '',
      reporter_address: formData.reporter_address || '',
      reporter_occupation: formData.reporter_occupation || '',
      reporter_education: formData.reporter_education || '',

      // Missing person details - matching database schema
      service_provider: formData.phone_company || '',
      date_of_birth: formData.dob || '',
      last_sighting: formData.last_sighting || '',
      distinctive_mark: formData.distinctive_mark || '',
      clothes_description: formData.clothes_description || '',
      disappearance_date: formData.disappearance_date || '',
      disappearance_time: formData.disappearance_time || '',
      medical_history: formData.medical_history || '',
      treating_physician: formData.treating_physician || '',
      physician_phone: formData.physician_phone || '',
      first_friend: formData.first_friend || '',
      second_friend: formData.second_friend || '',
      first_friend_phone: formData.first_friend_phone || '',
      second_friend_phone: formData.second_friend_phone || '',
      previous_disputes: formData.previous_disputes || '',
      gone_missing_before: formData.gone_missing_before || '',
      reason_for_location: formData.reason_for_location || '',
      was_accompanied: formData.was_accompanied || '',
      missing_person_phone: formData.missing_person_phone || '',
      missing_person_occupation: formData.missing_person_occupation || '',
      missing_person_education: formData.missing_person_education || '',

      // Police report information - matching database schema
      police_station: formData.police_station || '',
      security_directorate: formData.security_directorate || '',
      governorate: formData.governorate || '',
      absence_report_number: formData.absence_report_number || '',
      absence_report_date: formData.absence_report_date || '',
    };

    // Debug logging
    console.log('Submitting child data with fields:', Object.keys(childData));
    console.log(
      'FormData fields being sent:',
      Array.from(formDataToSend.keys())
    );

    // Add user_data as JSON
    formDataToSend.append('user_data', JSON.stringify(childData));

    // IMPORTANT: Only use the main registration endpoint to avoid duplicates
    console.log(editUserId ? 'Using registration endpoint for child update' : 'Using main registration endpoint only');
    try {
      const responseData = await registrationApi.registerUser(formDataToSend);
      console.log(editUserId ? 'Update response:' : 'Registration response:', responseData);

      // If successful, clear pending registration
      pendingRegistrations.delete(submissionKey);

      // Extract user info from the response
      const userId =
        responseData?.user_id ||
        responseData?.user?.id ||
        editUserId ||
        `temp-${uniqueSubmissionId}`;
      const userName = responseData?.user?.name || formData.name;

      toast.success(
        editUserId 
          ? `${userName} ${t('edit.successMessage', 'updated successfully!')}`
          : `${userName} ${t('registration.successMessage', 'registered successfully!')}`,
        { id: 'registration' }
      );

      return { success: true, userId, userName };
    } catch (error: unknown) {
      console.error('Registration error:', error);

      // Log detailed error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
          console.error('Error response headers:', axiosError.response.headers);
        }
      }

      pendingRegistrations.delete(submissionKey);

      let errorMessage = t(
        'registration.generalError',
        'An error occurred during registration'
      );

      if (error instanceof Error) {
        errorMessage = error.message;

        // Handle common errors
        if (errorMessage.includes('UNIQUE constraint failed')) {
          errorMessage =
            'Registration could not be completed. Please try again with a different image.';
        } else if (
          errorMessage.includes('Face angle') ||
          errorMessage.includes('face is not')
        ) {
          errorMessage = t(
            'validation.faceAngleError',
            "The uploaded photo doesn't meet our requirements. Please upload a clear front-facing photo where the person is looking directly at the camera."
          );
        }

        // Try to extract validation errors from response
        if (axios.isAxiosError(error) && error.response?.data) {
          const responseData = error.response.data;
          if (responseData.detail) {
            if (Array.isArray(responseData.detail)) {
              // FastAPI validation errors format
              const validationErrors = responseData.detail.map(
                (err: { loc: string[]; msg: string }) =>
                  `${err.loc.join('.')}: ${err.msg}`
              );
              console.error('Validation errors:', validationErrors);
              errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
            } else if (typeof responseData.detail === 'string') {
              errorMessage = responseData.detail;
            }
          }
        }
      }

      toast.error(errorMessage, { id: 'registration' });
      return { success: false };
    }
  } catch (err: unknown) {
    console.error('Registration error:', err);
    pendingRegistrations.delete(submissionKey);
    toast.dismiss('registration');

    // Check for specific error types
    let errorMessage = t(
      'registration.generalError',
      'An error occurred during registration'
    );

    if (err instanceof Error) {
      errorMessage = err.message;

      // Special case for UNIQUE constraint errors
      if (errorMessage.includes('UNIQUE constraint failed')) {
        errorMessage =
          'Registration could not be completed. Please try again with a different image.';
      }
      // Provide more user-friendly message for face angle errors
      else if (
        errorMessage.includes('Face angle') ||
        errorMessage.includes('face is not')
      ) {
        errorMessage = t(
          'validation.faceAngleError',
          "The uploaded photo doesn't meet our requirements. Please upload a clear front-facing photo where the person is looking directly at the camera."
        );
      }
    }

    toast.error(errorMessage);
    return { success: false };
  }
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
