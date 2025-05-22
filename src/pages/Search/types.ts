export interface User {
  id: string;
  full_name: string;
  name:string;
  nickname: string;
  employee_id?: string;
  department?: string;
  role?: string;
  image_path?: string;
  image_url?: string;
  created_at?: string;
  form_type?: string;
  category?: string;
  phone_number?: string;
  national_id?: string;
  address?: string;
  dob?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  full_name?: string;
  nickname?: string;
  employee_id?: string;
  department?: string;
  role?: string;
  image_path?: string;
  image_url?: string;
  created_at?: string;
  form_type?: string;
  category?: string;
  phone_number?: string;
  national_id?: string;
  address?: string;
  dob?: string;
  // Add specific optional fields that might be in the API response
  occupation?: string;
  has_criminal_record?: boolean | string;
  guardian_name?: string;
  disability_type?: string;
  
  // Vehicle-related fields (legacy format)
  vehicle_model?: string;
  color?: string;
  license_plate?: string;
  license_expiration_date?: string;
  manufacture_year?: string;
  chassis_number?: string;
  vehicle_number?: string;
  traffic_department?: string;
  
  // Structured vehicle information (new format)
  vehicle_info?: {
    vehicle_model?: string;
    vehicle_color?: string;
    license_plate?: string;
    license_expiration?: string;
    manufacture_year?: string;
    chassis_number?: string;
    vehicle_number?: string;
    traffic_department?: string;
  };
  
  // Use unknown instead of any for safety
  [key: string]: unknown;
}

export type SortField = 'name' | 'created_at' | 'none';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  hasPhone: boolean;
  hasNationalId: boolean;
  category: string;
  formType: string;
} 