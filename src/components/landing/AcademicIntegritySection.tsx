import React from 'react';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AcademicIntegritySection: React.FC = () => {
  const { setActiveView, setLegalTab } = useApp();

  const handleOpenIntegrityCode = () => {
    setLegalTab('integrity');
    setActiveView('legal-integrity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-16 lg:py-20 border-t border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/10 via-[var(--bg-surface)] to-cyan-900/10 p-8 sm:p-12 relative overflow-hidden shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Academic Integrity Code & Ethics Charter</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Empowering True Understanding, Not Just Deliverables
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                ApexProject is dedicated to legitimate academic mentorship, tutoring, debugging, and engineering assistance. We empower scholars to understand the core logic, design choices, and mathematical algorithms behind their projects so they can confidently defend their work in university viva and exams.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>1-on-1 Concept Tutoring & Walkthroughs</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Transparent Reference Source Code & Diagrams</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Original, Plagiarism-Free SRS Documentation</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Examiner Defense & Viva Question Practice</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleOpenIntegrityCode}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                >
                  <span>Read Full Honor Code & Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right Card: Scholar Responsibility Callout */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Student Responsibility Notice
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">University Institutional Compliance</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Students remain responsible for complying with their institution's specific academic policies. We encourage all scholars to actively test, modify, and master the architecture provided by their mentor before submitting for final grade evaluation.
              </p>

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono">
                "Honesty, rigorous comprehension, and ethical mentorship form the bedrock of true engineering."
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
