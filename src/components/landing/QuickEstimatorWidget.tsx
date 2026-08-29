import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  GraduationCap,
  Presentation,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CollegeServiceType, CollegeProjectLevel, UrgencyLevel, PPTTier } from '../../types';
import { evaluateProjectRequirements } from '../../utils/pricingEngine';
import { formatCurrency } from '../../utils/formatters';

export const QuickEstimatorWidget: React.FC = () => {
  const { setActiveView, setDraftSubmission, currency } = useApp();

  const [service, setService] = useState<CollegeServiceType>('college-project');
  const [level, setLevel] = useState<CollegeProjectLevel>('basic');
  const [pptTier, setPptTier] = useState<PPTTier>('8_10_slides');
  const [urgency, setUrgency] = useState<UrgencyLevel>('standard');
  const [withPpt, setWithPpt] = useState(false);

  const assessment = evaluateProjectRequirements({
    serviceType: service,
    projectLevel: level,
    pptSlideCount: pptTier,
    needsPPT: withPpt,
    urgency
  });

  const handleStartWithEstimate = () => {
    setDraftSubmission({
      serviceType: service,
      projectLevel: level,
      pptSlideCount: pptTier,
      needsPPT: withPpt,
      urgency
    });
    setActiveView('submit');
  };

  return (
    <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Instant Student Price Estimator
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">Priced between ₹30 and ₹100 MAX</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Zero Hidden Fees
        </span>
      </div>

      {/* Service Selector */}
      <div className="space-y-1.5 text-xs">
        <label className="block font-semibold text-[var(--text-primary)]">Service Required</label>
        <select
          value={service}
          onChange={e => setService(e.target.value as CollegeServiceType)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
        >
          <option value="college-project">🎓 College Project (1st/2nd/3rd/Final Year)</option>
          <option value="ppt-presentation">📑 College PPT / Presentation (100% FREE ₹0)</option>
          <option value="project-review">📝 Project Review & Error Audit (from ₹30)</option>
          <option value="data-science">📊 Data Science / Python Analysis</option>
          <option value="ai-ml">🤖 AI / Machine Learning Mini Project</option>
          <option value="technical-help">💻 Coding & Debugging Assistance</option>
        </select>
      </div>

      {/* Conditional Sub-selectors */}
      {service === 'college-project' && (
        <div className="space-y-1.5 text-xs">
          <label className="block font-semibold text-[var(--text-primary)]">Project Level</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'basic' as CollegeProjectLevel, label: '1st Year / Basic' },
              { id: 'mini' as CollegeProjectLevel, label: 'Mini Project' },
              { id: 'major' as CollegeProjectLevel, label: 'Major Project' }
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all ${
                  level === l.id
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {service === 'ppt-presentation' && (
        <div className="space-y-1.5 text-xs">
          <label className="block font-semibold text-[var(--text-primary)]">Number of Slides</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: '5_7_slides' as PPTTier, label: '5–7 Slides (FREE)' },
              { id: '8_10_slides' as PPTTier, label: '8–10 Slides (FREE)' },
              { id: '11_15_slides' as PPTTier, label: '11–15 Slides (₹30)' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPptTier(s.id)}
                className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all ${
                  pptTier === s.id
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Deadline */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <label className="font-semibold text-[var(--text-primary)]">Target Deadline</label>
          <span className="text-[10px] text-emerald-500 font-semibold">More time = Lower price</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'standard' as UrgencyLevel, label: '7+ Days' },
            { id: 'priority' as UrgencyLevel, label: '4–6 Days' },
            { id: 'urgent' as UrgencyLevel, label: '2–3 Days' },
            { id: 'same-day' as UrgencyLevel, label: '1 Day' }
          ].map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUrgency(u.id)}
              className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                urgency === u.id
                  ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Total Box */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 border border-blue-500/25 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Estimated Investment</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {assessment.totalFinalPrice === 0 ? 'FREE (₹0)' : formatCurrency(assessment.totalFinalPrice, currency)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleStartWithEstimate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <span>{assessment.totalFinalPrice === 0 ? 'Get Free PPT' : 'Start Project'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
