import React, { useState, useRef } from 'react';
import {
  QrCode,
  Save,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  Lock,
  Smartphone,
  Eye,
  Copy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentSettings } from '../../types';

export const AdminPaymentSettings: React.FC = () => {
  const { paymentSettings, updatePaymentSettings, resetPaymentSettings } = useApp();

  const [settings, setSettings] = useState<PaymentSettings>(paymentSettings);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(settings);
  };

  const handleReset = () => {
    resetPaymentSettings();
    setSettings(paymentSettings);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSettings(prev => ({ ...prev, qrCodeUrl: objectUrl }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Custom UPI QR Code & Payment Settings</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Upload your official UPI QR code and set the platform UPI ID shown to all students during checkout.
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
            <span>Save Payment Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Settings Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5 rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-8 shadow-xl text-xs">
          
          {/* Upload QR Image */}
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Upload UPI QR Code Image *
            </label>
            <p className="text-[11px] text-[var(--text-muted)] mb-2">
              Upload your Google Pay, PhonePe, Paytm, or BHIM merchant QR code.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleQrUpload}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Custom QR Image</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const newQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${settings.upiId || '7618820563-2@ybl'}&pn=${encodeURIComponent(settings.merchantName || 'Apex')}&mc=8299&mode=02`;
                  setSettings(prev => ({ ...prev, qrCodeUrl: newQr }));
                }}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-elevated)]"
              >
                Generate from UPI ID
              </button>
            </div>
          </div>

          {/* UPI ID */}
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Official UPI VPA ID *
            </label>
            <input
              type="text"
              required
              value={settings.upiId}
              onChange={e => setSettings(prev => ({ ...prev, upiId: e.target.value }))}
              placeholder="e.g. 7618820563-2@ybl"
              className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

          {/* Business / Merchant Name */}
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Business / Platform Name
            </label>
            <input
              type="text"
              required
              value={settings.merchantName}
              onChange={e => setSettings(prev => ({ ...prev, merchantName: e.target.value }))}
              placeholder="e.g. Apex Student Project Assistance Services"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Student Payment Instructions
            </label>
            <textarea
              rows={3}
              value={settings.instructions}
              onChange={e => setSettings(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Instructions displayed below QR code..."
              className="w-full p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

        </div>

        {/* Right Live Preview Box (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 px-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Live Student Checkout Preview</span>
          </div>

          <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 space-y-4 shadow-xl text-center">
            <div className="text-xs font-bold text-[var(--text-primary)]">
              {settings.merchantName || 'Apex Project Assistance'}
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-blue-500/30 inline-block">
              <img
                src={settings.qrCodeUrl}
                alt="QR Preview"
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs flex items-center justify-between">
              <span className="font-mono font-bold text-[var(--text-primary)] truncate max-w-[200px]">
                {settings.upiId}
              </span>
              <span className="text-[10px] text-blue-600 font-bold">Copy</span>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {settings.instructions}
            </p>
          </div>
        </div>

      </div>

    </form>
  );
};
