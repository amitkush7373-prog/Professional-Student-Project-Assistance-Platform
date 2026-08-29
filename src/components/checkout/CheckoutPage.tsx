import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  FileCode,
  QrCode,
  Tag,
  Lock,
  Sparkles,
  Info,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const {
    pendingCheckoutProject,
    setActiveView,
    setSelectedProjectId,
    currency,
    addToast
  } = useApp();

  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!pendingCheckoutProject) {
    return (
      <div className="w-full py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">No Active Order in Checkout</h3>
        <button
          onClick={() => setActiveView('submit')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Start New Project
        </button>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'STUDENT10' || promoCode.trim().toUpperCase() === 'SCHOLAR10') {
      setDiscountPercent(10);
      addToast('Scholarship Code Applied', '10% student discount applied to order!', 'success');
    } else {
      addToast('Invalid Coupon', 'Try code STUDENT10 for 10% student discount.', 'warning');
    }
  };

  const originalTotal = pendingCheckoutProject.assessment.totalFinalPrice;
  const isFree = originalTotal === 0;
  const discountAmount = Math.round((originalTotal * discountPercent) / 100);
  const finalPayable = isFree ? 0 : Math.max(30, Math.min(100, originalTotal - discountAmount));

  const handlePaymentSuccess = () => {
    setIsGatewayOpen(false);
    setSelectedProjectId(pendingCheckoutProject.id);
    setActiveView('project-detail');
  };

  return (
    <div className="w-full py-10 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Navigation Back */}
        <button
          onClick={() => setActiveView('submit')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit Requirements</span>
        </button>

        {/* Header */}
        <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
            Order Review & Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Review Your Project Summary
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Verify your academic specifications and itemized pricing before payment.
          </p>
        </div>

        {/* Project Summary Card */}
        <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="space-y-2 border-b border-[var(--border-color)] pb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase">
              {pendingCheckoutProject.requirement.serviceType.replace('-', ' ')}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
              {pendingCheckoutProject.requirement.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Student: <span className="font-bold text-[var(--text-primary)]">{pendingCheckoutProject.requirement.studentName}</span> ({pendingCheckoutProject.requirement.college}) • {pendingCheckoutProject.requirement.semester}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-[var(--text-primary)] text-[11px]">
              Included Deliverables:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pendingCheckoutProject.assessment.deliverablesList.map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-[var(--text-primary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Price Breakdown */}
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
              Price Breakdown (Transparent & Student Friendly)
            </div>
            <div className="space-y-1.5 text-xs">
              {pendingCheckoutProject.assessment.breakdownItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[var(--text-secondary)]">
                  <span>{item.label}:</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{formatCurrency(item.amount, currency)}</span>
                </div>
              ))}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Student Promo Discount (10%):</span>
                  <span className="font-mono font-bold">-{formatCurrency(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base text-[var(--text-primary)] border-t border-[var(--border-color)] pt-2">
                <span>Total Amount to Pay:</span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400">
                  {formatCurrency(finalPayable, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              placeholder="Enter student discount code (e.g. STUDENT10)"
              className="flex-1 px-3.5 py-2 text-xs uppercase font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              Apply Code
            </button>
          </form>

          {/* Proceed to Payment CTA */}
          <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin Verified Order with Official Invoice</span>
            </div>

            <button
              type="button"
              onClick={() => setIsGatewayOpen(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout ({formatCurrency(finalPayable, currency)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        project={{
          ...pendingCheckoutProject,
          assessment: {
            ...pendingCheckoutProject.assessment,
            totalFinalPrice: finalPayable
          }
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
