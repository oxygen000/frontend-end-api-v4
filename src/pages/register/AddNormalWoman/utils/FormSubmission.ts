import type { FormData } from '../types/types';
import { registrationApi } from '../../../../services/api';
import { toast } from 'react-hot-toast';

export const submitForm = async (
  formData: FormData,
  capturedImage: string | null,
  t: (key: string, fallback: string) => string
): Promise<{ success: boolean; userId?: string; userName?: string }> => {
  try {
    // Create FormData object
    const formDataToSend = new FormData();

    // Pass individual form fields as expected by the API
    formDataToSend.append('name', formData.name);
    formDataToSend.append('form_type', 'adult');
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');
    formDataToSend.append('category', 'female');

    // Add individual form fields to ensure they're properly processed
    formDataToSend.append(
      'nickname',
      formData.nickname || formData.name.split(' ')[0] || ''
    );
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('date_of_birth', formData.dob);
    formDataToSend.append('national_id', formData.national_id);
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('phone_company', formData.phone_company);
    formDataToSend.append('job', formData.job || '');
    formDataToSend.append('occupation', formData.job || '');

    if (formData.second_phone_number) {
      formDataToSend.append(
        'second_phone_number',
        formData.second_phone_number
      );
    }

    // Convert boolean values to "1"/"0" strings for proper backend processing
    formDataToSend.append(
      'has_criminal_record',
      formData.has_criminal_record ? '1' : '0'
    );
    formDataToSend.append(
      'has_motorcycle',
      formData.has_motorcycle ? '1' : '0'
    );

    // Add criminal record fields if applicable
    if (formData.has_criminal_record) {
      formDataToSend.append('case_details', formData.case_details || '');
      formDataToSend.append('police_station', formData.police_station || '');
      formDataToSend.append('case_number', formData.case_number || '');
      formDataToSend.append('judgment', formData.judgment || '');
      formDataToSend.append('accusation', formData.accusation || '');
    }

    // Add vehicle fields if applicable
    if (formData.has_motorcycle) {
      formDataToSend.append('license_plate', formData.license_plate || '');
      formDataToSend.append('vehicle_model', formData.vehicle_model || '');
      formDataToSend.append('vehicle_color', formData.vehicle_color || '');
      formDataToSend.append('chassis_number', formData.chassis_number || '');
      formDataToSend.append('vehicle_number', formData.vehicle_number || '');
      formDataToSend.append(
        'license_expiration',
        formData.license_expiration || ''
      );
      // Only send manufacture_year if it's actually set
      if (formData.manufacture_year) {
        formDataToSend.append('manufacture_year', formData.manufacture_year);
      }
    }

    // Add travel fields
    if (formData.travel_date) {
      formDataToSend.append('travel_date', formData.travel_date);
      formDataToSend.append(
        'travel_destination',
        formData.travel_destination || ''
      );
      formDataToSend.append('arrival_airport', formData.arrival_airport || '');
      formDataToSend.append('arrival_date', formData.arrival_date || '');
      formDataToSend.append('flight_number', formData.flight_number || '');
      formDataToSend.append('return_date', formData.return_date || '');
    }

    // Create a complete user data object and append as JSON
    const userData = {
      name: formData.name,
      nickname: formData.nickname || formData.name.split(' ')[0] || '',
      dob: formData.dob,
      date_of_birth: formData.dob,
      national_id: formData.national_id,
      address: formData.address || '',
      phone_number: formData.phone_number,
      phone_company: formData.phone_company,
      second_phone_number: formData.second_phone_number || '',
      category: 'female',
      form_type: 'adult', // Changed from 'woman' to match the backend expectations
      employee_id: '',
      department: '',
      role: '',
      job: formData.job || '',
      occupation: formData.job || '',
      has_criminal_record: formData.has_criminal_record ? '1' : '0',
      case_details: formData.case_details || '',
      police_station: formData.police_station || '',
      case_number: formData.case_number || '',
      judgment: formData.judgment || '',
      accusation: formData.accusation || '',
      has_motorcycle: formData.has_motorcycle ? '1' : '0',
      license_plate: formData.license_plate || '',
      vehicle_model: formData.vehicle_model || '',
      vehicle_color: formData.vehicle_color || '',
      chassis_number: formData.chassis_number || '',
      vehicle_number: formData.vehicle_number || '',
      license_expiration: formData.license_expiration || '',
      // Only include manufacture_year if it has a value to avoid DB errors
      ...(formData.manufacture_year
        ? { manufacture_year: formData.manufacture_year }
        : {}),
      travel_date: formData.travel_date || '',
      travel_destination: formData.travel_destination || '',
      arrival_airport: formData.arrival_airport || '',
      arrival_date: formData.arrival_date || '',
      flight_number: formData.flight_number || '',
      return_date: formData.return_date || '',
    };

    // Append the complete user data as JSON and log for debugging
    formDataToSend.append('user_data', JSON.stringify(userData));
    console.log('Complete user_data JSON being sent:', userData);

    // Make sure image is handled correctly
    if (formData.image) {
      formDataToSend.append('file', formData.image);
    } else if (capturedImage) {
      // Convert base64 to file if using webcam
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], 'webcam_image.jpg', {
        type: 'image/jpeg',
      });
      formDataToSend.append('file', file);
    } else {
      throw new Error(t('validation.photoRequired', 'Please provide an image'));
    }

    console.log(
      'Sending registration request for female user to endpoint /register/upload'
    );
    const responseData = await registrationApi.registerUser(formDataToSend);

    // Handle successful registration
    const userId = responseData?.user_id || responseData?.user?.id || undefined;
    const userName = responseData?.user?.name || formData.name;

    toast.success(
      t('registration.successMessage', `${userName} registered successfully!`)
    );

    return { success: true, userId, userName };
  } catch (err) {
    console.error('Registration error:', err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : t(
            'registration.generalError',
            'An error occurred during registration'
          );

    toast.error(errorMessage);
    return { success: false };
  }
};
