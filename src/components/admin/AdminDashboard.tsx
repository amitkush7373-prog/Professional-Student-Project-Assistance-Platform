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
  QrCode
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
  const { currentUser, projects, transactions } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'payment_settings' | 'pricing' | 'analytics' | 'experts' | 'payments'>('verifications');

  const pendingVerificationCount = projects.filter(p => p.paymentStatus === 'verification_pending').length;

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
                Manage manual UPI payment verification, custom QR settings, student orders, and affordable pricing rules (₹100–₹700).
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-[var(--border-color)] gap-2 overflow-x-auto">
          {[
            { id: 'verifications', label: `Payment Verification (${pendingVerificationCount} Pending)`, icon: FileCheck, highlight: pendingVerificationCount > 0 },
            { id: 'orders', label: `Orders Queue (${projects.length})`, icon: Layers },
            { id: 'payment_settings', label: 'Payment QR Settings', icon: QrCode },
            { id: 'pricing', label: 'Affordable Pricing Matrix (₹100–₹700)', icon: Zap },
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
