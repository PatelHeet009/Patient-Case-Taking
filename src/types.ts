export type UserRole = 'doctor' | 'staff' | 'administrator';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  password?: string;
}

export interface Patient {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  created_at: string;
  updated_at: string;
}

export interface Vitals {
  blood_pressure?: string; // e.g. 120/80 mmHg
  pulse_rate?: string; // e.g. 76 bpm
  temperature?: string; // e.g. 98.6 °F
  respiratory_rate?: string; // e.g. 16 /min
  spo2?: string; // e.g. 98%
  weight?: string; // e.g. 68 kg
}

export interface CaseRecord {
  id: string;
  patient_id: string;
  chief_complaint: string;
  present_illness: string;
  past_history: string;
  allergies: string;
  medications: string;
  examination_notes: string;
  vitals?: Vitals;
  additional_notes: string;
  recorded_by_name: string;
  recorded_by_role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ActivePage =
  | 'dashboard'
  | 'patients'
  | 'register-patient'
  | 'patient-details'
  | 'new-case'
  | 'case-history'
  | 'sih-docs'
  | 'admin-users';
