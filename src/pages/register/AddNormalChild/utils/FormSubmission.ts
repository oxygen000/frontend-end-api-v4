import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../../services/api';
import type { FormData } from '../types/types';

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
  t: (key: string, fallback: string) => string
): Promise<{ success: boolean; userId?: string; userName?: string }> => {
  // Generate a unique submission ID for tracking
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

    // Add all required fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('nickname', formData.name.split(' ')[0] || '');
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('gender', formData.gender || '');
    formDataToSend.append('national_id', formData.national_id || '');
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('form_type', 'child');
    formDataToSend.append('category', 'child');
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');
    formDataToSend.append('phone_number', formData.guardian_phone || '');
    formDataToSend.append('phone_company', formData.phone_company || '');
    formDataToSend.append(
      'physical_description',
      formData.physical_description || ''
    );
    formDataToSend.append('last_clothes', formData.last_seen_clothes || '');
    formDataToSend.append(
      'area_of_disappearance',
      formData.last_seen_location || ''
    );
    formDataToSend.append('last_seen_time', formData.last_seen_time || '');
    formDataToSend.append('guardian_name', formData.guardian_name || '');
    formDataToSend.append('guardian_phone', formData.guardian_phone || '');
    formDataToSend.append('guardian_id', formData.national_id || '');
    formDataToSend.append('relationship', formData.relationship || '');
    formDataToSend.append('additional_notes', formData.additional_notes || '');
    formDataToSend.append(
      'medical_condition',
      formData.medical_condition || ''
    );

    // Add the uniquely generated ID to prevent conflicts
    formDataToSend.append('unique_submission_id', uniqueSubmissionId);

    // Add the image file
    formDataToSend.append('file', imageFile);

    // Create a child data object for JSON payload
    const childData = {
      unique_id: uniqueSubmissionId,
      name: formData.name,
      nickname: formData.name.split(' ')[0] || '',
      dob: formData.dob,
      gender: formData.gender || '',
      national_id: formData.national_id || '',
      address: formData.address || '',
      category: 'child',
      form_type: 'child',
      additional_data: formData.additional_data || '',
      physical_description: formData.physical_description || '',
      last_clothes: formData.last_seen_clothes || '',
      area_of_disappearance: formData.last_seen_location || '',
      last_seen_time: formData.last_seen_time || '',
      guardian_name: formData.guardian_name || '',
      guardian_phone: formData.guardian_phone || '',
      guardian_id: formData.national_id || '',
      relationship: formData.relationship || '',
      additional_notes: formData.additional_notes || '',
      medical_condition: formData.medical_condition || '',
      // Required fields for the backend database
      phone_number: formData.guardian_phone || '',
      phone_company: formData.phone_company || '',
    };

    // Ensure there's no ID field
    if ('id' in childData) {
      delete (childData as Record<string, unknown>).id;
    }

    // Add user_data as JSON
    formDataToSend.append('user_data', JSON.stringify(childData));

    // IMPORTANT: Only use the main registration endpoint to avoid duplicates
    console.log('Using main registration endpoint only');
    try {
      const responseData = await registrationApi.registerUser(formDataToSend);
      console.log('Registration response:', responseData);

      // If successful, clear pending registration
      pendingRegistrations.delete(submissionKey);

      // Extract user info from the response
      const userId =
        responseData?.user_id ||
        responseData?.user?.id ||
        `temp-${uniqueSubmissionId}`;
      const userName = responseData?.user?.name || formData.name;

      toast.success(
        `${userName} ${t('registration.successMessage', 'registered successfully!')}`,
        { id: 'registration' }
      );

      return { success: true, userId, userName };
    } catch (error) {
      console.error('Registration error:', error);
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
      }

      toast.error(errorMessage, { id: 'registration' });
      return { success: false };
    }
  } catch (err) {
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
