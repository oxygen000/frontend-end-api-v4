// Define the telecom company options
export type TelecomCompany =
  | 'vodafone'
  | 'etisalat'
  | 'orange'
  | 'we'
  | 'other';
export type Gender = 'male' | 'female';

export interface FormData {
  accommodation_phone: string;
  accommodation_address: string;
  emergency_contact_phone: string;
  destination: string;
  has_motorcycle: boolean;
  security_directorate: string;
  // Basic user information
  form_type: string;
  name: string;
  full_name?: string;
  nickname?: string;
  dob: string;
  mothers_name?: string;
  marital_status?: string;
  educational_qualification?: string;
  occupation?: string;
  address?: string;
  issuing_authority?: string;
  issue_date?: string;
  national_id: string;
  gender?: Gender;
  category?: string;
  additional_notes?: string;
  image?: File;
  useCamera?: boolean;

  // Contact information
  phone_number: string;
  phone_company: string;
  service_provider?: string;
  second_phone_number?: string;
  landline_number?: string;
  registration_date?: string;
  last_number?: string;
  governorate?: string;

  // Criminal record information
  has_criminal_record: boolean;
  record_number?: string;
  case_details?: string;
  police_station?: string;
  case_number?: string;
  dossier_number?: string;
  judgment?: string;
  charge?: string;
  sentence?: string;
  accusation?: string;
  court_governorate?: string;

  // Vehicle information
  has_vehicle: boolean;
  vehicle_number?: string;
  license_plate?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  brand?: string;
  chassis_number?: string;
  license_governorate?: string;
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
  return_flight_number?: string;
  return_airport?: string;

  travel_purpose?: string;
  travel_duration?: string;

  // Travel (UI only)
  has_travel: boolean;
  travel_date?: string;
  travel_destination?: string;
  arrival_airport?: string;
  flight_number?: string;
  return_date?: string;
}

export const initialFormData: FormData = {
  // Basic user information
  form_type: 'woman',
  name: '',
  full_name: '',
  nickname: '',
  dob: '',
  mothers_name: '',
  marital_status: '',
  educational_qualification: '',
  occupation: '',
  address: '',
  issuing_authority: '',
  issue_date: '',
  national_id: '',
  gender: 'female',
  category: 'female',
  additional_notes: '',
  image: undefined,
  useCamera: true,

  // Contact information
  phone_number: '',
  phone_company: 'other',
  service_provider: '',
  second_phone_number: '',
  landline_number: '',
  registration_date: '',
  last_number: '',
  governorate: '',

  // Criminal record information
  has_criminal_record: false,
  record_number: '',
  case_details: '',
  police_station: '',
  case_number: '',
  dossier_number: '',
  judgment: '',
  charge: '',
  sentence: '',
  accusation: '',
  court_governorate: '',

  // Vehicle information
  has_vehicle: false,
  has_motorcycle: false,

  vehicle_number: '',
  license_plate: '',
  vehicle_model: '',
  vehicle_color: '',
  brand: '',
  chassis_number: '',
  license_type: '',
  traffic_unit: '',
  license_expiration: '',
  license_governorate: '',
  manufacture_year: '',
  expiration_year: '',
  traffic_department: '',
  engine_number: '',
  vehicle_type: '',
  fuel_type: '',
  registration_number: '',
  insurance_company: '',
  insurance_policy_number: '',
  insurance_expiry_date: '',
  owner_name: '',

  // Travel information
  passport_number: '',
  passport_issue_date: '',
  passport_expiry_date: '',
  passport_issuing_country: '',
  visa_number: '',
  visa_type: '',
  visa_issue_date: '',
  visa_expiry_date: '',
  departure_country: '',
  departure_destination: '',
  departure_date: '',
  departure_time: '',
  departure_airline: '',
  departure_flight_number: '',
  departure_airport: '',
  arrival_origin: '',
  arrival_destination: '',
  arrival_airline: '',
  arrival_flight_number: '',
  arrival_date: '',
  arrival_time: '',
  travel_purpose: '',
  travel_duration: '',
  return_flight_number: '',
  return_airport: '',

  // Travel (UI only)
  has_travel: false,
  travel_date: '',
  travel_destination: '',
  arrival_airport: '',
  flight_number: '',
  return_date: '',
  security_directorate: '',
  destination: '',
  accommodation_phone: '',
  accommodation_address: '',
  emergency_contact_phone: '',
};
