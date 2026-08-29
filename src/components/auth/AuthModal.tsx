import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsDemoUser,
    addToast
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      if (mode === 'signup') {
        addToast('Account Created!', `Welcome to ApexProject, ${name || 'Scholar'}!`, 'success');
      } else if (mode === 'signin') {
        addToast('Signed In', 'Welcome back to your workspace!', 'success');
      } else {
        addToast('Reset Link Sent', 'Password reset instructions sent to your email.', 'info');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-10">
        
        {/* Header with gradient accent */}
        <div className="relative p-6 border-b border-[var(--border-color)] bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">ApexProject Security</span>
          </div>

          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Create student or mentor account'}
            {mode === 'forgot' && 'Reset your password'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {mode === 'signin' && 'Access project submissions, live milestones, and mentor chat.'}
            {mode === 'signup' && 'Join thousands of university scholars getting verified engineering guidance.'}
            {mode === 'forgot' && 'Enter your university or registered email address.'}
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Access */}
        <div className="p-4 bg-[var(--bg-elevated)] border-b border-[var(--border-color)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center justify-between">
            <span>Instant Demo Logins (1-Click)</span>
            <span className="text-blue-500 text-[10px]">No password needed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => loginAsDemoUser('student')}
              className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Student</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Aarav (IIT Delhi)</div>
            </button>

            <button
              onClick={() => loginAsDemoUser('expert')}
              className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Expert</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Dr. Vikram (AI)</div>
            </button>

            <button
              onClick={() => loginAsDemoUser('admin')}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <Shield className="w-4 h-4 text-emerald-500" />
                <ArrowRight className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">Admin</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">Operations Lead</div>
            </button>
          </div>
        </div>

        {/* Regular Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">College / University</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi / BITS Pilani"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      role === 'student'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Student / Scholar
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('expert')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      role === 'expert'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Mentor / Developer
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Password</label>
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Free Account' : 'Send Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle Modes */}
          <div className="text-center text-xs text-[var(--text-secondary)] pt-2">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
