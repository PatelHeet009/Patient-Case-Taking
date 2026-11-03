import { Patient, CaseRecord, User } from '../types';

/* =========================================================
   DEMO USERS
========================================================= */

export const INITIAL_USERS: User[] = [
  {
    id: 'user-doctor',
    name: 'Dr. Sunita Rao, MD',
    username: 'doctor',
    email: 'doctor@hospital.org',
    role: 'doctor',
    department: 'General Medicine',
    password: 'doctor123',
  },
  {
    id: 'user-staff',
    name: 'Priya Nair',
    username: 'staff',
    email: 'staff@hospital.org',
    role: 'staff',
    department: 'Nursing',
    password: 'staff123',
  },
  {
    id: 'user-admin',
    name: 'Anil Kumar',
    username: 'admin',
    email: 'admin@hospital.org',
    role: 'administrator',
    department: 'Administration',
    password: 'admin123',
  },
];


/* =========================================================
   INITIAL PATIENTS
========================================================= */

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-001',
    patient_code: 'PT-2026-001',
    name: 'Ramesh Patel',
    age: 48,
    gender: 'Male',
    phone: '+91 98251 44321',
    address:
      '42 Sardar Patel Nagar, Navrangpura, Ahmedabad, Gujarat',
    emergency_contact:
      'Kavita Patel (Spouse) - +91 98251 44322',
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
    address:
      '15 Nehru Enclave, Malviya Nagar, Jaipur, Rajasthan',
    emergency_contact:
      'Rajesh Sharma (Brother) - +91 94140 88220',
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
    address:
      '8-3-228 Banjara Hills Road No. 3, Hyderabad, Telangana',
    emergency_contact:
      'Ayesha Imran (Daughter) - +91 98480 33192',
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
    address:
      '24 Besant Avenue, Adyar, Chennai, Tamil Nadu',
    emergency_contact:
      'V. Iyer (Father) - +91 98840 77124',
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
    emergency_contact:
      'Harpreet Kaur (Spouse) - +91 98150 66544',
    blood_group: 'O-',
    created_at: '2026-09-11T15:20:00Z',
    updated_at: '2026-09-11T15:20:00Z',
  },
];


/* =========================================================
   INITIAL CASES
========================================================= */

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'case-101',
    patient_id: 'pt-001',

    chief_complaint:
      'Severe throbbing headache in left temporal region with episodic nausea for 3 days.',

    present_illness:
      'Patient reports intermittent throbbing headaches exacerbated by bright light and loud noise. Mild relief after resting in a dark room. No history of aura, vomiting, or visual disturbances.',

    past_history:
      'History of episodic tension headaches since 2022. No history of hypertension, seizures, or trauma.',

    allergies:
      'No known drug allergies (NKDA). Mild dust allergy.',

    medications:
      'Occasional Paracetamol 500mg SOS.',

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

    chief_complaint:
      'Follow-up consultation for left-sided temporal headache. Significant relief reported.',

    present_illness:
      'Headache intensity reduced from 8/10 to 2/10 following prescribed lifestyle interventions and prophylactic therapy. No nausea or photophobia currently present.',

    past_history:
      'Migraine without aura diagnosed on 08-Sep-2026.',

    allergies: 'NKDA',

    medications:
      'Naproxen 250mg SOS (taken twice this week).',

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

    additional_notes:
      'Patient doing well. Advised to continue sleep hygiene and stay hydrated. Return if headache recurrence occurs.',

    recorded_by_name: 'Dr. Sunita Rao, MD',
    recorded_by_role: 'doctor',

    created_at: '2026-09-10T11:15:00Z',
    updated_at: '2026-09-10T11:15:00Z',
  },

  {
    id: 'case-103',
    patient_id: 'pt-002',

    chief_complaint:
      'Productive cough, mild throat soreness, and low-grade evening fever for 4 days.',

    present_illness:
      'Onset 4 days ago after exposure to cold rains. Whitish-yellow sputum, mild post-nasal drip. No shortness of breath, chest pain, or hemoptysis.',

    past_history:
      'Allergic rhinitis in winter seasons. No history of asthma or tuberculosis.',

    allergies:
      'Sulfa drugs (causes cutaneous rash).',

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

    chief_complaint:
      'Bilateral knee joint pain on walking and climbing stairs for past 6 months.',

    present_illness:
      'Progressive bilateral knee stiffness, worse in early mornings for ~15 minutes and after prolonged walking. Occasional crepitus. No warmth, redness, or systemic symptoms.',

    past_history:
      'Type 2 Diabetes Mellitus x 8 years (controlled). Hypertension x 5 years.',

    allergies:
      'No known drug allergies.',

    medications:
      'Metformin 500mg BD, Telmisartan 40mg OD.',

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


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  PATIENTS: 'sih_patient_case_patients_v1',
  CASES: 'sih_patient_case_cases_v1',
  USER: 'sih_patient_case_active_user_v1',
  ALL_USERS: 'sih_patient_case_all_users_v1',
};


/* =========================================================
   ACTIVE USER STORAGE
========================================================= */

export const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);

    if (data) {
      return JSON.parse(data) as User;
    }
  } catch (e) {
    console.error('Failed to parse stored user:', e);
  }

  return null;
};


export const saveStoredUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Failed to save stored user:', e);
  }
};


/* =========================================================
   USER STORAGE
========================================================= */

export const saveStoredUsers = (users: User[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ALL_USERS,
      JSON.stringify(users)
    );
  } catch (e) {
    console.error('Failed to save users to storage:', e);
  }
};


