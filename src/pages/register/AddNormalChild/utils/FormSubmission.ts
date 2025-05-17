import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../../services/api';
import { BASE_API_URL } from '../../../../config/constants';
import type { FormData, UserWithFaceId } from '../types/types';

export const submitForm = async (
  formData: FormData,
  capturedImage: string | null,
  t: (key: string, fallback: string) => string
): Promise<{ success: boolean; userId?: string; userName?: string }> => {
  try {
    // Create FormData object for file upload
    const formDataToSend = new FormData();

    // Add required form fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('nickname', formData.name.split(' ')[0] || '');
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('gender', formData.gender || '');
    formDataToSend.append('national_id', formData.national_id || '');
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('form_type', 'child');
    formDataToSend.append('category', 'child');

    // Add bypass parameters for face validation
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');

    // Phone fields are required by the backend
    formDataToSend.append('phone_number', formData.guardian_phone || '');
    formDataToSend.append('phone_company', formData.phone_company || '');

    // Add Child-specific fields
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

    // Additional important fields
    formDataToSend.append('description', ''); // Empty but required field
    formDataToSend.append('notes', ''); // Empty but required field

    // Create a complete child data object and append as JSON
    const childData = {
      name: formData.name,
      nickname: formData.name.split(' ')[0] || '',
      dob: formData.dob,
      date_of_birth: formData.dob,
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
      gender: formData.gender || '',
      additional_notes: formData.additional_notes || '',
      medical_condition: formData.medical_condition || '',
      // Required fields for the backend database
      phone_number: formData.guardian_phone || '',
      phone_company: formData.phone_company || '',
      employee_id: '',
      department: '',
      role: '',
    };

    // Append the complete user data in JSON format
    formDataToSend.append('user_data', JSON.stringify(childData));
    formDataToSend.append('child_data', JSON.stringify(childData));

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
        imageFile = new File([blob], `webcam_capture_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
      } catch (error) {
        console.error('Error converting base64 to file:', error);
        throw new Error(
          'Failed to process webcam image. Please try again or upload a file instead.'
        );
      }
    }

    if (imageFile) {
      // Append the file with name 'file' as expected by the backend
      formDataToSend.append('file', imageFile);
    } else {
      // No image was provided
      throw new Error(t('validation.photoRequired', 'Please provide an image'));
    }

    // Call API to register user
    const responseData = await registrationApi.registerUser(formDataToSend);

    // Handle successful registration
    const userId = responseData?.user_id || responseData?.user?.id || undefined;
    const userName = responseData?.user?.name || formData.name;

    toast.success(
      `${userName} ${t('registration.successMessage', 'registered successfully!')}`
    );

    // Verify the registration only if we have a userId with a proper format (not temp-)
    if (userId && !userId.toString().startsWith('temp-')) {
      // Try to verify the registration without delays
      try {
        const verificationData =
          await registrationApi.verifyRegistration(userId);
        const user = verificationData.user as UserWithFaceId;

        if (user && user.face_id) {
          console.log(
            'User verification successful with face_id:',
            user.face_id
          );
        } else {
          console.log('User verified but no face_id yet');
        }
      } catch (error) {
        console.error('Error during verification:', error);
      }

      // If verification didn't give us a face_id, try to trigger face processing
      try {
        if (imageFile) {
          const verifyFormData = new FormData();
          verifyFormData.append('file', imageFile);

          fetch(`${BASE_API_URL}/api/verify-face`, {
            method: 'POST',
            body: verifyFormData,
          })
            .then((response) => {
              if (response.ok) {
                console.log(
                  'Face verification successful, this may help generate face_id'
                );
              }
            })
            .catch((verifyError) => {
              console.error('Error during face verification:', verifyError);
            });
        }
      } catch (verifyError) {
        console.error('Error during face verification:', verifyError);
      }
    }

    return { success: true, userId, userName };
  } catch (err) {
    console.error('Registration error:', err);

    // Check for specific face angle error
    let errorMessage = t(
      'registration.generalError',
      'An error occurred during registration'
    );

    if (err instanceof Error) {
      errorMessage = err.message;

      // Provide more user-friendly message for face angle errors
      if (
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
