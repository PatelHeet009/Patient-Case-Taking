import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Calendar,
  User,
  ArrowRight,
  FilePlus2,
  ChevronDown,
  ChevronUp,
  Activity,
  Printer,
  Clock,
} from 'lucide-react';
import { Patient, CaseRecord } from '../../../types';

interface CaseHistoryViewProps {
  patients: Patient[];
  cases: CaseRecord[];
  onSelectPatient: (patient: Patient) => void;
  onNewCaseForPatient: (patient: Patient) => void;
  initialSelectedPatientId?: string;
}

export default function CaseHistoryView({
  patients,
  cases,
  onSelectPatient,
  onNewCaseForPatient,
  initialSelectedPatientId,
}: CaseHistoryViewProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialSelectedPatientId || 'ALL',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(cases[0]?.id || null);

  // Filter cases
  const filteredCases = cases
    .filter((c) => {
      const matchesPatient =
        selectedPatientId === 'ALL' || c.patient_id === selectedPatientId;

      const patient = patients.find((p) => p.id === c.patient_id);
      const patientName = patient?.name.toLowerCase() || '';
      const patientCode = patient?.patient_code.toLowerCase() || '';

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        c.chief_complaint.toLowerCase().includes(query) ||
        c.present_illness.toLowerCase().includes(query) ||
        c.additional_notes.toLowerCase().includes(query) ||
        patientName.includes(query) ||
        patientCode.includes(query);

      return matchesPatient && matchesSearch;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const toggleExpand = (caseId: string) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Case History &amp; Clinical Archive
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Chronological audit log of clinical encounters, chief complaints, and vitals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Case Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Patient select dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter by Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="ALL">All Patients ({cases.length} Total Cases)</option>
            {patients.map((p) => {
              const count = cases.filter((c) => c.patient_id === p.id).length;
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patient_code}) — {count} case(s)
                </option>
              );
            })}
          </select>
        </div>

        {/* Search query input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Search Complaints, Diagnosis, Symptoms:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Headache, Cough, Diabetes, Hypertension..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Chronological Case Timeline */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching case records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your search query or select another patient from the filter above.
            </p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const patient = patients.find((p) => p.id === c.patient_id);
            const isExpanded = expandedCaseId === c.id;

            return (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Header Summary */}
                <div
                  onClick={() => toggleExpand(c.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {patient ? patient.name : 'Unknown Patient'}
                        </span>
                        {patient && (
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {patient.patient_code}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(c.created_at).toLocaleString()}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-semibold mt-1">
                        <span className="text-slate-400 font-normal">Complaint: </span>
                        {c.chief_complaint}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    {c.vitals?.blood_pressure && (
                      <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700">
                        BP: {c.vitals.blood_pressure}
                      </span>
                    )}

                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed 7 Clinical Sections */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-6 space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="text-xs text-slate-600">
                        Recorded by: <strong>{c.recorded_by_name}</strong> (
                        <span className="capitalize">{c.recorded_by_role}</span>)
                      </div>

                      {patient && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onSelectPatient(patient)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <span>Open Patient Profile</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Section 1 & 2 */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-500 uppercase tracking-wide">
                          1. Chief Complaint &amp; 2. Present Illness
                        </span>
                        <p className="font-bold text-slate-900">{c.chief_complaint}</p>
                        <p className="text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                          {c.present_illness || 'No additional illness history recorded.'}
                        </p>
                      </div>

                      {/* Section 3 & 4 */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div>
                          <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">
                            3. Past Medical History
                          </span>
                          <p className="text-slate-700">{c.past_history || 'Nil'}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">
                            4. Known Allergies
                          </span>
                          <p className="text-amber-800 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200">
                            {c.allergies || 'No known allergies.'}
                          </p>
                        </div>
                      </div>

                      {/* Section 5 & 6 */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div>
                          <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">
                            5. Medications
                          </span>
                          <p className="font-mono text-slate-800">{c.medications || 'None'}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">
                            6. Vitals &amp; Examination Notes
                          </span>
                          {c.vitals && (
                            <div className="grid grid-cols-3 gap-1.5 mb-2 font-mono text-[11px]">
                              {c.vitals.blood_pressure && (
                                <div className="bg-slate-50 p-1 rounded border text-center">
                                  BP: {c.vitals.blood_pressure}
                                </div>
                              )}
                              {c.vitals.pulse_rate && (
                                <div className="bg-slate-50 p-1 rounded border text-center">
                                  HR: {c.vitals.pulse_rate}
                                </div>
                              )}
                              {c.vitals.spo2 && (
                                <div className="bg-slate-50 p-1 rounded border text-center">
                                  SpO2: {c.vitals.spo2}
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-slate-700">{c.examination_notes}</p>
                        </div>
                      </div>

                      {/* Section 7 */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-500 uppercase tracking-wide">
                          7. Additional Notes, Diagnosis &amp; Advice
                        </span>
                        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950 font-medium leading-relaxed">
                          {c.additional_notes || 'Follow-up as advised.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
