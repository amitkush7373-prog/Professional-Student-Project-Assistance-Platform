import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  DownloadCloud,
  FileText,
  AlertCircle,
  Star,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import {
  getStatusBadge,
  getPaymentStatusBadge,
  formatCurrency,
  formatDate,
  getCountdown
} from '../../utils/formatters';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    currency,
    setActiveView,
    setSelectedProjectId,
    setIsInvoiceModalOpen,
    setActiveInvoiceProject
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter projects by current student
  const studentProjects = projects.filter(p => p.studentId === currentUser.id || currentUser.role === 'admin');

  const activeProjectsCount = studentProjects.filter(p => p.status !== 'completed' && p.status !== 'download_available').length;
  const completedProjectsCount = studentProjects.filter(p => p.status === 'completed' || p.status === 'download_available').length;
  const pendingPaymentsCount = studentProjects.filter(p => p.paymentStatus === 'pending').length;

  const filteredProjects = studentProjects.filter(p => {
    const matchesSearch =
      p.requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirement.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && (p.status === 'in_progress' || p.status === 'review' || p.status === 'revision_requested');
    if (selectedFilter === 'completed') return matchesSearch && (p.status === 'completed' || p.status === 'download_available');
    if (selectedFilter === 'payment_pending') return matchesSearch && p.paymentStatus === 'pending';
    if (selectedFilter === 'under_review') return matchesSearch && (p.status === 'submitted' || p.status === 'under_review');
    return matchesSearch;
  });

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Student Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {currentUser.college} • {currentUser.branch} ({currentUser.semester})
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setActiveView('ai-ppt-agent');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 sm:px-5 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>⚡ AI PPT Agent (Free)</span>
            </button>

            <button
              onClick={() => {
                setActiveView('ai-report-agent');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 sm:px-5 py-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 shadow-sm"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span>📄 AI Report Generator</span>
            </button>

            <button
              onClick={() => {
                setActiveView('submit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Project</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
              <span>Active Projects</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {activeProjectsCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">In development / review</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
              <span>Completed Orders</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {completedProjectsCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Deliverables ready</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
              <span>Pending Payments</span>
              <CreditCard className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              {pendingPaymentsCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Awaiting checkout</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
              <span>Nearest Deadline</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              2d 14h left
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">APX-2026-9041</div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: `All (${studentProjects.length})` },
              { id: 'active', label: `In Progress (${activeProjectsCount})` },
              { id: 'completed', label: `Completed (${completedProjectsCount})` },
              { id: 'payment_pending', label: `Pending Payment (${pendingPaymentsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search projects or Order ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

        </div>

        {/* Projects Cards List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border border-[var(--border-color)] space-y-4">
              <AlertCircle className="w-10 h-10 text-blue-500 mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[var(--text-primary)]">No projects found in this filter</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Ready to begin your engineering capstone or technical project? Submit your requirements now.
              </p>
              <button
                onClick={() => setActiveView('submit')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Start New Project
              </button>
            </div>
          ) : (
            filteredProjects.map(project => {
              const statusBadge = getStatusBadge(project.status);
              const paymentBadge = getPaymentStatusBadge(project.paymentStatus);
              const countdown = getCountdown(project.deadlineDate);

              return (
                <div
                  key={project.id}
                  className="interactive-card rounded-2xl p-5 sm:p-6 space-y-4 border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-blue-500/40 transition-all shadow-sm"
                >
                  {/* Top Bar: Order ID, Category, Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {project.orderNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">
                        {project.requirement.category}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                        • Created {formatDate(project.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paymentBadge.bg}`}>
                        {paymentBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3
                      onClick={() => handleOpenProject(project.id)}
                      className="text-base font-bold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {project.requirement.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {project.requirement.problemStatement}
                    </p>
                  </div>

                  {/* Progress & Mentor Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                    
                    {/* Progress slider bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-[var(--text-muted)]">Progress</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Mentor */}
                    <div className="space-y-0.5">
                      <span className="font-semibold text-[var(--text-muted)] text-[11px]">Assigned Mentor</span>
                      <div className="font-bold text-[var(--text-primary)] truncate">
                        {project.assignedExpertName || 'Matching Specialist...'}
                      </div>
                    </div>

                    {/* Deadline Countdown */}
                    <div className="space-y-0.5">
                      <span className="font-semibold text-[var(--text-muted)] text-[11px]">Target Deadline</span>
                      <div className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {countdown.formatted}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-mono">
                      <span className="text-[var(--text-muted)]">Investment: </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {formatCurrency(project.assessment.totalFinalPrice, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {project.paymentStatus === 'confirmed' || project.paymentStatus === 'verified' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInvoiceProject(project);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : project.paymentStatus === 'verification_pending' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Verification Pending</span>
                        </span>
                      ) : project.paymentStatus === 'rejected' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setActiveView('project-detail');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <span>Re-upload Proof</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setActiveView('checkout');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenProject(project.id)}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <span>Open Workstation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
