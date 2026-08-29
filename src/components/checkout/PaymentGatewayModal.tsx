import React, { useState, useRef } from 'react';
import {
  QrCode,
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  X,
  CreditCard,
  Clock,
  FileCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess
}) => {
  const {
    currency,
    submitManualPayment,
    paymentSettings,
    addToast
  } = useApp();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const isFree = project.assessment.totalFinalPrice === 0;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentSettings.upiId);
    setCopiedUpi(true);
    addToast('UPI ID Copied', `${paymentSettings.upiId} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setScreenshotPreview(objectUrl);
    addToast('Screenshot Attached', 'Payment proof screenshot attached.', 'success');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFree) {
      submitManualPayment(project.id, 'FREE_PPT_REQUEST', undefined);
      addToast('Request Submitted!', 'Your free college PPT request has been registered.', 'success');
      onSuccess();
      return;
    }

    if (!utrNumber.trim()) {
      addToast('Enter UTR Number', 'Please enter your UPI transaction / UTR number.', 'warning');
      return;
    }

    submitManualPayment(project.id, utrNumber.trim(), screenshotPreview || undefined);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {project.orderNumber}
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Simple & Affordable
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
            {isFree ? 'Confirm Free College PPT' : 'Simple Checkout'}
          </h3>
        </div>

        {/* Order Details Summary */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2 text-xs">
          <div className="flex justify-between items-start gap-2">
            <span className="text-[var(--text-muted)]">Project / Service:</span>
            <span className="font-bold text-[var(--text-primary)] text-right max-w-[200px] truncate">
              {project.requirement.title}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-muted)]">Target Deadline:</span>
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              {formatDate(project.deadlineDate)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
            <span className="font-bold text-xs text-[var(--text-primary)]">Total Amount:</span>
            <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
              {isFree ? 'FREE (₹0)' : formatCurrency(project.assessment.totalFinalPrice, currency)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
          
          {/* If Paid Service: Show UPI QR and Copy UPI ID */}
          {!isFree && (
            <div className="space-y-3">
              <div className="text-center font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-500" />
                <span>Pay via UPI</span>
              </div>

              {/* QR Image Box */}
              <div className="p-3 bg-white rounded-2xl shadow-sm border-2 border-blue-500/30 text-center mx-auto w-max">
                <img
                  src={paymentSettings.qrCodeUrl || '/phonepe-qr.png'}
                  alt="UPI Payment QR Code"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              {/* Copy UPI ID Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Official UPI ID:</span>
                  <span className="font-mono font-bold text-xs text-[var(--text-primary)]">
                    {paymentSettings.upiId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
                </button>
              </div>

              {/* UTR Input */}
              <div className="space-y-1">
                <label className="block font-semibold text-[var(--text-primary)]">
                  After payment, enter your transaction / UTR number:
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="Enter 12-digit UPI UTR / Transaction ID"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              {/* Screenshot Upload (Optional) */}
              <div>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
                {screenshotPreview ? (
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Screenshot Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="text-[10px] text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="w-full py-2 text-[11px] text-[var(--text-secondary)] border border-dashed border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-elevated)] flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
                    <span>Attach Screenshot (Optional)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {isFree && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1 text-center">
              <div className="font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>100% Free College Presentation</span>
              </div>
              <p className="text-[11px] opacity-90">
                Your 5–10 slide college PPT will be prepared and formatted at no cost.
              </p>
            </div>
          )}

          {/* Submit Payment Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>{isFree ? 'Submit Free PPT Request' : 'Submit Payment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
