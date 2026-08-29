import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Code2,
  Paperclip,
  Smile,
  CheckCheck,
  Clock,
  User as UserIcon,
  Briefcase,
  Copy,
  Check,
  Sparkles,
  FileCode,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, Message } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface ProjectChatProps {
  project: Project;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({ project }) => {
  const { currentUser, messages, sendMessage, addToast } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const projectMessages = messages.filter(m => m.projectId === project.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [projectMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    sendMessage(project.id, inputContent.trim());
    setInputContent('');
  };

  const handleSendCodeSnippet = () => {
    if (!codeSnippet.trim()) return;
    sendMessage(
      project.id,
      inputContent.trim() || `Shared a ${codeLanguage.toUpperCase()} code snippet`,
      {
        code: codeSnippet.trim(),
        language: codeLanguage
      }
    );
    setCodeSnippet('');
    setInputContent('');
    setIsCodeModalOpen(false);
  };

  const handleCopyCode = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
    addToast('Copied', 'Code snippet copied to clipboard', 'info');
  };

  const quickPrompts = [
    'Could you please share the README setup commands?',
    'Can we review the database ER diagram schema?',
    'Is the IEEE documentation draft ready for review?',
    'How do I run the FastAPI server locally?'
  ];

  return (
    <div className="h-[600px] flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-lg">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/15 text-blue-600 flex items-center justify-center font-bold">
            {project.assignedExpertName ? project.assignedExpertName.charAt(0) : 'M'}
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{project.assignedExpertName || 'Lead Systems Architect'}</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Verified Mentor
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Direct Project Thread • Order: {project.orderNumber}
            </div>
          </div>
        </div>

        <div className="text-right text-[10px] text-[var(--text-muted)] font-mono hidden sm:block">
          All messages encrypted & stored
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-primary)]/50">
        
        {/* Mentor Welcome Notice */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[var(--text-secondary)] text-center max-w-md mx-auto space-y-1">
          <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Technical Collaboration Desk
          </span>
          <p className="text-[11px]">
            Exchange requirements, ask algorithm questions, and request code explanations directly with your assigned mentor.
          </p>
        </div>

        {projectMessages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] mx-auto flex items-center justify-center">
              <Code2 className="w-5 h-5 opacity-40" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">No messages in this project yet.</p>
            <p className="text-[11px] text-[var(--text-muted)]">Send a message or code snippet below to begin collaborating!</p>
          </div>
        ) : (
          projectMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] px-1">
                  <span className="font-bold text-[var(--text-secondary)]">{msg.senderName}</span>
                  <span className="capitalize text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-elevated)]">
                    {msg.senderRole}
                  </span>
                  <span>• {formatRelativeTime(msg.timestamp)}</span>
                </div>

                <div
                  className={`max-w-lg rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/15'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Code Snippet Box if attached */}
                  {msg.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 font-mono text-[11px] mt-2">
                      <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800">
                        <span>{msg.codeSnippet.language.toUpperCase()}</span>
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 overflow-x-auto text-slate-200">
                        <code>{msg.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] px-1">
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                  <span>Delivered</span>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase shrink-0 pl-1">
          Quick:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInputContent(qp)}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-blue-600 hover:border-blue-500/40 transition-colors shrink-0 truncate max-w-[200px]"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Action Bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-2">
        
        {/* Code Snippet Button */}
        <button
          type="button"
          onClick={() => setIsCodeModalOpen(true)}
          className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
          title="Share code snippet"
        >
          <Code2 className="w-4 h-4" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={inputContent}
          onChange={e => setInputContent(e.target.value)}
          placeholder={`Type message to ${project.assignedExpertName || 'mentor'}...`}
          className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={!inputContent.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/25 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Modal for Code Snippet Sharing */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-500" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Attach Code Snippet</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Language</label>
              <select
                value={codeLanguage}
                onChange={e => setCodeLanguage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="java">Java</option>
                <option value="sql">SQL / Database</option>
                <option value="html">HTML / CSS</option>
                <option value="bash">Bash / Shell</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Code</label>
              <textarea
                rows={8}
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                placeholder="Paste your source code or error logs here..."
                className="w-full p-3 font-mono text-xs rounded-xl border border-[var(--border-color)] bg-slate-950 text-slate-200 focus-ring"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCodeSnippet}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Post Code to Chat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
