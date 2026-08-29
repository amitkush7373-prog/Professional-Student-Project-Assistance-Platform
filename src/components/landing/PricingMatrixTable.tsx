import React from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PiggyBank,
  Clock,
  Presentation,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const PricingMatrixTable: React.FC = () => {
  const { currency, setActiveView, setDraftSubmission } = useApp();

  const pricingTiers = [
    {
      id: 'ppt',
      title: 'College Presentation PPT',
      tagline: '5–15 formatted presentation slides for semester seminar & viva',
      standardPrice: 100,
      priorityPrice: 150,
      urgentPrice: 200,
      sameDayPrice: 250,
      features: [
        '5–15 clean formatted PowerPoint slides (.pptx)',
        'Key bullet points, diagrams & summary tables',
        'Academic standard 16:9 widescreen layout',
        'Speaker talking points & viva notes',
        '3 Free revisions included'
      ],
      popular: false,
      badgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      actionService: 'ppt-presentation'
    },
    {
      id: 'basic',
      title: 'Basic 1st-Year Project',
      tagline: 'Simple college assignments, C/Java/Python tasks & basic web',
      standardPrice: 200,
      priorityPrice: 250,
      urgentPrice: 350,
      sameDayPrice: 450,
      features: [
        'Complete working source code & clean folders',
        'Step-by-step setup & execution guide (README)',
        'Up to 2 core functional modules',
        'Clean, commented & beginner-friendly code',
        '3 Free revisions included'
      ],
      popular: false,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      actionService: 'college-project'
    },
    {
      id: 'mini',
      title: 'College Mini Project',
      tagline: 'Standard semester mini project (Python, Web, ML, Data Science)',
      standardPrice: 300,
      priorityPrice: 350,
      urgentPrice: 450,
      sameDayPrice: 550,
      features: [
        'Full functional codebase (Frontend + Backend + DB)',
        'Clean dataset analysis / ML pipeline / GUI application',
        'Execution walkthrough and setup assistance',
        'Optional 8-slide PPT & project report add-ons',
        '3 Free revisions included'
      ],
      popular: true,
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      actionService: 'college-project'
    },
    {
      id: 'major',
      title: 'Major / Capstone Project',
      tagline: 'Larger multi-module project (AI/ML, Full-Stack, IoT, Cloud)',
      standardPrice: 400,
      priorityPrice: 450,
      urgentPrice: 550,
      sameDayPrice: 700,
      features: [
        'Production-quality multi-module project code',
        'Interactive dashboard / live web interface',
        'Comprehensive documentation & viva prep notes',
        'Priority verified mentor support',
        'Strictly capped at ₹700 maximum'
      ],
      popular: false,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      actionService: 'college-project'
    }
  ];

  const handleSelectTier = (serviceType: string) => {
    setDraftSubmission({
      serviceType
    });
    setActiveView('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-[var(--bg-primary)] relative overflow-hidden border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Built for Students, Priced for Students</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Transparent Pricing Matrix (₹100 – ₹700 Max)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Services starting from ₹100 • Standard projects up to ₹700 • No surprise pricing or high charges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map(tier => (
            <div
              key={tier.id}
              className={`rounded-3xl glass-panel border p-6 flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                tier.popular
                  ? 'border-emerald-500/50 shadow-2xl ring-1 ring-emerald-500/30'
                  : 'border-[var(--border-color)] hover:border-blue-500/40 hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold shadow-md uppercase tracking-wider">
                  Most Popular for Colleges
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                    {tier.title}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] pt-1 min-h-[32px] leading-tight">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1 text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Starting From (7+ Days)</div>
                  <div className="text-3xl font-black text-[var(--text-primary)] font-mono">
                    {formatCurrency(tier.standardPrice, currency)}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-semibold">
                    1 Day Express: {formatCurrency(tier.sameDayPrice, currency)}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)] text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectTier(tier.actionService)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  tier.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:scale-102'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-102'
                }`}
              >
                <span>Select & Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>

        {/* Dynamic Deadline Savings Guarantee Footer */}
        <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-[var(--text-primary)]">Student Deadline Savings Guarantee</div>
              <div className="text-[var(--text-muted)] text-[11px]">
                Submit your project early (7+ days) to automatically receive our lowest baseline price.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('submit')}
            className="px-5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] border border-[var(--border-color)] font-bold text-[var(--text-primary)] shrink-0 transition-colors"
          >
            Calculate Exact Price
          </button>
        </div>

      </div>
    </section>
  );
};
