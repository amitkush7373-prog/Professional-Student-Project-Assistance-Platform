import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  CheckCircle2,
  RefreshCw,
  Clock,
  RotateCcw,
  ShieldCheck,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, getPaymentStatusBadge } from '../../utils/formatters';

export const AdminPaymentsLedger: React.FC = () => {
  const { transactions, processRefund, currency, setIsInvoiceModalOpen, setActiveInvoiceProject, projects } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [refundTxn, setRefundTxn] = useState<Transaction | null>(null);
  const [refundReason, setRefundReason] = useState('Scope cancellation or timeline mismatch');

  const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);
  const refundedVolume = transactions.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);
  const confirmedVolume = transactions.filter(t => t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);

  const filteredTransactions = transactions.filter(t =>
    t.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTxn) return;
    processRefund(refundTxn.id, refundReason);
    setRefundTxn(null);
  };

  const handleViewInvoice = (projectId: string) => {
    const p = projects.find(proj => proj.id === projectId);
    if (p) {
      setActiveInvoiceProject(p);
      setIsInvoiceModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Gross Escrow Turnover</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {formatCurrency(totalVolume, currency)}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">{transactions.length} Total Transactions</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Verified & Settled</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(confirmedVolume, currency)}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Escrow Protected
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Total Refunded Volume</span>
          <div className="text-2xl font-black text-rose-500 font-mono">
            {formatCurrency(refundedVolume, currency)}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">0.8% Refund rate</div>
        </div>

      </div>

      {/* Search Header */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, student, or gateway ref..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl glass-panel border border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                <th className="p-4">Invoice & Date</th>
                <th className="p-4">Project & Student</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Gateway Reference</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredTransactions.map(txn => {
                const paymentBadge = getPaymentStatusBadge(txn.status);

                return (
                  <tr key={txn.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{txn.invoiceNumber}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{formatDate(txn.transactionDate)}</div>
                    </td>

                    <td className="p-4 max-w-xs space-y-0.5">
                      <div className="font-bold text-[var(--text-primary)] truncate">{txn.projectTitle}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{txn.studentName} ({txn.studentEmail})</div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)]">
                        {txn.paymentMethod}
                      </span>
                      <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[130px]">{txn.upiIdOrCardEnding}</div>
                    </td>

                    <td className="p-4 font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">
                      {txn.gatewayRef}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paymentBadge.bg}`}>
                        {paymentBadge.label}
                      </span>
                      {txn.status === 'refunded' && txn.refundReason && (
                        <div className="text-[9px] text-[var(--text-muted)] mt-0.5 truncate max-w-[120px]">
                          Reason: {txn.refundReason}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-base text-[var(--text-primary)]">
                      {formatCurrency(txn.amount, currency)}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleViewInvoice(txn.projectId)}
                          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]"
                          title="View Tax Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                        </button>

                        {txn.status === 'confirmed' && (
                          <button
                            onClick={() => setRefundTxn(txn)}
                            className="px-2 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold transition-colors"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Simulation Modal */}
      {refundTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <RotateCcw className="w-5 h-5" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Authorize Escrow Refund</h4>
              </div>
              <button onClick={() => setRefundTxn(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Refund Details</div>
                <div className="font-bold text-[var(--text-primary)]">{refundTxn.projectTitle}</div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Student: {refundTxn.studentName} • Amount: <span className="font-bold text-rose-500">{formatCurrency(refundTxn.amount, currency)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Reason for Refund / Cancellation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Specify refund authorization reason..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundTxn(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/25"
                >
                  Confirm Full Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
