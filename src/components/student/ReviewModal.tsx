import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, project }) => {
  const { addReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('Excellent code architecture and IEEE report formatting. Mentor explained the complex modules clearly!');
  const [suggestions, setSuggestions] = useState('Keep adding more live pair programming slots.');

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview(project.id, rating, comment.trim(), whatWentWell.trim(), suggestions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">Rate Your Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Project Title Callout */}
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Project Reviewed</span>
            <div className="font-bold text-[var(--text-primary)]">{project.requirement.title}</div>
            <div className="text-[11px] text-[var(--text-muted)]">Assigned Mentor: {project.assignedExpertName || 'Verified Expert'}</div>
          </div>

          {/* Star Selector */}
          <div className="text-center space-y-2 py-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Overall Rating</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-500">
              {rating === 5 && 'Outstanding Mentorship (5/5)'}
              {rating === 4 && 'Great Guidance (4/5)'}
              {rating === 3 && 'Average (3/5)'}
              {rating <= 2 && 'Needs Improvement'}
            </span>
          </div>

          {/* Main Review Text */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Your Review & Feedback *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was your experience working with your mentor? Did it help your viva defense?"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

          {/* What went well */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              What went exceptionally well?
            </label>
            <input
              type="text"
              value={whatWentWell}
              onChange={e => setWhatWentWell(e.target.value)}
              placeholder="e.g. Prompt replies, clean code comments, on-time delivery"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Any suggestions for the platform?
            </label>
            <input
              type="text"
              value={suggestions}
              onChange={e => setSuggestions(e.target.value)}
              placeholder="e.g. Add more tech stack tutorials"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
            />
          </div>

          <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Verified Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
