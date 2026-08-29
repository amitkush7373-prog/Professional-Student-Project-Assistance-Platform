import React, { useState } from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const TestimonialsSection: React.FC = () => {
  const { reviews } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="w-full py-16 lg:py-24 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Verified Student Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Trusted by Scholars Across Leading Universities
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Read authentic feedback from undergraduate and postgraduate students who mastered their project defense with our mentors.
          </p>
        </div>

        {/* Carousel / Featured Review */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map(item => (
            <div
              key={item.id}
              className="interactive-card rounded-2xl p-6 flex flex-col justify-between relative space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars & Verified Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Verified Order
                  </span>
                </div>

                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 line-clamp-1">
                  {item.projectTitle}
                </h4>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                  "{item.review}"
                </p>

                {item.whatWentWell && (
                  <div className="text-[11px] p-2.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] space-y-1">
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Key Highlight:
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)]">{item.whatWentWell}</p>
                  </div>
                )}
              </div>

              {/* Student Details */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{item.studentName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>{item.studentCollege}</span>
                  </div>
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  {formatDate(item.date)}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Universities List Banner */}
        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Mentoring Students From 80+ Premier Technical Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
            <span>IIT Delhi</span>
            <span>•</span>
            <span>BITS Pilani</span>
            <span>•</span>
            <span>NIT Trichy</span>
            <span>•</span>
            <span>IIT Bombay</span>
            <span>•</span>
            <span>Anna University</span>
            <span>•</span>
            <span>Delhi Technological University</span>
            <span>•</span>
            <span>SRM Institute</span>
            <span>•</span>
            <span>VIT Vellore</span>
          </div>
        </div>

      </div>
    </section>
  );
};
