import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  X,
  AlertCircle,
  Copy,
  Check,
  ZoomIn,
  DollarSign,
  ArrowRight,
  User,
  GraduationCap,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentVerificationRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminPaymentVerification: React.FC = () => {
  const {
    paymentRecords,
    verifyPayment,
    currency,
    selectedPaymentVerificationId,
    setSelectedPaymentVerificationId,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  // Detailed Payment View state
  const [viewingPayment, setViewingPayment] = useState<PaymentVerificationRecord | null>(() => {
    if (selectedPaymentVerificationId) {
      return paymentRecords.find(p => p.payment_id === selectedPaymentVerificationId || p.order_id === selectedPaymentVerificationId) || null;
    }
    return null;
  });

  // Verify Confirmation Modal state
  const [confirmVerifyModalOpen, setConfirmVerifyModalOpen] = useState(false);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('UTR could not be verified in bank statement.');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Screenshot Zoom Modal state
  const [isZoomedScreenshot, setIsZoomedScreenshot] = useState(false);

  // UTR Copy state
  const [copiedUtr, setCopiedUtr] = useState(false);

  // Calculate statistics
  const pendingRecords = paymentRecords.filter(p => p.payment_status === 'verification_pending');
  const verifiedRecords = paymentRecords.filter(p => p.payment_status === 'verified' || p.payment_status === 'confirmed');
  const rejectedRecords = paymentRecords.filter(p => p.payment_status === 'rejected');
  const totalVerifiedRevenue = verifiedRecords.reduce((sum, p) => sum + p.amount, 0);

  // Filter records
  const filteredRecords = paymentRecords.filter(p => {
    const matchesSearch =
      p.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.utr_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'pending') return matchesSearch && p.payment_status === 'verification_pending';
    if (filter === 'verified') return matchesSearch && (p.payment_status === 'verified' || p.payment_status === 'confirmed');
    if (filter === 'rejected') return matchesSearch && p.payment_status === 'rejected';
    return matchesSearch;
  });

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    addToast('UTR Copied', `Copied ${utr} to clipboard.`, 'info');
    setTimeout(() => setCopiedUtr(false), 3000);
  };

  const handleOpenPaymentDetails = (record: PaymentVerificationRecord) => {
    setViewingPayment(record);
    setSelectedPaymentVerificationId(record.payment_id);
  };

  const handleConfirmVerification = () => {
    if (!viewingPayment) return;
    verifyPayment(viewingPayment.payment_id, true);
    
    // Update local modal state immediately
    const updated = {
      ...viewingPayment,
      payment_status: 'verified' as const,
      verified_at: new Date().toISOString(),
      verified_by: 'Super Admin (Operations)'
    };
    setViewingPayment(updated);
    setConfirmVerifyModalOpen(false);
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingPayment) return;

    const finalReason = customRejectReason.trim() || rejectReason;
    verifyPayment(viewingPayment.payment_id, false, finalReason);

    // Update local modal state immediately
    const updated = {
      ...viewingPayment,
      payment_status: 'rejected' as const,
      rejected_at: new Date().toISOString(),
      rejected_by: 'Super Admin (Operations)',
      rejection_reason: finalReason
    };
    setViewingPayment(updated);
    setRejectModalOpen(false);
    setCustomRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Verification Stat */}
        <div
          onClick={() => setFilter('pending')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'pending'
              ? 'border-amber-500 bg-amber-500/15 shadow-md ring-1 ring-amber-500/30'
              : 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
            <span>Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
            {pendingRecords.length}
          </div>
          <div className="text-[10px] text-amber-800 dark:text-amber-400 mt-0.5">
            Orders waiting for bank check
          </div>
        </div>

        {/* Verified Payments Stat */}
        <div
          onClick={() => setFilter('verified')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'verified'
              ? 'border-emerald-500 bg-emerald-500/15 shadow-md ring-1 ring-emerald-500/30'
              : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
            <span>Verified Payments</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {verifiedRecords.length}
          </div>
          <div className="text-[10px] text-emerald-800 dark:text-emerald-400 mt-0.5">
            Confirmed & in development
          </div>
        </div>

        {/* Rejected Payments Stat */}
        <div
          onClick={() => setFilter('rejected')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'rejected'
              ? 'border-red-500 bg-red-500/15 shadow-md ring-1 ring-red-500/30'
              : 'border-red-500/30 bg-red-500/10 hover:bg-red-500/15'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-red-900 dark:text-red-300">
            <span>Rejected Payments</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono mt-1">
            {rejectedRecords.length}
          </div>
          <div className="text-[10px] text-red-800 dark:text-red-400 mt-0.5">
            Invalid UTR / Clarification needed
          </div>
        </div>

        {/* Total Verified Revenue Stat */}
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
            <span>Total Verified Revenue</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
            {formatCurrency(totalVerifiedRevenue, currency)}
          </div>
          <div className="text-[10px] text-blue-800 dark:text-blue-400 mt-0.5">
            Settled student transactions
          </div>
        </div>

      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${paymentRecords.length})` },
            { id: 'pending', label: `🟡 Pending (${pendingRecords.length})` },
            { id: 'verified', label: `🟢 Verified (${verifiedRecords.length})` },
            { id: 'rejected', label: `🔴 Rejected (${rejectedRecords.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Order ID, Student, UTR, or Project..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
          />
        </div>

      </div>

      {/* 3. PAYMENTS VERIFICATION TABLE */}
      <div className="rounded-2xl glass-panel border border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Project Title</th>
                <th className="p-4">UTR / Transaction ID</th>
                <th className="p-4">Payment Screenshot</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[var(--text-muted)]">
                    No payment verification records match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => {
                  const isPending = record.payment_status === 'verification_pending';
                  const isVerified = record.payment_status === 'verified' || record.payment_status === 'confirmed';
                  const isRejected = record.payment_status === 'rejected';

                  return (
                    <tr
                      key={record.payment_id}
                      className="hover:bg-[var(--bg-elevated)]/60 transition-colors cursor-pointer"
                      onClick={() => handleOpenPaymentDetails(record)}
                    >
                      {/* Order ID */}
                      <td className="p-4 space-y-0.5">
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {record.order_id}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {formatDate(record.submitted_at)}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-[var(--text-primary)]">{record.studentName}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{record.studentEmail}</div>
                      </td>

                      {/* Project Title */}
                      <td className="p-4 max-w-[180px]">
                        <div className="font-semibold text-[var(--text-primary)] truncate" title={record.projectTitle}>
                          {record.projectTitle}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] capitalize">
                          {record.serviceType?.replace('-', ' ') || 'College Project'}
                        </div>
                      </td>

                      {/* UTR */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]">
                            {record.utr_number}
                          </span>
                        </div>
                      </td>

                      {/* Payment Screenshot Thumbnail */}
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        {record.payment_screenshot ? (
                          <button
                            type="button"
                            onClick={() => {
                              setViewingPayment(record);
                              setIsZoomedScreenshot(true);
                            }}
                            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            <img
                              src={record.payment_screenshot}
                              alt="Proof thumbnail"
                              className="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)] shadow-sm hover:scale-105 transition-transform"
                            />
                            <span>View</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)]">No file</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-black text-sm text-[var(--text-primary)]">
                        {formatCurrency(record.amount, currency)}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Verification Pending</span>
                          </span>
                        )}
                        {isVerified && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Payment Verified</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1 w-max">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentDetails(record)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 mx-auto hover:scale-105"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Payment</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DETAILED PAYMENT VERIFICATION MODAL / PAGE */}
      {viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-3xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setViewingPayment(null);
                setSelectedPaymentVerificationId(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Order Header */}
            <div className="border-b border-[var(--border-color)] pb-4 space-y-1 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {viewingPayment.order_id}
                </span>
                
                {viewingPayment.payment_status === 'verification_pending' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    🟡 Verification Pending
                  </span>
                )}
                {viewingPayment.payment_status === 'verified' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    🟢 Payment Verified
                  </span>
                )}
                {viewingPayment.payment_status === 'rejected' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                    🔴 Payment Rejected
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Payment Verification Details
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Inspect the UTR and student payment screenshot to verify bank credit.
              </p>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Left Column: Student & Project Info */}
              <div className="space-y-4">
                
                {/* Student Info Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>Student Information</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="font-bold text-sm text-[var(--text-primary)]">{viewingPayment.studentName}</div>
                    <div className="text-[var(--text-secondary)]">{viewingPayment.studentEmail}</div>
                    {viewingPayment.studentPhone && (
                      <div className="text-[var(--text-muted)] font-mono">{viewingPayment.studentPhone}</div>
                    )}
                    {viewingPayment.studentCollege && (
                      <div className="text-[var(--text-muted)] pt-0.5 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{viewingPayment.studentCollege}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    <span>Project Information</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="font-bold text-[var(--text-primary)]">{viewingPayment.projectTitle}</div>
                    <div className="text-[var(--text-muted)] capitalize">
                      Category: {viewingPayment.serviceType?.replace('-', ' ') || 'College Project'}
                    </div>
                  </div>
                </div>

                {/* Financial Summary & UTR Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-3">
                  <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                    <span className="text-[11px] font-bold uppercase text-[var(--text-muted)]">Payable Amount:</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                      {formatCurrency(viewingPayment.amount, currency)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                      Submitted 12-Digit UTR / Transaction ID:
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      <span className="font-mono font-extrabold text-sm text-[var(--text-primary)]">
                        {viewingPayment.utr_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyUtr(viewingPayment.utr_number)}
                        className="px-2 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUtr ? 'Copied' : 'Copy UTR'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Submitted on: {formatDate(viewingPayment.submitted_at)}</span>
                  </div>
                </div>

                {/* Verification History Log */}
                {viewingPayment.verified_at && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified by: {viewingPayment.verified_by || 'Super Admin'}</span>
                    </div>
                    <div className="text-[10px] opacity-80">
                      Verified Date: {formatDate(viewingPayment.verified_at)}
                    </div>
                  </div>
                )}

                {viewingPayment.rejected_at && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>Rejected by: {viewingPayment.rejected_by || 'Super Admin'}</span>
                    </div>
                    <div className="text-[11px]">
                      Reason: <span className="font-semibold">{viewingPayment.rejection_reason}</span>
                    </div>
                    <div className="text-[10px] opacity-80">
                      Rejected Date: {formatDate(viewingPayment.rejected_at)}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Payment Screenshot Evidence View */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                  <span>Payment Screenshot Evidence</span>
                  <span className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline" onClick={() => setIsZoomedScreenshot(true)}>
                    Click to Enlarge
                  </span>
                </div>

                <div
                  onClick={() => setIsZoomedScreenshot(true)}
                  className="rounded-2xl border border-[var(--border-color)] bg-black/40 p-2 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden min-h-[260px]"
                >
                  <img
                    src={viewingPayment.payment_screenshot || '/phonepe-qr.png'}
                    alt="Payment Screenshot Proof"
                    className="max-h-72 w-auto object-contain rounded-xl transition-transform duration-200 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to Zoom Screenshot</span>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-muted)] text-center">
                  Verify the transaction amount (₹{viewingPayment.amount}) and UTR ({viewingPayment.utr_number}) match your Union Bank statement.
                </div>
              </div>

            </div>

            {/* 5. ACTION BUTTONS: VERIFY OR REJECT */}
            <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <button
                type="button"
                onClick={() => {
                  setViewingPayment(null);
                  setSelectedPaymentVerificationId(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                Close Details
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>❌ REJECT PAYMENT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmVerifyModalOpen(true)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ VERIFY PAYMENT</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. VERIFY CONFIRMATION DIALOG */}
      {confirmVerifyModalOpen && viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">Confirm Payment Verification</h4>
                <p className="text-xs text-[var(--text-secondary)]">Order #{viewingPayment.order_id}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              Are you sure you want to verify this payment of{' '}
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(viewingPayment.amount, currency)}
              </span>{' '}
              (UTR: <span className="font-mono font-bold">{viewingPayment.utr_number}</span>)?
            </p>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] space-y-1">
              <div>✓ Order status will change to <b>In Progress</b></div>
              <div>✓ Student will receive a verified payment receipt notification</div>
              <div>✓ Mentor will be alerted to begin development</div>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25"
              >
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. REJECT REASON DIALOG */}
      {rejectModalOpen && viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">Reject Payment Verification</h4>
                <p className="text-xs text-[var(--text-secondary)]">Order #{viewingPayment.order_id}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmRejection} className="space-y-3 text-xs">
              <label className="block font-semibold text-[var(--text-primary)]">
                Select Reason for Rejection * (Will be sent to student)
              </label>

              <div className="space-y-1.5">
                {[
                  'UTR could not be verified in bank statement',
                  'Incorrect payment amount transferred',
                  'Screenshot unclear or unreadable',
                  'Transaction not found in Union Bank account',
                  'Duplicate transaction ID entered'
                ].map(r => (
                  <label
                    key={r}
                    onClick={() => {
                      setRejectReason(r);
                      setCustomRejectReason('');
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      rejectReason === r && !customRejectReason
                        ? 'border-red-500 bg-red-500/10 font-semibold text-[var(--text-primary)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejection_reason"
                      checked={rejectReason === r && !customRejectReason}
                      onChange={() => setRejectReason(r)}
                      className="text-red-600"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-muted)] mb-1">
                  Or specify a custom message:
                </label>
                <input
                  type="text"
                  value={customRejectReason}
                  onChange={e => setCustomRejectReason(e.target.value)}
                  placeholder="e.g. Please send screenshot showing recipient UPI ID..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring text-xs"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ZOOMED SCREENSHOT FULL VIEW MODAL */}
      {isZoomedScreenshot && viewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                Student Payment Screenshot — Order #{viewingPayment.order_id} (UTR: {viewingPayment.utr_number})
              </h4>
              <button onClick={() => setIsZoomedScreenshot(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black/50 p-2 flex items-center justify-center">
              <img
                src={viewingPayment.payment_screenshot || '/phonepe-qr.png'}
                alt="Enlarged Proof"
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsZoomedScreenshot(false)}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
