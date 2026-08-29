import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  DownloadCloud,
  Layers,
  Sparkles,
  CreditCard,
  Star,
  RefreshCw,
  AlertCircle,
  FileCode,
  ShieldCheck,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  ZoomIn
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectTrackerTimeline } from './ProjectTrackerTimeline';
import { ProjectChat } from './ProjectChat';
import { DeliverablesVault } from './DeliverablesVault';
import { ReviewModal } from './ReviewModal';
import { PaymentGatewayModal } from '../checkout/PaymentGatewayModal';
import { getStatusBadge, getPaymentStatusBadge, formatCurrency, formatDate } from '../../utils/formatters';

export const ProjectDetailView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setActiveView,
    currency,
    setIsInvoiceModalOpen,
    setActiveInvoiceProject,
    requestRevision,
    addToast
  } = useApp();

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState<'timeline' | 'chat' | 'deliverables' | 'requirements'>('timeline');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isZoomedScreenshot, setIsZoomedScreenshot] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-blue-500" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Project Not Found</h3>
        <button
          onClick={() => setActiveView('student-dashboard')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isVerified = project.paymentStatus === 'verified' || project.paymentStatus === 'confirmed';
  const isPendingVerification = project.paymentStatus === 'verification_pending';
  const isRejected = project.paymentStatus === 'rejected';
  const isUnpaid = project.paymentStatus === 'pending';

  const statusBadge = getStatusBadge(project.status);
  const paymentBadge = getPaymentStatusBadge(project.paymentStatus);

  const handleOpenInvoice = () => {
    setActiveInvoiceProject(project);
    setIsInvoiceModalOpen(true);
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    addToast('UTR Copied', `Copied ${utr} to clipboard.`, 'info');
    setTimeout(() => setCopiedUtr(false), 3000);
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;

    requestRevision(project.id, revisionNotes.trim());
    setIsRevisionModalOpen(false);
    setRevisionNotes('');
  };

  return (
    <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setActiveView('student-dashboard');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </button>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {isVerified ? (
              <button
                onClick={handleOpenInvoice}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Invoice & Receipt</span>
              </button>
            ) : isRejected || isUnpaid ? (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isRejected ? 'Re-upload Payment Proof' : `Pay Now (${formatCurrency(project.assessment.totalFinalPrice, currency)})`}</span>
              </button>
            ) : null}

            {(project.status === 'completed' || project.status === 'download_available') && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{project.rating ? `Reviewed (${project.rating}★)` : 'Rate Mentor'}</span>
              </button>
            )}

            {isVerified && (
              <button
                onClick={() => setIsRevisionModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Revision</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Master Info Card */}
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {project.orderNumber}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                  {statusBadge.label}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentBadge.bg}`}>
                  {paymentBadge.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {project.requirement.title}
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Assigned Mentor: <span className="font-bold text-[var(--text-primary)]">{project.assignedExpertName || 'Technical Matching in Progress'}</span> • Target Deadline: {formatDate(project.deadlineDate)}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-3 lg:pt-0 lg:pl-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Amount</span>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                  {formatCurrency(project.assessment.totalFinalPrice, currency)}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Progress</span>
                <div className="text-lg font-black text-emerald-500 font-mono">
                  {project.progress}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💳 EXPLICIT PAYMENT STATUS SECTION */}
        {isPendingVerification && (
          <div className="p-5 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm text-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-amber-950 dark:text-amber-200">
                    Payment Status: 🟡 VERIFICATION PENDING
                  </span>
                  {project.paymentSubmittedAt && (
                    <span className="text-[10px] text-amber-800 dark:text-amber-300">
                      Submitted on {formatDate(project.paymentSubmittedAt)}
                    </span>
                  )}
                </div>
                <p className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                  Your payment of <span className="font-mono font-bold">{formatCurrency(project.assessment.totalFinalPrice, currency)}</span> with UTR <span className="font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">{project.utrNumber || 'N/A'}</span> has been received and is currently being verified against our bank statement. Development will start as soon as verified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {project.paymentProofUrl && (
                <button
                  type="button"
                  onClick={() => setIsZoomedScreenshot(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>View Proof</span>
                </button>
              )}
            </div>
          </div>
        )}

        {isVerified && (
          <div className="p-5 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  Payment Status: 🟢 VERIFIED
                </div>
                <div className="text-emerald-800 dark:text-emerald-300 text-xs">
                  Verified on {project.paymentVerifiedAt ? formatDate(project.paymentVerifiedAt) : 'Recently'} by {project.paymentVerifiedBy || 'Admin'}. Project is actively in progress.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenInvoice}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Download Tax Invoice</span>
            </button>
          </div>
        )}

        {isRejected && (
          <div className="p-5 rounded-3xl bg-red-500/15 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm text-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-red-950 dark:text-red-200">
                  Payment Status: 🔴 REJECTED
                </div>
                <div className="text-red-900 dark:text-red-200 text-xs leading-relaxed">
                  <b>Reason:</b> {project.paymentRejectedReason || 'UTR could not be verified in bank statement.'}
                </div>
                <div className="text-[11px] text-red-800 dark:text-red-300">
                  Please check your transaction statement and re-upload the valid UPI payment proof and 12-digit UTR.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all shrink-0 w-full sm:w-auto justify-center"
            >
              <CreditCard className="w-4 h-4" />
              <span>Re-upload Proof</span>
            </button>
          </div>
        )}

        {isUnpaid && (
          <div className="p-5 rounded-3xl bg-blue-500/15 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  Payment Status: ⚪ PAYMENT PENDING
                </div>
                <div className="text-[var(--text-secondary)] text-xs">
                  Scan the PhonePe UPI QR code ({formatCurrency(project.assessment.totalFinalPrice, currency)}) to submit your verification details.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all shrink-0 w-full sm:w-auto justify-center"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Now via UPI QR</span>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[var(--border-color)] gap-2 overflow-x-auto">
          {[
            { id: 'timeline', label: 'Milestone Tracker', icon: Clock },
            { id: 'chat', label: 'Direct Mentor Chat', icon: MessageSquare },
            { id: 'deliverables', label: 'Deliverables Vault', icon: DownloadCloud },
            { id: 'requirements', label: 'Requirement Specifications', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div>
          {activeTab === 'timeline' && <ProjectTrackerTimeline project={project} />}
          {activeTab === 'chat' && <ProjectChat project={project} />}
          {activeTab === 'deliverables' && (
            <DeliverablesVault
              project={project}
              onRequestRevision={() => setIsRevisionModalOpen(true)}
            />
          )}
          {activeTab === 'requirements' && (
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-[var(--border-color)] space-y-6">
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Problem Statement
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                  {project.requirement.problemStatement}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Required Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.requirement.technologies.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {project.files && project.files.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Submitted Files & Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.files.map(file => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="truncate font-semibold text-[var(--text-primary)]">
                            {file.name}
                          </div>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                          {file.sizeFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          project={project}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-lg w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Request Project Revision
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Specify what needs adjustment in the codebase, presentation slides, or project documentation.
            </p>

            <form onSubmit={handleSendRevision} className="space-y-4">
              <textarea
                required
                rows={4}
                value={revisionNotes}
                onChange={e => setRevisionNotes(e.target.value)}
                placeholder="Explain the changes requested by your professor or review panel..."
                className="w-full p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal (for Pay Now / Re-submit) */}
      {isPaymentModalOpen && (
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          project={project}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
          }}
        />
      )}

      {/* Zoomed Screenshot View */}
      {isZoomedScreenshot && project.paymentProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-150">
          <div className="max-w-xl w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                Submitted Payment Proof — {project.orderNumber}
              </h4>
              <button onClick={() => setIsZoomedScreenshot(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>
            <div className="p-2 bg-black/50 rounded-2xl flex items-center justify-center">
              <img
                src={project.paymentProofUrl}
                alt="Submitted Proof"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
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
