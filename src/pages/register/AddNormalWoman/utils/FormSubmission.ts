import type { FormData } from '../types/types';
import { registrationApi } from '../../../../services/api';
import { toast } from 'react-hot-toast';

// Define interface for user data
interface UserDataType {
  name: string;
  full_name: string; // Added for new schema
  nickname: string;
  dob: string;
  date_of_birth: string;
  national_id: string;
  address: string;
  phone_number: string;
  phone_company: string;
  service_provider: string;
  second_phone_number: string;
  category: string;
  form_type: string;
  employee_id: string;
  department: string;
  role: string;
  occupation: string;

  // Criminal record
  has_criminal_record: string;
  case_details: string;
  case_number: string;
  judgment: string;
  accusation: string;
  security_directorate: string;
  police_station: string;
  sentence: string;

  court_governorate?: string;

  travel_date: string;
  travel_destination: string;
  return_date: string;

  // Vehicle and travel
  has_vehicle: string;
  has_motorcycle: string;
  departure_airport: string;
  departure_country: string;
  departure_destination: string;
  departure_date: string;
  departure_time: string;
  departure_airline: string;
  departure_flight_number: string;
  destination: string;
  departure_datetime: string;
  arrival_airport: string;
  arrival_origin: string;
  arrival_destination: string;
  arrival_airline: string;
  arrival_flight_number: string;
  arrival_date: string;
  arrival_time: string;
  arrival_datetime: string;
  license_governorate: string;
  flight_number: string;
  return_airport: string;
  return_flight_number: string;
  passport_number: string;
  license_plate?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  color?: string;

  chassis_number?: string;
  vehicle_number?: string;
  license_expiration?: string;
  license_expiration_date?: string;
  traffic_department?: string;
  expiration_year?: string;
  manufacture_year?: string;

  dossier_number?: string;

  record_number?: string;

