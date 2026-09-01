import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { InvoiceModal } from './components/checkout/InvoiceModal';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { ServicesGrid } from './components/landing/ServicesGrid';
import { WorkflowSteps } from './components/landing/WorkflowSteps';
import { PricingMatrixTable } from './components/landing/PricingMatrixTable';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { AcademicIntegritySection } from './components/landing/AcademicIntegritySection';
import { FaqAccordion } from './components/landing/FaqAccordion';

// Wizards & Checkout
import { ProjectSubmissionWizard } from './components/submission/ProjectSubmissionWizard';
import { ProjectAssessmentReview } from './components/submission/ProjectAssessmentReview';
import { CheckoutPage } from './components/checkout/CheckoutPage';

// Dashboards
import { StudentDashboard } from './components/student/StudentDashboard';
import { ProjectDetailView } from './components/student/ProjectDetailView';
import { ExpertDashboard } from './components/expert/ExpertDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AiPptGeneratorAgent } from './components/ai/AiPptGeneratorAgent';
import { AiReportGeneratorAgent } from './components/ai/AiReportGeneratorAgent';

// Support & Legal
import { HelpCenterPage } from './components/support/HelpCenterPage';
import { LegalPages } from './components/legal/LegalPages';

// Toast icons
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeView,
    toasts,
    removeToast,
    isInvoiceModalOpen,
    setIsInvoiceModalOpen,
    activeInvoiceProject,
    projects,
    selectedProjectId
  } = useApp();

  const invoiceProject = activeInvoiceProject || projects.find(p => p.id === selectedProjectId) || projects[0];

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return (
          <main>
            <HeroSection />
            <ServicesGrid />
            <WorkflowSteps />
            <PricingMatrixTable />
            <TestimonialsSection />
            <AcademicIntegritySection />
            <FaqAccordion />
          </main>
        );

      case 'services':
        return (
          <main className="pt-6">
            <ServicesGrid />
            <PricingMatrixTable />
            <AcademicIntegritySection />
          </main>
        );

      case 'pricing':
        return (
          <main className="pt-6">
            <PricingMatrixTable />
            <FaqAccordion />
          </main>
        );

      case 'submit':
        return <ProjectSubmissionWizard />;

      case 'assessment':
        return <ProjectAssessmentReview />;

      case 'checkout':
        return <CheckoutPage />;

      case 'ai-ppt-agent':
        return <AiPptGeneratorAgent />;

      case 'ai-report-agent':
        return <AiReportGeneratorAgent />;

      case 'student-dashboard':
        return <StudentDashboard />;

      case 'project-detail':
        return <ProjectDetailView />;

      case 'expert-dashboard':
        return <ExpertDashboard />;

      case 'admin-dashboard':
        return <AdminDashboard />;

      case 'support':
        return <HelpCenterPage />;

      case 'legal-terms':
      case 'legal-privacy':
      case 'legal-refund':
      case 'legal-integrity':
        return <LegalPages />;

      default:
        return (
          <main>
            <HeroSection />
            <ServicesGrid />
            <WorkflowSteps />
            <PricingMatrixTable />
            <TestimonialsSection />
            <AcademicIntegritySection />
            <FaqAccordion />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Route */}
      <div className="flex-1">
        {renderActiveView()}
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <NotificationDrawer />
      <AuthModal />
      {invoiceProject && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          project={invoiceProject}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full pointer-events-none no-print">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl glass-panel border border-[var(--border-color)] shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
              
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">{toast.title}</h5>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
