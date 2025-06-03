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

  // CRITICAL: Determine edit mode more robustly
  const isEditMode = !!editUserId && editUserId.trim() !== '';

  try {
    console.log('=== CHILD FORM SUBMISSION ANALYSIS ===');
    console.log(`📊 Form Name: ${formData.name}`);
    console.log(`🆔 Edit User ID: ${editUserId}`);
    console.log(`🔄 Is Edit Mode: ${isEditMode}`);
    console.log(`📝 Submission Key: ${submissionKey}`);
    console.log('==========================================');

    if (isEditMode) {
      console.log(`🔄 UPDATING existing child with ID: ${editUserId}`);
    } else {
      console.log('✨ CREATING new child registration');
    }

    toast.loading(
      isEditMode ? 'جاري تحديث بيانات الطفل...' : 'جاري تسجيل بيانات الطفل...',
      { id: 'registration' }
    );

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
    } else if (isEditMode) {
      // In edit mode, image is optional (updating data only)
      console.log('Edit mode: No new image provided, updating data only');
    }

    // For new registrations, image is required
    if (!imageFile && !isEditMode) {
      toast.dismiss('registration');
      pendingRegistrations.delete(submissionKey);
      throw new Error(t('validation.photoRequired', 'Please provide an image'));
    }

    // Debug logging after imageFile is determined
    console.log('=== CHILD FORM SUBMISSION DEBUG ===');
    console.log(`📊 Form Name: ${formData.name}`);
    console.log(`🆔 Edit User ID: ${editUserId}`);
    console.log(`🔄 Is Edit Mode: ${isEditMode}`);
    console.log(`📸 Has Image: ${!!imageFile}`);
    console.log(`📸 Image Size: ${imageFile ? imageFile.size : 'N/A'}`);
    console.log('====================================');

    // Create FormData for submission
    const formDataToSend = new FormData();

    // CRITICAL FIX: Add update parameters FIRST before any other processing
    if (isEditMode && editUserId) {
      console.log('🔧 CRITICAL FIX: Adding update parameters at the beginning');
      formDataToSend.append('user_id', editUserId);
      formDataToSend.append('is_update', 'true');
      formDataToSend.append('operation_type', 'update');

      // Log to confirm they were added
      console.log('✅ Update parameters confirmed:');
      console.log('   - user_id:', formDataToSend.get('user_id'));
      console.log('   - is_update:', formDataToSend.get('is_update'));
      console.log('   - operation_type:', formDataToSend.get('operation_type'));
    }

    // Add essential fields to FormData
    formDataToSend.append(
      'full_name',
      formData.full_name || formData.name || ''
    );
    formDataToSend.append('form_type', 'child');
    formDataToSend.append('category', 'child');
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');

    // Generate temp face ID for new registrations only
    if (!isEditMode) {
      const tempFaceId = `temp-face-${uniqueSubmissionId}`;
      formDataToSend.append('face_id', tempFaceId);
      formDataToSend.append('image_path', '/static/temp-image.jpg');
      formDataToSend.append('operation_type', 'create');
      console.log(
        '✨ Create mode - New child registration with temp ID:',
        tempFaceId
      );
    }

    // Add the image file only if available
    if (imageFile) {
      formDataToSend.append('file', imageFile);
      console.log(`✅ Added image file to FormData (${imageFile.size} bytes)`);
    } else {
      console.log('ℹ️ No image file added to FormData (data-only update)');
    }

    // Create a child data object for JSON payload - match backend field names
    const childData = {
      // ESSENTIAL: Always include user ID in edit mode
      ...(isEditMode && editUserId
        ? { id: editUserId, user_id: editUserId }
        : {}),

      name: formData.name,
      full_name: formData.full_name || formData.name,
      nickname: formData.name.split(' ')[0] || '',
      dob: formData.dob,
      gender: formData.gender || '',
      national_id: formData.national_id || '',
      address: formData.address || '',
      category: 'child',
      form_type: 'child',

      // Age calculation
      age: formData.age || calculateAgeFromDOB(formData.dob),

      // Guardian information - use correct field mappings
      guardian_name: formData.guardian_name || '',
      guardian_phone: formData.guardian_phone || '',
      guardian_id: formData.guardian_id || '',
      relationship: formData.relationship || '',
      phone_number: formData.guardian_phone || '',
      phone_company: formData.phone_company || '',

      // Physical description
      physical_description: formData.physical_description || '',
      last_clothes: formData.last_seen_clothes || '',
      area_of_disappearance:
        formData.last_seen_location || formData.area_of_disappearance || '',
      last_seen_time: formData.last_seen_time || '',
      medical_condition: formData.medical_condition || '',
      additional_notes: formData.additional_notes || '',

      // Reporter information fields - matching database schema
      reporter_name: formData.reporter_name || formData.guardian_name || '',
      reporter_phone: formData.reporter_phone || formData.guardian_phone || '',
      reporter_national_id:
        formData.reporter_national_id || formData.guardian_id || '',
      reporter_relationship:
        formData.reporter_relationship || formData.relationship || '',
      reporter_secondary_phone: formData.reporter_secondary_phone || '',
      reporter_address: formData.reporter_address || formData.address || '',
      reporter_occupation: formData.reporter_occupation || '',
      reporter_education: formData.reporter_education || '',

      // Missing person details - matching database schema
      service_provider: formData.phone_company || '',
      date_of_birth: formData.dob || '',
      last_sighting:
        formData.last_sighting || formData.last_seen_location || '',
      distinctive_mark:
        formData.distinctive_mark || formData.physical_description || '',
      clothes_description:
        formData.clothes_description || formData.last_seen_clothes || '',
      disappearance_date:
        formData.disappearance_date || formData.last_seen_time || '',
      disappearance_time:
        formData.disappearance_time || formData.last_seen_time || '',
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

    // FINAL VERIFICATION: Double-check update parameters before sending
    if (isEditMode && editUserId) {
      console.log('🔍 FINAL VERIFICATION OF UPDATE PARAMETERS:');
      console.log('   - user_id in FormData:', formDataToSend.get('user_id'));
      console.log(
        '   - is_update in FormData:',
        formDataToSend.get('is_update')
      );
      console.log(
        '   - operation_type in FormData:',
        formDataToSend.get('operation_type')
      );
      console.log('   - editUserId parameter:', editUserId);
      console.log(
        '   - Match check:',
        formDataToSend.get('user_id') === editUserId
      );

      // If any critical parameter is missing, add it again
      if (!formDataToSend.get('user_id')) {
        console.log('⚠️ CRITICAL: user_id missing, adding again!');
        formDataToSend.append('user_id', editUserId);
      }
      if (!formDataToSend.get('is_update')) {
        console.log('⚠️ CRITICAL: is_update missing, adding again!');
        formDataToSend.append('is_update', 'true');
      }
    }

    // Use the appropriate API method
    console.log(
      isEditMode
        ? 'Using updateUser API for child update'
        : 'Using registerUser API for new child registration'
    );

    try {
      let responseData;

      if (isEditMode && editUserId) {
        // Use updateUser for editing existing child
        console.log('🔄 Calling updateUser API for child edit:', editUserId);

        // Enhanced logging before API call
        console.log('=== UPDATE API CALL DEBUG ===');
        console.log('Edit User ID:', editUserId);
        console.log(
          'FormData keys being sent:',
          Array.from(formDataToSend.keys())
        );
        console.log('user_id in FormData:', formDataToSend.get('user_id'));
        console.log('is_update in FormData:', formDataToSend.get('is_update'));
        console.log(
          'operation_type in FormData:',
          formDataToSend.get('operation_type')
        );
        console.log('full_name in FormData:', formDataToSend.get('full_name'));
        console.log('form_type in FormData:', formDataToSend.get('form_type'));

        // Log user_data JSON content
        const userDataJson = formDataToSend.get('user_data');
        if (userDataJson) {
          try {
            const userData = JSON.parse(userDataJson as string);
            console.log('user_data JSON contains id:', userData.id);
            console.log('user_data JSON contains user_id:', userData.user_id);
            console.log('user_data JSON name:', userData.name);
            console.log('user_data JSON full_name:', userData.full_name);
          } catch {
            console.warn('Could not parse user_data JSON for logging');
          }
        }
        console.log('==============================');

        responseData = await registrationApi.updateUser(
          editUserId,
          formDataToSend
        );

        // Enhanced logging after API call
        console.log('=== UPDATE API RESPONSE DEBUG ===');
        console.log('Response status:', responseData?.status);
        console.log('Response message:', responseData?.message);
        console.log('Response user_id:', responseData?.user_id);
        console.log('Response user object:', responseData?.user);
        console.log('Full response:', responseData);
        console.log('==================================');
      } else {
        // Use registerUser for new child registration
        console.log('✨ Calling registerUser API for new child registration');
        responseData = await registrationApi.registerUser(formDataToSend);
      }

      console.log(
        isEditMode ? 'Update response:' : 'Registration response:',
        responseData
      );

      // If successful, clear pending registration
      pendingRegistrations.delete(submissionKey);

      // Extract user info from the response
      const userId =
        responseData?.user_id ||
        responseData?.user?.id ||
        editUserId ||
        `temp-${uniqueSubmissionId}`;
      const userName =
        responseData?.user?.name ||
        responseData?.user?.full_name ||
        formData.name;

      // VERIFICATION: Check if update was actually performed
      if (isEditMode) {
        const wasUpdated =
          responseData?.operation_type === 'update' ||
          responseData?.user_id === editUserId ||
          responseData?.user?.id === editUserId;

        if (wasUpdated) {
          console.log('✅ Update operation confirmed - same user ID returned');
        } else {
          console.log('⚠️ WARNING: Update operation may have created new user');
          console.log('Expected user ID:', editUserId);
          console.log(
            'Returned user ID:',
            responseData?.user_id || responseData?.user?.id
          );
        }
      }

      // Log success details
      console.log(
        `✅ Child ${isEditMode ? 'update' : 'registration'} successful:`,
        {
          userId,
          userName,
          operation: isEditMode ? 'update' : 'create',
          actualOperation: responseData?.operation_type || 'unknown',
        }
      );

      toast.success(
        isEditMode
          ? `تم تحديث بيانات ${userName} بنجاح!`
          : `تم تسجيل ${userName} بنجاح!`,
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

      let errorMessage = isEditMode
        ? 'حدث خطأ أثناء تحديث البيانات'
        : 'حدث خطأ أثناء تسجيل البيانات';

      if (error instanceof Error) {
        // Keep original English message for debugging, but show Arabic to user
        console.error('Original error message:', error.message);

        // Handle common errors with Arabic messages
        if (error.message.includes('UNIQUE constraint failed')) {
          errorMessage =
            'لا يمكن إكمال العملية. يرجى المحاولة مرة أخرى بصورة مختلفة.';
        } else if (
          error.message.includes('Face angle') ||
          error.message.includes('face is not')
        ) {
          errorMessage =
            'الصورة المرفوعة لا تلبي المتطلبات. يرجى رفع صورة واضحة للوجه مباشرة أمام الكاميرا.';
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
              errorMessage =
                'أخطاء في التحقق من البيانات. يرجى مراجعة المعلومات المدخلة.';
            } else if (typeof responseData.detail === 'string') {
              console.error('Server error detail:', responseData.detail);
              // Keep the Arabic error message for user display
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
    let errorMessage = isEditMode
      ? 'حدث خطأ أثناء تحديث البيانات'
      : 'حدث خطأ أثناء تسجيل البيانات';

    if (err instanceof Error) {
      // Keep original error for debugging
      console.error('Original error message:', err.message);

      // Special case for UNIQUE constraint errors
      if (err.message.includes('UNIQUE constraint failed')) {
        errorMessage =
          'لا يمكن إكمال العملية. يرجى المحاولة مرة أخرى بصورة مختلفة.';
      }
      // Provide more user-friendly message for face angle errors
      else if (
        err.message.includes('Face angle') ||
        err.message.includes('face is not')
      ) {
        errorMessage =
          'الصورة المرفوعة لا تلبي المتطلبات. يرجى رفع صورة واضحة للوجه مباشرة أمام الكاميرا.';
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
