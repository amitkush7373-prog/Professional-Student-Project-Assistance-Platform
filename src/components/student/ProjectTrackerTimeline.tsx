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
  Sparkles,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { Project, ProjectStatus } from '../../types';
import { getCountdown, getStatusBadge, formatDate } from '../../utils/formatters';

interface ProjectTrackerTimelineProps {
  project: Project;
}

export const ProjectTrackerTimeline: React.FC<ProjectTrackerTimelineProps> = ({ project }) => {
  const countdown = getCountdown(project.deadlineDate);
  const badge = getStatusBadge(project.status);

  const isPaymentVerified = project.paymentStatus === 'verified' || project.paymentStatus === 'confirmed';
  const isPaymentPending = project.paymentStatus === 'verification_pending';
  const isPaymentRejected = project.paymentStatus === 'rejected';

  // 6 Connected Lifecycle Stages
  const stages: {
    id: string;
    title: string;
    desc: string;
    isCompleted: boolean;
    isCurrent: boolean;
    isAlert?: boolean;
  }[] = [
    {
      id: 'submitted',
      title: 'Requirement Registered',
      desc: 'Project specifications and assets registered',
      isCompleted: true,
      isCurrent: project.status === 'submitted'
    },
    {
      id: 'assigned',
      title: 'Mentor Assigned',
      desc: project.assignedExpertName ? `Assigned to ${project.assignedExpertName}` : 'Technical mentor assigned',
      isCompleted: true,
      isCurrent: project.status === 'under_review' || project.status === 'quotation_ready'
    },
    {
      id: 'payment_verification',
      title: isPaymentVerified
        ? 'Payment Verified 🟢'
        : isPaymentRejected
        ? 'Payment Verification Failed 🔴'
        : isPaymentPending
        ? 'Payment Verification Pending 🟡'
        : 'Payment Pending',
      desc: isPaymentVerified
        ? `Verified by ${project.paymentVerifiedBy || 'Admin'} • ${project.paymentVerifiedAt ? formatDate(project.paymentVerifiedAt) : 'Ready to start'}`
        : isPaymentRejected
        ? `Rejected: ${project.paymentRejectedReason || 'Invalid UTR'}`
        : isPaymentPending
        ? `Submitted UTR: ${project.utrNumber || 'Pending check'} • Awaiting admin bank verification`
        : 'Scan PhonePe UPI QR code to complete payment',
      isCompleted: isPaymentVerified,
      isCurrent: project.status === 'payment_pending' || project.status === 'verification_pending',
      isAlert: isPaymentRejected || isPaymentPending
    },
    {
      id: 'in_progress',
      title: 'Development In Progress',
      desc: isPaymentVerified
        ? 'Codebase architecture, module implementation and testing underway'
        : 'Will begin immediately after admin verifies payment',
      isCompleted: ['in_progress', 'review', 'revision_requested', 'completed', 'download_available'].includes(project.status) && isPaymentVerified,
      isCurrent: project.status === 'in_progress' && isPaymentVerified
    },
    {
      id: 'review',
      title: 'Quality & Code Audit',
      desc: 'Checking rubric, error logs, and preparing PPT & documentation',
      isCompleted: ['review', 'revision_requested', 'completed', 'download_available'].includes(project.status) && isPaymentVerified,
      isCurrent: (project.status === 'review' || project.status === 'revision_requested') && isPaymentVerified
    },
    {
      id: 'completed',
      title: 'Deliverables Available for Download',
      desc: 'Source code, PPT slides, and reports unlocked in Vault',
      isCompleted: ['completed', 'download_available'].includes(project.status) && isPaymentVerified,
      isCurrent: (project.status === 'completed' || project.status === 'download_available') && isPaymentVerified
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Progress Bar & Countdown */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
        
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

          {/* Countdown Timer Badge */}
          <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Target Delivery Deadline</div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                {countdown.formatted} ({formatDate(project.deadlineDate)})
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[var(--bg-elevated)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              project.progress === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : isPaymentRejected
                ? 'bg-red-500'
                : isPaymentPending
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
            style={{ width: `${Math.max(5, project.progress)}%` }}
          />
        </div>

      </div>

      {/* Lifecycle Timeline Steps */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--border-color)] space-y-6 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Connected Lifecycle Timeline</span>
        </h4>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-[15px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border-color)]">
          {stages.map((stage, idx) => {
            return (
              <div key={stage.id} className="relative flex items-start gap-4 group">
                
                {/* Node Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                    stage.isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10'
                      : stage.isAlert && stage.isCurrent
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-500/10 animate-pulse'
                      : stage.isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-500/10 animate-pulse'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}
                >
                  {stage.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : stage.isAlert && isPaymentRejected ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5 min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5
                      className={`text-xs sm:text-sm font-bold ${
                        stage.isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : stage.isCurrent
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {stage.title}
                    </h5>

                    {stage.isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Active State
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
