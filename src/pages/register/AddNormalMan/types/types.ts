import type { TelecomCompany } from '../../../../config/types';

export interface FormData {
  // Common fields for all forms
  name: string;
  nickname: string;
  dob: string;
  national_id: string;
  address: string;
  phone_number: string;
  job: string;
  phone_company: TelecomCompany;
  second_phone_number?: string;
  category: string;
  form_type: string;

  // Criminal record
  has_criminal_record: boolean;
  case_details: string;
  police_station: string;
  case_number: string;
  judgment: string;
  accusation: string;

  // Vehicle info
  has_motorcycle: boolean;
  has_vehicle: boolean;
  license_plate: string;
  vehicle_model: string;
  vehicle_color: string;
  chassis_number: string;
  vehicle_number: string;
  license_expiration: string;
  manufacture_year: string;

  // Travel info
  travel_date: string;
  travel_destination: string;
  arrival_airport: string;
  arrival_date: string;
  flight_number: string;
  return_date: string;

  // Image handling
  image: File | null;
  useCamera: boolean;
  // Vehicle info object for nested data
  vehicle_info?: Record<string, string>;
}

export const initialFormData: FormData = {
  name: '',
  nickname: '',
  dob: '',
  national_id: '',
  address: '',
  phone_number: '',
  job: '',
  phone_company: '',
  second_phone_number: '',
  category: 'male',
  form_type: 'adult',
  has_criminal_record: false,
  case_details: '',
  police_station: '',
  case_number: '',
  judgment: '',
  accusation: '',
  has_motorcycle: false,
  has_vehicle: false,
  license_plate: '',
  vehicle_model: '',
  vehicle_color: '',
  chassis_number: '',
  vehicle_number: '',
  license_expiration: '',
  manufacture_year: '',
  travel_date: '',
  travel_destination: '',
  arrival_airport: '',
  arrival_date: '',
  flight_number: '',
  return_date: '',
  image: null,
  useCamera: false,
};
