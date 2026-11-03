export interface SIHDoc {
  id: string;
  title: string;
  filename: string;
  purpose: string;
  summary: string;
  sections: { heading: string; points: string[] }[];
}

export const SIH_DOCUMENTS: SIHDoc[] = [
  {
    id: 'prd',
    title: 'Product Requirements Document (PRD)',
    filename: 'PRD.md',
    purpose: 'Requirements and scope for hackathon MVP',
    summary:
      'Defines the problem statement SIH26047, target users (Doctor, Medical Staff, Admin), core in-scope and out-of-scope features, and the success criteria for digital case-taking.',
    sections: [
      {
        heading: '1. Project Overview & SIH Problem Statement',
        points: [
          'SIH Problem Statement: SIH26047 — Patient Case-Taking Software.',
          'Project Type: Web-based Patient Case-Taking Software for SIH Hackathon.',
          'Goal: Simple, usable digital workflow for recording, storing, searching, and viewing patient case records.',
        ],
      },
      {
        heading: '2. Target Users & Roles',
        points: [
          'Doctor: View patients, create and update case records, review case history.',
          'Medical Staff: Register patients, view directory, update demographic info, assist triage.',
          'Administrator: Manage application access, system oversight, and data governance.',
        ],
      },
      {
        heading: '3. In-Scope MVP Features',
        points: [
          'Authentication & Role-Based Access (Doctor, Staff, Admin)',
          'Patient Registration: Patient ID, Full Name, Age, Gender, Contact, Address, Emergency Contact',
          'Patient Directory & Search: Quick search by name, ID, or contact number',
          '7-Section Case Taking: Chief Complaint, Present Illness, Past History, Allergies, Medications, Examination & Vitals, Additional Notes',
          'Case History: Chronological case list per patient with timestamp and author',
          'Clean responsive healthcare UI with input validation and feedback messages',
        ],
      },
      {
        heading: '4. Explicitly Out of Scope for Hackathon MVP',
        points: [
          'AI diagnosis / automated disease prediction (strictly forbidden to prevent safety risks and hallucinated prescriptions)',
          'Payment gateway, pharmacy inventory, and lab hardware integrations',
          'Full hospital enterprise billing',
        ],
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture Specification',
    filename: 'Architecture.md',
    purpose: 'Full-stack architecture and file structure',
    summary:
      'Explains high-level data flows, REST API endpoints, relational database structure (users, patients, cases), and component hierarchy.',
    sections: [
      {
        heading: '1. High-Level Flow',
        points: [
          'Browser / React UI → HTTP Request / State Action → Validation → Structured Storage → Feedback Response → View Update.',
          'Separation of concerns: UI components remain modular; storage queries are isolated.',
        ],
      },
      {
        heading: '2. Database Schema Direction',
        points: [
          'users: id, name, email/username, password_hash, role (doctor | staff | administrator)',
          'patients: id, patient_code, name, age, gender, phone, address, emergency_contact, created_at, updated_at',
          'cases: id, patient_id (foreign key to patients), chief_complaint, present_illness, past_history, allergies, medications, examination_notes, additional_notes, created_at, updated_at',
        ],
      },
      {
        heading: '3. REST API Endpoint Direction',
        points: [
          'POST /api/auth/login — User authentication & role dispatch',
          'POST /api/patients — Register a new patient',
          'GET /api/patients — Retrieve patient directory with search query support',
          'GET /api/patients/:id — Retrieve detailed patient profile',
          'PUT /api/patients/:id — Update demographic or contact details',
          'POST /api/patients/:id/cases — Create a comprehensive case record',
          'GET /api/patients/:id/cases — Retrieve full clinical history for a patient',
        ],
      },
    ],
  },
  {
    id: 'rules',
    title: 'AI Development Rules',
    filename: 'Rules.md',
    purpose: 'AI-assisted development rules and constraints',
    summary:
      'Governs development behavior: prioritize working software, simplicity, demonstrability, maintainability, and avoid unrequested external frameworks.',
    sections: [
      {
        heading: '1. Core Directives',
        points: [
          'Optimize for: Working software, team understanding, simplicity, demonstrability, maintainability.',
          'Do not optimize for maximum feature count or bloated abstractions.',
          'Keep code explainable to hackathon judges.',
        ],
      },
      {
        heading: '2. Clinical & Frontend Rules',
        points: [
          'Never expose sensitive database credentials in client code.',
          'Keep clinical forms divided into readable, non-intimidating sections.',
          'Show clear loading states and user-friendly success/error banners.',
          'Provide sensible medical defaults and structured vitals inputs.',
        ],
      },
    ],
  },
  {
    id: 'phases',
    title: 'Development Roadmap & Phases',
    filename: 'Phases.md',
    purpose: 'Step-by-step development plan (Phases 0 - 10)',
    summary:
      'Step-by-step delivery plan from initial setup to presentation preparation and the 10-point judge demo sequence.',
    sections: [
      {
        heading: 'Phase 0-3: Foundation & Registration Slice',
        points: [
          'Phase 0: Environment setup, dependencies & schema understanding.',
          'Phase 1: Clickable UI prototypes (Login, Dashboard, Registration, List, Details, Case Taking, History).',
          'Phase 2: Database schema modeling (users, patients, cases).',
          'Phase 3: First complete vertical slice: Patient Form → Storage → Confirmation.',
        ],
      },
      {
        heading: 'Phase 4-7: CRUD, Clinical Cases & Validation',
        points: [
          'Phase 4: Full Patient CRUD (Add, List, Search, View, Update).',
          'Phase 5: Case Taking (New case with 7 sections, Save, View, History linked to Patient ID).',
          'Phase 6: Role-based navigation and protected routes (Doctor vs Staff vs Admin).',
          'Phase 7: Comprehensive validation and error prevention.',
        ],
      },
      {
        heading: 'Phase 8-10: Polish, Testing & Judge Presentation',
        points: [
          'Phase 8: UI polish (medical theme, contrast, clear cards, typography).',
          'Phase 9: 10-point end-to-end verification checklist.',
          'Phase 10: Live judging demonstration with rapid 1-click test workflow.',
        ],
      },
    ],
  },
  {
    id: 'design',
    title: 'UI/UX Design System',
    filename: 'Design.md',
    purpose: 'Clean healthcare UI/UX design specifications',
    summary:
      'Establishes the visual identity: healthcare-inspired light theme, white/light slate background, blue primary color, dark readable text, clear typography, and feedback patterns.',
    sections: [
      {
        heading: '1. Visual Theme',
        points: [
          'Healthcare-inspired clean light theme: Slate-50 background, white container surfaces.',
          'Primary action: Medical blue (Blue-600) with subtle slate borders (Slate-200).',
          'Feedback colors: Emerald-600 for success, Rose-600 for alerts/errors, Amber-500 for warnings.',
          'Strict prohibition of dark clichés, glowing neon borders, or low-contrast text.',
        ],
      },
      {
        heading: '2. Typography & Layout',
        points: [
          'Clean sans-serif with high contrast and readable line heights (1.5 - 1.7).',
          'Strong and clear page titles, medium section headers, compact labels above inputs.',
          'Desktop: Collapsible sidebar navigation with spacious main workspace.',
          'Mobile: Responsive single-column flow with large touch targets (min 44px).',
        ],
      },
      {
        heading: '3. Form & Table Ergonomics',
        points: [
          'Avoid monolithic intimidating forms: break case taking into 7 clear medical sections.',
          'Required indicators, inline validation messages, visible save/back buttons.',
          'Spacious data tables with instant search, gender tags, and clear action links.',
        ],
      },
    ],
  },
  {
    id: 'memory',
    title: 'Project Memory & Checklist',
    filename: 'Memory.md',
    purpose: 'Project status tracking and decision memory',
    summary:
      'Maintains project status, completed milestones, architectural decisions, and notes for evaluation.',
    sections: [
      {
        heading: '1. Completed Milestones',
        points: [
          '✓ PRD & Requirements verified against SIH26047 problem statement.',
          '✓ Structured Patient database with demographic and emergency fields.',
          '✓ 7-section clinical case-taking workflow implemented.',
          '✓ Role-based access simulation (Doctor, Staff, Administrator).',
          '✓ Instant search, filtering, and case history timeline.',
          '✓ Hackathon Judge Demonstration walkthrough integrated.',
        ],
      },
      {
        heading: '2. Key Design Decisions',
        points: [
          'Single reliable full-stack web architecture with instant data responsiveness.',
          'Zero medical hallucination: No unvalidated AI diagnostics as per PRD Section 11.',
          'Durable client-side persistence + quick demo reset ensures zero data loss during judging.',
        ],
      },
    ],
  },
];
