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
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminAnalyticsView: React.FC = () => {
  const { currency, projects, transactions } = useApp();

  const totalRevenue = transactions.filter(t => t.status === 'confirmed').reduce((sum, t) => sum + t.amount, 0);

  const monthlyData = [
    { month: 'Mar', revenue: 42000, orders: 12 },
    { month: 'Apr', revenue: 68500, orders: 19 },
    { month: 'May', revenue: 94200, orders: 27 },
    { month: 'Jun', revenue: 145000, orders: 38 },
    { month: 'Jul', revenue: 182000, orders: 49 },
    { month: 'Aug', revenue: 238000, orders: 64 }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const categoryStats = [
    { name: 'AI, NLP & Computer Vision', count: 34, percent: 32, color: 'bg-rose-500' },
    { name: 'Full-Stack Web Development', count: 28, percent: 26, color: 'bg-blue-500' },
    { name: 'Python & FastAPI Backends', count: 18, percent: 17, color: 'bg-emerald-500' },
    { name: 'Machine Learning Pipelines', count: 15, percent: 14, color: 'bg-purple-500' },
    { name: 'Java & Spring Boot Microservices', count: 12, percent: 11, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Total Escrow Inflow</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(totalRevenue || 769450, currency)}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28.4% this month
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Average Turnaround</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            3.8 Days
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Target: &lt; 5.0 Days</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Defense Success Rate</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            99.6%
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Verified A/A+ grades</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold">
            <span>Active Mentor Roster</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            42 Leads
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">94% Utilization Rate</div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Inflow Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Revenue & Order Volume Velocity
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">Monthly student assistance escrow turnover (2026)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
              +142% YoY Growth
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCurrency(item.revenue, currency)}
                  </div>
                  <div className="w-full max-w-[48px] bg-[var(--bg-elevated)] rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 rounded-t-xl group-hover:brightness-110 transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-[var(--text-secondary)]">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Demand by Category
          </h4>

          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span className="truncate pr-2 font-medium">{cat.name}</span>
                  <span className="font-bold text-[var(--text-primary)]">{cat.percent}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
            AI, Transformers & Computer Vision lead total project demand by 32%.
          </div>
        </div>

      </div>

      {/* Tech Stack Distribution */}
      <div className="p-6 rounded-2xl glass-panel border border-[var(--border-color)] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Top 10 In-Demand Technologies & Frameworks
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Python (PyTorch / OpenCV)', count: '42%' },
            { name: 'React 18 & Next.js 14', count: '38%' },
            { name: 'Node.js & Express', count: '29%' },
            { name: 'Spring Boot & Java 21', count: '24%' },
            { name: 'PostgreSQL & Docker', count: '35%' },
            { name: 'Flutter & Dart', count: '18%' },
            { name: 'FastAPI & Microservices', count: '27%' },
            { name: 'Pandas & Power BI', count: '21%' },
            { name: 'IEEE SRS LaTeX Reports', count: '74%' },
            { name: 'AWS & Cloud Hosting', count: '31%' }
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs space-y-0.5">
              <div className="font-bold text-[var(--text-primary)] truncate">{t.name}</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{t.count} of all orders</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
