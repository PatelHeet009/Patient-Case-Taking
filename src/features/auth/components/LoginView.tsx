import { useState, type FormEvent } from 'react';
import {
  Stethoscope,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  ArrowRight,
  Sparkles,
  Info,
  KeyRound,
  Building2,
  Mail,
  UserCheck,
} from 'lucide-react';
import { User, UserRole } from '../../../types';
import {
  authenticateUser,
  registerNewUser,
  getStoredUsers,
  INITIAL_USERS,
} from '../../../data/initialData';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onOpenDocs?: () => void;
}

export default function LoginView({ onLoginSuccess, onOpenDocs }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('doctor');
  const [regDepartment, setRegDepartment] = useState('General Medicine');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Quick fill helper
  const handleQuickFill = (user: User) => {
    setUsername(user.username);
    setPassword(user.password || '');
    setLoginError(null);
  };

  const handleQuickLogin = (user: User) => {
    setUsername(user.username);
    setPassword(user.password || '');
    setLoginError(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = authenticateUser(user.username, user.password || '');
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setLoginError(res.error || 'Authentication failed');
      }
    }, 250);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!username.trim()) {
      setLoginError('Please enter your username or registered email.');
      return;
    }
    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = authenticateUser(username, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setLoginError(result.error || 'Invalid credentials. Please verify and try again.');
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim()) {
      setRegError('Please provide your full legal/clinical name.');
      return;
    }
    if (!regUsername.trim() || regUsername.trim().length < 3) {
      setRegError('Username must be at least 3 characters.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid official email address.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    const result = registerNewUser({
      name: regName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDepartment.trim(),
      password: regPassword,
    });

    if (result.success && result.user) {
      setRegSuccess(`Account successfully created for ${result.user.name}! Logging you in...`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 700);
    } else {
      setRegError(result.error || 'Could not register user. Please check your details.');
    }
  };

  const allUsers = getStoredUsers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/30 flex flex-col justify-between font-sans antialiased text-slate-900 p-4 sm:p-6 lg:p-8">

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header of Auth Card */}
          <div className="px-6 pt-6 pb-4 bg-slate-900 text-white text-center relative">
            <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-md mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              {activeTab === 'login' ? 'Clinical Staff & Doctor Sign In' : 'Register Clinical Account'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {activeTab === 'login'
                ? 'Enter your assigned hospital credentials to access patient records'
                : 'Create a new clinical profile to begin recording cases'}
            </p>

            {/* Tab switchers */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-4 border border-slate-700/60">
              <button
                type="button"
                id="login-tab-signin"
                onClick={() => {
                  setActiveTab('login');
                  setLoginError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="login-tab-register"
                onClick={() => {
                  setActiveTab('register');
                  setRegError(null);
                  setRegSuccess(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Register New User
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Error Banner */}
                {loginError && (
                  <div
                    id="login-error-alert"
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-shake"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{loginError}</span>
                  </div>
                )}

                {/* Username Input */}
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Username or Email ID <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. doctor, staff, or admin"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Default: <code className="text-slate-600 font-mono">role123</code>
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password (e.g. doctor123)"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember this session on this computer</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-sm shadow-blue-200 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Clinical Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick 1-Click Login Chips for Demo / Judging */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Quick Demo Accounts (1-Click)
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">Ready to Test</span>
                  </div>

                  <div className="space-y-1.5">
                    {INITIAL_USERS.map((u) => {
                      const isDoc = u.role === 'doctor';
                      const isStf = u.role === 'staff';
                      return (
                        <div
                          key={u.id}
                          className="p-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-base flex-shrink-0">
                              {isDoc ? '👨‍⚕️' : isStf ? '📋' : '⚙️'}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {u.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                user: <strong className="text-slate-700">{u.username}</strong> | pass:{' '}
                                <strong className="text-slate-700">{u.password}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleQuickFill(u)}
                              className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md font-medium"
                              title="Fill credentials into form"
                            >
                              Fill
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickLogin(u)}
                              className="px-2.5 py-1 text-[11px] text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition shadow-2xs"
                              title="Instant Login with this account"
                            >
                              Log In
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            ) : (
              /* Register Tab */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{regSuccess}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name &amp; Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Verma, MD"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Username & Role Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. rajesh.verma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinical Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="doctor">Doctor (Physician)</option>
                      <option value="staff">Medical Staff (Nurse / Triage)</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                {/* Email & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hospital Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@hospital.org"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="e.g. Internal Medicine"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 4 chars"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showRegPassword ? 'Hide Passwords' : 'Show Passwords'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-200 transition-all flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account &amp; Log In</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Security & Access Matrix Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Encrypted Session • Role-Based Access Control (FR-01 &amp; FR-09)</span>
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-400 py-2 border-t border-slate-200">
        Smart India Hackathon SIH26047 • Patient Case-Taking and History Management System
      </div>
    </div>
  );
}
