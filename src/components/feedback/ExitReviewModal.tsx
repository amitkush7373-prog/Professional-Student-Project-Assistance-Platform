import React, { useState, useEffect } from 'react';
import {
  Star,
  X,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  Heart,
  Send,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExitReviewModal: React.FC = () => {
  const {
    isExitReviewModalOpen,
    setIsExitReviewModalOpen,
    addPlatformReview,
    currentUser
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [studentName, setStudentName] = useState(currentUser?.name || 'Aarav Sharma');
  const [studentCollege, setStudentCollege] = useState(currentUser?.college || 'Delhi Technological University (DTU)');
  const [selectedTags, setSelectedTags] = useState<string[]>(['⚡ Fast AI Generator', '🎓 Academic Quality']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Available feedback tags
  const feedbackTags = [
    '⚡ Fast AI Generator',
    '🎓 Academic Quality',
    '💰 Affordable & Free PPT',
    '📄 Clean PDF & Word Export',
    '🛠️ Easy to Use',
    '👨‍🏫 Helpful Mentorship',
    '✨ Modern Clean UI'
  ];

  const ratingDescriptions: Record<number, string> = {
    1: '⭐ Poor experience — needs work',
    2: '⭐⭐ Fair — room for improvement',
    3: '⭐⭐⭐ Good — met project needs',
    4: '⭐⭐⭐⭐ Very Good — high quality assistance',
    5: '⭐⭐⭐⭐⭐ Outstanding & University Grade!'
  };

  // Exit-Intent Detector: Triggers when mouse moves towards top browser bar (tab switch / close)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if cursor moved out of the top of viewport (close/tab switch intent)
      if (e.clientY <= 15) {
        const lastPrompt = localStorage.getItem('apex_exit_review_last_prompt');
        const hasSubmitted = localStorage.getItem('apex_exit_review_submitted');
        
        // Don't prompt if already submitted or prompted within last 15 minutes
        if (hasSubmitted) return;
        if (lastPrompt && Date.now() - parseInt(lastPrompt, 10) < 1000 * 60 * 15) {
          return;
        }

        localStorage.setItem('apex_exit_review_last_prompt', Date.now().toString());
        setIsExitReviewModalOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [setIsExitReviewModalOpen]);

  if (!isExitReviewModalOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const comment = reviewText.trim() || `Great experience! Highlighted: ${selectedTags.join(', ')}.`;
    
    addPlatformReview({
      studentName: studentName.trim() || currentUser?.name || 'Verified Student',
      studentCollege: studentCollege.trim() || currentUser?.college || 'University Scholar',
      projectTitle: 'Apex Academic & AI Project Assistance',
      rating,
      review: comment,
      whatWentWell: selectedTags.join(' • ') || 'Fast turnaround and high quality output',
      suggestions: ''
    });

    localStorage.setItem('apex_exit_review_submitted', 'true');
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsExitReviewModalOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Confirmation View */}
        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Thank You for Your Review! 🎓
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                Your feedback has been published to our scholar community. It helps us continually elevate student project excellence.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        ) : (
          /* Main Review Form View */
          <form onSubmit={handleSubmitReview} className="space-y-5">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Before You Go — Quick 10-Sec Review</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                How Was Your Experience?
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Your review helps us refine our AI PPT generator, project report automation, and mentorship.
              </p>
            </div>

            {/* Star Rating Interactive Widget */}
            <div className="text-center space-y-2 py-2">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(starNum => {
                  const isActive = (hoverRating || rating) >= starNum;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starNum)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isActive
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono">
                {ratingDescriptions[hoverRating || rating]}
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                What did you like most?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {feedbackTags.map((tag, idx) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Comment Box */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Your Feedback / Review (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Tell us what you liked, suggested improvements, or your thoughts on the generated PPT/Report..."
                className="w-full p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring placeholder-[var(--text-muted)]"
              />
            </div>

            {/* Student Details (Editable) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-muted)] mb-1">Your Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-muted)] mb-1">College / University</label>
                <input
                  type="text"
                  value={studentCollege}
                  onChange={e => setStudentCollege(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Maybe Later
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review ({rating}⭐)</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