export const getStoredUsers = (): User[] => {
  try {
    const data = localStorage.getItem(
      STORAGE_KEYS.ALL_USERS
    );

    if (data) {
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed) && parsed.length > 0) {
        /*
         * Keep demo accounts synchronized with INITIAL_USERS.
         * This fixes old passwords stored in localStorage.
         */
        const updatedUsers: User[] = parsed.map(
          (storedUser: User) => {
            const demoUser = INITIAL_USERS.find(
              (demo) =>
                demo.username.toLowerCase() ===
                storedUser.username.toLowerCase()
            );

            if (demoUser) {
              return {
                ...storedUser,
                id: demoUser.id,
                name: demoUser.name,
                username: demoUser.username,
                email: demoUser.email,
                role: demoUser.role,
                department: demoUser.department,
                password: demoUser.password,
              };
            }

            return storedUser;
          }
        );

        /*
         * Add any missing demo accounts.
         */
        for (const demoUser of INITIAL_USERS) {
          const exists = updatedUsers.some(
            (user) =>
              user.username.toLowerCase() ===
              demoUser.username.toLowerCase()
          );

          if (!exists) {
            updatedUsers.push(demoUser);
          }
        }

        saveStoredUsers(updatedUsers);

        return updatedUsers;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored users:', e);
  }

  saveStoredUsers(INITIAL_USERS);

  return INITIAL_USERS;
};


/* =========================================================
   LOGIN / AUTHENTICATION
========================================================= */

export const authenticateUser = (
  usernameOrEmail: string,
  passwordAttempt: string
): {
  success: boolean;
  user?: User;
  error?: string;
} => {
  const users = getStoredUsers();

  const enteredUsername = usernameOrEmail
    .trim()
    .toLowerCase();

  const enteredPassword = passwordAttempt;

  if (!enteredUsername) {
    return {
      success: false,
      error: 'Please enter your username or email.',
    };
  }

  if (!enteredPassword) {
    return {
      success: false,
      error: 'Please enter your password.',
    };
  }

  const foundUser = users.find(
    (user) =>
      user.username.toLowerCase() === enteredUsername ||
      user.email.toLowerCase() === enteredUsername
  );

  if (!foundUser) {
    return {
      success: false,
      error:
        'User not found. Please check your username or email.',
    };
  }

  if (foundUser.password !== enteredPassword) {
    return {
      success: false,
      error:
        'Invalid password. Please check your credentials.',
    };
  }

  /*
   * Login successful
   */
  saveStoredUser(foundUser);

  return {
    success: true,
    user: foundUser,
  };
};


/* =========================================================
   REGISTER NEW USER
========================================================= */

export const registerNewUser = (
  userData: Omit<User, 'id'>
): {
  success: boolean;
  user?: User;
  error?: string;
} => {
  const users = getStoredUsers();

  const trimmedUsername =
    userData.username.trim().toLowerCase();

  const trimmedEmail =
    userData.email.trim().toLowerCase();

  if (!trimmedUsername) {
    return {
      success: false,
      error: 'Username is required.',
    };
  }

  if (!trimmedEmail) {
    return {
      success: false,
      error: 'Email address is required.',
    };
  }

  if (users.some(
    (u) =>
      u.username.toLowerCase() === trimmedUsername
  )) {
    return {
      success: false,
      error:
        `Username "${userData.username}" is already taken. Please choose another.`,
    };
  }

  if (users.some(
    (u) =>
      u.email.toLowerCase() === trimmedEmail
  )) {
    return {
      success: false,
      error:
        `Email address "${userData.email}" is already registered.`,
    };
  }

  const newUser: User = {
    ...userData,
    username: userData.username.trim(),
    email: userData.email.trim(),
    id: `usr-${Date.now().toString().slice(-6)}`,
  };

  const updatedUsers = [
    ...users,
    newUser,
  ];

  saveStoredUsers(updatedUsers);

  /*
   * Automatically log in newly registered user.
   */
  saveStoredUser(newUser);

  return {
    success: true,
    user: newUser,
  };
};


/* =========================================================
   PATIENT STORAGE
========================================================= */

export const getStoredPatients = (): Patient[] => {
  try {
    const data = localStorage.getItem(
      STORAGE_KEYS.PATIENTS
    );

    if (data) {
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        return parsed as Patient[];
      }
    }
  } catch (e) {
    console.error(
      'Failed to parse stored patients:',
      e
    );
  }

  saveStoredPatients(INITIAL_PATIENTS);

  return INITIAL_PATIENTS;
};


export const saveStoredPatients = (
  patients: Patient[]
): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PATIENTS,
      JSON.stringify(patients)
    );
  } catch (e) {
    console.error(
      'Failed to save patients to storage:',
      e
    );
  }
};


/* =========================================================
   CASE STORAGE
========================================================= */

export const getStoredCases = (): CaseRecord[] => {
  try {
    const data = localStorage.getItem(
      STORAGE_KEYS.CASES
    );

    if (data) {
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        return parsed as CaseRecord[];
      }
    }
  } catch (e) {
    console.error(
      'Failed to parse stored cases:',
      e
    );
  }

  saveStoredCases(INITIAL_CASES);

  return INITIAL_CASES;
};


export const saveStoredCases = (
  cases: CaseRecord[]
): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CASES,
      JSON.stringify(cases)
    );
  } catch (e) {
    console.error(
      'Failed to save cases to storage:',
      e
    );
  }
};


/* =========================================================
   RESET APPLICATION DATA
========================================================= */

export const resetToDemoData = (): void => {
  saveStoredPatients(INITIAL_PATIENTS);

  saveStoredCases(INITIAL_CASES);

  saveStoredUsers(INITIAL_USERS);

  /*
   * Set doctor as the default demo session.
   */
  saveStoredUser(INITIAL_USERS[0]);
};