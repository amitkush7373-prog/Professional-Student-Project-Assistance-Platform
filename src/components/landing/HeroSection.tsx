import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Presentation,
  Check,
  Star,
  PiggyBank,
  Clock,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuickEstimatorWidget } from './QuickEstimatorWidget';

export const HeroSection: React.FC = () => {
  const { setActiveView, setDraftSubmission } = useApp();

  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[var(--border-color)]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple. Affordable. Student-Friendly. • ₹100 MAXIMUM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.12]">
              College Projects{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                Made Simple.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Start with a Free Preview — Pay Only When You Need More. Affordable assistance (Max ₹100), 100% FREE college PPTs, code review, documentation, and viva prep.
            </p>

            {/* Trust Bullet Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              {[
                { label: 'College PPT — FREE', icon: Presentation },
                { label: 'Paid Tasks Up to ₹100 Max', icon: PiggyBank },
                { label: 'Free Project Preview', icon: ShieldCheck },
                { label: '100% Viva Ready Code', icon: Code2 },
                { label: 'On-Time Delivery', icon: Clock },
                { label: '3 Revisions Included', icon: CheckCircle2 }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-[11px]"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={() => setActiveView('submit')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Start with Free Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('ai-ppt-agent')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>⚡ Instant AI PPT Agent (FREE ₹0)</span>
              </button>
            </div>

            {/* Student Ratings Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[var(--text-primary)] ml-1">4.96/5 Rating</span>
              </div>
              <span>•</span>
              <span>2,400+ College Submissions Assisted</span>
            </div>

          </div>

          {/* Right Hero Estimator Widget (5 cols) */}
          <div className="lg:col-span-5">
            <QuickEstimatorWidget />
          </div>

        </div>
      </div>
    </div>
  );
};
