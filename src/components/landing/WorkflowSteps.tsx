import React from 'react';
import {
  FileText,
  Cpu,
  GitPullRequest,
  DownloadCloud,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkflowSteps: React.FC = () => {
  const { setActiveView } = useApp();

  const steps = [
    {
      number: '01',
      title: 'Submit Project Specs & Files',
      subtitle: 'Tell us your problem statement',
      description: 'Fill out our structured submission wizard. Upload requirement PDFs, datasets, existing code snippets, wireframes, or reference research papers.',
      icon: FileText,
      badge: 'Step 1: Input'
    },
    {
      number: '02',
      title: 'Smart Assessment & Pricing',
      subtitle: 'Transparent, zero-surprise quote',
      description: 'Our dynamic engine evaluates complexity, required tech stack, and deadline urgency to generate an itemized assessment and recommended roadmap.',
      icon: Cpu,
      badge: 'Step 2: Analysis'
    },
    {
      number: '03',
      title: 'Mentor Collaboration & Tracking',
      subtitle: '1-on-1 direct development chat',
      description: 'A verified domain engineer is matched to your project. Track development milestones via live countdown and exchange code snippets in real-time chat.',
      icon: GitPullRequest,
      badge: 'Step 3: Execution'
    },
    {
      number: '04',
      title: 'Download Deliverables & Viva Prep',
      subtitle: 'Complete verified package',
      description: 'Inspect deliverables in your secure vault. Download commented source code, IEEE SRS thesis reports, presentation slides, and live deployment links.',
      icon: DownloadCloud,
      badge: 'Step 4: Delivery'
    }
  ];

  return (
    <section className="w-full py-16 lg:py-24 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless 4-Stage Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            How ApexProject Works: From Submission to Defense
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            A transparent, stress-free methodology designed to ensure on-time project completion with complete technical understanding.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="interactive-card rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 opacity-90 font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] mb-2">
                    {step.badge}
                  </span>

                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>

                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center text-[11px] font-semibold text-emerald-500 gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Guaranteed Quality Check</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* CTA Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setActiveView('submit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <span>Start Step 1: Submit Your Requirement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
