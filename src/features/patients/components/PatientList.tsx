import { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Eye,
  FilePlus2,
  Edit2,
  Phone,
  MapPin,
  ClipboardList,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { Patient, CaseRecord } from '../../../types';

interface PatientListProps {
  patients: Patient[];
  cases: CaseRecord[];
  onSelectPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onNewCaseForPatient: (patient: Patient) => void;
  onRegisterClick: () => void;
}

export default function PatientList({
  patients,
  cases,
  onSelectPatient,
  onEditPatient,
  onNewCaseForPatient,
  onRegisterClick,
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female' | 'Other'>('All');

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender = genderFilter === 'All' || patient.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [patients, searchTerm, genderFilter]);

  const getCaseCountForPatient = (patientId: string) => {
    return cases.filter((c) => c.patient_id === patientId).length;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Registered patients and their clinical case histories. Total: {patients.length} patients
          </p>
        </div>

        <button
          id="list-register-patient-btn"
          onClick={onRegisterClick}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            placeholder="Search by Patient ID, Name, Phone number, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1 text-xs text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Gender:</span>
          </div>
          {(['All', 'Male', 'Female'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setGenderFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                genderFilter === filter
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table (Mandated format from PRD page 19) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Patient ID
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Age / Gender
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Contact &amp; Emergency
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center"
                >
                  Cases
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Search className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-slate-900">No patients found</div>
                      <p className="text-xs text-slate-500">
                        {searchTerm
                          ? `No patient records match "${searchTerm}". Try another search or clear the filter.`
                          : 'No patients have been registered yet.'}
                      </p>
                      <button
                        onClick={onRegisterClick}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register Patient</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const caseCount = getCaseCountForPatient(patient.id);
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => onSelectPatient(patient)}
                    >
                      {/* Patient ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {patient.patient_code}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {patient.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                          <span className="truncate max-w-xs">{patient.address}</span>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-800 font-medium">
                          {patient.age} years
                        </div>
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                            patient.gender === 'Female'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {patient.gender}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                          ICE: {patient.emergency_contact}
                        </div>
                      </td>

                      {/* Cases Count */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            caseCount > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {caseCount} {caseCount === 1 ? 'case' : 'cases'}
                        </span>
                      </td>

                      {/* Actions (PRD Page 19: View, Edit, Add Case) */}
                      <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            id={`view-patient-${patient.id}`}
                            onClick={() => onSelectPatient(patient)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="View Patient Details & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            id={`edit-patient-${patient.id}`}
                            onClick={() => onEditPatient(patient)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                            title="Edit Patient Information"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            id={`add-case-patient-${patient.id}`}
                            onClick={() => onNewCaseForPatient(patient)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs"
                            title="Add Case Record"
                          >
                            <FilePlus2 className="w-3.5 h-3.5" />
                            <span>Add Case</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Database table: `patients` (SIH26047 Schema)
          </span>
        </div>
      </div>
    </div>
  );
}
