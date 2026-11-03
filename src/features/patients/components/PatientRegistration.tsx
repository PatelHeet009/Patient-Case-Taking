import { useState, useEffect, type FormEvent } from 'react';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Phone,
  User,
  HeartPulse,
} from 'lucide-react';
import { Patient } from '../../../types';

interface PatientRegistrationProps {
  onSavePatient: (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => Patient;
  onCancel: () => void;
  onSuccessNavigateToCase: (patient: Patient) => void;
  existingPatientToEdit?: Patient | null;
  onUpdatePatient?: (updated: Patient) => void;
}

export default function PatientRegistration({
  onSavePatient,
  onCancel,
  onSuccessNavigateToCase,
  existingPatientToEdit,
  onUpdatePatient,
}: PatientRegistrationProps) {
  // Generate a sequential default ID if creating new
  const defaultCode = existingPatientToEdit?.patient_code || `PT-2026-00${Math.floor(Math.random() * 900) + 100}`;

  const [patientCode, setPatientCode] = useState(defaultCode);
  const [name, setName] = useState(existingPatientToEdit?.name || '');
  const [age, setAge] = useState(existingPatientToEdit ? String(existingPatientToEdit.age) : '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(existingPatientToEdit?.gender || 'Male');
  const [phone, setPhone] = useState(existingPatientToEdit?.phone || '');
  const [address, setAddress] = useState(existingPatientToEdit?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(existingPatientToEdit?.emergency_contact || '');
  const [bloodGroup, setBloodGroup] = useState(existingPatientToEdit?.blood_group || 'B+');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (existingPatientToEdit) {
      setPatientCode(existingPatientToEdit.patient_code);
      setName(existingPatientToEdit.name);
      setAge(String(existingPatientToEdit.age));
      setGender(existingPatientToEdit.gender);
      setPhone(existingPatientToEdit.phone);
      setAddress(existingPatientToEdit.address);
      setEmergencyContact(existingPatientToEdit.emergency_contact);
      setBloodGroup(existingPatientToEdit.blood_group || 'B+');
    }
  }, [existingPatientToEdit]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!age.trim()) {
      errs.age = 'Age is required';
    } else {
      const num = Number(age);
      if (isNaN(num) || num < 0 || num > 125) {
        errs.age = 'Please enter a valid age between 0 and 125';
      }
    }
    if (!phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number (at least 8 digits)';
    }
    if (!address.trim()) errs.address = 'Residential address is required';
    if (!emergencyContact.trim()) errs.emergencyContact = 'Emergency contact details are required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable saving to storage as required by Architecture.md
    setTimeout(() => {
      if (existingPatientToEdit && onUpdatePatient) {
        const updated: Patient = {
          ...existingPatientToEdit,
          patient_code: patientCode,
          name: name.trim(),
          age: parseInt(age, 10),
          gender,
          phone: phone.trim(),
          address: address.trim(),
          emergency_contact: emergencyContact.trim(),
          blood_group: bloodGroup,
          updated_at: new Date().toISOString(),
        };
        onUpdatePatient(updated);
        setIsSubmitting(false);
        setRegisteredPatient(updated);
      } else {
        const newPatient = onSavePatient({
          patient_code: patientCode,
          name: name.trim(),
          age: parseInt(age, 10),
          gender,
          phone: phone.trim(),
          address: address.trim(),
          emergency_contact: emergencyContact.trim(),
          blood_group: bloodGroup,
        });
        setIsSubmitting(false);
        setRegisteredPatient(newPatient);
      }
    }, 350);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients</span>
        </button>

        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Module: Patient Registration (FR-02)
        </div>
      </div>

      {/* Success banner if just registered */}
      {registeredPatient && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs animate-fadeIn">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-bold text-emerald-900">
                Patient registered successfully!
              </h2>
              <p className="text-xs text-emerald-700 mt-1">
                Record stored in database with Patient ID{' '}
                <span className="font-mono font-bold">{registeredPatient.patient_code}</span> for{' '}
                <span className="font-bold">{registeredPatient.name}</span>.
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  id="proceed-to-case-btn"
                  onClick={() => onSuccessNavigateToCase(registeredPatient)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Proceed to Clinical Case-Taking →
                </button>
                <button
                  onClick={onCancel}
                  className="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition"
                >
                  View in Patient Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {existingPatientToEdit ? 'Edit Patient Information' : 'Patient Registration'}
              </h1>
              <p className="text-xs text-slate-500">
                Enter demographic and emergency contact details for hospital intake.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                1. Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient ID / Code <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 font-mono text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="e.g. PT-2026-006"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Unique institutional medical record identifier
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Ramesh Patel"
                />
                {errors.name && (
                  <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.age ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="e.g. 45"
                />
                {errors.age && (
                  <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.age}</span>
                  </span>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender <span className="text-rose-600">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact / Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="e.g. +91 98251 44321"
                />
                {errors.phone && (
                  <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </span>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group (Optional)
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.address ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="Street address, locality, city, state, pin code"
                />
                {errors.address && (
                  <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.address}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Emergency Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                2. Emergency Information
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact (Name, Relation &amp; Phone){' '}
                <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => {
                  setEmergencyContact(e.target.value);
                  if (errors.emergencyContact) setErrors((prev) => ({ ...prev, emergencyContact: '' }));
                }}
                className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                  errors.emergencyContact ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
                placeholder="e.g. Kavita Patel (Spouse) - +91 98251 44322"
              />
              {errors.emergencyContact && (
                <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.emergencyContact}</span>
                </span>
              )}
              <span className="text-[11px] text-slate-400 mt-1 block">
                Crucial for in-case-of-emergency clinical communication.
              </span>
            </div>
          </div>

          {/* Notice from PRD */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-800">
            <span className="font-semibold">PRD Note:</span> Detailed medical history and chief complaints
            are recorded in the dedicated <strong>Case-Taking flow</strong> to prevent overwhelming the
            initial registration desk.
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              id="save-patient-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold shadow-xs transition"
            >
              {isSubmitting ? (
                <span>Saving patient...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {existingPatientToEdit ? 'Update Patient Record' : 'Save & Register Patient'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
