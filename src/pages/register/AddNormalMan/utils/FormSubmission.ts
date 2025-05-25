import type { FormData } from '../types/types';
import { registrationApi } from '../../../../services/api';
import { toast } from 'react-hot-toast';

// Define a type for the user data sent to the API
interface UserDataType {
  name: string;
  full_name: string; // Add full_name field as required by the API
  nickname: string;
  dob: string;
  national_id: string;
  mothers_name: string;
  address: string;
  category: string;
  form_type: string;
  employee_id: string;
  department: string;
  role: string;
  occupation: string;
  has_criminal_record: string;
  case_details: string;
  police_station: string;
  case_number: string;
  judgment: string;
  accusation: string;
  has_vehicle: string;
  court_governorate: string;
  marital_status: string;
  educational_qualification: string;
  issue_date: string;
  issuing_authority: string;

  // Contact information
  phone_number: string;
  phone_company: string;
  service_provider?: string;
  second_phone_number?: string;
  landline_number?: string;
  registration_date?: string;
  last_number?: string;
  governorate?: string;

  // Vehicle information
  vehicle_number?: string;
  license_plate?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  brand?: string;
  chassis_number?: string;
  license_type?: string;
  traffic_unit?: string;
  license_expiration?: string;
  manufacture_year?: string;
  expiration_year?: string;
  traffic_department?: string;
  engine_number?: string;
  vehicle_type?: string;
  fuel_type?: string;
  registration_number?: string;
  insurance_company?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: string;

  owner_name?: string; // If different from the person
  record_number?: string;
  dossier_number?: string;

  // Travel information
  passport_number?: string;
  passport_issue_date?: string;
  passport_expiry_date?: string;
  passport_issuing_country?: string;
  visa_number?: string;
  visa_type?: string;
  visa_issue_date?: string;
  visa_expiry_date?: string;
  departure_country?: string;
  departure_destination?: string;
  departure_date?: string;
  departure_time?: string;
  departure_airline?: string;
  departure_flight_number?: string;
  departure_airport?: string;
  arrival_origin?: string;
  arrival_destination?: string;
  arrival_airline?: string;
  arrival_flight_number?: string;
  arrival_date?: string;
  arrival_time?: string;
  return_airport?: string;
  return_flight_number?: string;
  accommodation_address?: string;
  accommodation_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  travel_purpose?: string;
  travel_duration?: string;
  // Travel (UI only)
  has_travel: string;
  travel_date: string;
  travel_destination: string;
  arrival_airport: string;
  flight_number: string;
  return_date: string;
  charge: string;
  sentence: string;
}

