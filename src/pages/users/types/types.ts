export interface User {
  // Base table fields
  id: string;
  face_id: string;
  name: string;
  full_name: string;
  employee_id: string | null;
  department: string | null;
  image_path: string;
  created_at: string;
  updated_at: string | null;
  form_type: string;

  // Common fields for all forms
  nickname: string | null;
  dob: string | null;
  date_of_birth: string | null;
  national_id: string | null;
  address: string | null;
  phone_number: string | null;
  phone_company: string | null;
  service_provider: string | null;
  second_phone_number: string | null;
  category: string | null;

  // FIELD MAPPING NOTE: guardian_relationship doesn't exist in database schema
  // Use reporter_relationship instead which is the proper database field
  guardian_relationship: string | null;

  // Personal info fields from base.py
  mothers_name: string | null;
  marital_status: string | null;
  educational_qualification: string | null;
  occupation: string | null;
  issuing_authority: string | null;
  issue_date: string | null;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;

  // Vehicle fields
  has_vehicle: number | null;
  has_motorcycle: number | null;
  license_plate: string | null;
  vehicle_model: string | null;
  vehicle_color: string | null;
  color: string | null;
  chassis_number: string | null;
  vehicle_number: string | null;
  expiration_year: string | null;
  license_expiration: string | null;
  license_expiration_date: string | null;
  manufacture_year: string | null;
  traffic_department: string | null;
  brand: string | null;
  license_type: string | null;
  traffic_unit: string | null;
  // For nested vehicle data from API
  vehicle_info?: Record<string, string | null> | null;

  // Vehicle penalty fields
  vehicle_penalty: string | null;
  penalty_amount: string | null;
  penalty_date: string | null;
  penalty_location: string | null;
  // For nested penalty data from API
  penalty_info?: Record<string, string | null> | null;

  // Criminal record fields
  has_criminal_record: number;
  case_details: string | null;
  police_station: string | null;
  case_number: string | null;
  judgment: string | null;
  accusation: string | null;
  sentence: string | null;
  security_directorate: string | null;
  governorate: string | null;
  dossier_number: string | null;
  record_number: string | null;
  charge: string | null;

  // Travel fields
  travel_date: string | null;
  travel_destination: string | null;
  arrival_airport: string | null;
  arrival_date: string | null;
  flight_number: string | null;
  return_date: string | null;
  passport_number: string | null;
  departure_airport: string | null;
  departure_country: string | null;
  departure_destination: string | null;
  departure_date: string | null;
  departure_time: string | null;
  departure_airline: string | null;
  departure_flight_number: string | null;
  destination: string | null;
  departure_datetime: string | null;
  arrival_origin: string | null;
  arrival_destination: string | null;
  arrival_airline: string | null;
  arrival_flight_number: string | null;
  arrival_time: string | null;
  arrival_datetime: string | null;
  return_airport: string | null;
  return_flight_number: string | null;

  // Contact info fields
  landline_number: string | null;
  registration_date: string | null;
  last_number: string | null;

  // Child form fields - FIELD MAPPING NOTES:
  // Frontend form uses different field names than backend:
  // - physical_description → distinctive_mark
  // - last_clothes → clothes_description
  // - last_seen_location → area_of_disappearance
  // - last_seen_time → disappearance_date + disappearance_time
  physical_description: string | null;
  last_clothes: string | null;
  area_of_disappearance: string | null;
  last_seen_time: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_id: string | null;

  // Missing person fields
  reporter_name: string | null;
  reporter_national_id: string | null;
  reporter_address: string | null;
  reporter_phone: string | null;
  reporter_occupation: string | null;
  reporter_education: string | null;
  reporter_secondary_phone: string | null;
  reporter_relationship: string | null;
  absence_report_number: string | null;
  absence_report_date: string | null;
  age: string | null;
  distinctive_mark: string | null;
  missing_person_phone: string | null;
  missing_person_occupation: string | null;
  missing_person_education: string | null;
  last_sighting: string | null;
  vehicle_type: string | null;
  clothes_description: string | null;
  reason_for_location: string | null;
  disappearance_date: string | null;
  disappearance_time: string | null;
  was_accompanied: string | null;
  previous_disputes: string | null;
  medical_history: string | null;
  treating_physician: string | null;
  physician_phone: string | null;
  first_friend: string | null;
  second_friend: string | null;
  first_friend_phone: string | null;
  second_friend_phone: string | null;
  gone_missing_before: string | null;

  // Disabled person form fields
  disability_type: string | null;
  disability_description: string | null;
  medical_condition: string | null;
  special_needs: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;

  // Additional fields
  additional_notes: string | null;
  brand_affiliation: string | null;
  brand_products: string | null;
  brand_position: string | null;
  gender?: string | null;
  role?: string | null;

  // FIELD MAPPING NOTE: additional_data doesn't exist in database schema
  // Use additional_notes instead which is the proper database field
  additional_data: string | null;

  disabled_data?: string | null | Record<string, unknown>;
  user_data?: string | null | Record<string, unknown>;

  // Rewards and loyalty
  loyalty_points?: number | null;

  // Recognition status for registered disabled individuals
  is_recognized?: boolean;

  // These fields aren't in the database schema but may be used by the frontend:
  // - friends: This field doesn't exist; use first_friend and second_friend
  // - previous_incidents: This field doesn't exist; use previous_disputes
  // - school: This field doesn't exist in the database schema
  // - grade: This field doesn't exist in the database schema
  // - guardian_address: This field doesn't exist; use reporter_address
  // - guardian_job: This field doesn't exist; use reporter_occupation
  // - last_known_location: This field doesn't exist; use area_of_disappearance
}

