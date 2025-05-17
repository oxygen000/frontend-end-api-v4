// Types for user data
export interface BaseUser {
  id?: string;
  name: string;
  nickname?: string;
  dob?: string;
  national_id?: string;
  address?: string;
  additional_notes?: string;
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
}

// Use MaleUser directly for female users since they share the same properties
export type FemaleUser = MaleUser;

export interface ChildUser extends BaseUser {
  gender?: string;
  age?: number;
  school?: string;
  grade?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_id: string;
  relationship: string;
  guardian_address?: string;
  guardian_job?: string;
  physical_description?: string;
  last_clothes?: string;
  area_of_disappearance?: string;
  last_known_location?: string;
  last_seen_time?: string;
  additional_data?: string;
  medical_condition?: string;
  unique_id?: string;
  request_id?: string;
}

export interface DisabledUser extends BaseUser {
  gender?: string;
  job?: string;
  document_number?: string;
  phone_number?: string;
  secondary_phone?: string;
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
}

// Define types for user data for registration
export interface BaseUserData {
  name: string;
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
  };
}

export interface TravelData {
  travel_date?: string;
  travel_destination?: string;
  arrival_airport?: string;
  arrival_date?: string;
  flight_number?: string;
  return_date?: string;
}

export interface ChildData {
  date_of_birth?: string;
  physical_description?: string;
  last_clothes?: string;
  area_of_disappearance?: string;
  last_seen_time?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_id?: string;
  relationship?: string;
  additional_data?: string;
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
}

export type UserData = BaseUserData &
  Partial<CriminalRecordData> &
  Partial<VehicleData> &
  Partial<TravelData> &
  Partial<ChildData> &
  Partial<DisabledData>;

// API response types
export interface RecognitionResult {
  recognized: boolean;
  username?: string;
  user_id?: string;
  message?: string;
  status?: string;
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
  user?: {
    id: string;
    face_id: string;
    name: string;
    employee_id?: string;
    department?: string;
    role?: string;
    image_path: string;
    created_at: string;
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
