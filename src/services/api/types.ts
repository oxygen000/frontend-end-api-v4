// Types for user data
export interface BaseUser {
  id?: string;
  name: string;
  full_name?: string;
  nickname?: string;
  dob?: string;
  national_id?: string;
  address?: string;
  additional_notes?: string;
  mothers_name?: string;
  marital_status?: string;
  educational_qualification?: string;
  issuing_authority?: string;
  issue_date?: string;
}

export interface MaleUser extends BaseUser {
  job?: string;
  document_number?: string;
  employee_id?: string;
  department?: string;
  occupation?: string;
  phone_number?: string;
  phone_company?: string;
  second_phone_number?: string;
  has_criminal_record?: boolean;

  arrest?: string;
  case_details?: string;
  security_directorate?: string;
  police_station?: string;
  description?: string;
  sentence?: string;
  fame?: string;
  case_date?: string;
  case_number?: string;
  judgment?: string;
  accusation?: string;
  has_motorcycle?: boolean;

  vehicle?: string;
  traffic_department?: string;
  license_plate?: string;
  color?: string;
  passport_number: string;
  license_expiration_date?: string;
  manufacture_year?: string;
  chassis_number?: string;
  vehicle_number?: string;
  vehicle_model?: string;
  vehicle_type?: string;
  vehicle_info?: {
    manufacture_year?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    chassis_number?: string;
    vehicle_number?: string;
    license_plate?: string;
    license_expiration?: string;
    traffic_department?: string;
    vehicle_type?: string;
  };

  // Travel info
  departure_airport?: string;
  destination?: string;
  departure_datetime?: string;
  arrival_airport?: string;
  arrival_datetime?: string;
  flight_number?: string;
  return_airport?: string;
  return_flight_number?: string;
  record_number?: string;
  arrival_time?: string;
  arrival_airline?: string;
  arrival_flight_number?: string;
}

// Define FemaleUser with missing person schema
export interface FemaleUser extends BaseUser {
  job?: string;
  document_number?: string;
  employee_id?: string;
  department?: string;
  occupation?: string;
  phone_number?: string;
  phone_company?: string;
  second_phone_number?: string;

  // Reporter Information (added for missing person schema)
  reporter_name?: string;
  reporter_national_id?: string;
  reporter_address?: string;
  reporter_phone?: string;
  reporter_secondary_phone?: string;
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_relationship?: string;
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Missing Person Information (added for missing person schema)
  age?: string;
  distinctive_mark?: string;
  missing_person_phone?: string;

  // Disappearance Details (added for missing person schema)
  area_of_disappearance?: string;
  last_sighting?: string;
  clothes_description?: string;
  disappearance_date?: string;
  disappearance_time?: string;
  was_accompanied?: string;

  // Additional Information (added for missing person schema)
  medical_history?: string;
  friends?: string;
  previous_incidents?: string;

  // Criminal record
  has_criminal_record?: boolean;
  arrest?: string;
  case_details?: string;
  case_number?: string;
  judgment?: string;
  accusation?: string;
  sentence?: string;
  fame?: string;
  case_date?: string;
  court_governorate?: string;
  // Vehicle info
  has_motorcycle?: boolean;
  has_vehicle?: boolean;
  vehicle?: string;
  traffic_department?: string;
  license_plate?: string;
  color?: string;
  license_expiration_date?: string;
  manufacture_year?: string;
  chassis_number?: string;
  vehicle_number?: string;
  vehicle_model?: string;
  vehicle_info?: {
    manufacture_year?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    chassis_number?: string;
    vehicle_number?: string;
    license_plate?: string;
    license_expiration?: string;
    traffic_department?: string;
  };

  // Travel info
  departure_airport?: string;
  destination?: string;
  departure_datetime?: string;
  arrival_airport?: string;
  arrival_datetime?: string;
  flight_number?: string;
  return_airport?: string;
  return_flight_number?: string;
  record_number?: string;
  arrival_time?: string;
  arrival_airline?: string;
  arrival_flight_number?: string;
}

export interface ChildUser extends BaseUser {
  // Basic fields
  gender?: string;
  age?: string;

  // Guardian/Reporter information - IMPORTANT FIELD MAPPING NOTES:
  // ============================================================
  // Frontend form uses guardian_* fields, which map to reporter_* fields in backend
  // - guardian_name → reporter_name
  // - guardian_phone → reporter_phone
  // - guardian_id → reporter_national_id
  // - relationship → reporter_relationship
  // Both frontend and backend fields are kept here for compatibility
  guardian_name: string;
  guardian_phone: string;
  guardian_id: string;
  relationship: string;
  reporter_name?: string;
  reporter_national_id?: string;
  reporter_address?: string;
  reporter_phone?: string;
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_secondary_phone?: string;
  reporter_relationship?: string;

