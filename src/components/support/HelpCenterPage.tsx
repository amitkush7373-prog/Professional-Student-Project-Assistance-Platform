import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  LifeBuoy,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import { formatDate } from '../../utils/formatters';

export const HelpCenterPage: React.FC = () => {
  const { currentUser, supportTickets, createSupportTicket, addTicketReply } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // New ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Billing' | 'Project Technical' | 'Expert Communication' | 'Delivery Issue' | 'General'>('Project Technical');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');

  // Reply text
  const [replyText, setReplyText] = useState('');

  const myTickets = supportTickets.filter(t => t.userId === currentUser.id || currentUser.role === 'admin');

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId) || myTickets[0];

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    createSupportTicket(
      {
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        priority: ticketPriority,
        status: 'open'
      },
      ticketMessage.trim()
    );

    setIsNewTicketModalOpen(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    addTicketReply(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="w-full py-10 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 Technical Support Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Open a high-priority ticket with our engineering support staff or reach our advisors directly.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Email Support</h4>
            <p className="text-xs text-[var(--text-muted)]">Direct response within 2 hours</p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">support@apexproject.io</div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Helpline & WhatsApp</h4>
            <p className="text-xs text-[var(--text-muted)]">Immediate project guidance</p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+91 (800) 555-APEX</div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Live Ticket System</h4>
            <p className="text-xs text-[var(--text-muted)]">Track ticket resolution in real-time</p>
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>+ Log New Ticket</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tickets System View */}
        <div className="rounded-3xl glass-panel border border-[var(--border-color)] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between flex-wrap gap-4 bg-[var(--bg-elevated)]">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Support Tickets & Inquiries</h3>
              <p className="text-xs text-[var(--text-muted)]">View past conversations with the platform resolution team</p>
            </div>

            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Support Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
            
            {/* Tickets Roster (4 cols) */}
            <div className="lg:col-span-5 border-r border-[var(--border-color)] divide-y divide-[var(--border-color)] overflow-y-auto max-h-[500px]">
              {myTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                  No active support tickets logged.
                </div>
              ) : (
                myTickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 cursor-pointer transition-colors space-y-1 ${
                      selectedTicket?.id === t.id
                        ? 'bg-blue-500/10 border-l-4 border-blue-600'
                        : 'hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-600">{t.id}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">{t.subject}</div>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                      <span>{t.category}</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Conversation View (7 cols) */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
              {selectedTicket ? (
                <>
                  <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.id}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                          {selectedTicket.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">{selectedTicket.subject}</h4>
                    </div>

                    {/* Messages list */}
                    <div className="space-y-3">
                      {selectedTicket.messages.map(m => (
                        <div key={m.id} className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-[var(--text-primary)]">{m.sender}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-normal">{formatDate(m.timestamp)}</span>
                          </div>
                          <p className="text-[var(--text-secondary)] leading-relaxed">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Box */}
                  <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-[var(--border-color)]">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your response to support..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-[var(--text-muted)]">
                  Select a ticket on the left to view messages.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-blue-500" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Open New Support Inquiry</h4>
              </div>
              <button onClick={() => setIsNewTicketModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question regarding IEEE format citations"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  >
                    <option value="Project Technical">Project Technical</option>
                    <option value="Billing">Billing & Payments</option>
                    <option value="Expert Communication">Expert Communication</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Describe your query in detail *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Provide all relevant details or order ID..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Submit Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
