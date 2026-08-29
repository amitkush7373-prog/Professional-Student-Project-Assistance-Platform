import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Code2,
  FileText,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, project }) => {
  const { currency } = useApp();

  if (!isOpen || !project) return null;

  const invoiceNum = 'INV-' + project.orderNumber.replace('APX-', '');
  const taxableSubtotal = project.assessment.totalFinalPrice - project.assessment.taxAmount;
  const cgst = Math.round(project.assessment.taxAmount / 2);
  const sgst = project.assessment.taxAmount - cgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm no-print" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-10 border border-slate-200 my-8">
        
        {/* Controls Bar (hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 no-print">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Official Tax Invoice & Verification Receipt</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INVOICE SHEET */}
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">ApexProject Technologies Inc.</h2>
                <p className="text-[11px] text-slate-500">Academic Mentorship & Engineering Services Platform</p>
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: 07AAACA1234B1Z5 • CIN: U72200DL2025PTC109281</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                PAID & VERIFIED
              </span>
              <div className="text-sm font-bold font-mono text-slate-900 mt-1">{invoiceNum}</div>
              <div className="text-[11px] text-slate-500">Date: {formatDate(project.createdAt)}</div>
            </div>
          </div>

          {/* Billed To & Order Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Student / Scholar Info</span>
              <div className="font-bold text-slate-900">{project.requirement.studentName}</div>
              <div className="text-slate-600">{project.requirement.college}</div>
              <div className="text-slate-600">{project.requirement.courseBranch} ({project.requirement.semester})</div>
              <div className="text-slate-500 font-mono">{project.requirement.email}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Project Order Scope</span>
              <div className="font-bold text-slate-900">{project.orderNumber}</div>
              <div className="text-slate-600 truncate">{project.requirement.title}</div>
              <div className="text-slate-600 capitalize">Tier: {project.complexity} ({project.selectedUrgency} timeline)</div>
              <div className="text-slate-500">Deadline: {formatDate(project.deadlineDate)}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3">Description of Engineering Deliverable</th>
                  <th className="p-3 text-center">HSN/SAC</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{project.requirement.category.toUpperCase()} Development & Guidance</div>
                    <div className="text-[11px] text-slate-500">Commented source code, README setup instructions & tests</div>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-500">998314</td>
                  <td className="p-3 text-right font-mono font-semibold">{formatCurrency(project.assessment.basePrice + project.assessment.complexityFee + project.assessment.techFee, currency)}</td>
                </tr>

                {project.assessment.urgencyFee > 0 && (
                  <tr>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">Priority Urgency Acceleration ({project.selectedUrgency.toUpperCase()})</div>
                      <div className="text-[11px] text-slate-500">Dedicated compute and accelerated turn-around guarantee</div>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-500">998314</td>
                    <td className="p-3 text-right font-mono font-semibold">{formatCurrency(project.assessment.urgencyFee, currency)}</td>
                  </tr>
                )}

                {project.selectedAddons.filter(a => a.isSelected).map(addon => (
                  <tr key={addon.id}>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{addon.title}</div>
                      <div className="text-[11px] text-slate-500">{addon.description}</div>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-500">998314</td>
                    <td className="p-3 text-right font-mono font-semibold">{formatCurrency(addon.price, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Grand Total */}
          <div className="flex justify-end text-xs">
            <div className="w-72 space-y-1.5 border-t border-slate-200 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-mono">{formatCurrency(taxableSubtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span className="font-mono">{formatCurrency(cgst, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span className="font-mono">{formatCurrency(sgst, currency)}</span>
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-300 pt-2">
                <span>Total Paid:</span>
                <span className="font-mono text-blue-600">{formatCurrency(project.assessment.totalFinalPrice, currency)}</span>
              </div>
            </div>
          </div>

          {/* Verification & Digital Signature Block */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Digitally Verified Escrow Receipt</span>
              </div>
              <div>This is a computer-generated tax invoice and requires no physical signature.</div>
            </div>

            <div className="text-center sm:text-right font-mono">
              <div>Auth Ref: AUTH_{project.orderNumber.replace('APX-', '')}_OKAXIS</div>
              <div>Timestamp: {formatDateTime(project.createdAt)}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