export const submitForm = async (
  formData: FormData,
  capturedImage: string | null,
  t: (key: string, fallback: string) => string
): Promise<{ success: boolean; userId?: string; userName?: string }> => {
  try {
    // Create FormData object (using global FormData)
    const formDataToSend = new globalThis.FormData();

    // Pass individual form fields as expected by the API
    formDataToSend.append('name', formData.name);
    formDataToSend.append('full_name', formData.name); // Add full_name field as required by the API
    formDataToSend.append('form_type', 'man');
    formDataToSend.append('bypass_angle_check', 'true');
    formDataToSend.append('train_multiple', 'true');
    formDataToSend.append('category', 'male');

    // Ensure these critical fields are always present
    if (!formData.name) {
      const defaultName = 'Unknown';
      formDataToSend.append('name', defaultName);
      formDataToSend.append('full_name', defaultName);
    }
    if (!formData.dob)
      formDataToSend.append('dob', new Date().toISOString().split('T')[0]);
    if (!formData.national_id)
      formDataToSend.append('national_id', 'temp-' + Date.now());

    // Add individual form fields to ensure they're properly processed
    formDataToSend.append(
      'nickname',
      formData.nickname || formData.name.split(' ')[0] || ''
    );
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('national_id', formData.national_id);
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('phone_company', formData.phone_company);
    formDataToSend.append('landline_number', formData.landline_number || '');
    formDataToSend.append('service_provider', formData.service_provider || '');
    formDataToSend.append('occupation', formData.occupation || '');

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
    formDataToSend.append('has_vehicle', formData.has_vehicle ? '1' : '0');
    formDataToSend.append('has_travel', formData.has_travel ? '1' : '0');

    // Add criminal record fields if applicable
    if (formData.has_criminal_record) {
      formDataToSend.append('case_details', formData.case_details || '');
      formDataToSend.append('police_station', formData.police_station || '');
      formDataToSend.append('case_number', formData.case_number || '');
      formDataToSend.append('judgment', formData.judgment || '');
      formDataToSend.append('accusation', formData.accusation || '');
      formDataToSend.append(
        'court_governorate',
        formData.court_governorate || ''
      );
    }

    // Add vehicle fields directly as individual columns to match the database schema
    if (formData.has_vehicle) {
      formDataToSend.append('license_plate', formData.license_plate || '');
      formDataToSend.append('vehicle_model', formData.vehicle_model || '');
      formDataToSend.append('vehicle_color', formData.vehicle_color || '');
      formDataToSend.append('chassis_number', formData.chassis_number || '');
      formDataToSend.append('vehicle_number', formData.vehicle_number || '');
      formDataToSend.append('vehicle_type', formData.vehicle_type || '');
      formDataToSend.append(
        'license_expiration',
        formData.license_expiration || ''
      );
      formDataToSend.append(
        'license_governorate',
        formData.license_governorate || ''
      );
      formDataToSend.append('expiration_year', formData.expiration_year || '');
      formDataToSend.append(
        'manufacture_year',
        formData.manufacture_year || ''
      );
      formDataToSend.append(
        'traffic_department',
        formData.traffic_department || ''
      );
      formDataToSend.append('brand', formData.brand || '');
      formDataToSend.append('license_type', formData.license_type || '');
      formDataToSend.append('traffic_unit', formData.traffic_unit || '');
      formDataToSend.append('vehicle_number', formData.vehicle_number || '');
    }

    // Add travel fields if has_travel is true
    if (formData.has_travel) {
      // Passport information
      formDataToSend.append('passport_number', formData.passport_number || '');
      formDataToSend.append(
        'passport_issue_date',
        formData.passport_issue_date || ''
      );
      formDataToSend.append(
        'passport_expiry_date',
        formData.passport_expiry_date || ''
      );
      formDataToSend.append(
        'passport_issuing_country',
        formData.passport_issuing_country || ''
      );

      // Departure information
      formDataToSend.append(
        'departure_airport',
        formData.departure_airport || ''
      );
      formDataToSend.append(
        'departure_country',
        formData.departure_country || ''
      );
      formDataToSend.append(
        'departure_destination',
        formData.travel_destination || ''
      );
      // Use the appropriate travel date fields
      formDataToSend.append(
        'departure_date',
        formData.departure_date || formData.travel_date || ''
      );
      formDataToSend.append('departure_time', formData.departure_time || '');
      formDataToSend.append(
        'departure_airline',
        formData.departure_airline || ''
      );
      formDataToSend.append(
        'departure_flight_number',
        formData.departure_flight_number || ''
      );

      // Arrival information
      formDataToSend.append('destination', formData.travel_destination || '');
      formDataToSend.append('arrival_airport', formData.arrival_airport || '');
      formDataToSend.append('arrival_origin', formData.arrival_origin || '');
      formDataToSend.append(
        'arrival_destination',
        formData.arrival_destination || ''
      );
      formDataToSend.append('arrival_airline', formData.arrival_airline || '');
      formDataToSend.append(
        'arrival_flight_number',
        formData.arrival_flight_number || ''
      );
      formDataToSend.append('arrival_date', formData.arrival_date || '');
      formDataToSend.append('arrival_time', formData.arrival_time || '');
      formDataToSend.append('return_date', formData.return_date || '');

      // Return information
      formDataToSend.append('return_airport', formData.return_airport || '');
      formDataToSend.append(
        'return_flight_number',
        formData.return_flight_number || ''
      );
    }

    // Create a complete user data object and append as JSON
    const userData: UserDataType = {
      name: formData.name,
      full_name: formData.name, // Add full_name field as required by the API
      nickname: formData.nickname || formData.name.split(' ')[0] || '',
      dob: formData.dob,
      mothers_name: formData.mothers_name || '',
      marital_status: formData.marital_status || '',
      educational_qualification: formData.educational_qualification || '',
      national_id: formData.national_id,
      address: formData.address || '',
      issue_date: formData.issue_date || '',
      phone_number: formData.phone_number,
      phone_company: formData.phone_company,
      service_provider: formData.service_provider || '',
      second_phone_number: formData.second_phone_number || '',
      category: 'male',
      form_type: 'man',
      employee_id: '',
      department: '',
      role: '',
      vehicle_number: formData.vehicle_number || '',
      occupation: formData.occupation || '',
      has_criminal_record: formData.has_criminal_record ? '1' : '0',
      case_details: formData.case_details || '',
      court_governorate: formData.court_governorate || '',
      police_station: formData.police_station || '',
      issuing_authority: formData.issuing_authority || '',
      case_number: formData.case_number || '',
      judgment: formData.judgment || '',
      accusation: formData.accusation || '',
      has_vehicle: formData.has_vehicle ? '1' : '0',
      has_travel: formData.has_travel ? '1' : '0',
      travel_date: formData.travel_date || '',
      travel_destination: formData.travel_destination || '',
      arrival_airport: formData.arrival_airport || '',
      arrival_date: formData.arrival_date || '',
      flight_number: formData.flight_number || '',
      return_date: formData.return_date || '',
      departure_date: formData.departure_date || formData.travel_date || '',
      departure_destination: formData.travel_destination || '',
      departure_flight_number: formData.departure_flight_number || '',
      departure_airport: formData.departure_airport || '',
      passport_number: formData.passport_number || '',
      passport_issue_date: formData.passport_issue_date || '',
      passport_expiry_date: formData.passport_expiry_date || '',
      passport_issuing_country: formData.passport_issuing_country || '',
      return_airport: formData.return_airport || '',
      return_flight_number: formData.return_flight_number || '',
      governorate: formData.governorate || '',
      record_number: formData.record_number || '',
      dossier_number: formData.dossier_number || '',
      charge: formData.charge || '',
      sentence: formData.sentence || '',
    };

    // Add vehicle fields to the user data object too
    if (formData.has_vehicle) {
      userData.vehicle_model = formData.vehicle_model || '';
      userData.vehicle_color = formData.vehicle_color || '';
      userData.chassis_number = formData.chassis_number || '';
      userData.vehicle_number = formData.vehicle_number || '';
      userData.vehicle_type = formData.vehicle_type || '';
      userData.license_expiration = formData.license_expiration || '';
      userData.expiration_year = formData.expiration_year || '';
      userData.manufacture_year = formData.manufacture_year || '';
      userData.traffic_department = formData.traffic_department || '';
    }

    // Filter out fields that are not in the database schema
    // Remove unique_id and request_id fields that cause database errors
    const filteredUserData = { ...userData };

    // List of fields not present in the database schema that should be removed
    const fieldsToRemove = ['unique_id', 'request_id'];

    // Remove problematic fields - ensure they're removed completely
    fieldsToRemove.forEach((field) => {
      delete (filteredUserData as unknown as Record<string, unknown>)[field];
    });

    // Double-check to ensure unique_id is definitely removed
    if ('unique_id' in filteredUserData) {
      console.warn(
        'unique_id still present after removal attempt, forcing deletion'
      );
      delete (filteredUserData as unknown as Record<string, unknown>).unique_id;
    }

    // Log filtered data
    console.log(
      'Filtered user_data (removed fields that cause DB errors):',
      fieldsToRemove
        .filter((f) => f in (userData as unknown as Record<string, unknown>))
        .join(', ')
    );

    // Append the filtered user data as JSON and log for debugging
    formDataToSend.append('user_data', JSON.stringify(filteredUserData));
    console.log('Complete user_data JSON being sent:', filteredUserData);

    // Make sure image is handled correctly
    try {
      if (formData.image) {
        // Ensure the image is a valid File object
        if (formData.image instanceof File) {
          console.log(
            'Using uploaded image file:',
            formData.image.name,
            formData.image.size
          );
          formDataToSend.append('file', formData.image);
        } else {
          console.error('Invalid image object:', formData.image);
          throw new Error(
            t('validation.photoRequired', 'Please provide a valid image')
          );
        }
      } else if (capturedImage) {
        // Convert base64 to file if using webcam
        console.log('Converting webcam image to file');
        try {
          const blob = await (await fetch(capturedImage)).blob();
          const file = new File([blob], 'webcam_image.jpg', {
            type: 'image/jpeg',
          });
          console.log('Created file from webcam image:', file.size);
          formDataToSend.append('file', file);
        } catch (imgError) {
          console.error('Error converting webcam image:', imgError);
          throw new Error(
            t(
              'validation.photoProcessingError',
              'Error processing webcam image'
            )
          );
        }
      } else {
        console.error('No image provided');
        throw new Error(
          t('validation.photoRequired', 'Please provide an image')
        );
      }
    } catch (imageError) {
      console.error('Image processing error:', imageError);
      throw new Error(
        t('validation.photoRequired', 'Please provide a valid image')
      );
    }

    console.log(
      'Sending registration request for male user to endpoint /register/upload'
    );

    try {
      // Check if the API is healthy before making the request
      try {
        const isApiHealthy = await registrationApi.checkApiHealth();
        if (!isApiHealthy) {
          console.warn(
            'API health check failed, but attempting registration anyway'
          );
        } else {
          console.log('API health check passed, proceeding with registration');
        }
      } catch (healthError) {
        console.warn(
          'API health check error, but attempting registration anyway:',
          healthError
        );
      }

      // Log all form data keys and values for debugging
      console.log('Form data keys being sent:');
      for (const pair of formDataToSend.entries()) {
        if (pair[0] === 'file') {
          console.log(
            'file:',
            pair[1] instanceof File
              ? `${pair[1].name} (${pair[1].size} bytes)`
              : pair[1]
          );
        } else if (pair[0] === 'user_data') {
          console.log('user_data: [JSON object]');
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Double-check that full_name is included
      console.log(
        'Checking for full_name field:',
        formDataToSend.has('full_name')
      );
      if (!formDataToSend.has('full_name')) {
        console.warn('full_name field is missing, adding it now');
        formDataToSend.append('full_name', formData.name || 'Unknown');
      }

      const responseData = await registrationApi.registerUser(formDataToSend);

      // Handle successful registration
      const userId =
        responseData?.user_id || responseData?.user?.id || undefined;
      const userName = responseData?.user?.name || formData.name;

      console.log('Registration successful:', { userId, userName });

      toast.success(
        t('registration.successMessage', `${userName} registered successfully!`)
      );

      return { success: true, userId, userName };
    } catch (error) {
      console.error('API request failed:', error);

      // Type guard for AxiosError-like objects
      function isAxiosError(
        error: unknown
      ): error is { response: { data: unknown } } {
        return (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: unknown }).response === 'object' &&
          (error as { response?: { data?: unknown } }).response !== null &&
          'data' in
            ((error as { response?: { data?: unknown } }).response || {})
        );
      }
      let errorDetail = '';
      if (isAxiosError(error)) {
        const responseData = error.response.data;
        console.error('API error response data:', responseData);
        if (typeof responseData === 'object') {
          errorDetail = JSON.stringify(responseData);
        } else {
          errorDetail = String(responseData);
        }
      }

      throw new Error(
        `API Error: ${error instanceof Error ? error.message : ''}${errorDetail ? ` - ${errorDetail}` : ''}`
      );
    }
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
