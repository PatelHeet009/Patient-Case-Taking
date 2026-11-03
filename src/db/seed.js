import bcrypt from 'bcryptjs';
import { db, initSchema } from './connection.js';

// Demo data — mirrors the original frontend-only INITIAL_USERS / INITIAL_PATIENTS /
// INITIAL_CASES from src/data/initialData.ts, so the seeded backend produces the
// exact same demo experience the frontend previously simulated with localStorage.

const DEMO_USERS = [
  {
    id: 'usr-1',
    username: 'doctor',
    password: 'doctor123',
    name: 'Dr. Sunita Rao, MD',
    email: 'doctor@hospital.org',
    role: 'doctor',
    department: 'General Medicine',
  },
  {
    id: 'usr-2',
    username: 'staff',
    password: 'staff123',
    name: 'Priya Nair',
    email: 'staff@hospital.org',
    role: 'staff',
    department: 'Outpatient Reception & Triage',
  },
  {
    id: 'usr-3',
    username: 'admin',
    password: 'admin123',
    name: 'Anil Kumar',
    email: 'admin@hospital.org',
    role: 'administrator',
    department: 'Hospital Administration',
  },
];

const DEMO_PATIENTS = [
  {
    id: 'pt-001',
    patient_code: 'PT-2026-001',
    name: 'Ramesh Patel',
    age: 48,
    gender: 'Male',
    phone: '+91 98251 44321',
    address: '42 Sardar Patel Nagar, Navrangpura, Ahmedabad, Gujarat',
    emergency_contact: 'Kavita Patel (Spouse) - +91 98251 44322',
    blood_group: 'B+',
    created_at: '2026-09-08T09:30:00Z',
    updated_at: '2026-09-10T11:15:00Z',
  },
  {
    id: 'pt-002',
    patient_code: 'PT-2026-002',
    name: 'Sunita Devi Sharma',
    age: 34,
    gender: 'Female',
    phone: '+91 94140 88219',
    address: '15 Nehru Enclave, Malviya Nagar, Jaipur, Rajasthan',
    emergency_contact: 'Rajesh Sharma (Brother) - +91 94140 88220',
    blood_group: 'O+',
    created_at: '2026-09-09T14:10:00Z',
    updated_at: '2026-09-11T16:00:00Z',
  },
  {
    id: 'pt-003',
    patient_code: 'PT-2026-003',
    name: 'Mohammad Farooq Imran',
    age: 62,
    gender: 'Male',
    phone: '+91 98480 33190',
    address: '8-3-228 Banjara Hills Road No. 3, Hyderabad, Telangana',
    emergency_contact: 'Ayesha Imran (Daughter) - +91 98480 33192',
    blood_group: 'A+',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-10T10:00:00Z',
  },
  {
    id: 'pt-004',
    patient_code: 'PT-2026-004',
    name: 'Ananya Iyer',
    age: 26,
    gender: 'Female',
    phone: '+91 98840 77123',
    address: '24 Besant Avenue, Adyar, Chennai, Tamil Nadu',
    emergency_contact: 'V. Iyer (Father) - +91 98840 77124',
    blood_group: 'AB+',
    created_at: '2026-09-11T08:45:00Z',
    updated_at: '2026-09-11T08:45:00Z',
  },
  {
    id: 'pt-005',
    patient_code: 'PT-2026-005',
    name: 'Vikramjit Singh',
    age: 53,
    gender: 'Male',
    phone: '+91 98150 66543',
    address: '112 Model Town, Jalandhar, Punjab',
    emergency_contact: 'Harpreet Kaur (Spouse) - +91 98150 66544',
    blood_group: 'O-',
    created_at: '2026-09-11T15:20:00Z',
    updated_at: '2026-09-11T15:20:00Z',
  },
];

