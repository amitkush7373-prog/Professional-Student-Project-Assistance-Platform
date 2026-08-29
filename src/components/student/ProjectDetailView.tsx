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
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectTrackerTimeline } from './ProjectTrackerTimeline';
import { ProjectChat } from './ProjectChat';
import { DeliverablesVault } from './DeliverablesVault';
import { ReviewModal } from './ReviewModal';
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
  const [revisionNotes, setRevisionNotes] = useState('');

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

  const statusBadge = getStatusBadge(project.status);
  const paymentBadge = getPaymentStatusBadge(project.paymentStatus);

  const handleOpenInvoice = () => {
    setActiveInvoiceProject(project);
    setIsInvoiceModalOpen(true);
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
            {project.paymentStatus === 'confirmed' ? (
              <button
                onClick={handleOpenInvoice}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Invoice & Receipt</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveView('checkout');
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Now ({formatCurrency(project.assessment.totalFinalPrice, currency)})</span>
              </button>
            )}

            {(project.status === 'completed' || project.status === 'download_available') && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{project.rating ? `Reviewed (${project.rating}★)` : 'Rate Mentor'}</span>
              </button>
            )}

            <button
              onClick={() => setIsRevisionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Request Revision</span>
            </button>
          </div>
        </div>

        {/* Project Master Card */}
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
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Investment</span>
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

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Required Functional Features ({project.requirement.requiredFeatures.length})
                </h3>
                <div className="space-y-1.5">
                  {project.requirement.requiredFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.files.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Submitted Reference Files ({project.files.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.files.map(f => (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="truncate font-semibold text-[var(--text-primary)]">{f.name}</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0">{f.sizeFormatted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.requirement.specialInstructions && (
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs space-y-1">
                  <span className="font-bold text-[var(--text-primary)]">Special Instructions:</span>
                  <p className="text-[var(--text-secondary)]">{project.requirement.specialInstructions}</p>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        project={project}
      />

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                <h4 className="text-base font-bold text-[var(--text-primary)]">Submit Revision Request</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRevision} className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Specify any adjustments requested by your college professor or changes needed in the code/report.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Revision Notes & Specific Changes *
                </label>
                <textarea
                  rows={5}
                  required
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  placeholder="Detail exact changes required (e.g. adjust learning rate graph, add chapter 4 UML sequence diagram, change database port to 5432)..."
                  className="w-full p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Relay to Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
