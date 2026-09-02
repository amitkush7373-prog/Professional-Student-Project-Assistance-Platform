import React from 'react';
import {
  ShieldAlert,
  FileText,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Scale,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LegalPages: React.FC = () => {
  const { legalTab, setLegalTab } = useApp();

  return (
    <div className="w-full py-10 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Trust, Compliance & Legal Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Policies & Ethical Guidance Standards
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            ApexProject operates with full transparency and adherence to academic ethical codes and data privacy statutes.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center border-b border-[var(--border-color)] gap-2 flex-wrap pb-2">
          {[
            { id: 'integrity', label: 'Academic Integrity Code', icon: ShieldAlert },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'privacy', label: 'Privacy & Data Policy', icon: Lock },
            { id: 'refund', label: 'Refund & Escrow Policy', icon: RotateCcw }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setLegalTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  legalTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Document Body */}
        <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-12 space-y-8 shadow-xl text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          
          {/* TAB 1: ACADEMIC INTEGRITY CODE */}
          {legalTab === 'integrity' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section 1.0</span>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Academic Integrity & Ethical Guidance Code</h2>
                <p className="text-xs text-[var(--text-muted)]">Last Updated: August 2026</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Important Scholar Notice</span>
                </div>
                <p className="text-xs">
                  ApexProject is designed to facilitate technical tutoring, algorithmic comprehension, error fixing, and reference engineering models. We do not encourage, condone, or support the academic misrepresentation of another party's work.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">1. Purpose of Assistance</h3>
                <p>
                  Engineering projects in higher education require mastery across multiple disciplines including cloud infrastructure, database normalization, system design, and specialized AI algorithms. ApexProject mentors act as technical advisors and senior pair-programmers to assist students in:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Resolving complex architectural bottlenecks, runtime crashes, and compiler errors.</li>
                  <li>Understanding mathematical formulations (e.g. Convolutional networks, Backpropagation, Gradient Descent).</li>
                  <li>Structuring IEEE-standard reports, system diagrams, and data flow charts.</li>
                  <li>Preparing for academic Viva examinations, thesis defense, and presentation rehearsals.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">2. Student Ownership & Responsibility</h3>
                <p>
                  Every student who receives project deliverables or reference repositories is strongly urged to run the code, examine the documented docstrings, review the provided README instructions, and master the theoretical mechanics. Students remain solely responsible for understanding and complying with their institution's specific academic-integrity rules and honor codes.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">3. Plagiarism & Originality Guarantee</h3>
                <p>
                  All documentation reports, thesis chapters, and source code generated through ApexProject are written from scratch and audited for original authorship. We strictly forbid the replication or redistribution of copyrighted third-party student submissions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {legalTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section 2.0</span>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Terms of Service & Platform User Agreement</h2>
                <p className="text-xs text-[var(--text-muted)]">Effective: 2026-2027 Academic Cycle</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">1. Acceptance of Terms</h3>
                <p>
                  By creating an account, submitting a project requirement, or making a payment on ApexProject, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">2. Service Scope & Deliverables</h3>
                <p>
                  ApexProject provides custom technical mentorship and engineering assistance as scoped in the project assessment sheet. Deliverables include commented source code, setup instructions, and optional selected add-ons (such as IEEE documentation, cloud deployment, and presentation decks).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">3. Intellectual Property Rights</h3>
                <p>
                  Upon final payment confirmation and deliverable hand-over, the student is granted full, royalty-free, perpetual rights to use, modify, and reference the source code for academic and educational purposes.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {legalTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section 3.0</span>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Privacy & Non-Disclosure Policy</h2>
                <p className="text-xs text-[var(--text-muted)]">Data Security & Confidentiality Charter</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">1. Confidentiality of Requirements</h3>
                <p>
                  We treat all uploaded datasets, problem statement documents, university guidelines, and student contact details with strict confidentiality. Your project specifications will never be published, resold, or indexed publicly.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">2. Encryption & Payment Security</h3>
                <p>
                  All project messages, file attachments, and payment authorizations are secured using 256-bit TLS encryption. Sensitive card data and bank credentials are never stored on our servers and are processed strictly through authorized payment gateways.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REFUND & ESCROW */}
          {legalTab === 'refund' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section 4.0</span>
                <h2 className="text-xl font-black text-[var(--text-primary)]">Refund & Escrow Protection Policy</h2>
                <p className="text-xs text-[var(--text-muted)]">Milestone & Escrow Release Policy</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">1. Escrow Milestone Security</h3>
                <p>
                  When you make a payment for an order, your funds are placed in a secure escrow buffer. The mentor is paid only after the verified deliverables have been generated and reviewed.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">2. Free Revision Guarantee</h3>
                <p>
                  If the deliverable requires modifications or if your college professor asks for minor adjustments within the original scope, your assigned expert will make the necessary revisions free of charge.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">3. Refund Eligibility</h3>
                <p>
                  In the rare event that a project cannot be completed within the agreed deadline or if deliverables fundamentally deviate from the submitted specifications, students are eligible for a 100% full refund credited to their original payment source.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
