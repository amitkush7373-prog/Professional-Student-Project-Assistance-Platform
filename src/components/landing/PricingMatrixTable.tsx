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
      badgeText: 'College PPT — FREE (₹0)',
      tagline: '5–10 formatted presentation slides for semester seminars & viva',
      standardPrice: 0,
      priorityPrice: 0,
      urgentPrice: 0,
      sameDayPrice: 0,
      isFree: true,
      priceLabel: 'FREE (₹0)',
      features: [
        '5–10 formatted PowerPoint slides (.pptx)',
        'Key bullet points, diagrams & summaries',
        'Academic standard 16:9 widescreen layout',
        'Viva speaker notes & outline',
        '100% Free for College Students'
      ],
      popular: true,
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      actionService: 'ppt-presentation'
    },
    {
      id: 'very_small',
      title: 'Very Small Task / Bug Fix',
      badgeText: '₹30 Level',
      tagline: 'Minor bug resolution, quick syntax fix, or small script edits',
      standardPrice: 30,
      priorityPrice: 30,
      urgentPrice: 30,
      sameDayPrice: 30,
      isFree: false,
      priceLabel: '₹30',
      features: [
        'Single bug or minor logic correction',
        'Code formatting and linting cleanup',
        'Quick explanation of the fix',
        'Verified working code output',
        'Fast turnaround assistance'
      ],
      popular: false,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      actionService: 'technical-help'
    },
    {
      id: 'basic',
      title: 'Small Task / Basic Assignment',
      badgeText: '₹50 Level',
      tagline: 'Simple 1st/2nd year assignments, Python/Java scripts & basic tasks',
      standardPrice: 50,
      priorityPrice: 50,
      urgentPrice: 50,
      sameDayPrice: 50,
      isFree: false,
      priceLabel: '₹50',
      features: [
        'Complete working source code & clean folders',
        'Step-by-step setup guide (README)',
        'Up to 2 core functional modules',
        'Clean, commented & beginner-friendly code',
        '3 Free revisions included'
      ],
      popular: false,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      actionService: 'college-project'
    },
    {
      id: 'mini',
      title: 'Medium Task / Mini Project',
      badgeText: '₹80 Level',
      tagline: 'Standard semester mini project (Python, Web, ML, Data Science)',
      standardPrice: 80,
      priorityPrice: 80,
      urgentPrice: 80,
      sameDayPrice: 80,
      isFree: false,
      priceLabel: '₹80',
      features: [
        'Full functional codebase (Frontend + Backend + DB)',
        'Clean dataset analysis / ML pipeline / GUI application',
        'Execution walkthrough and setup assistance',
        'Free 5–10 slide college PPT included',
        '3 Free revisions included'
      ],
      popular: false,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      actionService: 'college-project'
    },
    {
      id: 'major',
      title: 'More Involved Task / Capstone',
      badgeText: '₹100 MAXIMUM',
      tagline: 'Comprehensive multi-module academic project or final-year task',
      standardPrice: 100,
      priorityPrice: 100,
      urgentPrice: 100,
      sameDayPrice: 100,
      isFree: false,
      priceLabel: '₹100 MAX',
      features: [
        'Full multi-module project code & structure',
        'Interactive web interface / dashboard / API',
        'Comprehensive documentation & viva prep notes',
        'Strictly capped at ₹100 MAXIMUM',
        'Priority verified mentor review'
      ],
      popular: false,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
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
            <span>Simple. Affordable. Student-Friendly.</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Clear Student Price Levels (₹30, ₹50, ₹80, ₹100 MAX)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Start with a Free Preview — Pay Only When You Need More. Basic College PPT is 100% FREE (₹0). Highest normal price is strictly ₹100 MAX.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {pricingTiers.map(tier => (
            <div
              key={tier.id}
              className={`rounded-3xl glass-panel border p-5 flex flex-col justify-between space-y-5 transition-all duration-300 relative ${
                tier.popular
                  ? 'border-emerald-500/50 shadow-2xl ring-1 ring-emerald-500/30'
                  : 'border-[var(--border-color)] hover:border-blue-500/40 hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold shadow-md uppercase tracking-wider whitespace-nowrap">
                  100% Free Service
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                    {tier.badgeText}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] pt-1">
                    {tier.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] leading-tight min-h-[30px]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-0.5 text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Investment</div>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {tier.priceLabel}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-semibold">
                    {tier.isFree ? '100% Free (₹0)' : 'Affordable College Rate'}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-1.5 text-xs pt-1">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[var(--text-secondary)] text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectTier(tier.actionService)}
                className={`w-full py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  tier.isFree
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:scale-102'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-102'
                }`}
              >
                <span>{tier.isFree ? 'Get Free PPT' : 'Select Service'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
              <div className="font-bold text-[var(--text-primary)]">Start with a Free Preview — Pay Only When You Need More</div>
              <div className="text-[var(--text-muted)] text-[11px]">
                Upload your files to get an instant verification preview. Only pay if you need source code, report or assistance (strictly below ₹100).
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveView('submit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shrink-0 hover:bg-blue-700 transition-colors"
          >
            Start Free Preview
          </button>
        </div>

      </div>
    </section>
  );
};