const DEMO_CASES = [
  {
    id: 'case-101',
    patient_id: 'pt-001',
    chief_complaint: 'Severe throbbing headache in left temporal region with episodic nausea for 3 days.',
    present_illness:
      'Patient reports intermittent throbbing headaches exacerbated by bright light and loud noise. Mild relief after resting in a dark room. No history of aura, vomiting, or visual disturbances.',
    past_history: 'History of episodic tension headaches since 2022. No history of hypertension, seizures, or trauma.',
    allergies: 'No known drug allergies (NKDA). Mild dust allergy.',
    medications: 'Occasional Paracetamol 500mg SOS.',
    vitals: {
      blood_pressure: '128/82 mmHg',
      pulse_rate: '74 bpm',
      temperature: '98.4 °F',
      spo2: '99%',
      respiratory_rate: '16 /min',
      weight: '72 kg',
    },
    examination_notes:
      'Patient alert, oriented to time, place, and person. Pupils equal and reactive to light. No neck stiffness or meningeal signs. Cranial nerves grossly intact.',
    additional_notes:
      'Provisional Diagnosis: Migraine without aura. Advised hydrated rest, avoid trigger foods (aged cheese/caffeine), maintain headache diary. Follow-up in 7 days.',
    recorded_by_name: 'Dr. Sunita Rao, MD',
    recorded_by_role: 'doctor',
    created_at: '2026-09-08T10:15:00Z',
    updated_at: '2026-09-08T10:15:00Z',
  },
  {
    id: 'case-102',
    patient_id: 'pt-001',
    chief_complaint: 'Follow-up consultation for left-sided temporal headache. Significant relief reported.',
    present_illness:
      'Headache intensity reduced from 8/10 to 2/10 following prescribed lifestyle interventions and prophylactic therapy. No nausea or photophobia currently present.',
    past_history: 'Migraine without aura diagnosed on 08-Sep-2026.',
    allergies: 'NKDA',
    medications: 'Naproxen 250mg SOS (taken twice this week).',
    vitals: {
      blood_pressure: '120/80 mmHg',
      pulse_rate: '72 bpm',
      temperature: '98.2 °F',
      spo2: '99%',
      respiratory_rate: '15 /min',
      weight: '71.8 kg',
    },
    examination_notes:
      'Neurological examination completely normal. Temporal arteries non-tender and non-pulsatile. Normal fundoscopy.',
    additional_notes: 'Patient doing well. Advised to continue sleep hygiene and stay hydrated. Return if headache recurrence occurs.',
    recorded_by_name: 'Dr. Sunita Rao, MD',
    recorded_by_role: 'doctor',
    created_at: '2026-09-10T11:15:00Z',
    updated_at: '2026-09-10T11:15:00Z',
  },
  {
    id: 'case-103',
    patient_id: 'pt-002',
    chief_complaint: 'Productive cough, mild throat soreness, and low-grade evening fever for 4 days.',
    present_illness:
      'Onset 4 days ago after exposure to cold rains. Whitish-yellow sputum, mild post-nasal drip. No shortness of breath, chest pain, or hemoptysis.',
    past_history: 'Allergic rhinitis in winter seasons. No history of asthma or tuberculosis.',
    allergies: 'Sulfa drugs (causes cutaneous rash).',
    medications: 'None currently.',
    vitals: {
      blood_pressure: '116/76 mmHg',
      pulse_rate: '82 bpm',
      temperature: '99.8 °F',
      spo2: '98%',
      respiratory_rate: '18 /min',
      weight: '58 kg',
    },
    examination_notes:
      'Pharyngeal erythema noted. Tonsils not enlarged. Chest auscultation reveals bilateral clear breath sounds without wheezes or crackles. No cervical lymphadenopathy.',
    additional_notes:
      'Provisional Diagnosis: Acute upper respiratory tract infection (viral tracheobronchitis). Prescribed steam inhalation, warm saline gargles, supportive antipyretic. Review in 5 days if fever persists.',
    recorded_by_name: 'Dr. Sunita Rao, MD',
    recorded_by_role: 'doctor',
    created_at: '2026-09-09T14:40:00Z',
    updated_at: '2026-09-09T14:40:00Z',
  },
  {
    id: 'case-104',
    patient_id: 'pt-003',
    chief_complaint: 'Bilateral knee joint pain on walking and climbing stairs for past 6 months.',
    present_illness:
      'Progressive bilateral knee stiffness, worse in early mornings for ~15 minutes and after prolonged walking. Occasional crepitus. No warmth, redness, or systemic symptoms.',
    past_history: 'Type 2 Diabetes Mellitus x 8 years (controlled). Hypertension x 5 years.',
    allergies: 'No known drug allergies.',
    medications: 'Metformin 500mg BD, Telmisartan 40mg OD.',
    vitals: {
      blood_pressure: '136/84 mmHg',
      pulse_rate: '78 bpm',
      temperature: '98.4 °F',
      spo2: '97%',
      respiratory_rate: '16 /min',
      weight: '84 kg',
    },
    examination_notes:
      'Bilateral knee crepitus palpable on active flexion/extension. Medial joint line tenderness present bilaterally. No significant joint effusion. Range of motion: 0-115 degrees.',
    additional_notes:
      'Provisional Diagnosis: Primary Osteoarthritis of knees (Grade II). Advised quadriceps strengthening exercises, weight reduction, hot fomentation, avoid squatting. Prescribed Glucosamine supplement and topical analgesics.',
    recorded_by_name: 'Dr. Sunita Rao, MD',
    recorded_by_role: 'doctor',
    created_at: '2026-09-10T10:45:00Z',
    updated_at: '2026-09-10T10:45:00Z',
  },
];

