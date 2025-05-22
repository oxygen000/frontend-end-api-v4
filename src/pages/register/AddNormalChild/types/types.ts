import type { TelecomCompany } from '../../../../config/types';

// Add interface with face_id property to fix TypeScript errors
export interface UserWithFaceId {
  id: string;
  name?: string; // Keep for backward compatibility
  face_id?: string;
  image_path?: string;
  [key: string]: unknown;
}

// Update the FormData interface to include all database fields from child.py
export interface FormData {
  // ========== BACKEND DATABASE FIELDS ==========

  // Basic information from base table
  id?: string;
  face_id?: string;
  name: string; // Maps to both name AND full_name in backend
  full_name?: string; // Added for consistency with backend
  nickname?: string; // Usually derived from name
  dob: string; // Maps to both dob AND date_of_birth in backend
  date_of_birth?: string; // Added for consistency with backend
  gender: string;
  national_id: string;
  address: string;
  age?: string; // Calculated from DOB
  form_type: string;

  // Reporter Information (direct match with database)
  reporter_name?: string; // Mapped from guardian_name
  reporter_national_id?: string; // Mapped from guardian_id
  reporter_address?: string;
  reporter_phone?: string; // Mapped from guardian_phone
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_secondary_phone?: string;
  reporter_relationship?: string; // Mapped from relationship

  // Guardian information (frontend naming, mapped to reporter fields)
  guardian_name: string; // Maps to reporter_name
  guardian_phone: string; // Maps to reporter_phone
  guardian_id?: string; // Maps to reporter_national_id
  relationship: string; // Maps to reporter_relationship
  phone_company: TelecomCompany; // Maps to service_provider

  // Police Report Information
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Missing Person Information
  distinctive_mark?: string; // Mapped from physical_description
  missing_person_phone?: string;
  missing_person_occupation?: string;
  missing_person_education?: string;

  // Disappearance Details
  area_of_disappearance?: string; // Mapped from last_seen_location
  last_sighting?: string;
  clothes_description?: string; // Mapped from last_seen_clothes
  reason_for_location?: string;
  disappearance_date?: string; // Derived from last_seen_time
  disappearance_time?: string; // Derived from last_seen_time
 

  // Frontend naming for disappearance (mapped to database fields)
  last_seen_time: string; // Maps to disappearance_date and disappearance_time
  last_seen_location: string; // Maps to area_of_disappearance
  last_seen_clothes: string; // Maps to clothes_description
  physical_description: string; // Maps to distinctive_mark

  // Medical Information
  medical_history?: string; // Mapped from medical_condition
  medical_condition: string; // Maps to medical_history in backend
  treating_physician?: string;
  physician_phone?: string;

  // Additional Details
  previous_disputes?: string;
  gone_missing_before?: string;
  first_friend?: string;
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;
  additional_notes: string;

  // Frontend-specific fields (not sent to backend)
  image: File | null;
  useCamera: boolean;


  was_accompanied: string;
 
}

export const initialFormData: FormData = {
  // Basic information
  name: '',
  dob: '',
  full_name: '',
  gender: '',
  national_id: '',
  address: '',
  form_type: 'child',

  // Guardian/Reporter information
  guardian_name: '',
  guardian_phone: '',
  guardian_id: '',
  relationship: '',
  phone_company: '',

  // Physical description fields
  physical_description: '',
  last_seen_time: '',
  last_seen_location: '',
  last_seen_clothes: '',

  // Medical information
  medical_condition: '',

  // Additional information
  additional_notes: '',

  // Frontend fields
  image: null,
  useCamera: false,

  // Initialize optional fields as empty strings
  // Reporter fields (backend schema)
  reporter_name: '',
  reporter_national_id: '',
  reporter_address: '',
  reporter_phone: '',
  reporter_occupation: '',
  reporter_education: '',
  reporter_secondary_phone: '',

  // Police report fields
  absence_report_number: '',
  absence_report_date: '',
  police_station: '',
  security_directorate: '',
  governorate: '',

  // Disappearance details
  reason_for_location: '',
  was_accompanied: '',
  last_sighting: '',

  // Missing person fields
  missing_person_phone: '',
  missing_person_occupation: '',
  missing_person_education: '',

  // Medical details
  treating_physician: '',
  physician_phone: '',

  // Social connections
  first_friend: '',
  second_friend: '',
  first_friend_phone: '',
  second_friend_phone: '',




  // History information
  previous_disputes: '',
  gone_missing_before: '',


  // Police Report Information

  clothes_description: '',
  distinctive_mark: '',
  disappearance_time: '',
  disappearance_date: '',
  area_of_disappearance: '',


};
