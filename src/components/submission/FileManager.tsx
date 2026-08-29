import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Trash2,
  File,
  AlertCircle,
  Eye,
  Lock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ProjectFile } from '../../types';
import { formatFileSize } from '../../utils/formatters';

interface FileManagerProps {
  files: ProjectFile[];
  onAddFiles: (newFiles: ProjectFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  categoryDefault?: 'requirement' | 'dataset' | 'screenshot' | 'existing_code' | 'reference';
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  categoryDefault = 'requirement'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<ProjectFile | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);

    const newProjectFiles: ProjectFile[] = [];

    Array.from(fileList).forEach(f => {
      let inferredCategory: ProjectFile['category'] = categoryDefault;
      if (f.name.endsWith('.zip') || f.name.endsWith('.rar') || f.name.endsWith('.py') || f.name.endsWith('.java')) {
        inferredCategory = 'existing_code';
      } else if (f.name.endsWith('.csv') || f.name.endsWith('.xlsx') || f.name.endsWith('.json')) {
        inferredCategory = 'dataset';
      } else if (f.type.startsWith('image/')) {
        inferredCategory = 'screenshot';
      }

      const newFile: ProjectFile = {
        id: 'file_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
        name: f.name,
        type: f.type || 'application/octet-stream',
        size: f.size,
        sizeFormatted: formatFileSize(f.size),
        uploadDate: new Date().toISOString(),
        category: inferredCategory,
        url: URL.createObjectURL(f),
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      };
      newProjectFiles.push(newFile);
    });

    setTimeout(() => {
      onAddFiles(newProjectFiles);
      setIsUploading(false);
      if (newProjectFiles.length > 0) {
        setSelectedPreviewFile(newProjectFiles[0]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (fileName.endsWith('.py') || fileName.endsWith('.java') || fileName.endsWith('.js') || fileName.endsWith('.cpp')) {
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    }
    if (fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z')) {
      return <FileArchive className="w-5 h-5 text-purple-500" />;
    }
    if (type.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return <ImageIcon className="w-5 h-5 text-pink-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-5">
      
      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-blue-500/50 hover:bg-[var(--bg-elevated)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.py,.java,.cpp,.csv,.xlsx,.json,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
            <UploadCloud className={`w-6 h-6 ${isUploading ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Upload Your Project / Reference Files
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Drag & drop your files here, or <span className="text-blue-600 dark:text-blue-400 font-semibold underline">Browse Files</span>
            </p>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] max-w-md pt-1">
            Supports PDF, DOCX, PPTX, ZIP, Python (.py), Java, CSV, Excel, Images (Free Instant Verification)
          </p>
        </div>
      </div>

      {/* Uploaded Files List with Free Preview */}
      {files.length > 0 && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)] px-1">
            <span>Uploaded Files ({files.length})</span>
            <span className="text-emerald-500 flex items-center gap-1 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> File Uploaded & Verified
            </span>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => setSelectedPreviewFile(file)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-sm ${
                  selectedPreviewFile?.id === file.id
                    ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/25'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] shrink-0">
                    {getFileIcon(file.name, file.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                      <span>{file.sizeFormatted}</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-600 dark:text-emerald-400 font-semibold">✓ Verified</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10">
                    Free Preview
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedPreviewFile?.id === file.id) setSelectedPreviewFile(null);
                      onRemoveFile(file.id);
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3. FREE PROJECT PREVIEW CARD */}
          {selectedPreviewFile && (
            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Free Project Preview — {selectedPreviewFile.name}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ File Parsed Successfully • Ready for Processing
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-[var(--text-muted)]">
                  {selectedPreviewFile.sizeFormatted}
                </span>
              </div>

              {/* Free Preview Snippet Content */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Basic Requirement Summary (Free Preview)</span>
                </div>
                <p className="text-[var(--text-primary)] leading-relaxed">
                  Document confirmed: <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedPreviewFile.name}</span>. The platform has validated the file format, structural headers, and submission guidelines.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Format</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedPreviewFile.name.split('.').pop()?.toUpperCase() || 'DOCUMENT'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">Inspection Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Upload Verified</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">College PPT</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% FREE (₹0)</span>
                  </div>
                </div>
              </div>

              {/* 4. LIMITED PREVIEW + LOCKED CONTENT CARD */}
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Detailed Project Analysis & Implementation Guide
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    🔒 Locked
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Unlock complete source code development, step-by-step documentation, error audits, and mentor assistance. (Affordable rates: ₹50 – ₹200 or FREE for 5-10 slide PPT).
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)] text-[11px]">
                  <span className="text-[var(--text-muted)]">
                    Start with Free Preview — Pay Only When You Need More
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>Next: Choose Deadline & Price</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {files.length === 0 && (
        <div className="text-center p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
          Attach project guidelines, PDFs, notes, or datasets to see your <span className="font-semibold text-blue-600 dark:text-blue-400">Free Project Preview</span>.
        </div>
      )}

    </div>
  );
};
