import { ProjectCategory, ProjectStatus, PaymentStatus, ComplexityLevel, UrgencyLevel } from '../types';

export function formatCurrency(amount: number, currency: 'INR' | 'USD' = 'INR'): string {
  if (currency === 'USD') {
    const usdAmount = Math.round(amount / 83);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(usdAmount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateString);
}

export interface CountdownInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  formatted: string;
}

export function getCountdown(deadlineDateString: string): CountdownInfo {
  if (!deadlineDateString) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false, formatted: 'No deadline' };
  }
  const deadline = new Date(deadlineDateString).getTime();
  const now = new Date().getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true, formatted: 'Deadline reached' };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m left`;
  } else {
    formatted = `${minutes}m ${seconds}s left`;
  }

  return { days, hours, minutes, seconds, isOverdue: false, formatted };
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getStatusBadge(status: ProjectStatus): { label: string; bg: string; text: string; border: string } {
  switch (status) {
    case 'submitted':
      return { label: 'Submitted', bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' };
    case 'under_review':
      return { label: 'Under Review', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' };
    case 'quotation_ready':
      return { label: 'Quote Ready', bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' };
    case 'payment_pending':
      return { label: 'Payment Pending', bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' };
    case 'verification_pending':
      return { label: 'Verification Pending', bg: 'bg-amber-500/15 dark:bg-amber-500/25', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' };
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30' };
    case 'review':
      return { label: 'Quality Review', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' };
    case 'revision_requested':
      return { label: 'Revision In Progress', bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' };
    case 'download_available':
      return { label: 'Deliverables Ready', bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/30' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30' };
    default:
      return { label: String(status).replace('_', ' '), bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/30' };
  }
}

export function getPaymentStatusBadge(status: PaymentStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'verified':
    case 'confirmed':
      return { label: '🟢 Paid', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400' };
    case 'verification_pending':
      return { label: '🟡 Payment Submitted', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30', text: 'text-amber-600 dark:text-amber-400' };
    case 'pending':
      return { label: '🟡 Pending', bg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30', text: 'text-orange-600 dark:text-orange-400' };
    case 'rejected':
      return { label: '🔴 Payment Issue', bg: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30', text: 'text-red-600 dark:text-red-400' };
    case 'refunded':
      return { label: 'Refunded', bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30', text: 'text-slate-600 dark:text-slate-400' };
    default:
      return { label: String(status), bg: 'bg-slate-500/15 text-slate-600 border border-slate-500/30', text: 'text-slate-600' };
  }
}

export function getCategoryTitle(category: ProjectCategory): string {
  const titles: Record<ProjectCategory, string> = {
    'college-project': 'College Project',
    'web-dev': 'Web Development',
    'python': 'Python Projects & Scripts',
    'java': 'Java & Spring Boot Projects',
    'data-science': 'Data Science & Analysis',
    'data-analytics': 'Data Analytics & BI',
    'ai-ml': 'AI / Machine Learning',
    'machine-learning': 'Machine Learning Models',
    'ai-nlp-cv': 'AI, NLP & Computer Vision',
    'ppt-presentation': 'PPT Presentation',
    'project-review': 'Project Review & Audit',
    'debugging': 'Debugging & Bug Fixing',
    'debugging-fixing': 'Debugging & Bug Fixing',
    'documentation': 'Project Documentation',
    'documentation-srs': 'SRS & Academic Documentation',
    'viva-prep': 'Viva Preparation',
    'viva-preparation': 'Viva & Presentation Prep',
    'deployment': 'Cloud & Live Deployment',
    'deployment-cloud': 'Cloud Hosting & CI/CD Deployment',
    'mobile-apps': 'Mobile Apps (Flutter/React Native/Android)',
    'database-systems': 'Database & SQL Architecture',
    'ui-ux-design': 'UI/UX Design & Prototyping',
    'technical-guidance': 'Technical 1-on-1 Guidance',
    'other': 'Custom Project Assistance'
  };
  return titles[category] || category;
}

export function getComplexityLabel(complexity: ComplexityLevel): { title: string; desc: string; color: string } {
  switch (complexity) {
    case 'small':
      return {
        title: 'Small Project',
        desc: 'Single script, basic website, bug fix, or minor database schema',
        color: 'text-emerald-500'
      };
    case 'medium':
      return {
        title: 'Medium Project',
        desc: 'Full-stack web application, data analysis pipeline, or multi-module Java/Python project',
        color: 'text-blue-500'
      };
    case 'large':
      return {
        title: 'Large & Advanced Project',
        desc: 'Enterprise full-stack, end-to-end ML/AI model with UI, distributed system, or mobile app',
        color: 'text-purple-500'
      };
    case 'evaluate-for-me':
      return {
        title: 'Smart AI Evaluation',
        desc: 'System automatically analyzes requirement complexity and assigns optimal scope & tier',
        color: 'text-amber-500'
      };
  }
}

export function getUrgencyLabel(urgency: UrgencyLevel): { title: string; days: string; tag: string } {
  switch (urgency) {
    case 'standard':
      return { title: 'Quick Task', days: '~5–30 Minutes', tag: 'Fast Automated' };
    case 'priority':
      return { title: 'Standard Project', days: '~30m–4 Hours', tag: 'Most Popular' };
    case 'urgent':
      return { title: 'Complex Project', days: '~4–12 Hours', tag: 'Deep Synthesis' };
    case 'same-day':
      return { title: 'Expedited Review', days: '~1–2 Hours', tag: 'Priority Queue' };
  }
}