  // Physical description - IMPORTANT FIELD MAPPING NOTES:
  // ===================================================
  // Frontend form uses different field names than backend:
  // - physical_description → distinctive_mark
  // - last_seen_clothes → clothes_description
  // - last_seen_location → area_of_disappearance
  // - last_seen_time → disappearance_date + disappearance_time
  // Both frontend and backend fields are kept here for compatibility
  physical_description?: string;
  last_clothes?: string;
  area_of_disappearance?: string;
  last_seen_time?: string;
  distinctive_mark?: string;
  clothes_description?: string;
  last_sighting?: string;

  // Medical information - IMPORTANT FIELD MAPPING NOTES:
  // ==================================================
  // Frontend form uses different field names than backend:
  // - medical_condition → medical_history
  // Both frontend and backend fields are kept here for compatibility
  medical_condition?: string;
  medical_history?: string;
  treating_physician?: string;
  physician_phone?: string;

  // Missing person details
  missing_person_phone?: string;
  missing_person_occupation?: string;
  missing_person_education?: string;

  // Police report information
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Disappearance details
  disappearance_date?: string;
  disappearance_time?: string;
  was_accompanied?: string;
  reason_for_location?: string;

  // Additional details
  previous_disputes?: string;
  gone_missing_before?: string;
  first_friend?: string;
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;
  additional_notes?: string;
  phone_number?: string;
  phone_company?: string;
  service_provider?: string;
  secondary_phone?: string;

  // Internal tracking fields
  unique_id?: string;
  request_id?: string;
}

export interface DisabledUser extends BaseUser {
  gender?: string;
  job?: string;
  document_number?: string;
  phone_number?: string;
  phone_company?: string;
  service_provider?: string;
  secondary_phone?: string;
  guardian_name?: string;
  guardian_phone?: string;
  date_of_birth?: string;
  disability_type: string;
  disability_details: string;
  medical_condition?: string;
  medication?: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  caregiver_relationship?: string;
  physical_description?: string;
  last_clothes?: string;
  area_of_disappearance?: string;
  last_known_location?: string;
  last_seen_time?: string;
  unique_id?: string;
  request_id?: string;

  // New missing person fields
  reporter_name?: string;
  reporter_national_id?: string;
  reporter_address?: string;
  reporter_phone?: string;
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_relationship?: string;
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;
  distinctive_mark?: string;
  clothes_description?: string;
  disappearance_date?: string;
  disappearance_time?: string;
  was_accompanied?: string;
  medical_history?: string;
  friends?: string;
  previous_incidents?: string;

  // Additional missing person fields
  treating_physician?: string;
  physician_phone?: string;
  first_friend?: string;
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;
  gone_missing_before?: string;
  missing_person_phone?: string;
  missing_person_occupation?: string;
  missing_person_education?: string;
}

// Define types for user data for registration
export interface BaseUserData {
  name: string;
  full_name: string;
  nickname?: string;
  dob: string;
  national_id: string;
  address: string;
  phone_number: string;
  phone_company: string;
  second_phone_number?: string;
  category: string;
  form_type: string;
}

export interface CriminalRecordData {
  has_criminal_record: number | string;
  arrest?: string;
  case_number?: string;
  security_directorate?: string;
  police_station?: string;
  description?: string;
  sentence?: string;
  fame?: string;
  case_date?: string;
  judgment?: string;
  accusation?: string;
  case_details?: string;
}

export interface VehicleData {
  has_motorcycle: number | string;
  has_vehicle?: number | string;
  motorcycle?: boolean | string;
  vehicle_type?: string;
  vehicle_model?: string;
  traffic_department?: string;
  license_plate?: string;
  vehicle_color?: string;
  license_expiration?: string;
  manufacture_year?: string;
  chassis_number?: string;
  vehicle_number?: string;
  vehicle_info?: {
    manufacture_year?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    chassis_number?: string;
    vehicle_number?: string;
    license_plate?: string;
    license_expiration?: string;
    traffic_department?: string;
    expiration_year?: string;
    vehicle_type?: string;
  };
}

export interface TravelData {
  departure_airport?: string;
  destination?: string;
  departure_datetime?: string;
  arrival_airport?: string;
  arrival_datetime?: string;
  flight_number?: string;
  return_airport?: string;
  return_flight_number?: string;
  record_number?: string;
  arrival_time?: string;
  arrival_airline?: string;
  arrival_flight_number?: string;
  departure_country?: string;
  departure_destination?: string;
  departure_date?: string;
  departure_time?: string;
  departure_airline?: string;
  departure_flight_number?: string;
  passport_number?: string;
  passport_expiry_date?: string;
  passport_issue_date?: string;
}

export interface MissingPersonData {
  // Reporter Information
  reporter_name?: string;
  reporter_national_id?: string;
  reporter_address?: string;
  reporter_phone?: string;
  reporter_secondary_phone?: string;
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_relationship?: string;
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Missing Person Information
  age?: string;
  distinctive_mark?: string;
  missing_person_phone?: string;

