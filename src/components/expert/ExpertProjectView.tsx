import React, { useState } from 'react';
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  FileCode,
  FileText,
  Clock,
  Send,
  Sparkles,
  Layers,
  RefreshCw,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectChat } from '../student/ProjectChat';
import { Project, ProjectStatus, DeliverableItem } from '../../types';
import { getStatusBadge, formatDate, formatCurrency } from '../../utils/formatters';

interface ExpertProjectViewProps {
  project: Project;
  onBack: () => void;
}

export const ExpertProjectView: React.FC<ExpertProjectViewProps> = ({ project, onBack }) => {
  const { updateProjectStatus, uploadProjectDeliverable, currency, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'deliverables'>('overview');
  const [progressSlider, setProgressSlider] = useState(project.progress);
  const [statusSelection, setStatusSelection] = useState<ProjectStatus>(project.status);

  // Deliverable Upload Form State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [delivTitle, setDelivTitle] = useState('');
  const [delivCategory, setDelivCategory] = useState<'source_code' | 'documentation' | 'presentation' | 'deployment_guide' | 'video_walkthrough'>('source_code');
  const [delivDescription, setDelivDescription] = useState('');
  const [delivFileType, setDelivFileType] = useState('ZIP Archive');
  const [delivSize, setDelivSize] = useState('24.5 MB');

  const statusBadge = getStatusBadge(project.status);

  const handleUpdateProgress = () => {
    updateProjectStatus(project.id, statusSelection, progressSlider);
  };

  const handleUploadDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivTitle.trim()) return;

    uploadProjectDeliverable(project.id, {
      title: delivTitle.trim(),
      description: delivDescription.trim() || 'Verified project deliverable asset compiled according to academic guidelines.',
      fileType: delivFileType,
      fileSize: delivSize,
      downloadUrl: '#',
      isReady: true,
      category: delivCategory
    });

    setIsUploadModalOpen(false);
    setDelivTitle('');
    setDelivDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expert Assignments Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Deliverable Asset</span>
          </button>
        </div>
      </div>

      {/* Project Card Summary */}
      <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {project.orderNumber}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                {statusBadge.label}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {project.requirement.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Student: <span className="font-bold text-[var(--text-primary)]">{project.requirement.studentName}</span> ({project.requirement.college}) • Deadline: {formatDate(project.deadlineDate)}
            </p>
          </div>

          {/* Quick Progress Controller */}
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)]">Update Milestone Progress</span>
              <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">{progressSlider}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progressSlider}
              onChange={e => setProgressSlider(Number(e.target.value))}
              className="w-full h-2 bg-[var(--bg-muted)] rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center gap-2">
              <select
                value={statusSelection}
                onChange={e => setStatusSelection(e.target.value as ProjectStatus)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              >
                <option value="in_progress">In Progress</option>
                <option value="review">Quality Review</option>
                <option value="revision_requested">Revision In Progress</option>
                <option value="completed">Completed</option>
                <option value="download_available">Deliverables Ready</option>
              </select>
              <button
                type="button"
                onClick={handleUpdateProgress}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Notice Alert if present */}
      {project.status === 'revision_requested' && project.revisionNotes && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-1">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Student Requested Revisions / Professor Feedback</span>
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed pl-6">
            "{project.revisionNotes}"
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-[var(--border-color)] gap-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Requirement Scope & Specs
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Student Direct Chat
        </button>
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'deliverables'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Deliverables Vault ({project.deliverables?.length || 0})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Problem Statement */}
            <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Problem Statement
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {project.requirement.problemStatement}
              </p>
            </div>

            {/* Required Features */}
            <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Required Functional Features ({project.requirement.requiredFeatures.length})
              </h4>
              <div className="space-y-2">
                {project.requirement.requiredFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Reference Files */}
            {project.files.length > 0 && (
              <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Student Uploaded Assets ({project.files.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.files.map(f => (
                    <div
                      key={f.id}
                      className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[var(--text-primary)] truncate max-w-[200px]">{f.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{f.sizeFormatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Meta */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                Tech Stack Specifications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.requirement.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-2 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                Order Escrow Meta
              </h4>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Total Value:</span>
                <span className="font-bold text-[var(--text-primary)]">{formatCurrency(project.assessment.totalFinalPrice, currency)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-500 uppercase">{project.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Revisions Allowed:</span>
                <span className="font-bold text-[var(--text-primary)]">{project.assessment.revisionsAllowed}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && <ProjectChat project={project} />}

      {activeTab === 'deliverables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Uploaded Deliverable Assets
            </h4>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              + Upload Deliverable
            </button>
          </div>

          <div className="space-y-3">
            {project.deliverables?.map(deliv => (
              <div
                key={deliv.id}
                className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)]">{deliv.title}</h5>
                  <p className="text-xs text-[var(--text-secondary)]">{deliv.description}</p>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">
                    {deliv.fileType} • {deliv.fileSize} • Uploaded {formatDate(deliv.uploadedAt)}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Live for Student
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverable Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-500" />
                <h4 className="text-base font-bold text-[var(--text-primary)]">Upload Project Deliverable</h4>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDeliverableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Deliverable Title *</label>
                <input
                  type="text"
                  required
                  value={delivTitle}
                  onChange={e => setDelivTitle(e.target.value)}
                  placeholder="e.g. Core Deep Learning Checkpoint & Backend API"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Category</label>
                  <select
                    value={delivCategory}
                    onChange={e => setDelivCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  >
                    <option value="source_code">Source Code (.zip)</option>
                    <option value="documentation">IEEE SRS Thesis (.pdf)</option>
                    <option value="presentation">Viva PPT Deck (.pptx)</option>
                    <option value="deployment_guide">Deployment URL & Guide</option>
                    <option value="video_walkthrough">Video Demo (.mp4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">File Size</label>
                  <input
                    type="text"
                    value={delivSize}
                    onChange={e => setDelivSize(e.target.value)}
                    placeholder="e.g. 34.2 MB"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Deliverable Summary & Run Notes</label>
                <textarea
                  rows={3}
                  value={delivDescription}
                  onChange={e => setDelivDescription(e.target.value)}
                  placeholder="Instructions for how the student should extract and test this deliverable..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25"
                >
                  Upload & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
