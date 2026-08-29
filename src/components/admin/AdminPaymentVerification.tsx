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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { formatCurrency, formatDate, getPaymentStatusBadge } from '../../utils/formatters';

export const AdminPaymentVerification: React.FC = () => {
  const { projects, verifyPayment, currency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  // Screenshot modal preview
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Reject modal state
  const [rejectingProject, setRejectingProject] = useState<Project | null>(null);
  const [rejectReason, setRejectReason] = useState('Screenshot / UTR number could not be verified in bank statement.');

  const pendingPayments = projects.filter(p => p.paymentStatus === 'verification_pending');
  const verifiedPayments = projects.filter(p => p.paymentStatus === 'confirmed');
  const rejectedPayments = projects.filter(p => p.paymentStatus === 'rejected');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.utrNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch && (p.paymentStatus === 'verification_pending' || p.paymentStatus === 'confirmed' || p.paymentStatus === 'rejected');
    if (filter === 'pending') return matchesSearch && p.paymentStatus === 'verification_pending';
    if (filter === 'verified') return matchesSearch && p.paymentStatus === 'confirmed';
    if (filter === 'rejected') return matchesSearch && p.paymentStatus === 'rejected';
    return matchesSearch;
  });

  const handleApprove = (projectId: string) => {
    verifyPayment(projectId, true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingProject) return;

    verifyPayment(rejectingProject.id, false, rejectReason);
    setRejectingProject(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-1">
          <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center justify-between">
            <span>Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {pendingPayments.length} Orders
          </div>
          <div className="text-[10px] text-amber-800 dark:text-amber-400">Needs admin approval</div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
            <span>Verified & In Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {verifiedPayments.length} Orders
          </div>
          <div className="text-[10px] text-emerald-800 dark:text-emerald-400">Payment approved</div>
        </div>

        <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/10 space-y-1">
          <div className="text-xs font-semibold text-red-900 dark:text-red-300 flex items-center justify-between">
            <span>Rejected / Clarification Needed</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">
            {rejectedPayments.length} Orders
          </div>
          <div className="text-[10px] text-red-800 dark:text-red-400">Student notified</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `All Payments (${projects.length})` },
            { id: 'pending', label: `Pending Approval (${pendingPayments.length})` },
            { id: 'verified', label: `Verified (${verifiedPayments.length})` },
            { id: 'rejected', label: `Rejected (${rejectedPayments.length})` }
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search order ID, student or UTR..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
          />
        </div>
      </div>

      {/* Payments Verification Table */}
      <div className="rounded-2xl glass-panel border border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Student Details</th>
                <th className="p-4">UTR / Transaction ID</th>
                <th className="p-4">Payment Screenshot</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Verification Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredProjects.map(p => {
                const isPending = p.paymentStatus === 'verification_pending';
                const isConfirmed = p.paymentStatus === 'confirmed';
                const isRejected = p.paymentStatus === 'rejected';

                return (
                  <tr key={p.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    
                    {/* Order ID */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{p.orderNumber}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{formatDate(p.createdAt)}</div>
                    </td>

                    {/* Student */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-[var(--text-primary)]">{p.requirement.studentName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{p.requirement.college}</div>
                    </td>

                    {/* UTR */}
                    <td className="p-4">
                      {p.utrNumber ? (
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]">
                          {p.utrNumber}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)]">Online / Simulated</span>
                      )}
                    </td>

                    {/* Screenshot Preview Thumbnail */}
                    <td className="p-4">
                      {p.paymentProofUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshotUrl(p.paymentProofUrl || null)}
                          className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          <img
                            src={p.paymentProofUrl}
                            alt="Proof thumbnail"
                            className="w-9 h-9 rounded-lg object-cover border border-[var(--border-color)]"
                          />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)]">No file attached</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-mono font-black text-sm text-[var(--text-primary)]">
                      {formatCurrency(p.assessment.totalFinalPrice, currency)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {isPending && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          🟡 Pending Approval
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          🟢 Payment Verified
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                          🔴 Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => setRejectingProject(p)}
                              className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)]">Verified</span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Enlarge Modal */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)]">Student Payment Screenshot Proof</h4>
              <button onClick={() => setPreviewScreenshotUrl(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black/50 p-1 flex items-center justify-center">
              <img src={previewScreenshotUrl} alt="Enlarged Proof" className="max-h-80 w-auto object-contain rounded-xl" />
            </div>

            <div className="text-center">
              <button
                onClick={() => setPreviewScreenshotUrl(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-red-500">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Reject Payment Verification</h4>
              </div>
              <button onClick={() => setRejectingProject(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="font-bold text-[var(--text-primary)]">{rejectingProject.requirement.title}</div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Student: {rejectingProject.requirement.studentName} • UTR: {rejectingProject.utrNumber || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Reason for Rejection * (Will be notified to student)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Specify why payment was rejected..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingProject(null)}
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

    </div>
  );
};
