import { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  HeartPulse,
  Calendar,
  FilePlus2,
  Clock,
  ChevronRight,
  Edit2,
  Activity,
  AlertTriangle,
  FileText,
  Printer,
} from 'lucide-react';
import { Patient, CaseRecord } from '../../../types';

interface PatientDetailsProps {
  patient: Patient;
  cases: CaseRecord[];
  onBack: () => void;
  onEditPatient: (patient: Patient) => void;
  onNewCase: (patient: Patient) => void;
  onViewCaseHistory: (patient: Patient) => void;
}

export default function PatientDetails({
  patient,
  cases,
  onBack,
  onEditPatient,
  onNewCase,
  onViewCaseHistory,
}: PatientDetailsProps) {
  const patientCases = cases
    .filter((c) => c.patient_id === patient.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const latestCase = patientCases[0] || null;
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<CaseRecord | null>(latestCase);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Directory</span>
        </button>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            id="details-edit-patient-btn"
            onClick={() => onEditPatient(patient)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Information</span>
          </button>

          <button
            id="details-new-case-btn"
            onClick={() => onNewCase(patient)}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs transition"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Record New Case</span>
          </button>
        </div>
      </div>

      {/* Patient Demographic Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xl text-blue-700 flex-shrink-0">
              {patient.name[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  {patient.patient_code}
                </span>
                {patient.blood_group && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    Blood: {patient.blood_group}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>
                  <strong>Age:</strong> {patient.age} years
                </span>
                <span>•</span>
                <span>
                  <strong>Gender:</strong> {patient.gender}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{patient.phone}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[11px] font-semibold text-slate-500 block">Emergency Contact (ICE)</span>
              <span className="font-semibold text-slate-800">{patient.emergency_contact}</span>
            </div>
          </div>
        </div>

        {/* Address & Meta */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start space-x-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Residential Address:</span>
              <p className="text-slate-600 mt-0.5">{patient.address}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-slate-600 sm:justify-end">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Registration Date:</span>
              <p className="text-slate-600 mt-0.5">
                {new Date(patient.created_at).toLocaleDateString()} (
                {patientCases.length} total clinical encounters)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Clinical Case History ({patientCases.length})
            </h2>
          </div>

          {patientCases.length > 0 && (
            <button
              onClick={() => onViewCaseHistory(patient)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View Full Chronological Timeline →
            </button>
          )}
        </div>

        {patientCases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No clinical cases recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Use the 7-section digital case-taking workflow to document symptoms, examination vitals, and
              treatment.
            </p>
            <button
              onClick={() => onNewCase(patient)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Start First Case-Taking</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left list of cases */}
            <div className="lg:col-span-1 space-y-2">
              {patientCases.map((c, index) => {
                const isSelected = selectedCaseDetail?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseDetail(c)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">
                        Encounter #{patientCases.length - index}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2 font-medium">
                      {c.chief_complaint}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                      <span>{c.recorded_by_name}</span>
                      {c.vitals?.blood_pressure && (
                        <span className="font-mono text-slate-600">BP: {c.vitals.blood_pressure}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Case Full 7-Section Clinical Details */}
            <div className="lg:col-span-2">
              {selectedCaseDetail ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                          Clinical Encounter Details
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(selectedCaseDetail.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Recorded by: <strong>{selectedCaseDetail.recorded_by_name}</strong> (
                        {selectedCaseDetail.recorded_by_role})
                      </p>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs"
                      title="Print Clinical Case Sheet"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>

                  <div className="p-6 space-y-5 text-sm">
                    {/* Section 1: Chief Complaint */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        1. Chief Complaint
                      </span>
                      <p className="text-slate-900 font-semibold bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {selectedCaseDetail.chief_complaint}
                      </p>
                    </div>

                    {/* Section 2: Present Illness */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        2. History of Present Illness (HPI)
                      </span>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-xs">
                        {selectedCaseDetail.present_illness || 'None recorded'}
                      </p>
                    </div>

                    {/* Section 3 & 4: Past History & Allergies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          3. Past Medical History
                        </span>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 min-h-[4rem]">
                          {selectedCaseDetail.past_history || 'Nil'}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          4. Allergies
                        </span>
                        <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 min-h-[4rem]">
                          {selectedCaseDetail.allergies || 'No known drug allergies'}
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Medications */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        5. Current Medications
                      </span>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 font-mono">
                        {selectedCaseDetail.medications || 'None'}
                      </div>
                    </div>

                    {/* Section 6: Examination & Vitals */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        6. Examination Notes &amp; Vitals
                      </span>

                      {/* Vitals mini tags */}
                      {selectedCaseDetail.vitals && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {selectedCaseDetail.vitals.blood_pressure && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">BP</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.blood_pressure}
                              </span>
                            </div>
                          )}
                          {selectedCaseDetail.vitals.pulse_rate && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">Pulse</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.pulse_rate}
                              </span>
                            </div>
                          )}
                          {selectedCaseDetail.vitals.temperature && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">Temp</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.temperature}
                              </span>
                            </div>
                          )}
                          {selectedCaseDetail.vitals.spo2 && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">SpO2</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.spo2}
                              </span>
                            </div>
                          )}
                          {selectedCaseDetail.vitals.respiratory_rate && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">Resp Rate</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.respiratory_rate}
                              </span>
                            </div>
                          )}
                          {selectedCaseDetail.vitals.weight && (
                            <div className="bg-blue-50/80 border border-blue-200 p-2 rounded-md">
                              <span className="text-[10px] text-blue-700 block font-semibold">Weight</span>
                              <span className="font-mono font-bold text-slate-800">
                                {selectedCaseDetail.vitals.weight}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
                        {selectedCaseDetail.examination_notes || 'No notes entered.'}
                      </div>
                    </div>

                    {/* Section 7: Additional Notes */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        7. Additional Notes, Diagnosis &amp; Advice
                      </span>
                      <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                        {selectedCaseDetail.additional_notes || 'Follow-up as advised.'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Select an encounter from the left to view clinical details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