export function seed({ wipe = false } = {}) {
  initSchema();

  if (wipe) {
    db.exec('DELETE FROM cases; DELETE FROM patients; DELETE FROM users;');
  }

  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, name, email, password_hash, role, department, created_at, updated_at)
      VALUES (@id, @username, @name, @email, @password_hash, @role, @department, @created_at, @updated_at)
    `);
    const now = new Date().toISOString();
    const tx = db.transaction((users) => {
      for (const u of users) {
        insertUser.run({
          id: u.id,
          username: u.username,
          name: u.name,
          email: u.email,
          password_hash: bcrypt.hashSync(u.password, 10),
          role: u.role,
          department: u.department ?? null,
          created_at: now,
          updated_at: now,
        });
      }
    });
    tx(DEMO_USERS);
    console.log(`Seeded ${DEMO_USERS.length} demo users.`);
  }

  const patientCount = db.prepare('SELECT COUNT(*) AS c FROM patients').get().c;
  if (patientCount === 0) {
    const insertPatient = db.prepare(`
      INSERT INTO patients (id, patient_code, name, age, gender, phone, address, emergency_contact, emergency_contact_phone, blood_group, created_by, created_at, updated_at)
      VALUES (@id, @patient_code, @name, @age, @gender, @phone, @address, @emergency_contact, @emergency_contact_phone, @blood_group, @created_by, @created_at, @updated_at)
    `);
    const tx = db.transaction((patients) => {
      for (const p of patients) {
        insertPatient.run({
          id: p.id,
          patient_code: p.patient_code,
          name: p.name,
          age: p.age,
          gender: p.gender,
          phone: p.phone,
          address: p.address,
          emergency_contact: p.emergency_contact,
          emergency_contact_phone: p.emergency_contact_phone ?? null,
          blood_group: p.blood_group ?? null,
          created_by: 'usr-1',
          created_at: p.created_at,
          updated_at: p.updated_at,
        });
      }
    });
    tx(DEMO_PATIENTS);
    console.log(`Seeded ${DEMO_PATIENTS.length} demo patients.`);
  }

  const caseCount = db.prepare('SELECT COUNT(*) AS c FROM cases').get().c;
  if (caseCount === 0) {
    const insertCase = db.prepare(`
      INSERT INTO cases (id, patient_id, chief_complaint, present_illness, past_history, allergies, medications, examination_notes, vitals_json, additional_notes, recorded_by_id, recorded_by_name, recorded_by_role, created_at, updated_at)
      VALUES (@id, @patient_id, @chief_complaint, @present_illness, @past_history, @allergies, @medications, @examination_notes, @vitals_json, @additional_notes, @recorded_by_id, @recorded_by_name, @recorded_by_role, @created_at, @updated_at)
    `);
    const tx = db.transaction((cases) => {
      for (const c of cases) {
        insertCase.run({
          id: c.id,
          patient_id: c.patient_id,
          chief_complaint: c.chief_complaint,
          present_illness: c.present_illness ?? null,
          past_history: c.past_history ?? null,
          allergies: c.allergies ?? null,
          medications: c.medications ?? null,
          examination_notes: c.examination_notes ?? null,
          vitals_json: c.vitals ? JSON.stringify(c.vitals) : null,
          additional_notes: c.additional_notes ?? null,
          recorded_by_id: 'usr-1',
          recorded_by_name: c.recorded_by_name,
          recorded_by_role: c.recorded_by_role,
          created_at: c.created_at,
          updated_at: c.updated_at,
        });
      }
    });
    tx(DEMO_CASES);
    console.log(`Seeded ${DEMO_CASES.length} demo cases.`);
  }
}

// Allow running directly: `npm run seed`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed({ wipe: process.argv.includes('--wipe') });
  console.log('Seeding complete.');
  process.exit(0);
}
