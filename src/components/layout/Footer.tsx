import React from 'react';
import {
  Code2,
  ShieldCheck,
  Lock,
  Clock,
  Award,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, setLegalTab, openExitReviewModal } = useApp();

  const handleLegalClick = (tab: 'terms' | 'privacy' | 'refund' | 'integrity') => {
    setLegalTab(tab);
    setActiveView('legal-' + tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors duration-200">
      
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[var(--border-color)] bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-cyan-900/10 dark:from-blue-950/40 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">Verified Mentorship</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Code Guidance & Tutoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">Automated Delivery</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Real-Time Progress & Milestones</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">Escrow Protected Payments</h4>
                <p className="text-[11px] text-[var(--text-muted)]">UPI, Cards, NetBanking with Invoices</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">Academic Ethics Compliance</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Tutoring, Guidance & Clean Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                ApexProject
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pr-4">
              The premier professional engineering assistance and academic project mentoring platform. We connect college and university students with verified software architects for technical guidance, debugging, clean code architecture, and IEEE-standard documentation.
            </p>

            <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs space-y-1">
              <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Academic Integrity Commitment</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                Our services are provided as educational mentorship, tutoring, coding guidance, and technical reference material. Students are responsible for understanding their institution's honor code.
              </p>
            </div>
          </div>

          {/* Popular Project Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Services & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  AI, NLP & Computer Vision
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Machine Learning & Data Science
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Full-Stack Web (React / Next.js)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Python & FastAPI Backend
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Java & Spring Boot Microservices
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Flutter & Mobile Applications
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  IEEE SRS & Thesis Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('submit')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-blue-600 dark:text-blue-400">
                  + Start New Submission
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('student-dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pricing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dynamic Pricing Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('support')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Help Center & Tickets
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('expert-dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Expert Mentor Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ai-ppt-agent')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-colors flex items-center gap-1">
                  <span>⚡ AI Presentation Agent (Free)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ai-report-agent')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors flex items-center gap-1">
                  <span>📄 AI Report Generator</span>
                </button>
              </li>
              <li>
                <button onClick={openExitReviewModal} className="text-amber-600 dark:text-amber-400 font-bold hover:underline transition-colors flex items-center gap-1">
                  <span>⭐ Rate Experience / Leave Review</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  <span>🛡️ Staff Admin Hub (Passcode)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLegalClick('integrity')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Academic Integrity Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLegalClick('terms')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleLegalClick('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLegalClick('refund')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Refund & Escrow Policy
                </button>
              </li>
            </ul>

            <div className="pt-2 text-xs space-y-1.5 text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>support@apexproject.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>+91 (800) 555-APEX</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} ApexProject Technologies Inc. All rights reserved. GST Reg: 07AAACA1234B1Z5</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.9% Platform Uptime
            </span>
            <span>Made for Engineers & Academic Scholars</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
