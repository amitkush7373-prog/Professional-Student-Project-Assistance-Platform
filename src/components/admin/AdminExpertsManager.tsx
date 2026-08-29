import React, { useState } from 'react';
import {
  Users,
  Star,
  Plus,
  CheckCircle2,
  XCircle,
  Briefcase,
  ShieldCheck,
  Search,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

export const AdminExpertsManager: React.FC = () => {
  const { users, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');

  const experts = users.filter(u => u.role === 'expert');

  const filteredExperts = experts.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddExpertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addToast('Expert Added', `${name} has been added to the verified mentor pool.`, 'success');
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setBio('');
    setSkills('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search expert name or skills..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus-ring"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Expert</span>
        </button>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map(exp => (
          <div
            key={exp.id}
            className="interactive-card rounded-2xl p-6 border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={exp.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={exp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{exp.name}</h4>
                    <div className="text-[11px] text-[var(--text-muted)]">{exp.college || 'Senior Architect'}</div>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {exp.rating || 4.95}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {exp.bio || 'Experienced engineering mentor specialized in full-stack architecture, algorithm design, and thesis guidance.'}
              </p>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1">
                {exp.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Completed</span>
                <span className="font-bold text-[var(--text-primary)]">{exp.completedProjectsCount || 60}+ Projects</span>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" /> Available
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Onboard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Onboard Verified Expert Mentor</h4>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpertSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Sen"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="expert@apexproject.io"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="Python, PyTorch, React, Computer Vision, Docker"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Professional Bio & Credentials</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Ex-Research Scientist with 8+ years experience in deep learning systems..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Confirm Verification & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
