import { useState } from 'react';
import {
  Users,
  ClipboardList,
  UserPlus,
  FilePlus2,
  Search,
  ArrowRight,
  Clock,
  ShieldCheck,
  Calendar,
  Eye,
  Activity,
  Award,
} from 'lucide-react';
import { Patient, CaseRecord, User } from '../../../types';

interface DashboardProps {
  patients: Patient[];
  cases: CaseRecord[];
  currentUser: User;
  onNavigate: (page: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onNewCaseForPatient: (patient: Patient) => void;
  onStartJudgeTour: () => void;
}

export default function Dashboard({
  patients,
  cases,
  currentUser,
  onNavigate,
  onSelectPatient,
  onNewCaseForPatient,
  onStartJudgeTour,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered recent patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Recent cases
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Filter patients based on search
  const searchedPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patient_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery),
      )
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Hackathon Presentation Hero Banner (Mandate from Design.md Page 20) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
           
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Digital Patient Case-Taking and Case History Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Structured clinical workflow designed for rapid medical intake, chief complaint documentation,
              vitals capture, and chronological history retrieval across healthcare teams.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                id="hero-register-btn"
                onClick={() => onNavigate('register-patient')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register New Patient</span>
              </button>

              <button
                id="hero-new-case-btn"
                onClick={() => onNavigate('new-case')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                <FilePlus2 className="w-4 h-4 text-blue-600" />
                <span>Start Case-Taking</span>
              </button>

              <button
                id="hero-demo-tour-btn"
                onClick={onStartJudgeTour}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold transition-colors"
              >
                <span>One-Click Judge Demo</span>
              </button>
            </div>
          </div>

          {/* User Role Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:w-72 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Logged in as</div>
                <div className="text-sm font-bold text-slate-900">{currentUser.name}</div>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="font-semibold text-slate-900 capitalize">{currentUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span className="font-semibold text-slate-700">{currentUser.department || 'Clinical'}</span>
              </div>
              <div className="flex justify-between">
                <span>Permissions:</span>
                <span className="text-emerald-700 font-semibold">
                  {currentUser.role === 'doctor'
                    ? 'Full Clinical & Case Taking'
                    : currentUser.role === 'staff'
                    ? 'Registration & Triage'
                    : 'System Admin & Records'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards (Design.md Page 18: Total Patients, Total Cases, etc.) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{patients.length}</h2>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
              <span>Active in database</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinical Cases</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{cases.length}</h2>
            <p className="text-xs text-blue-600 font-medium mt-1 flex items-center">
              <span>7-section structured</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Frequency</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {(cases.length / Math.max(1, patients.length)).toFixed(1)}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Avg cases per patient</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System State</p>
            <h2 className="text-base font-bold text-slate-900 mt-1"> MVP Ready</h2>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Phase 1-10 Operational</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Search Patient Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="dashboard-patient-search"
              type="text"
              placeholder="Quick search by Patient ID, Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live Search Results if searching */}
        {searchQuery.trim() && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Found {searchedPatients.length} matching patient(s):
            </div>
            {searchedPatients.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No patient matching "{searchQuery}"</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchedPatients.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between transition cursor-pointer"
                    onClick={() => onSelectPatient(p)}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{p.name}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {p.patient_code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.age} yrs • {p.gender} • {p.phone}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNewCaseForPatient(p);
                      }}
                      className="px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 rounded"
                    >
                      + Case
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid: Recent Patients & Recent Case Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Patients</h3>
            </div>
            <button
              id="view-all-patients-link"
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentPatients.map((patient) => {
              const patientCases = cases.filter((c) => c.patient_id === patient.id);
              return (
                <div
                  key={patient.id}
                  className="px-5 py-3 hover:bg-slate-50/80 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {patient.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-900">{patient.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {patient.patient_code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {patient.age} yrs • {patient.gender} • {patient.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                      title="View Patient Details & History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNewCaseForPatient(patient)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      title="Add New Clinical Case Record"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Take Case</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Cases Timeline */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Case Records</h3>
            </div>
            <button
              id="view-all-cases-link"
              onClick={() => onNavigate('case-history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentCases.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No case records recorded yet. Start by taking a case for any patient.
              </div>
            ) : (
              recentCases.map((c) => {
                const patient = patients.find((p) => p.id === c.patient_id);
                return (
                  <div
                    key={c.id}
                    className="px-5 py-3 hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => {
                      if (patient) onSelectPatient(patient);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">
                          {patient ? patient.name : 'Unknown Patient'}
                        </span>
                        {patient && (
                          <span className="text-[11px] font-mono text-slate-500">
                            ({patient.patient_code})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium line-clamp-1">
                      <span className="text-slate-500 font-normal">Complaint: </span>
                      {c.chief_complaint}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Recorded by: {c.recorded_by_name}</span>
                      {c.vitals?.blood_pressure && (
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          BP: {c.vitals.blood_pressure}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
