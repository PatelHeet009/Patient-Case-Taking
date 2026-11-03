import { useState, type FormEvent } from 'react';
import {
  FileSpreadsheet,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Activity,
  Heart,
  Pill,
  ShieldAlert,
  Clock,
  User,
  Plus,
  FileCheck,
} from 'lucide-react';
import { Patient, CaseRecord, User as CurrentUserType, Vitals } from '../../../types';

interface CaseTakingFormProps {
  patient: Patient;
  currentUser: CurrentUserType;
  onSaveCase: (caseRecord: Omit<CaseRecord, 'id' | 'created_at' | 'updated_at'>) => CaseRecord;
  onCancel: () => void;
  onViewHistory: (patient: Patient) => void;
}

export default function CaseTakingForm({
  patient,
  currentUser,
  onSaveCase,
  onCancel,
  onViewHistory,
}: CaseTakingFormProps) {
  // 7 Sections state matching Page 19
  const [activeSection, setActiveSection] = useState<number>(1);

  // Section 1: Chief Complaint
  const [chiefComplaint, setChiefComplaint] = useState('');

  // Section 2: Present Illness
  const [presentIllness, setPresentIllness] = useState('');

  // Section 3: Past Medical History
  const [pastHistory, setPastHistory] = useState('');

  // Section 4: Allergies
  const [allergies, setAllergies] = useState('No known drug allergies (NKDA)');

  // Section 5: Medications
  const [medications, setMedications] = useState('None currently');

  // Section 6: Examination Notes & Vitals
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [spo2, setSpo2] = useState('99%');
  const [respRate, setRespRate] = useState('16 /min');
  const [weight, setWeight] = useState('');
  const [examinationNotes, setExaminationNotes] = useState('');

  // Section 7: Additional Notes & Advice
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedCase, setSavedCase] = useState<CaseRecord | null>(null);

  const sections = [
    { id: 1, title: 'Chief Complaint', desc: 'Primary symptoms and onset duration' },
    { id: 2, title: 'Present Illness', desc: 'Chronological illness progression (HPI)' },
    { id: 3, title: 'Past Medical History', desc: 'Prior conditions, surgeries, chronic illnesses' },
    { id: 4, title: 'Allergies', desc: 'Drug, food, or environmental hypersensitivity' },
    { id: 5, title: 'Medications', desc: 'Current active prescriptions and dosage' },
    { id: 6, title: 'Examination & Vitals', desc: 'Objective physical findings and vital parameters' },
    { id: 7, title: 'Additional Notes', desc: 'Provisional diagnosis and clinical advice' },
  ];

  // Quick preset chips for rapid entry during live demo
  const quickChiefComplaints = [
    'Persistent fever with chills for 3 days',
    'Severe bilateral throbbing headache',
    'Productive dry cough and sore throat',
    'Acute lower abdominal pain with nausea',
    'Generalized joint stiffness in mornings',
    'Routine executive medical consultation',
  ];

  const quickPastHistory = [
    'No previous chronic medical illness',
    'Type 2 Diabetes Mellitus (5 yrs)',
    'Essential Hypertension on medication',
    'Childhood Bronchial Asthma (quiescent)',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!chiefComplaint.trim()) {
      errs.chiefComplaint = 'Chief complaint is required (Section 1)';
    }
    if (!examinationNotes.trim() && !bp.trim()) {
      errs.examinationNotes = 'Please record clinical examination notes or vitals (Section 6)';
    }

    setErrors(errs);
    if (errs.chiefComplaint && activeSection !== 1) {
      setActiveSection(1);
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const vitalsData: Vitals = {
      blood_pressure: bp.trim() || undefined,
      pulse_rate: pulse.trim() || undefined,
      temperature: temp.trim() || undefined,
      spo2: spo2.trim() || undefined,
      respiratory_rate: respRate.trim() || undefined,
      weight: weight.trim() || undefined,
    };

    setTimeout(() => {
      const created = onSaveCase({
        patient_id: patient.id,
        chief_complaint: chiefComplaint.trim(),
        present_illness: presentIllness.trim() || 'No detailed HPI reported.',
        past_history: pastHistory.trim() || 'No significant past medical history.',
        allergies: allergies.trim() || 'No known allergies reported.',
        medications: medications.trim() || 'No current medications.',
        examination_notes: examinationNotes.trim() || 'Systemic examination within normal limits.',
        vitals: vitalsData,
        additional_notes: additionalNotes.trim() || 'Symptomatic supportive management advised.',
        recorded_by_name: currentUser.name,
        recorded_by_role: currentUser.role,
      });

      setIsSaving(false);
      setSavedCase(created);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Profile</span>
        </button>

        <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
          Module: Case-Taking Workflow (FR-05)
        </div>
      </div>

      {/* Patient Identification Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-sm text-blue-700">
            {patient.name[0]}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {patient.patient_code}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {patient.age} yrs • {patient.gender} • Contact: {patient.phone}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 pt-2 sm:pt-0">
          <div>
            <span className="block text-[11px] text-slate-400">Attending Clinician:</span>
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Success Notification after Save */}
      {savedCase && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs animate-fadeIn">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-emerald-900">
                Case record successfully created and persisted!
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                Linked to patient {patient.name} ({patient.patient_code}) with 7 structured clinical
                sections.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  id="view-saved-case-history-btn"
                  onClick={() => onViewHistory(patient)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  View Case History for {patient.name} →
                </button>
                <button
                  onClick={onCancel}
                  className="px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition"
                >
                  Return to Patient Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Section Step Navigation (Preventing monolithic giant forms as mandated by Design.md) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 mb-2 px-1">
          7 Clinical Case Sections (Click to navigate):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`p-2 rounded-lg text-left transition flex flex-col justify-between border ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    activeSection === sec.id ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  S{sec.id}
                </span>
                {sec.id === 1 && chiefComplaint && (
                  <CheckCircle2 className={`w-3 h-3 ${activeSection === sec.id ? 'text-white' : 'text-emerald-600'}`} />
                )}
              </div>
              <span className="text-xs font-bold truncate">{sec.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Section Content Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Section {activeSection} of 7
              </span>
              <span className="text-slate-300">•</span>
              <h3 className="text-base font-bold text-slate-900">
                {sections[activeSection - 1].title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {sections[activeSection - 1].desc}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {activeSection > 1 && (
              <button
                type="button"
                onClick={() => setActiveSection((prev) => prev - 1)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Previous
              </button>
            )}
            {activeSection < 7 && (
              <button
                type="button"
                onClick={() => setActiveSection((prev) => prev + 1)}
                className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Next Section →
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* SECTION 1: Chief Complaint */}
          {activeSection === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Primary Chief Complaint &amp; Duration <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="case-chief-complaint"
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => {
                    setChiefComplaint(e.target.value);
                    if (errors.chiefComplaint) setErrors((prev) => ({ ...prev, chiefComplaint: '' }));
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.chiefComplaint ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Throbbing headache on the right side with nausea for 3 days..."
                />
                {errors.chiefComplaint && (
                  <span className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.chiefComplaint}</span>
                  </span>
                )}
              </div>

              {/* Rapid preset chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  ⚡ Quick Sample Clinical Complaints (Click to insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickChiefComplaints.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChiefComplaint(item)}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition text-left"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Present Illness (HPI) */}
          {activeSection === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  History of Present Illness (HPI)
                </label>
                <textarea
                  id="case-present-illness"
                  rows={4}
                  value={presentIllness}
                  onChange={(e) => setPresentIllness(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Detail the chronological course, severity, aggravating and relieving factors, and associated symptoms..."
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: Onset 3 days ago following long drive; aggravated by sunlight; partially relieved by resting in dark room.
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Clinical Tip:</span> Structure HPI
                chronologically from first appearance of symptoms to present hospital arrival.
              </div>
            </div>
          )}

          {/* SECTION 3: Past Medical History */}
          {activeSection === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Past Medical &amp; Surgical History
                </label>
                <textarea
                  id="case-past-history"
                  rows={3}
                  value={pastHistory}
                  onChange={(e) => setPastHistory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Previous chronic conditions, hospitalizations, past surgeries, family medical history..."
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Common Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPastHistory.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPastHistory(item)}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Allergies */}
          {activeSection === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center space-x-2 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  High-priority safety area: Inquire specifically regarding penicillin, sulfa drugs, NSAIDs, and food allergens.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Known Drug &amp; Substance Allergies
                </label>
                <textarea
                  id="case-allergies"
                  rows={3}
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="e.g. No known drug allergies (NKDA) OR Sulfa drugs (rash), Penicillin (anaphylaxis)"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAllergies('No known drug allergies (NKDA)')}
                  className="text-xs px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                >
                  ✓ Set NKDA (No Known Allergies)
                </button>
                <button
                  type="button"
                  onClick={() => setAllergies('Penicillin allergy (causes urticaria)')}
                  className="text-xs px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                >
                  + Penicillin Allergy
                </button>
                <button
                  type="button"
                  onClick={() => setAllergies('Sulfa drugs allergy')}
                  className="text-xs px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                >
                  + Sulfa Allergy
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: Medications */}
          {activeSection === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Current Medications &amp; Dosages
                </label>
                <textarea
                  id="case-medications"
                  rows={3}
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="e.g. Metformin 500mg BD, Telmisartan 40mg OD, Paracetamol 650mg SOS"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Include active prescription drugs, over-the-counter supplements, or herbal remedies.
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMedications('None currently')}
                  className="text-xs px-3 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  None currently
                </button>
                <button
                  type="button"
                  onClick={() => setMedications('Paracetamol 500mg SOS for headache')}
                  className="text-xs px-3 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  + Paracetamol SOS
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: Examination Notes & Vitals */}
          {activeSection === 6 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Structured Vitals Sub-panel */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Clinical Vitals Measurement
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="120/80 mmHg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pulse Rate
                    </label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="72 bpm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Temperature
                    </label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="98.6 °F"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Oxygen Saturation (SpO2)
                    </label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="98%"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Respiratory Rate
                    </label>
                    <input
                      type="text"
                      value={respRate}
                      onChange={(e) => setRespRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="16 /min"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Body Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                      placeholder="e.g. 68 kg"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Examination Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Physical &amp; Systemic Examination Observations
                </label>
                <textarea
                  id="case-examination-notes"
                  rows={3}
                  value={examinationNotes}
                  onChange={(e) => {
                    setExaminationNotes(e.target.value);
                    if (errors.examinationNotes)
                      setErrors((prev) => ({ ...prev, examinationNotes: '' }));
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition ${
                    errors.examinationNotes ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                  placeholder="General appearance, cardiovascular, respiratory auscultation, abdominal palpation, local site findings..."
                />
              </div>
            </div>
          )}

          {/* SECTION 7: Additional Notes & Plan */}
          {activeSection === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Provisional Diagnosis, Advice &amp; Follow-up Plan
                </label>
                <textarea
                  id="case-additional-notes"
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Provisional impression, dietary/lifestyle counsel, prescribed interventions, follow-up date..."
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example: Advise hydrated rest, avoid triggers. Review in clinic after 5-7 days or earlier if distress occurs.
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                All 7 sections are populated and ready for database insertion. Click "Save Case Record" below.
              </div>
            </div>
          )}

          {/* Form Actions bar */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="save-case-record-btn"
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold shadow-xs transition"
              >
                {isSaving ? (
                  <span>Saving case...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Save Complete Case Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
