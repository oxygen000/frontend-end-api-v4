import type { TelecomCompany } from '../../../../services/api/types';

export interface DisabledFormData {
  // Basic information
  name: string;
  dob: string;
  gender: string;
  national_id: string;
  address: string;

  // Contact information
  phone_number: string;
  phone_company: TelecomCompany;
  second_phone_number: string;

  // Disability information
  disability_type: string;
  disability_description: string;
  medical_condition: string;
  special_needs: string;
  emergency_contact: string;
  emergency_phone: string;

  // Additional information
  additional_notes: string;
  guardian_name: string;
  guardian_phone: string;
  relationship: string;
  form_type: string;
  image: File | null;
  useCamera: boolean;
}

export const initialFormData: DisabledFormData = {
  name: '',
  dob: '',
  gender: '',
  national_id: '',
  address: '',
  phone_number: '',
  phone_company: '',
  second_phone_number: '',
  disability_type: '',
  disability_description: '',
  medical_condition: '',
  special_needs: '',
  emergency_contact: '',
  emergency_phone: '',
  additional_notes: '',
  guardian_name: '',
  guardian_phone: '',
  relationship: '',
  form_type: 'disabled',
  image: null,
  useCamera: false,
};

export type DisabledFormSection = 1 | 2 | 3 | 4;
