import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit,
  X,
  FileCode,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import {
  getStatusBadge,
  getPaymentStatusBadge,
  formatCurrency,
  formatDate
} from '../../utils/formatters';

export const AdminOrdersManager: React.FC = () => {
  const {
    projects,
    users,
    updateProjectStatus,
    assignExpertToProject,
    setSelectedProjectId,
    setActiveView,
    currency
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Project | null>(null);
  const [selectedExpertId, setSelectedExpertId] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<ProjectStatus>('in_progress');

  const expertUsers = users.filter(u => u.role === 'expert');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirement.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  const handleOpenEdit = (project: Project) => {
    setSelectedOrderForEdit(project);
    setSelectedExpertId(project.assignedExpertId || (expertUsers[0]?.id || ''));
    setSelectedNewStatus(project.status);
  };

  const handleSaveOrderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;

    if (selectedExpertId && selectedExpertId !== selectedOrderForEdit.assignedExpertId) {
      assignExpertToProject(selectedOrderForEdit.id, selectedExpertId);
    }
    if (selectedNewStatus !== selectedOrderForEdit.status) {
      updateProjectStatus(selectedOrderForEdit.id, selectedNewStatus);
    }

    setSelectedOrderForEdit(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search order ID, student, or title..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
          >
            <option value="all">All Statuses ({projects.length})</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Quality Review</option>
            <option value="revision_requested">Revision Requested</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Master Table */}
      <div className="rounded-2xl glass-panel border border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Project Title & Scope</th>
                <th className="p-4">Student</th>
                <th className="p-4">Assigned Expert</th>
                <th className="p-4">Status & Payment</th>
                <th className="p-4 text-right">Investment</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredProjects.map(p => {
                const statusBadge = getStatusBadge(p.status);
                const paymentBadge = getPaymentStatusBadge(p.paymentStatus);

                return (
                  <tr key={p.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    
                    {/* Order ID */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{p.orderNumber}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{formatDate(p.createdAt)}</div>
                    </td>

                    {/* Title */}
                    <td className="p-4 max-w-xs space-y-1">
                      <div className="font-bold text-[var(--text-primary)] truncate" title={p.requirement.title}>
                        {p.requirement.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                        <span className="capitalize font-semibold text-[var(--text-secondary)]">{p.requirement.category}</span>
                        <span>•</span>
                        <span className="capitalize">{p.complexity} Tier</span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-semibold text-[var(--text-primary)]">{p.requirement.studentName}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">{p.requirement.college}</div>
                    </td>

                    {/* Assigned Expert */}
                    <td className="p-4">
                      {p.assignedExpertName ? (
                        <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{p.assignedExpertName}</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-medium text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badges */}
                    <td className="p-4 space-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.label}
                      </span>
                      <div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${paymentBadge.bg}`}>
                          {paymentBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Investment */}
                    <td className="p-4 text-right font-mono font-bold text-[var(--text-primary)]">
                      {formatCurrency(p.assessment.totalFinalPrice, currency)}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-blue-600 hover:text-white transition-colors"
                          title="Assign Expert or Override Status"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setActiveView('project-detail');
                          }}
                          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order / Assignment Modal */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Manage Order {selectedOrderForEdit.orderNumber}</h4>
                <p className="text-[11px] text-[var(--text-muted)]">{selectedOrderForEdit.requirement.title}</p>
              </div>
              <button onClick={() => setSelectedOrderForEdit(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderChanges} className="space-y-4">
              
              {/* Assign Expert */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Assign / Reassign Verified Expert Mentor
                </label>
                <select
                  value={selectedExpertId}
                  onChange={e => setSelectedExpertId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                >
                  {expertUsers.map(exp => (
                    <option key={exp.id} value={exp.id}>
                      {exp.name} — {exp.skills?.slice(0, 3).join(', ')} ({exp.rating}★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Override Status */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Override Lifecycle Stage Status
                </label>
                <select
                  value={selectedNewStatus}
                  onChange={e => setSelectedNewStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="quotation_ready">Quotation Ready</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Quality Review</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="completed">Completed</option>
                  <option value="download_available">Download Available</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