  // Disappearance Details
  area_of_disappearance?: string;
  last_sighting?: string;
  clothes_description?: string;
  disappearance_date?: string;
  disappearance_time?: string;
  was_accompanied?: string;

  // Additional Information
  medical_history?: string;
  friends?: string;
  previous_incidents?: string;
}

export interface ChildData {
  // Basic fields
  full_name?: string;
  name?: string;
  nickname?: string;
  dob?: string;
  date_of_birth?: string;
  gender?: string;
  national_id?: string;
  address?: string;
  age?: string;

  // Physical description - FIELD MAPPING NOTES:
  // =========================================
  // Frontend form → Backend database mappings:
  // - physical_description → distinctive_mark
  // - last_seen_clothes → clothes_description
  // - last_seen_location → area_of_disappearance
  // - last_seen_time → disappearance_date + disappearance_time
  physical_description?: string;
  distinctive_mark?: string;
  last_clothes?: string;
  clothes_description?: string;
  area_of_disappearance?: string;
  last_seen_time?: string;
  disappearance_date?: string;
  disappearance_time?: string;
  last_sighting?: string;

  // Guardian/Reporter information - FIELD MAPPING NOTES:
  // =================================================
  // Frontend form → Backend database mappings:
  // - guardian_name → reporter_name
  // - guardian_phone → reporter_phone
  // - guardian_id → reporter_national_id
  // - relationship → reporter_relationship
  guardian_name?: string;
  guardian_phone?: string;
  guardian_id?: string;
  relationship?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_national_id?: string;
  reporter_relationship?: string;
  reporter_address?: string;
  reporter_occupation?: string;
  reporter_education?: string;
  reporter_secondary_phone?: string;

  // Medical information - FIELD MAPPING NOTES:
  // =======================================
  // Frontend form → Backend database mappings:
  // - medical_condition → medical_history
  medical_condition?: string;
  medical_history?: string;
  treating_physician?: string;
  physician_phone?: string;

  // Missing person details
  missing_person_phone?: string;
  missing_person_occupation?: string;
  missing_person_education?: string;

  // Police report information
  absence_report_number?: string;
  absence_report_date?: string;
  police_station?: string;
  security_directorate?: string;
  governorate?: string;

  // Additional details
  reason_for_location?: string;
  was_accompanied?: string;
  previous_disputes?: string;
  gone_missing_before?: string;
  first_friend?: string;
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;
  additional_notes?: string;
}

export interface DisabledData {
  disability_type?: string;
  disability_details?: string;
  medical_condition?: string;
  special_needs?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  caregiver_relationship?: string;

  // Medical and emergency fields
  treating_physician?: string;
  physician_phone?: string;

  // Friend information
  first_friend?: string;
  second_friend?: string;
  first_friend_phone?: string;
  second_friend_phone?: string;

  // Additional fields
  gone_missing_before?: string;
}

export interface PersonalInfoData {
  mothers_name?: string;
  marital_status?: string;
  educational_qualification?: string;
  issuing_authority?: string;
  issue_date?: string;
}

export type UserData = BaseUserData &
  Partial<CriminalRecordData> &
  Partial<VehicleData> &
  Partial<TravelData> &
  Partial<MissingPersonData> &
  Partial<ChildData> &
  Partial<DisabledData> &
  Partial<PersonalInfoData>;

// API response types
export interface RecognitionResult {
  recognized: boolean;
  username?: string;
  user_id?: string;
  message?: string;
  status?: string;
  confidence?: number;
}

export interface VerificationResult {
  user?: MaleUser | FemaleUser | ChildUser | DisabledUser;
  message?: string;
  status?: string;
}

export interface RegistrationResult {
  status: string;
  message: string;
  user_id?: string;
  face_id?: string;
  operation_type?: string;
  user?: {
    id: string;
    face_id: string;
    name: string;
    full_name?: string;
    employee_id?: string;
    department?: string;
    role?: string;
    image_path: string;
    created_at: string;
    updated_at?: string;
    form_type?: string;
    [key: string]: unknown;
  };
  face_analysis?: {
    pose?: {
      yaw?: number;
      pitch?: number;
      roll?: number;
    };
    alignment_quality?: number;
    pose_recommendation?: string;
    [key: string]: unknown;
  };
  form_data?: Record<string, string | number | boolean | undefined>;
  multi_angle_trained?: boolean;
  image_info?: {
    filename?: string;
    size_bytes?: number;
    backup_paths?: {
      primary?: string;
      backup?: string;
      data_backup?: string;
    };
    face_encoding_updated?: boolean;
    multi_angle_encoding_updated?: boolean;
  };
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserListResponse {
  users: Array<MaleUser | FemaleUser | ChildUser | DisabledUser>;
  total?: number;
}

export interface UserResponse {
  user: MaleUser | FemaleUser | ChildUser | DisabledUser;
  success: boolean;
}

export interface CountResponse {
  count: number;
  category_counts?: Record<string, number>;
}

// Define TelecomCompany type (imported from elsewhere)
export type TelecomCompany = string;
