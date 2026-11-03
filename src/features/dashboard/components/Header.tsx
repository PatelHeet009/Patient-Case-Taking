import {
  Stethoscope,
  RotateCcw,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { User, UserRole } from '../../../types';
import { INITIAL_USERS } from '../../../data/initialData';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onLogout: () => void;
  onResetData: () => void;
  onNavigate: (page: string) => void;
  showResetToast: boolean;
}

export default function Header({
  currentUser,
  onUserChange,
  onLogout,
  onResetData,
  onNavigate,
  showResetToast,
}: HeaderProps) {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'doctor':
        return {
          label: 'Doctor / Physician',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-600',
        };
      case 'staff':
        return {
          label: 'Medical Staff',
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-600',
        };
      case 'administrator':
        return {
          label: 'Administrator',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-600',
        };
      default:
        return {
          label: 'User',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-600',
        };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Project Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <Stethoscope className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center">
                <span className="font-semibold text-slate-900 text-lg leading-tight tracking-tight">
                  Patient Case-Taking
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Digital Case-Taking &amp; History System
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Quick Demo Reset */}
            <button
              id="header-reset-btn"
              onClick={onResetData}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Reset records to default test dataset for demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            {/* User Session & Role */}
            <div className="relative flex items-center space-x-2 pl-2 border-l border-slate-200">

              <div className="flex flex-col items-end text-right hidden lg:block">
                <span className="text-xs font-semibold text-slate-900">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  @{currentUser.username} • {currentUser.department}
                </span>
              </div>

              {/* Role Selector */}
              <div className="flex items-center">
                <select
                  id="header-role-selector"
                  value={currentUser.id}
                  onChange={(e) => {
                    const selected = INITIAL_USERS.find(
                      (u) => u.id === e.target.value
                    );

                    if (selected) {
                      onUserChange(selected);
                    }
                  }}
                  aria-label="Switch User Role"
                  className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${roleInfo.bg}`}
                >
                  {INITIAL_USERS.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Log Out Button */}
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="Log out of clinical session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success notification after reset */}
      {showResetToast && (
        <div className="bg-emerald-50 border-t border-b border-emerald-200 px-4 py-1.5 text-center text-xs font-medium text-emerald-800 flex items-center justify-center space-x-1.5 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Demo dataset restored: 5 sample patients and clinical cases loaded
            for judging demonstration.
          </span>
        </div>
      )}
    </header>
  );
}
