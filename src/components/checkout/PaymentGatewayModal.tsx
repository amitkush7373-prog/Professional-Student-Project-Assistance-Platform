import React, { useState, useRef } from 'react';
import {
  QrCode,
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  X,
  CreditCard,
  Building,
  Smartphone,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, PaymentMethod } from '../../types';
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
    processPayment,
    submitManualPayment,
    paymentSettings,
    addToast
  } = useApp();

  const [paymentMode, setPaymentMode] = useState<'manual_upi' | 'online_gateway'>('manual_upi');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Manual UPI form state
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  // Online gateway form state
  const [onlineTab, setOnlineTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingOnline, setIsProcessingOnline] = useState(false);
  const [upiVpa, setUpiVpa] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  if (!isOpen) return null;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentSettings.upiId);
    setCopiedUpi(true);
    addToast('UPI ID Copied', `${paymentSettings.upiId} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingScreenshot(true);
    const objectUrl = URL.createObjectURL(file);
    setScreenshotPreview(objectUrl);
    setIsUploadingScreenshot(false);
    addToast('Screenshot Attached', 'Payment proof screenshot attached.', 'success');
  };

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      addToast('Invalid UTR Number', 'Please enter your valid 12-digit UPI UTR / Transaction ID.', 'warning');
      return;
    }

    submitManualPayment(project.id, utrNumber.trim(), screenshotPreview || undefined);
    onSuccess();
  };

  const handleOnlinePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingOnline(true);

    setTimeout(async () => {
      await processPayment(project.id, onlineTab, { vpa: upiVpa });
      setIsProcessingOnline(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {project.orderNumber}
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Safe Escrow
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Complete Your Payment
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Total Investment:{' '}
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              {formatCurrency(project.assessment.totalFinalPrice, currency)}
            </span>{' '}
            (All-inclusive, capped below ₹700)
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setPaymentMode('manual_upi')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'manual_upi'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI QR Code (Direct)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('online_gateway')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'online_gateway'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Online Gateway</span>
          </button>
        </div>

        {/* MODE 1: MANUAL UPI QR CODE & VERIFICATION */}
        {paymentMode === 'manual_upi' && (
          <form onSubmit={handleManualPaymentSubmit} className="space-y-5 animate-in fade-in duration-150">
            
            {/* Custom Admin Uploaded QR Code Display */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col items-center text-center space-y-3 shadow-inner">
              <div className="text-xs font-bold text-[var(--text-primary)]">
                {paymentSettings.merchantName}
              </div>

              {/* QR Image Box */}
              <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-blue-500/30 inline-block">
                <img
                  src={paymentSettings.qrCodeUrl}
                  alt="Admin Payment QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>

              <p className="text-[11px] text-[var(--text-muted)] max-w-xs">
                Scan using <span className="font-bold text-[var(--text-primary)]">Google Pay, PhonePe, Paytm, BHIM</span>, or any banking UPI app.
              </p>

              {/* Copy UPI ID Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs">
                <span className="font-mono font-bold text-[var(--text-primary)]">{paymentSettings.upiId}</span>
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="p-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center gap-1 font-semibold text-[10px]"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Verification Inputs (UTR & Screenshot) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Submit Verification Proof</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  12-Digit UTR / UPI Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. 202608291041 or 421987654321"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Upload Payment Screenshot (Optional but recommended)
                </label>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />

                {screenshotPreview ? (
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={screenshotPreview} alt="Proof" className="w-10 h-10 rounded-lg object-cover border" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Screenshot Attached ✓</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-500" />
                    <span>Click to Browse & Attach Screenshot</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Submit Payment for Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* MODE 2: ONLINE GATEWAY ABSTRACTION */}
        {paymentMode === 'online_gateway' && (
          <form onSubmit={handleOnlinePaymentSubmit} className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[var(--text-primary)]">
              <span className="font-bold">Instant Online Gateway:</span> Process instant payment via UPI apps, Debit/Credit cards, or Net Banking.
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI Apps', icon: Smartphone },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: Building }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOnlineTab(t.id as any)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      onlineTab === t.id
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {onlineTab === 'upi' && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Enter Your UPI VPA ID</label>
                <input
                  type="text"
                  required
                  value={upiVpa}
                  onChange={e => setUpiVpa(e.target.value)}
                  placeholder="student@okaxis"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            )}

            {onlineTab === 'card' && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2 font-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]" />
                  <input type="text" placeholder="CVV" className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]" />
                </div>
              </div>
            )}

            {onlineTab === 'netbanking' && (
              <div className="text-xs text-[var(--text-muted)] p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                Supports HDFC, ICICI, SBI, Axis, Kotak, and 50+ Indian banks.
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessingOnline}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isProcessingOnline ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <span>Authorize ₹{project.assessment.totalFinalPrice} Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
