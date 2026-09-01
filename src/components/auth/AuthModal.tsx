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
  AlertCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShinchanPowerUp, ShinchanAnimationState } from './ShinchanPowerUp';

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

  // Portal Type: 'student' | 'expert' | 'admin'
  const [portalType, setPortalType] = useState<'student' | 'expert' | 'admin'>('student');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shinchan Power-Up Animation States
  const [shinchanState, setShinchanState] = useState<ShinchanAnimationState>('idle');
  const [shinchanStatusText, setShinchanStatusText] = useState<string>('');

  useEffect(() => {
    if (isAuthModalOpen) {
      setPortalType(authModalPortal || 'student');
      setMode(authModalMode || 'signin');
      setErrorMessage('');
      setShinchanState('idle');
      setShinchanStatusText('');
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authModalPortal, authModalMode]);

  if (!isAuthModalOpen) return null;

  // Shinchan Triggered Admin Authentication Sequence
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Check validation first
    if (!adminPasscode.trim()) {
      setErrorMessage('Please enter the admin passcode.');
      return;
    }

    setIsLoading(true);
    setShinchanState('charging');
    setShinchanStatusText('Shinchan is charging admin access… ⚡');

    // 1. Powering Stage
    setTimeout(() => {
      setShinchanState('powering');
      setShinchanStatusText('ADMIN POWER ON! ⚡');
    }, 600);

    // 2. Final Authorization Stage (~1.2s)
    setTimeout(() => {
      if (
        adminPasscode === 'admin123' ||
        adminPasscode === 'apexadmin' ||
        adminPasscode.toLowerCase() === 'superadmin'
      ) {
        setShinchanState('success');
        setShinchanStatusText('Access Granted! ✌️');
        setTimeout(() => {
          setIsLoading(false);
          loginAsDemoUser('admin');
          addToast('Admin Authorized', 'Logged in as Super Admin Operations Command.', 'success');
        }, 350);
      } else {
        setShinchanState('error');
        setShinchanStatusText('Oops! Wrong Passcode');
        setIsLoading(false);
        setErrorMessage('Invalid Admin Security Passcode. Default demo code: admin123');
        setTimeout(() => {
          setShinchanState('idle');
          setShinchanStatusText('');
        }, 2000);
      }
    }, 1200);
  };

  // Shinchan Triggered Student/Expert Authentication Sequence
  const handleUserAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Pre-validation
    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    } else if (mode === 'signin') {
      if (!email.trim()) {
        setErrorMessage('Please enter your registered email.');
        return;
      }
    }

    // Begin Shinchan Power-Up Sequence (~1.2s)
    setIsLoading(true);
    setShinchanState('charging');
    setShinchanStatusText('Shinchan is powering you in… ⚡');

    // Step 2: Electric surge after 550ms
    setTimeout(() => {
      setShinchanState('powering');
      setShinchanStatusText('POWER ON! ⚡');
    }, 550);

    // Step 3: Complete Authentication after 1.15s
    setTimeout(() => {
      setShinchanState('success');
      setShinchanStatusText('Action Kamen Victory! ✌️');

      setTimeout(() => {
        setIsLoading(false);
        if (mode === 'signup') {
          signUpUser({
            name: name.trim(),
            email: email.trim(),
            college: college.trim() || (portalType === 'student' ? 'University Campus' : 'Engineering Department'),
            role: portalType === 'expert' ? 'expert' : 'student'
          });
        } else if (mode === 'signin') {
          signInUser(email, password, portalType === 'expert' ? 'expert' : 'student');
        } else {
          setIsAuthModalOpen(false);
          addToast('Reset Link Sent', `Password reset instructions sent to ${email}.`, 'info');
        }
      }, 350);
    }, 1150);
  };

  // Demo Login with Shinchan power animation
  const handleDemoLoginTrigger = (role: 'student' | 'expert' | 'admin') => {
    setIsLoading(true);
    setShinchanState('charging');
    setShinchanStatusText(`Powering up ${role.toUpperCase()} workspace… ⚡`);

    setTimeout(() => {
      setShinchanState('powering');
      setShinchanStatusText('POWER ON! ⚡');
    }, 500);

    setTimeout(() => {
      setShinchanState('success');
      setShinchanStatusText('Ready to Roll! ✌️');
      setTimeout(() => {
        loginAsDemoUser(role);
      }, 300);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Dark Ambient Backdrop with Floating Light Orbs */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => !isLoading && setIsAuthModalOpen(false)}
      />

      {/* Glowing Ambient Radial Ring Behind Modal */}
      <div className="fixed pointer-events-none w-96 h-96 rounded-full bg-blue-600/20 blur-[90px] animate-pulse" />

      {/* Main Glassmorphic Modal Card */}
      <div className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-300">
        
        {/* Animated Top Header */}
        <div className="relative p-6 sm:p-7 border-b border-[var(--border-color)] bg-gradient-to-br from-blue-600/15 via-transparent to-indigo-600/10">
          <button
            disabled={isLoading}
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-1">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              ApexProject Gateway • Verified Access
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
            {portalType === 'admin'
              ? 'Super Admin Operations Portal'
              : mode === 'signin'
              ? `Sign In to ${portalType === 'student' ? 'Student' : 'Mentor'} Workspace`
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

        {/* Portal Access Switcher (Student / Mentor / Admin) */}
        <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-color)]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 px-1">
            Select Workspace Role:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              <span>Admin Hub</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ADMIN PORTAL FORM */}
        {/* ========================================================================= */}
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
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-[var(--text-primary)]">
                Admin Security Passcode / Master Key *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={e => setAdminPasscode(e.target.value)}
                  placeholder="Enter admin passcode (e.g. admin123)"
                  className="w-full pl-10 pr-3 py-2.5 font-mono text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring transition-all"
                />
              </div>
            </div>

            {/* Shinchan Power-Up Easter Egg Row */}
            <div className="pt-2 flex items-center justify-between">
              <ShinchanPowerUp
                state={shinchanState}
                statusText={shinchanStatusText}
              />
            </div>

            {/* Power Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/50 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-spin" />
                  <span>Powering Up System…</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Unlock Admin Operations Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* 1-Click Super Admin Access */}
            <div className="pt-2 border-t border-[var(--border-color)] text-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoLoginTrigger('admin')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>⚡ 1-Click Super Admin Demo Login</span>
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* STUDENT / EXPERT PORTAL FORM WITH SHINCHAN POWER-UP */
          /* ========================================================================= */
          <form onSubmit={handleUserAuth} className="p-6 space-y-4 text-xs">
            
            {/* Mode Switcher: Sign In vs Sign Up */}
            <div className="flex rounded-xl p-1 bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-lg font-bold text-center transition-all ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Create Free Account
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-lg font-bold text-center transition-all ${
                  mode === 'signin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign In
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2 animate-in shake duration-200">
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
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    College / University *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. DTU / IIT Delhi / BITS"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring transition-all"
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
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. scholar@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring transition-all"
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
                      disabled={isLoading}
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring transition-all"
                  />
                </div>
              </div>
            )}

            {/* Shinchan Power-Up Easter Egg Row */}
            <div className="pt-1 flex items-center justify-between border-t border-[var(--border-color)]/50">
              <ShinchanPowerUp
                state={shinchanState}
                statusText={shinchanStatusText}
              />
            </div>

            {/* Power-Up Interactive Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/50 scale-[1.02] ring-2 ring-cyan-400 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
                  <span className="font-mono tracking-wider">
                    {shinchanState === 'charging'
                      ? 'Powering Up… ⚡'
                      : shinchanState === 'powering'
                      ? 'POWER ON! ⚡'
                      : 'Authenticating…'}
                  </span>
                </>
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
                  disabled={isLoading}
                  onClick={() => handleDemoLoginTrigger('student')}
                  className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-left transition-all hover:scale-105"
                >
                  <div className="font-bold text-xs text-[var(--text-primary)]">Demo Student</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Aarav (DTU CS)</div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoLoginTrigger('expert')}
                  className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-all hover:scale-105"
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
