import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  CheckCircle2,
  Clock,
  Star,
  Search,
  ArrowRight,
  UploadCloud,
  MessageSquare,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpertProjectView } from './ExpertProjectView';
import { Project } from '../../types';
import { getStatusBadge, formatDate, formatCurrency, getCountdown } from '../../utils/formatters';

export const ExpertDashboard: React.FC = () => {
  const { currentUser, projects, currency } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'review' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Assigned projects for this expert (or all projects if admin)
  const expertProjects = projects.filter(
    p => p.assignedExpertId === currentUser.id || currentUser.role === 'admin' || !p.assignedExpertId
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (selectedProject) {
    return (
      <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExpertProjectView
            project={selectedProject}
            onBack={() => setSelectedProjectId(null)}
          />
        </div>
      </div>
    );
  }

  const activeCount = expertProjects.filter(p => p.status === 'in_progress' || p.status === 'revision_requested').length;
  const reviewCount = expertProjects.filter(p => p.status === 'review' || p.status === 'quotation_ready' || p.status === 'under_review').length;
  const completedCount = expertProjects.filter(p => p.status === 'completed' || p.status === 'download_available').length;

  const filteredProjects = expertProjects.filter(p => {
    const matchesSearch =
      p.requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requirement.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && (p.status === 'in_progress' || p.status === 'revision_requested');
    if (filter === 'review') return matchesSearch && (p.status === 'review' || p.status === 'under_review');
    if (filter === 'completed') return matchesSearch && (p.status === 'completed' || p.status === 'download_available');
    return matchesSearch;
  });

  return (
    <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Mentor Profile Header */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Verified Mentor
                </span>
                {currentUser.rating && (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {currentUser.rating} Rating
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {currentUser.name}
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                {currentUser.bio || 'Principal AI & Full-Stack Architect'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Available for New Projects
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] flex items-center justify-between">
              <span>Active Assignments</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{activeCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">In active coding</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] flex items-center justify-between">
              <span>Pending Reviews</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">{reviewCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Awaiting approval</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] flex items-center justify-between">
              <span>Completed Orders</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Deliverables handed over</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] flex items-center justify-between">
              <span>Escrow Balance</span>
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {formatCurrency(32450, currency)}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Guaranteed payouts</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: `All Queue (${expertProjects.length})` },
              { id: 'active', label: `Active Coding (${activeCount})` },
              { id: 'review', label: `Review & Revisions (${reviewCount})` },
              { id: 'completed', label: `Completed (${completedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search student or order..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>
        </div>

        {/* Assigned Projects Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border border-[var(--border-color)] space-y-2">
              <AlertCircle className="w-10 h-10 text-blue-500 mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[var(--text-primary)]">No assigned projects in this queue</h3>
              <p className="text-xs text-[var(--text-muted)]">Check back soon as new student submissions arrive.</p>
            </div>
          ) : (
            filteredProjects.map(p => {
              const statusBadge = getStatusBadge(p.status);
              const countdown = getCountdown(p.deadlineDate);

              return (
                <div
                  key={p.id}
                  className="interactive-card rounded-2xl p-5 sm:p-6 space-y-4 border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-blue-500/40 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {p.orderNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">
                        {p.requirement.category}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                        • Student: <span className="text-[var(--text-primary)] font-bold">{p.requirement.studentName}</span> ({p.requirement.college})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                        {countdown.formatted}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedProjectId(p.id)}
                      className="text-base font-bold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {p.requirement.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2">
                      {p.requirement.problemStatement}
                    </p>
                  </div>

                  {/* Progress and Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 max-w-xs space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[var(--text-muted)]">Progress</span>
                        <span className="font-bold text-blue-600">{p.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProjectId(p.id)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
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
