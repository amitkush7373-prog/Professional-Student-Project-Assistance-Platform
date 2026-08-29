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
  AlertCircle
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

      newProjectFiles.push({
        id: 'file_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
        name: f.name,
        type: f.type || 'application/octet-stream',
        size: f.size,
        sizeFormatted: formatFileSize(f.size),
        uploadDate: new Date().toISOString(),
        category: inferredCategory,
        url: URL.createObjectURL(f),
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      });
    });

    setTimeout(() => {
      onAddFiles(newProjectFiles);
      setIsUploading(false);
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
    <div className="space-y-4">
      
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
            Supports PDF, DOC/DOCX, PPT/PPTX, ZIP, RAR, Python (.py), Java, CSV, Excel, Images (Max 50 MB)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)] px-1">
            <span>Uploaded Files ({files.length})</span>
            <span className="text-emerald-500 flex items-center gap-1 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Mentor Review
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map(file => (
              <div
                key={file.id}
                className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-150"
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
                      <span className="capitalize text-emerald-500 font-semibold">✓ Uploaded</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remove File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
          No files uploaded yet. You can attach problem statements, notes, datasets, or existing code.
        </div>
      )}

    </div>
  );
};
