import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  Star,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminAnalyticsView: React.FC = () => {
  const { currency, projects, transactions, reviews, users } = useApp();

  const confirmedTransactions = transactions.filter(t => t.status === 'confirmed');
  const totalRevenue = confirmedTransactions.reduce((sum, t) => sum + t.amount, 0);

  const activeProjectsCount = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;
  const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
  const expertMentorsCount = users.filter(u => u.role === 'expert').length;

  const avgRatingText = reviews.length > 0
    ? `${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5`
    : 'No reviews yet';

  // Dynamic Category Stats computed directly from real projects
  const categoryCounts: Record<string, number> = {};
  projects.forEach(p => {
    const cat = p.requirement?.category || 'General Engineering';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryColors = [
    'bg-rose-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500'
  ];

  const categoryEntries = Object.entries(categoryCounts);
  const totalProjectEntries = projects.length || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Real Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Total Escrow Inflow</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            {confirmedTransactions.length} confirmed {confirmedTransactions.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Active Projects</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {activeProjectsCount}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            {completedProjectsCount} completed in database
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Verified Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
            {avgRatingText}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            {reviews.length} genuine {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Active Mentors</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {expertMentorsCount}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Verified expert roster</div>
        </div>

      </div>

      {/* Main Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Pipeline Summary (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Active Projects & Submissions Pipeline
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">Live database project orders</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              {projects.length} Total Projects
            </span>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                No project orders in the database yet.
              </div>
            ) : (
              projects.map(proj => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="font-bold text-[var(--text-primary)] truncate">
                      {proj.orderNumber}: {proj.requirement?.title || proj.requirement?.description?.substring(0, 40) || 'Project'}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {proj.requirement?.serviceType} • {proj.status}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {formatCurrency(proj.assessment.totalFinalPrice, currency)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Real Demand by Category
          </h4>

          {categoryEntries.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No project categories recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([catName, count], idx) => {
                const percent = Math.round((count / totalProjectEntries) * 100);
                const colorClass = categoryColors[idx % categoryColors.length];
                return (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[var(--text-secondary)]">
                      <span className="font-semibold truncate max-w-[180px]">{catName}</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-elevated)] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
