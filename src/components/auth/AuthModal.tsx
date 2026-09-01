import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalPortal,
    authModalMode,
    loginAsDemoUser,
    signUpUser,
    signInUser,
    addToast
  } = useApp();

  // Portal Type Selection: 'student' | 'expert' | 'admin'
  const [portalType, setPortalType] = useState<'student' | 'expert' | 'admin'>('student');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');

  useEffect(() => {
    if (isAuthModalOpen) {
      setPortalType(authModalPortal || 'student');
      setMode(authModalMode || 'signin');
      setErrorMessage('');
    }
  }, [isAuthModalOpen, authModalPortal, authModalMode]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Valid admin passcodes
      if (adminPasscode === 'admin123' || adminPasscode === 'apexadmin' || adminPasscode.toLowerCase() === 'superadmin') {
        loginAsDemoUser('admin');
        addToast('Admin Authorized', 'Logged in as Super Admin Operations Command.', 'success');
      } else {
        setErrorMessage('Invalid Admin Security Passcode. Default demo code: admin123');
      }
    }, 400);
  };

  const handleUserAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          return;
        }
        if (!email.trim()) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }
        signUpUser({
          name: name.trim(),
          email: email.trim(),
          college: college.trim() || (portalType === 'student' ? 'University Campus' : 'Engineering Department'),
          role: portalType === 'expert' ? 'expert' : 'student'
        });
      } else if (mode === 'signin') {
        if (!email.trim()) {
          setErrorMessage('Please enter your registered email.');
          return;
        }
        signInUser(email, password, portalType === 'expert' ? 'expert' : 'student');
      } else {
        setIsAuthModalOpen(false);
        addToast('Reset Link Sent', `Password reset instructions sent to ${email}.`, 'info');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden z-10">
        
        {/* Header */}
        <div className="relative p-6 border-b border-[var(--border-color)] bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-500/10">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">ApexProject Security Gateway</span>
          </div>

          <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {portalType === 'admin'
              ? 'Super Admin Operations Portal'
              : mode === 'signin'
              ? `Sign in to ${portalType === 'student' ? 'Student' : 'Mentor'} Workspace`
              : `Create ${portalType === 'student' ? 'Student' : 'Mentor'} Account`}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {portalType === 'admin'
              ? 'Authorized operations staff and platform management only.'
              : portalType === 'student'
              ? 'Access verified college project guidance, 100% free PPTs, and code review.'
              : 'Join as a verified technical mentor & academic project guide.'}
          </p>
        </div>

        {/* Top 3 Portal Selector Tabs */}
        <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-color)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 px-1">
            Select Portal Access:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPortalType('student');
                setErrorMessage('');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalType === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('expert');
                setErrorMessage('');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalType === 'expert'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('admin');
                setErrorMessage('');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalType === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Lock</span>
            </button>
          </div>
        </div>

        {/* If Admin Portal Selected */}
        {portalType === 'admin' ? (
          <form onSubmit={handleAdminAuth} className="p-6 space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Restricted Administrative Zone</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Admin dashboard access requires security authorization. Demo Passcode: <span className="font-mono font-bold text-[var(--text-primary)]">admin123</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-[var(--text-primary)]">
                Admin Security Passcode / Master Key *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={e => setAdminPasscode(e.target.value)}
                  placeholder="Enter admin passcode (e.g. admin123)"
                  className="w-full pl-9 pr-3 py-2.5 font-mono text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Unlock Admin Operations Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Instant 1-Click Super Admin Access */}
            <div className="pt-2 border-t border-[var(--border-color)] text-center">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser('admin');
                  addToast('Admin Authorized', 'Logged in as Super Admin.', 'success');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>⚡ 1-Click Super Admin Demo Login</span>
              </button>
            </div>
          </form>
        ) : (
          /* Student or Expert Portal Form */
          <form onSubmit={handleUserAuth} className="p-6 space-y-4 text-xs">
            
            {/* Mode Switcher: Sign In vs Sign Up */}
            <div className="flex rounded-xl p-1 bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Create Free Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors ${
                  mode === 'signin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign In
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Amit Kushwaha"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    College / University *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. IILM / DTU / IIT Delhi"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. scholar@university.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[var(--text-primary)]">Password *</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? 'Sign In to Workspace'
                      : mode === 'signup'
                      ? 'Create Free Account & Enter Hub'
                      : 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Instant 1-Click Demo Login for Quick Access */}
            <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] text-center">
                Or Instant 1-Click Demo Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsDemoUser('student')}
                  className="p-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[var(--text-primary)]">Demo Student</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Aarav (DTU CS)</div>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsDemoUser('expert')}
                  className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-colors"
                >
                  <div className="font-bold text-xs text-[var(--text-primary)]">Demo Mentor</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Dr. Vikram (AI Lead)</div>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
