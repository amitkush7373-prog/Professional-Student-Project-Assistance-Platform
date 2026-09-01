import React from 'react';
import {
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ProjectAssessmentReview: React.FC = () => {
  const {
    pendingCheckoutProject,
    currency,
    submitNewProject,
    setActiveView,
    addToast
  } = useApp();

  if (!pendingCheckoutProject) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">No Project in Assessment Queue</h3>
        <p className="text-xs text-[var(--text-secondary)]">Please submit your project requirements through our submission wizard first.</p>
        <button
          onClick={() => setActiveView('submit')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
        >
          Start New Project
        </button>
      </div>
    );
  }

  const { requirement, assessment, complexity, selectedUrgency, selectedAddons, deadlineDate, files } = pendingCheckoutProject;

  const handleProceedToCheckout = () => {
    // Save project into store
    const savedProject = submitNewProject(pendingCheckoutProject);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestManualReview = () => {
    const savedProject = submitNewProject({
      ...pendingCheckoutProject,
      status: 'under_review'
    });
    addToast('Manual Review Requested', 'Our technical board will review your requirements and notify you within 2 hours.', 'info');
    setActiveView('student-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-10 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Checkout Architectural Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Project Assessment & Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Review the technical evaluation, mentor effort scope, deliverables checklist, and verified investment quote.
          </p>
        </div>

        {/* Main Assessment Container */}
        <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Top Banner: Project Title & Student Meta */}
          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400">
                {requirement.category.toUpperCase()}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1">
                {requirement.title}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {requirement.studentName} • {requirement.college} • {requirement.courseBranch} ({requirement.semester})
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ready for Checkout
            </span>
          </div>

          {/* Assessment Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Complexity Tier</div>
              <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 capitalize">
                {assessment.estimatedComplexity} Scope
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Evaluated by Engine</div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Estimated Effort</div>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                ~{assessment.estimatedEffortHours} Hours
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Senior Mentor Compute</div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">AI Delivery Time</div>
              <div className="text-base font-extrabold text-purple-600 dark:text-purple-400">
                {assessment.estimatedDeliveryText || '~25 minutes'}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Max 12 hours turnaround</div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Mentor Tier</div>
              <div className="text-base font-extrabold text-amber-500 truncate" title={assessment.assignedExpertTier}>
                {assessment.assignedExpertTier.split(' ')[0]} Specialist
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Verified Industry Lead</div>
            </div>

          </div>

          {/* Evaluation Rationale */}
          <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-1.5">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Evaluation Rationale</span>
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {assessment.rationale}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Guaranteed Deliverables in this Package ({assessment.deliverablesList.length} items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {assessment.deliverablesList.map((deliv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-start gap-2.5 text-xs text-[var(--text-primary)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{deliv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Price Breakdown Sheet */}
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2">
              Transparent Investment Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Base Tier Fee ({assessment.estimatedComplexity.toUpperCase()} Project Architecture):</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(assessment.basePrice, currency)}</span>
              </div>

              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Category Domain Fee ({requirement.category}):</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">+{formatCurrency(assessment.complexityFee, currency)}</span>
              </div>

              {assessment.techFee > 0 && (
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Specialized Tech Stack ({requirement.technologies.join(', ')}):</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">+{formatCurrency(assessment.techFee, currency)}</span>
                </div>
              )}

              {assessment.urgencyFee > 0 && (
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Urgency Premium Multiplier ({selectedUrgency.toUpperCase()} - {formatDate(deadlineDate)}):</span>
                  <span className="font-mono font-semibold text-amber-500">+{formatCurrency(assessment.urgencyFee, currency)}</span>
                </div>
              )}

              {assessment.addOnsTotal > 0 && (
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Selected Academic Add-ons ({selectedAddons.filter(a => a.isSelected).map(a => a.title).join(', ')}):</span>
                  <span className="font-mono font-semibold text-blue-500">+{formatCurrency(assessment.addOnsTotal, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-2">
                <span>GST Tax (18% Statutory Output Tax):</span>
                <span className="font-mono font-semibold text-[var(--text-muted)]">{formatCurrency(assessment.taxAmount, currency)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-[var(--text-primary)] border-t border-[var(--border-color)] pt-3">
                <span>Total Investment (Escrow Protected):</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {formatCurrency(assessment.totalFinalPrice, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-color)]">
            <button
              onClick={() => setActiveView('submit')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Requirements</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleRequestManualReview}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all"
              >
                Request Manual Admin Review
              </button>

              <button
                onClick={handleProceedToCheckout}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Proceed to Secure Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
