import React, { useState } from 'react';
import {
  Shield,
  Layers,
  BarChart3,
  Users,
  DollarSign,
  Zap,
  RotateCcw,
  CreditCard,
  CheckCircle2,
  FileCheck,
  QrCode,
  Clock,
  Lock,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminPricingConfig } from './AdminPricingConfig';
import { AdminExpertsManager } from './AdminExpertsManager';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminPaymentsLedger } from './AdminPaymentsLedger';
import { AdminPaymentVerification } from './AdminPaymentVerification';
import { AdminPaymentSettings } from './AdminPaymentSettings';

export const AdminDashboard: React.FC = () => {
  const { currentUser, paymentRecords, transactions, loginAsDemoUser, setActiveView, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'payment_settings' | 'pricing' | 'analytics' | 'experts' | 'payments'>('verifications');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const pendingVerificationCount = paymentRecords.filter(p => p.payment_status === 'verification_pending').length;

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'apexadmin' || passcode.toLowerCase() === 'superadmin') {
      loginAsDemoUser('admin');
      addToast('Admin Authorized', 'Logged in as Super Admin Operations Command.', 'success');
      setAuthError('');
    } else {
      setAuthError('Incorrect Passcode. Default demo code: admin123');
    }
  };

  // If user is not authenticated as admin, show security clearance lock
  if (currentUser.role !== 'admin') {
    return (
      <div className="w-full py-16 lg:py-24 bg-[var(--bg-primary)]">
        <div className="max-w-md mx-auto px-4 space-y-6 animate-in fade-in duration-200">
          
          <div className="p-8 rounded-3xl glass-panel border border-red-500/30 bg-red-500/5 shadow-2xl text-center space-y-5">
            
            <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
                Restricted Admin Access
              </span>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight pt-1">
                Admin Clearance Required
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You are currently signed in as <span className="font-bold text-[var(--text-primary)]">{currentUser.name}</span> ({currentUser.role}). This command center is restricted to operations staff.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} className="space-y-3 pt-2 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)]">
                  Enter Admin Passcode:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="e.g. admin123"
                    className="w-full pl-9 pr-3 py-2.5 font-mono text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Authorize & Unlock Admin Hub</span>
              </button>
            </form>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('student-dashboard')}
                className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser('admin');
                  addToast('Admin Authorized', 'Logged in as Super Admin.', 'success');
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                1-Click Demo Admin
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Super Admin Operations Hub
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Services Active
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1">
                College Project Platform Operations
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Manage manual UPI payment verification, custom QR settings, student orders, and affordable pricing rules (Max ₹100).
              </p>
            </div>
          </div>
        </div>

        {/* 🟡 PENDING PAYMENT VERIFICATIONS ALERT BANNER */}
        {pendingVerificationCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 dark:text-amber-200">
                  🟡 {pendingVerificationCount} {pendingVerificationCount === 1 ? 'Payment' : 'Payments'} Awaiting Admin Verification
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300">
                  Students have submitted UTR and screenshots. Review and verify to move projects to In Progress.
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('verifications')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-sm flex items-center justify-center gap-1"
            >
              <span>Review Payments</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center border-b border-[var(--border-color)] gap-2 overflow-x-auto">
          {[
            { id: 'verifications', label: `Payment Verification (${pendingVerificationCount} Pending)`, icon: FileCheck, highlight: pendingVerificationCount > 0 },
            { id: 'orders', label: `Orders Queue (${paymentRecords.length})`, icon: Layers },
            { id: 'payment_settings', label: 'Payment QR Settings', icon: QrCode },
            { id: 'pricing', label: 'Affordable Pricing Matrix (Max ₹100)', icon: Zap },
            { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
            { id: 'experts', label: 'Mentors Roster', icon: Users },
            { id: 'payments', label: `Transactions Ledger (${transactions.length})`, icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Active Tab Content */}
        <div>
          {activeTab === 'verifications' && <AdminPaymentVerification />}
          {activeTab === 'orders' && <AdminOrdersManager />}
          {activeTab === 'payment_settings' && <AdminPaymentSettings />}
          {activeTab === 'pricing' && <AdminPricingConfig />}
          {activeTab === 'analytics' && <AdminAnalyticsView />}
          {activeTab === 'experts' && <AdminExpertsManager />}
          {activeTab === 'payments' && <AdminPaymentsLedger />}
        </div>

      </div>
    </div>
  );
};
