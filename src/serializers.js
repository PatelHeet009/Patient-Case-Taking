// Converts raw SQLite rows into the exact JSON shapes the frontend's
// src/types.ts already expects, so no frontend type changes are needed.

export function serializeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department ?? undefined,
    // password is intentionally never sent back to the client
  };
}

export function serializePatient(row) {
  if (!row) return null;
  return {
    id: row.id,
    patient_code: row.patient_code,
    name: row.name,
    age: row.age,
    gender: row.gender,
    phone: row.phone,
    address: row.address,
    emergency_contact: row.emergency_contact,
    emergency_contact_phone: row.emergency_contact_phone ?? undefined,
    blood_group: row.blood_group ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function serializeCase(row) {
  if (!row) return null;
  return {
    id: row.id,
    patient_id: row.patient_id,
    chief_complaint: row.chief_complaint,
    present_illness: row.present_illness ?? '',
    past_history: row.past_history ?? '',
    allergies: row.allergies ?? '',
    medications: row.medications ?? '',
    examination_notes: row.examination_notes ?? '',
    vitals: row.vitals_json ? JSON.parse(row.vitals_json) : undefined,
    additional_notes: row.additional_notes ?? '',
    recorded_by_name: row.recorded_by_name,
    recorded_by_role: row.recorded_by_role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
