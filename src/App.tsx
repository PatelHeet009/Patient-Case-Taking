import { useState, useEffect } from 'react';
import Header from './features/dashboard/components/Header';
import Sidebar from './features/dashboard/components/Sidebar';
import Dashboard from './features/dashboard/components/Dashboard';
import PatientList from './features/patients/components/PatientList';
import PatientRegistration from './features/patients/components/PatientRegistration';
import PatientDetails from './features/patients/components/PatientDetails';
import CaseTakingForm from './features/cases/components/CaseTakingForm';
import CaseHistoryView from './features/cases/components/CaseHistoryView';
import SIHDocsView from './features/docs/components/SIHDocsView';
import JudgeDemoModal from './features/docs/components/JudgeDemoModal';
import LoginView from './features/auth/components/LoginView';
import {
  getStoredPatients,
  saveStoredPatients,
  getStoredCases,
  saveStoredCases,
  getStoredUser,
  saveStoredUser,
  resetToDemoData,
  INITIAL_USERS,
} from './data/initialData';
import { Patient, CaseRecord, User, ActivePage } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [patients, setPatients] = useState<Patient[]>(getStoredPatients());
  const [cases, setCases] = useState<CaseRecord[]>(getStoredCases());

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [showResetToast, setShowResetToast] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Set default selected patient if null
  useEffect(() => {
    if (!selectedPatient && patients.length > 0) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  const handleUserChange = (newUser: User) => {
    setCurrentUser(newUser);
    saveStoredUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
    setActivePage('dashboard');
  };

  const handleResetData = () => {
    if (window.confirm('Reset patient records and cases to the initial SIH demo dataset?')) {
      resetToDemoData();
      setPatients(getStoredPatients());
      setCases(getStoredCases());
      setCurrentUser(INITIAL_USERS[0]);
      setShowResetToast(true);
      setTimeout(() => setShowResetToast(false), 4000);
    }
  };

  const handleSavePatient = (
    patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>,
  ): Patient => {
    const newId = `pt-${Date.now().toString().slice(-4)}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedList = [newPatient, ...patients];
    setPatients(updatedList);
    saveStoredPatients(updatedList);
    setSelectedPatient(newPatient);
    return newPatient;
  };

  const handleUpdatePatient = (updated: Patient) => {
    const updatedList = patients.map((p) => (p.id === updated.id ? updated : p));
    setPatients(updatedList);
    saveStoredPatients(updatedList);
    setSelectedPatient(updated);
    setEditingPatient(null);
    setActivePage('patient-details');
  };

  const handleSaveCase = (
    caseData: Omit<CaseRecord, 'id' | 'created_at' | 'updated_at'>,
  ): CaseRecord => {
    const newId = `case-${Date.now().toString().slice(-4)}`;
    const newCase: CaseRecord = {
      ...caseData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedList = [newCase, ...cases];
    setCases(updatedList);
    saveStoredCases(updatedList);
    return newCase;
  };

  const handleOpenPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setActivePage('patient-details');
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setActivePage('register-patient');
  };

  const handleStartNewCase = (patient: Patient) => {
    setSelectedPatient(patient);
    setActivePage('new-case');
  };

  const handleNavigateToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setActivePage('dashboard');
        break;
      case 2:
        setEditingPatient(null);
        setActivePage('register-patient');
        break;
      case 3:
        setActivePage('patients');
        break;
      case 4:
        if (patients.length > 0) {
          setSelectedPatient(patients[0]);
          setActivePage('patient-details');
        }
        break;
      case 5:
        if (patients.length > 0) {
          setSelectedPatient(patients[0]);
          setActivePage('new-case');
        }
        break;
      case 6:
        setActivePage('case-history');
        break;
    }
  };

  if (!currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            saveStoredUser(user);
          }}
          onOpenDocs={() => setShowDocsModal(true)}
        />

        {showDocsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">SIH26047 Documentation Suite</h3>
                  <p className="text-[11px] text-slate-400">PRD, Architecture, Rules, Phases, Design, Memory</p>
                </div>
                <button
                  onClick={() => setShowDocsModal(false)}
                  className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  Close Specs
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <SIHDocsView onStartDemoTour={() => setShowDocsModal(false)} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Header */}
      <Header
  currentUser={currentUser}
  onUserChange={handleUserChange}
  onLogout={handleLogout}
  onResetData={handleResetData}
  onNavigate={(p) => setActivePage(p as ActivePage)}
  showResetToast={showResetToast}
/>

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            if (page === 'register-patient') setEditingPatient(null);
            setActivePage(page);
          }}
          userRole={currentUser.role}
          patientCount={patients.length}
          caseCount={cases.length}
          onStartJudgeTour={() => setIsJudgeModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activePage === 'dashboard' && (
            <Dashboard
              patients={patients}
              cases={cases}
              currentUser={currentUser}
              onNavigate={(p) => {
                if (p === 'register-patient') setEditingPatient(null);
                setActivePage(p as ActivePage);
              }}
              onSelectPatient={handleOpenPatientDetails}
              onNewCaseForPatient={handleStartNewCase}
              onStartJudgeTour={() => setIsJudgeModalOpen(true)}
            />
          )}

          {activePage === 'patients' && (
            <PatientList
              patients={patients}
              cases={cases}
              onSelectPatient={handleOpenPatientDetails}
              onEditPatient={handleEditPatient}
              onNewCaseForPatient={handleStartNewCase}
              onRegisterClick={() => {
                setEditingPatient(null);
                setActivePage('register-patient');
              }}
            />
          )}

          {activePage === 'register-patient' && (
            <PatientRegistration
              onSavePatient={handleSavePatient}
              onCancel={() => setActivePage('patients')}
              onSuccessNavigateToCase={(patient) => {
                setSelectedPatient(patient);
                setActivePage('new-case');
              }}
              existingPatientToEdit={editingPatient}
              onUpdatePatient={handleUpdatePatient}
            />
          )}

          {activePage === 'patient-details' && selectedPatient && (
            <PatientDetails
              patient={selectedPatient}
              cases={cases}
              onBack={() => setActivePage('patients')}
              onEditPatient={handleEditPatient}
              onNewCase={handleStartNewCase}
              onViewCaseHistory={() => setActivePage('case-history')}
            />
          )}

          {activePage === 'new-case' && (
            selectedPatient ? (
              <CaseTakingForm
                patient={selectedPatient}
                currentUser={currentUser}
                onSaveCase={handleSaveCase}
                onCancel={() => setActivePage('patient-details')}
                onViewHistory={() => setActivePage('case-history')}
              />
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
                <h3 className="text-base font-bold text-slate-800">Select a Patient for Case-Taking</h3>
                <p className="text-xs text-slate-500">
                  Choose a registered patient from the directory to initiate clinical case-taking.
                </p>
                <button
                  onClick={() => setActivePage('patients')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Go to Patient Directory
                </button>
              </div>
            )
          )}

          {activePage === 'case-history' && (
            <CaseHistoryView
              patients={patients}
              cases={cases}
              onSelectPatient={handleOpenPatientDetails}
              onNewCaseForPatient={handleStartNewCase}
              initialSelectedPatientId={selectedPatient ? selectedPatient.id : 'ALL'}
            />
          )}

          {activePage === 'sih-docs' && (
            <SIHDocsView onStartDemoTour={() => setIsJudgeModalOpen(true)} />
          )}
        </main>
      </div>

      {/* 1-Click Guided Demo Modal for SIH26047 Hackathon Evaluation */}
      <JudgeDemoModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onNavigateToStep={handleNavigateToStep}
        patients={patients}
      />
    </div>
  );
}
