import type { TelecomCompany } from '../../../../config/types';

// Add interface with face_id property to fix TypeScript errors
export interface UserWithFaceId {
  id: string;
  name: string;
  face_id?: string;
  image_path?: string;
  [key: string]: unknown;
}

// Update the FormData interface to include the image property
export interface FormData {
  // Basic information
  name: string;
  dob: string;
  gender: string;
  national_id: string;
  address: string;

  // Guardian information
  guardian_name: string;
  guardian_phone: string;
  relationship: string;
  phone_company: TelecomCompany;

  // Disappearance details
  last_seen_time: string;
  last_seen_location: string;
  last_seen_clothes: string;
  physical_description: string;
  additional_data: string;
  medical_condition: string;

  // Additional information
  additional_notes: string;
  form_type: string;
  image: File | null;
  useCamera: boolean;
}

export const initialFormData: FormData = {
  name: '',
  dob: '',
  gender: '',
  national_id: '',
  phone_company: '',
  address: '',
  guardian_name: '',
  guardian_phone: '',
  medical_condition: '',
  relationship: '',
  last_seen_time: '',
  last_seen_location: '',
  last_seen_clothes: '',
  physical_description: '',
  additional_data: '',
  additional_notes: '',
  form_type: 'child',
  image: null,
  useCamera: false,
};
