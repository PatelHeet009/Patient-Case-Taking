import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  FileSpreadsheet,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { ActivePage, UserRole, User } from '../../../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  userRole: UserRole;
  patientCount: number;
  caseCount: number;
  onStartJudgeTour: () => void;
  currentUser?: User;
  onLogout?: () => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
  userRole,
  patientCount,
  caseCount,
  onStartJudgeTour,
  currentUser,
  onLogout,
}: SidebarProps) {
  const isDoctor = userRole === 'doctor';

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Group: Main */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            <button
              id="nav-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Dashboard</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Navigation Group: Patients */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Patients
          </div>
          <nav className="space-y-1">
            <button
              id="nav-all-patients-btn"
              onClick={() => onNavigate('patients')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'patients' || activePage === 'patient-details'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>All Patients</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {patientCount}
              </span>
            </button>

            <button
              id="nav-register-patient-btn"
              onClick={() => onNavigate('register-patient')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'register-patient'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <UserPlus className="w-4 h-4 text-slate-500" />
                <span>Register Patient</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Navigation Group: Clinical Cases */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Clinical Records
          </div>
          <nav className="space-y-1">
            <button
              id="nav-case-history-btn"
              onClick={() => onNavigate('case-history')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'case-history'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ClipboardList className="w-4 h-4 text-slate-500" />
                <span>Case History</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {caseCount}
              </span>
            </button>

            <button
              id="nav-take-case-btn"
              onClick={() => onNavigate('new-case')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'new-case'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                <span>New Case-Taking</span>
              </div>
              {isDoctor && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                  MD
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* User Session & Logout Card */}
      <div className="mt-6 space-y-4">
        {currentUser && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="min-w-0 flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  @{currentUser.username}
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Bottom Card: Hackathon Judge Demo Workflow */}
        <div className="pt-2 border-t border-slate-200">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Judge Path</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              Follows official success criteria: Register → Search → Case Entry → History in minimal clicks.
            </p>

            <button
              id="judge-tour-quick-btn"
              onClick={onStartJudgeTour}
              className="w-full flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Start Guided Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 px-1 text-[11px] text-slate-400 text-center">
            SIH26047 • Healthcare Prototype
          </div>
        </div>
      </div>
    </aside>
  );
}