/**
 * Interface for section color schemes
 */
export interface SectionColors {
  gradient: string; // Background gradient
  border: string; // Border color
  icon: string; // Icon color
  bg: string; // Background color
  text: string; // Text color
  hover: string; // Hover state color
  shadow: string; // Shadow color
}

/**
 * Color schemes for different user types
 * These colors are used consistently across all components
 */
export const SECTION_COLORS = {
  man: {
    gradient: 'from-blue-500/20 to-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    bg: 'bg-blue-600/30',
    text: 'text-blue-300',
    hover: 'hover:bg-blue-700/50',
    shadow: 'hover:shadow-blue-500/50',
  },
  woman: {
    gradient: 'from-pink-500/20 to-pink-500/10',
    border: 'border-pink-500/30',
    icon: 'text-pink-400',
    bg: 'bg-pink-600/30',
    text: 'text-pink-300',
    hover: 'hover:bg-pink-700/50',
    shadow: 'hover:shadow-pink-500/50',
  },
  child: {
    gradient: 'from-amber-500/20 to-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    bg: 'bg-amber-600/30',
    text: 'text-amber-300',
    hover: 'hover:bg-amber-700/50',
    shadow: 'hover:shadow-amber-500/50',
  },
  disabled: {
    gradient: 'from-purple-500/20 to-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    bg: 'bg-purple-600/30',
    text: 'text-purple-300',
    hover: 'hover:bg-purple-700/50',
    shadow: 'hover:shadow-purple-500/50',
  },
};
/**
 * Translation function type
 */
export type TranslationFunction = (key: string, fallback: string) => string;

/**
 * Props for the BaseUserLayout component
 */
export interface BaseUserLayoutProps {
  user: User; // User data
  isRTL: boolean; // Right-to-left text direction
  t: (key: string, defaultText?: string) => string; // Translation function
  navigate: (to: string | number) => void; // Navigation function
}

/**
 * Props for the ChildUserDisplay component
 */
export interface ChildUserDisplayProps {
  user: User; // User data
  isRTL: boolean; // Right-to-left text direction
  t: (key: string, defaultText?: string) => string; // Translation function
  navigate: (to: string | number) => void; // Navigation function
}

/**
 * Props for the DisabledUserDisplay component
 */
export interface DisabledUserDisplayProps {
  user: User; // User data
  isRTL: boolean; // Right-to-left text direction
  t: (key: string, defaultText?: string) => string; // Translation function
  navigate: (to: string | number) => void; // Navigation function
}

/**
 * Format date function type
 */
export interface FormatDateFunction {
  (date: string | null | undefined): string;
}

/**
 * Mask sensitive information function type
 */
export interface MaskSensitiveInfoFunction {
  (value: string | null | undefined): string;
}
