import type { TelecomCompany } from '../../../../services/api/types';

export interface DisabledFormData {
  // Basic information - core user fields
  name: string; // Maps to full_name in backend
  dob: string; // Maps to date_of_birth in backend
  gender: string;
  national_id: string;
  address: string;
  nickname: string;

  // Physical description
  distinctive_mark?: string;

  // Contact information
  phone_number: string;
  phone_company: TelecomCompany; // Maps to service_provider in backend
  second_phone_number: string; // Maps to secondary_phone in backend

  // Disability information (required fields)
  disability_type: string;
  disability_description: string; // Used for both disability_details and disability_description in backend
  medical_condition: string; // Maps to both medical_condition and medical_history in backend
  special_needs: string;
  emergency_contact: string;
  emergency_phone: string;

  // Guardian/Reporter information (required fields)
  guardian_name: string; // Maps to both guardian_name and reporter_name in backend
  guardian_phone: string; // Maps to both guardian_phone and reporter_phone in backend
  relationship: string; // Maps to reporter_relationship in backend
  reporter_address: string; // Required for guardian/reporter
  previous_disputes: string;
  missing_person_phone: string;
  missing_person_occupation: string;
  missing_person_education: string;

  // Additional reporter fields
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_secondary_phone?: string;
  reporter_national_id?: string;
  reason_for_location?: string;

  // Police report information (optional)
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Medical information (optional)
  age?: string; // Calculated from DOB but can be explicitly provided
  treating_physician?: string;
  physician_phone?: string;
  medication?: string;

  // Missing person information (optional)
  area_of_disappearance?: string;
  last_sighting?: string;
  last_seen_time?: string;
  clothes_description?: string;
  disappearance_date?: string;
  disappearance_time?: string;
  was_accompanied?: string;
  friends?: string; // Combined field for friend information
  first_friend?: string; // Individual friend fields
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;
  previous_incidents?: string;
  gone_missing_before?: string;

  // Form metadata
  form_type: string;
  image: File | null;
  useCamera: boolean;
  additional_notes?: string;
}

export const initialFormData: DisabledFormData = {
  // Basic information
  name: '',
  dob: '',
  gender: '',
  national_id: '',
  address: '',
  nickname: '',

  // Physical description
  distinctive_mark: '',

  // Contact information
  phone_number: '',
  phone_company: '',
  second_phone_number: '',

  // Disability information (required fields)
  disability_type: '',
  disability_description: '',
  medical_condition: '',
  special_needs: '',
  emergency_contact: '',
  emergency_phone: '',

  // Guardian/Reporter information (required fields)
  guardian_name: '',
  guardian_phone: '',
  relationship: '',
  reporter_address: '',
  missing_person_education: '',

  // Additional reporter fields
  reporter_occupation: '',
  reporter_education: '',
  reporter_secondary_phone: '',
  reporter_national_id: '',
  reason_for_location: '',

  // Police report information
  absence_report_number: '',
  absence_report_date: '',
  police_station: '',
  security_directorate: '',
  governorate: '',
  previous_disputes: '',
  missing_person_occupation: '',
  gone_missing_before: '',

  // Medical information
  age: '',
  treating_physician: '',
  physician_phone: '',
  medication: '',

  // Missing person information
  area_of_disappearance: '',
  last_sighting: '',
  last_seen_time: '',
  clothes_description: '',
  disappearance_date: '',
  disappearance_time: '',
  was_accompanied: '',
  previous_incidents: '',
  friends: '',
  first_friend: '',
  second_friend: '',
  first_friend_phone: '',
  second_friend_phone: '',

  // Form metadata
  form_type: 'disabled',
  image: null,
  useCamera: false,
  additional_notes: '',

  missing_person_phone: '',

};

export type DisabledFormSection = 1 | 2 | 3 | 4 | 5 | 6;
