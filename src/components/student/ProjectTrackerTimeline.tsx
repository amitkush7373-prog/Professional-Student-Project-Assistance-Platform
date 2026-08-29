import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  FileCheck,
  Code2,
  UserCheck,
  CheckCheck,
  DownloadCloud,
  Sparkles
} from 'lucide-react';
import { Project, ProjectStatus } from '../../types';
import { getCountdown, getStatusBadge, formatDate } from '../../utils/formatters';

interface ProjectTrackerTimelineProps {
  project: Project;
}

export const ProjectTrackerTimeline: React.FC<ProjectTrackerTimelineProps> = ({ project }) => {
  const countdown = getCountdown(project.deadlineDate);
  const badge = getStatusBadge(project.status);

  // 7 Core lifecycle stages
  const stages: { id: string; title: string; desc: string; isCompleted: boolean; isCurrent: boolean }[] = [
    {
      id: 'submitted',
      title: 'Requirement Submitted',
      desc: 'Project specifications and assets uploaded',
      isCompleted: true,
      isCurrent: project.status === 'submitted'
    },
    {
      id: 'under_review',
      title: 'Project Reviewed',
      desc: 'Complexity and architectural scope verified',
      isCompleted: ['under_review', 'quotation_ready', 'payment_pending', 'payment_confirmed', 'in_progress', 'review', 'revision_requested', 'completed', 'download_available'].includes(project.status),
      isCurrent: project.status === 'under_review' || project.status === 'quotation_ready'
    },
    {
      id: 'assigned',
      title: 'Expert Mentor Assigned',
      desc: project.assignedExpertName ? `Assigned to ${project.assignedExpertName}` : 'Matching with domain architect',
      isCompleted: Boolean(project.assignedExpertId),
      isCurrent: Boolean(project.assignedExpertId) && project.status === 'payment_pending'
    },
    {
      id: 'in_progress',
      title: 'Development Started',
      desc: 'Core architecture and module development underway',
      isCompleted: ['in_progress', 'review', 'revision_requested', 'completed', 'download_available'].includes(project.status),
      isCurrent: project.status === 'in_progress'
    },
    {
      id: 'review',
      title: 'Progress Quality Review',
      desc: 'Test cases run & initial deliverables drafted',
      isCompleted: ['review', 'revision_requested', 'completed', 'download_available'].includes(project.status),
      isCurrent: project.status === 'review' || project.status === 'revision_requested'
    },
    {
      id: 'completed',
      title: 'Deliverables Ready & Verified',
      desc: 'Source code, documentation & presentations uploaded',
      isCompleted: ['completed', 'download_available'].includes(project.status),
      isCurrent: project.status === 'completed' || project.status === 'download_available'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Progress Bar & Countdown */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Project Development Progress
            </span>
            <div className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2 mt-0.5">
              <span>{project.progress}% Completed</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Non-stressful Countdown Timer Badge */}
          <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Target Deadline</div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                {countdown.formatted} ({formatDate(project.deadlineDate)})
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Animated Progress Bar */}
        <div className="w-full h-3 bg-[var(--bg-muted)] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-full transition-all duration-700 relative"
            style={{ width: `${Math.max(project.progress, 5)}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>

      </div>

      {/* Vertical Stepper Timeline */}
      <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
          Milestone Timeline & Verification Stages
        </h4>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="relative flex items-start gap-4">
              
              {/* Stepper Node Icon */}
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  stage.isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : stage.isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                    : 'bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-muted)]'
                }`}
              >
                {stage.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : stage.isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Stage Info */}
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h5
                    className={`text-xs font-bold ${
                      stage.isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : stage.isCompleted
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {stage.title}
                  </h5>

                  {stage.isCompleted && (
                    <span className="text-[10px] font-semibold text-emerald-500">Verified</span>
                  )}
                  {stage.isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      In Progress
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stage.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