  brand?: string;
  license_type?: string;
  traffic_unit?: string;
  vehicle_type?: string;
  [key: string]: string | undefined; // Use more specific types instead of any
}

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
    formDataToSend.append('full_name', formData.full_name || formData.name); // Use name if full_name not set
    formDataToSend.append('form_type', 'woman');
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
    formDataToSend.append('service_provider', formData.service_provider || '');
    formDataToSend.append('occupation', formData.occupation || '');
    formDataToSend.append('mothers_name', formData.mothers_name || '');
    formDataToSend.append('marital_status', formData.marital_status || '');
    formDataToSend.append(
      'educational_qualification',
      formData.educational_qualification || ''
    );
    formDataToSend.append(
      'issuing_authority',
      formData.issuing_authority || ''
    );
    formDataToSend.append('issue_date', formData.issue_date || '');
    formDataToSend.append(
      'court_governorate',
      formData.court_governorate || ''
    );

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
    formDataToSend.append(
      'has_motorcycle',
      formData.has_motorcycle ? '1' : '0'
    );

    // Add criminal record fields if applicable
    if (formData.has_criminal_record) {
      formDataToSend.append('case_details', formData.case_details || '');
      formDataToSend.append('case_number', formData.case_number || '');
      formDataToSend.append('judgment', formData.judgment || '');
      formDataToSend.append('accusation', formData.accusation || '');
      formDataToSend.append(
        'security_directorate',
        formData.security_directorate || ''
      );
      formDataToSend.append('police_station', formData.police_station || '');
      formDataToSend.append('sentence', formData.sentence || '');
    }

    // Add travel fields
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
      formDataToSend.append(
        'return_flight_number',
        formData.return_flight_number || ''
      );
      formDataToSend.append('arrival_date', formData.arrival_date || '');
      formDataToSend.append('arrival_time', formData.arrival_time || '');
      formDataToSend.append('return_date', formData.return_date || '');
      formDataToSend.append(
        'return_flight_number',
        formData.return_flight_number || ''
      );
      formDataToSend.append('return_airport', formData.return_airport || '');
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
        'traffic_department',
        formData.traffic_department || ''
      );
      formDataToSend.append('brand', formData.brand || '');
      formDataToSend.append('license_type', formData.license_type || '');
      formDataToSend.append('license_governorate', formData.license_governorate || '');

      // Keep original expiration_year
      formDataToSend.append('expiration_year', formData.expiration_year || '');

      if (formData.manufacture_year) {
        formDataToSend.append('manufacture_year', formData.manufacture_year);
      }
      formDataToSend.append('traffic_unit', formData.traffic_unit || '');
      formDataToSend.append('brand', formData.brand || '');
      formDataToSend.append('license_type', formData.license_type || '');

      formDataToSend.append('record_number', formData.record_number || '');
      formDataToSend.append('dossier_number', formData.dossier_number || '');
    }

    // Create a complete user data object and append as JSON
    const userData: UserDataType = {
      name: formData.name,
      full_name: formData.full_name || formData.name, // Use full_name if available, otherwise name
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
      category: 'female',
      form_type: 'woman',
      employee_id: '',
      department: '',
      role: '',
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
      record_number: formData.record_number || '',

      // Map travel fields correctly
      passport_number: formData.passport_number || '',
      passport_issue_date: formData.passport_issue_date || '',
      passport_expiry_date: formData.passport_expiry_date || '',
      passport_issuing_country: formData.passport_issuing_country || '',

      // Make sure these fields match what's in the form
      travel_date: formData.travel_date || '',
      travel_destination: formData.travel_destination || '',
      departure_date: formData.departure_date || formData.travel_date || '',
      departure_destination: formData.travel_destination || '',
      departure_country: formData.departure_country || '',
      departure_airline: formData.departure_airline || '',
      departure_flight_number: formData.departure_flight_number || '',
      departure_airport: formData.departure_airport || '',
      departure_time: formData.departure_time || '',

      arrival_airport: formData.arrival_airport || '',
      arrival_date: formData.arrival_date || '',
      arrival_time: formData.arrival_time || '',
      arrival_origin: formData.arrival_origin || '',
      arrival_destination: formData.arrival_destination || '',
      arrival_airline: formData.arrival_airline || '',
      arrival_flight_number: formData.arrival_flight_number || '',
      license_governorate: formData.license_governorate || '',

      return_date: formData.return_date || '',
      flight_number: formData.departure_flight_number || '', // Use departure flight number as fallback

      // Other fields that need to be preserved
      governorate: formData.governorate || '',
      date_of_birth: formData.dob || '',
      security_directorate: formData.security_directorate || '',
      sentence: formData.sentence || '',
      has_motorcycle: formData.has_motorcycle ? '1' : '0',
      destination: formData.travel_destination || '',
      departure_datetime: '',
      arrival_datetime: '',
      return_airport: formData.return_airport || '',
      return_flight_number: formData.return_flight_number || '',
      dossier_number: formData.dossier_number || '',
    };

    // Add vehicle fields to the user data object too
    if (formData.has_vehicle) {
      userData.license_plate = formData.license_plate || '';
      userData.vehicle_model = formData.vehicle_model || '';
      userData.vehicle_color = formData.vehicle_color || '';
      userData.chassis_number = formData.chassis_number || '';
      userData.vehicle_number = formData.vehicle_number || '';
      userData.vehicle_type = formData.vehicle_type || '';
      userData.license_expiration = formData.license_expiration || '';
      userData.traffic_department = formData.traffic_department || '';
      userData.brand = formData.brand || '';
      userData.license_type = formData.license_type || '';
      userData.traffic_unit = formData.traffic_unit || '';

      // Keep original expiration_year without transformation
      userData.expiration_year = formData.expiration_year || '';

      if (formData.manufacture_year) {
        userData.manufacture_year = formData.manufacture_year;
      }
    }

    // Filter out fields that are not in the database schema
    // Remove unique_id and request_id fields that cause database errors
    const filteredUserData = { ...userData };

    // List of fields not present in the database schema that should be removed
    const fieldsToRemove = ['unique_id', 'request_id', 'unique_submission_id'];

    // Remove problematic fields
    fieldsToRemove.forEach((field) => {
      delete (filteredUserData as unknown as Record<string, unknown>)[field];
    });

    // Append the filtered user data as JSON and log for debugging
    formDataToSend.append('user_data', JSON.stringify(filteredUserData));
    console.log('Complete user_data JSON being sent:', filteredUserData);

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
