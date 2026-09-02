import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  HelpCircle,
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'Ordering & Pricing',
    question: 'How is the project price and delivery time calculated?',
    answer: 'Our dynamic AI engine determines delivery time automatically based on project scope (Quick Tasks: ~5–30 minutes, Standard Projects: ~30m–4 hours, Complex Systems: ~4–12 hours max). Pricing is strictly capped at ₹100 MAX with Basic College PPT 100% FREE. There are zero hidden fees and no deadline markups.'
  },
  {
    id: 'faq_2',
    category: 'Mentorship & Code Quality',
    question: 'Who will be working on my project and how are mentors verified?',
    answer: 'Every mentor on ApexProject undergoes rigorous verification, including background technical assessments, code quality reviews, and credential validation. Our roster comprises senior full-stack software architects, AI research scientists, and PhD scholars from top tech firms and research labs.'
  },
  {
    id: 'faq_3',
    category: 'Mentorship & Code Quality',
    question: 'Will the source code be commented and easy to explain during my Viva?',
    answer: 'Yes! High code readability is our cornerstone. Every module, function, and complex algorithm includes clear explanatory docstrings and comments. Additionally, every package includes a comprehensive README with local setup steps and command-line execution instructions.'
  },
  {
    id: 'faq_4',
    category: 'Deadlines & Revisions',
    question: 'What happens if my college professor requests modifications or revisions?',
    answer: 'We include free revisions with every order. If your university guide or professor reviews the draft and asks for minor changes or parameter tuning, simply click "Request Revision" in your project workstation and your assigned mentor will implement the updates promptly.'
  },
  {
    id: 'faq_5',
    category: 'Deadlines & Revisions',
    question: 'How fast can I get my college project deliverables?',
    answer: 'Our AI automation delivers simple tasks and PPT decks in ~5–30 minutes, standard mini-projects in ~30m–4 hours, and complex major capstone systems in ~4–12 hours maximum. You never have to wait days.'
  },
  {
    id: 'faq_6',
    category: 'Payment & Escrow',
    question: 'Which payment methods are accepted and how is escrow managed?',
    answer: 'We support all major payment modes across India and globally, including UPI (Google Pay, PhonePe, Paytm, BHIM QR), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across all top banks, and digital wallets. Your payment is held securely in escrow and released only upon successful deliverable milestones.'
  },
  {
    id: 'faq_7',
    category: 'Academic Integrity',
    question: 'Is using ApexProject compliant with academic integrity rules?',
    answer: 'ApexProject provides educational tutoring, coding mentorship, bug fixes, reference implementations, and technical documentation guidance. Students remain responsible for mastering the code and adhering to their university honor code policies. We provide 1-on-1 walkthrough sessions so you fully grasp the architecture.'
  }
];

export const FaqAccordion: React.FC = () => {
  const { setActiveView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>('faq_1');

  const categories = ['All', 'Ordering & Pricing', 'Mentorship & Code Quality', 'Deadlines & Revisions', 'Payment & Escrow', 'Academic Integrity'];

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full py-16 lg:py-24 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Everything you need to know about our project assistance workflow, pricing, delivery, and guarantees.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search FAQs by keywords (e.g. revisions, pricing, UPI, IEEE, viva)..."
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <p className="text-sm font-semibold text-[var(--text-secondary)]">No FAQs match your search query.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Have a specific question? Reach out to our 24/7 technical desk.</p>
              <button
                onClick={() => setActiveView('support')}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Open Support Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filteredFaqs.map(faq => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Still have questions?</h4>
            <p className="text-xs text-[var(--text-secondary)]">Our engineering project advisors are available 24/7 on chat and tickets.</p>
          </div>
          <button
            onClick={() => setActiveView('support')}
            className="px-5 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Support Team</span>
          </button>
        </div>

      </div>
    </section>
  );
};
