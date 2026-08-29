import React, { useState } from 'react';
import {
  DownloadCloud,
  FileCode,
  FileText,
  Presentation,
  Video,
  Globe,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, DeliverableItem } from '../../types';
import { formatDate } from '../../utils/formatters';

interface DeliverablesVaultProps {
  project: Project;
  onRequestRevision: () => void;
}

export const DeliverablesVault: React.FC<DeliverablesVaultProps> = ({ project, onRequestRevision }) => {
  const { addToast } = useApp();

  const isUnlocked = project.paymentStatus === 'confirmed' && (project.status === 'completed' || project.status === 'download_available' || (project.deliverables && project.deliverables.some(d => d.isReady)));

  const handleDownload = (deliv: DeliverableItem) => {
    if (!deliv.isReady || project.paymentStatus !== 'confirmed') {
      addToast('Deliverable Gated', 'This file is currently in preparation or awaiting payment confirmation.', 'warning');
      return;
    }

    addToast('Download Started', `Downloading "${deliv.title}" (${deliv.fileSize})...`, 'success');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'source_code':
        return <FileCode className="w-6 h-6 text-blue-500" />;
      case 'documentation':
        return <FileText className="w-6 h-6 text-emerald-500" />;
      case 'presentation':
        return <Presentation className="w-6 h-6 text-pink-500" />;
      case 'deployment_guide':
        return <Globe className="w-6 h-6 text-cyan-500" />;
      case 'video_walkthrough':
        return <Video className="w-6 h-6 text-purple-500" />;
      default:
        return <FileText className="w-6 h-6 text-blue-500" />;
    }
  };

  const readyDeliverables = project.deliverables?.filter(d => d.isReady) || [];

  return (
    <div className="space-y-6">
      
      {/* Vault Status Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isUnlocked && readyDeliverables.length > 0
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-blue-500/10 border-blue-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isUnlocked && readyDeliverables.length > 0
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
          }`}>
            {isUnlocked && readyDeliverables.length > 0 ? <Unlock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              {isUnlocked && readyDeliverables.length > 0 ? 'Verified Deliverables Vault: Ready for Download' : 'Deliverables Vault: Work in Progress'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {isUnlocked && readyDeliverables.length > 0
                ? 'Your completed deliverables (Source code, PPT slides, reports) are ready below.'
                : 'Your mentor is working on your project deliverables. They will be uploaded and unlocked here.'}
            </p>
          </div>
        </div>

        <button
          onClick={onRequestRevision}
          className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span>Request Revision</span>
        </button>
      </div>

      {/* Deliverables Cards Roster */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Official Project Deliverable Files ({project.deliverables?.length || 0} Assets)
        </h4>

        {(!project.deliverables || project.deliverables.length === 0) ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
            <Clock className="w-8 h-8 text-blue-500 mx-auto opacity-60 animate-pulse" />
            <h5 className="text-sm font-bold text-[var(--text-primary)]">Your final files will appear here once they are ready.</h5>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Your assigned mentor will upload your source code, presentation PPT, and documentation report before your target deadline.
            </p>
          </div>
        ) : (
          project.deliverables.map(deliv => (
            <div
              key={deliv.id}
              className="p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition-all group shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform">
                  {getCategoryIcon(deliv.category)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-[var(--text-primary)]">{deliv.title}</h5>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {deliv.fileType}
                    </span>
                    {deliv.isReady ? (
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {deliv.description}
                  </p>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    File Size: <span className="font-mono">{deliv.fileSize}</span>
                    {deliv.uploadedAt && ` • Uploaded ${formatDate(deliv.uploadedAt)}`}
                  </div>
                </div>
              </div>

              {/* Download Action */}
              <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
                <button
                  type="button"
                  disabled={!deliv.isReady || project.paymentStatus !== 'confirmed'}
                  onClick={() => handleDownload(deliv)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    deliv.isReady && project.paymentStatus === 'confirmed'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:scale-105'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
                  }`}
                >
                  {deliv.isReady && project.paymentStatus === 'confirmed' ? (
                    <>
                      <DownloadCloud className="w-4 h-4" />
                      <span>Download File</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Locked (Awaiting Completion)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
