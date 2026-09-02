import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  PiggyBank,
  CheckCircle2,
  Lock,
  Sliders,
  Presentation,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PricingConfig } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminPricingConfig: React.FC = () => {
  const { pricingConfig, updatePricingConfig, resetPricingConfig, currency } = useApp();

  const [config, setConfig] = useState<PricingConfig>(pricingConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig(config);
  };

  const handleReset = () => {
    resetPricingConfig();
    setConfig(pricingConfig);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Student-Friendly Pricing Control Matrix (Max ₹100)</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Configure base project prices (₹30–₹100), Free PPT rates (₹0), and the strict maximum price ceiling (₹100 HARD CAP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Pricing Matrix</span>
          </button>
        </div>
      </div>

      {/* Global Student Maximum Budget Ceiling */}
      <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Absolute Maximum Price Limit (Hard Cap: ₹100 MAXIMUM)
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                All platform services (Project + PPT + Docs + Review + Priority) are strictly clamped below this budget ceiling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-primary)]">Max Cap:</span>
            <div className="relative w-32">
              <span className="absolute left-3 top-2 text-xs font-bold text-[var(--text-muted)]">₹</span>
              <input
                type="number"
                value={config.maxPriceLimit || 100}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  maxPriceLimit: Number(e.target.value)
                }))}
                className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-emerald-500/40 bg-[var(--bg-surface)] text-emerald-600 dark:text-emerald-400 focus-ring"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Base Project Prices */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
            <span>Base Project Price (INR)</span>
            <span className="text-emerald-500 font-normal text-[10px]">AI Dynamic Base</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Basic College / 1st-Year Project (₹50 baseline)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.basePrices.basicCollege}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    basePrices: { ...prev.basePrices, basicCollege: Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Mini Project / Data Science (₹80 baseline)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.basePrices.miniProject}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    basePrices: { ...prev.basePrices, miniProject: Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Major Capstone Project (₹100 baseline)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.basePrices.majorProject}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    basePrices: { ...prev.basePrices, majorProject: Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated PPT Presentation Rates */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
            <span>PPT Presentation Rates (INR)</span>
            <span className="text-pink-500 font-normal text-[10px]">Free Slides</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                5–7 Slides Rate (₹0 FREE)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.pptRates['5_7_slides']}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    pptRates: { ...prev.pptRates, '5_7_slides': Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                8–10 Slides Rate (₹0 FREE)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.pptRates['8_10_slides']}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    pptRates: { ...prev.pptRates, '8_10_slides': Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                11–15 Slides Rate (₹30)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={config.pptRates['11_15_slides']}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    pptRates: { ...prev.pptRates, '11_15_slides': Number(e.target.value) }
                  }))}
                  className="w-full pl-7 pr-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Timeline Tiers */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            AI Complexity Timeline Adders (INR)
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Quick Task (~5–30 Minutes, +₹0)
              </label>
              <input
                type="number"
                value={config.urgencyAdders.standard}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  urgencyAdders: { ...prev.urgencyAdders, standard: Number(e.target.value) }
                }))}
                className="w-full px-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Standard Project (~30m–4 Hours, +₹0)
              </label>
              <input
                type="number"
                value={config.urgencyAdders.priority}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  urgencyAdders: { ...prev.urgencyAdders, priority: Number(e.target.value) }
                }))}
                className="w-full px-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Complex Project (~4–12 Hours, +₹0)
              </label>
              <input
                type="number"
                value={config.urgencyAdders.urgent}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  urgencyAdders: { ...prev.urgencyAdders, urgent: Number(e.target.value) }
                }))}
                className="w-full px-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Expedited Review Queue (~1–2 Hours, +₹0)
              </label>
              <input
                type="number"
                value={config.urgencyAdders['same-day']}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  urgencyAdders: { ...prev.urgencyAdders, 'same-day': Number(e.target.value) }
                }))}
                className="w-full px-3 py-1.5 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              />
            </div>
          </div>
        </div>

      </div>

    </form>
  );
};
