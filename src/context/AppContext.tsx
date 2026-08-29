import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Project,
  Message,
  PlatformReview,
  SupportTicket,
  Transaction,
  PricingConfig,
  NotificationItem,
  ProjectStatus,
  PaymentStatus,
  PaymentMethod,
  DeliverableItem,
  PaymentSettings
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_SUPPORT_TICKETS
} from '../data/initialData';
import { DEFAULT_PRICING_CONFIG } from '../utils/pricingEngine';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  qrCodeUrl: '/phonepe-qr.png',
  upiId: '7618820563-2@ybl',
  merchantName: 'Apex Student Project Assistance (PhonePe / UPI)',
  instructions: 'Scan this official PhonePe / UPI QR Code using Google Pay, PhonePe, Paytm, or BHIM. After completing payment, upload your payment screenshot and enter the 12-digit UTR number for admin verification.'
};

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  loginAsDemoUser: (role: UserRole) => void;

  // Theming & Localization
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;

  // Navigation & Routing State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  legalTab: 'terms' | 'privacy' | 'refund' | 'integrity';
  setLegalTab: (tab: 'terms' | 'privacy' | 'refund' | 'integrity') => void;

  // Projects & Orders
  projects: Project[];
  draftSubmission: any;
  setDraftSubmission: (data: any) => void;
  pendingCheckoutProject: Project | null;
  setPendingCheckoutProject: (project: Project | null) => void;
  submitNewProject: (projectData: any) => Project;
  updateProjectStatus: (projectId: string, status: ProjectStatus, progress?: number) => void;
  assignExpertToProject: (projectId: string, expertId: string) => void;
  uploadProjectDeliverable: (projectId: string, deliverable: Omit<DeliverableItem, 'id' | 'uploadedAt'>) => void;
  requestRevision: (projectId: string, notes: string) => void;

  // Chat & Messaging
  messages: Message[];
  sendMessage: (projectId: string, content: string, codeSnippet?: { code: string; language: string }, attachment?: any) => void;
  getProjectMessages: (projectId: string) => Message[];

  // Pricing Matrix Configuration (Admin editable, strictly ₹100 - ₹700)
  pricingConfig: PricingConfig;
  updatePricingConfig: (newConfig: PricingConfig) => void;
  resetPricingConfig: () => void;

  // Payment Settings (Admin QR & UPI configuration)
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  resetPaymentSettings: () => void;

  // Payments & Verification Engine
  transactions: Transaction[];
  processPayment: (projectId: string, method: PaymentMethod, details?: any) => Promise<boolean>;
  submitManualPayment: (projectId: string, utrNumber: string, paymentProofUrl?: string) => void;
  verifyPayment: (projectId: string, approved: boolean, reason?: string) => void;
  processRefund: (transactionId: string, reason: string) => void;

  // Reviews & Feedback
  reviews: PlatformReview[];
  addReview: (projectId: string, rating: number, comment: string, whatWentWell: string, suggestions: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, messageText: string) => void;
  addTicketReply: (ticketId: string, text: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Quick Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  activeInvoiceProject: Project | null;
  setActiveInvoiceProject: (p: Project | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'apex_theme_v2',
  CURRENCY: 'apex_currency_v2',
  USERS: 'apex_users_v2',
  CURRENT_USER_ID: 'apex_current_user_id_v2',
  PROJECTS: 'apex_projects_v2',
  MESSAGES: 'apex_messages_v2',
  PRICING: 'apex_pricing_config_v2',
  PAYMENT_SETTINGS: 'apex_payment_settings_v3',
  TRANSACTIONS: 'apex_transactions_v2',
  REVIEWS: 'apex_reviews_v2',
  NOTIFICATIONS: 'apex_notifications_v2',
  SUPPORT_TICKETS: 'apex_support_tickets_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  // Currency
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Navigation state
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'integrity'>('integrity');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeInvoiceProject, setActiveInvoiceProject] = useState<Project | null>(null);

  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (savedId) {
        const found = INITIAL_USERS.find(u => u.id === savedId);
        if (found) return found;
      }
      return INITIAL_USERS[0]; // Aarav Sharma (student)
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Draft Submission State
  const [draftSubmission, setDraftSubmission] = useState<any>(null);
  const [pendingCheckoutProject, setPendingCheckoutProject] = useState<Project | null>(null);

  // Messages State
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Pricing Matrix State
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
      return saved ? JSON.parse(saved) : DEFAULT_PRICING_CONFIG;
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  });

  // Payment Settings (Admin QR & UPI configuration)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<PlatformReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
    } catch {
      return INITIAL_SUPPORT_TICKETS;
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif_1',
          userId: 'user_student_1',
          title: 'Project Milestone Reached',
          message: 'Dr. Vikram Sethi updated progress on AI Diagnostic Assistant to 68%.',
          type: 'info',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'notif_2',
          userId: 'user_student_1',
          title: 'Deliverables Ready to Download',
          message: 'CampusConnect project completed! Download your verified source code and IEEE report.',
          type: 'success',
          read: false,
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync Theme to HTML and LocalStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync States to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Role switching
  const switchRole = (role: UserRole) => {
    const userForRole = users.find(u => u.role === role) || users[0];
    setCurrentUser(userForRole);
    if (role === 'student') setActiveView('student-dashboard');
    else if (role === 'expert') setActiveView('expert-dashboard');
    else if (role === 'admin') setActiveView('admin-dashboard');
    addToast('Role Switched', `Active workspace: ${role.toUpperCase()}`, 'info');
  };

  const loginAsDemoUser = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      setIsAuthModalOpen(false);
      if (role === 'student') setActiveView('student-dashboard');
      else if (role === 'expert') setActiveView('expert-dashboard');
      else if (role === 'admin') setActiveView('admin-dashboard');
      addToast('Welcome Back!', `Logged in as ${target.name} (${role.toUpperCase()})`, 'success');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Submit Project
  const submitNewProject = (projectData: any): Project => {
    const orderNumber = 'APX-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newProject: Project = {
      ...projectData,
      id: 'proj_' + Date.now().toString(36),
      orderNumber,
      studentId: currentUser.id,
      status: 'payment_pending',
      paymentStatus: 'pending',
      progress: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliverables: []
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);

    addNotification({
      userId: currentUser.id,
      title: 'Order Created',
      message: `Your project requirement "${newProject.requirement.title}" has been registered (#${orderNumber}).`,
      type: 'project_update',
      read: false
    });

    addToast('Project Submitted Successfully', `Order ${newProject.orderNumber} is now ready for payment.`, 'success');

    return newProject;
  };

  // Update Status
  const updateProjectStatus = (projectId: string, status: ProjectStatus, progress?: number) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const updatedProgress = progress !== undefined ? progress : p.progress;
          return {
            ...p,
            status,
            progress: updatedProgress,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    const project = projects.find(p => p.id === projectId);
    if (project) {
      addNotification({
        userId: project.studentId,
        title: 'Project Status Updated',
        message: `Project "${project.requirement.title}" status changed to: ${status.replace('_', ' ').toUpperCase()}`,
        type: 'project_update',
        read: false
      });
      addToast('Status Updated', `Project status set to ${status.replace('_', ' ').toUpperCase()}`, 'info');
    }
  };

  // Assign Expert
  const assignExpertToProject = (projectId: string, expertId: string) => {
    const expert = users.find(u => u.id === expertId);
    if (!expert) return;

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            assignedExpertId: expert.id,
            assignedExpertName: expert.name,
            status: p.status === 'submitted' || p.status === 'under_review' ? 'quotation_ready' : p.status,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    const project = projects.find(p => p.id === projectId);
    if (project) {
      addNotification({
        userId: project.studentId,
        title: 'Expert Assigned',
        message: `${expert.name} has been assigned as your technical mentor for "${project.requirement.title}".`,
        type: 'project_update',
        read: false
      });
      addToast('Expert Assigned', `${expert.name} assigned to ${project.orderNumber}`, 'success');
    }
  };

  // Upload Deliverable
  const uploadProjectDeliverable = (projectId: string, deliverable: Omit<DeliverableItem, 'id' | 'uploadedAt'>) => {
    const newDeliverable: DeliverableItem = {
      ...deliverable,
      id: 'deliv_' + Date.now().toString(36),
      uploadedAt: new Date().toISOString()
    };

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const currentDelivs = p.deliverables || [];
          const updatedDelivs = [...currentDelivs, newDeliverable];
          return {
            ...p,
            deliverables: updatedDelivs,
            status: updatedDelivs.every(d => d.isReady) ? 'download_available' : 'review',
            progress: updatedDelivs.every(d => d.isReady) ? 100 : p.progress,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    const project = projects.find(p => p.id === projectId);
    if (project) {
      addNotification({
        userId: project.studentId,
        title: 'Deliverables Ready',
        message: `Your project files for "${project.requirement.title}" are ready to download.`,
        type: 'project_update',
        read: false
      });
      addToast('Deliverable Uploaded', `Uploaded ${newDeliverable.title}`, 'success');
    }
  };

  // Revision Request
  const requestRevision = (projectId: string, notes: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'revision_requested',
            revisionNotes: notes,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    const project = projects.find(p => p.id === projectId);
    if (project && project.assignedExpertId) {
      addNotification({
        userId: project.assignedExpertId,
        title: 'Revision Requested by Student',
        message: `Student requested revisions on "${project.requirement.title}". Notes: ${notes.slice(0, 80)}...`,
        type: 'project_update',
        read: false
      });
    }
    addToast('Revision Submitted', 'Your revision request has been relayed to your assigned expert.', 'info');
  };

  // Messaging Engine
  const sendMessage = (
    projectId: string,
    content: string,
    codeSnippet?: { code: string; language: string },
    attachment?: any
  ) => {
    const newMessage: Message = {
      id: 'msg_' + Date.now().toString(36),
      projectId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content,
      codeSnippet,
      attachments: attachment ? [attachment] : undefined,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const getProjectMessages = (projectId: string): Message[] => {
    return messages.filter(m => m.projectId === projectId);
  };

  // Pricing Matrix Updates
  const updatePricingConfig = (newConfig: PricingConfig) => {
    setPricingConfig(newConfig);
    addToast('Pricing Matrix Updated', 'Dynamic pricing rules saved successfully.', 'success');
  };

  const resetPricingConfig = () => {
    setPricingConfig(DEFAULT_PRICING_CONFIG);
    addToast('Pricing Defaults Restored', 'Reset to student-friendly pricing baseline.', 'info');
  };

  // Payment Settings Updates
  const updatePaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettings(settings);
    addToast('Payment Settings Updated', 'Custom UPI QR Code and UPI ID saved.', 'success');
  };

  const resetPaymentSettings = () => {
    setPaymentSettings(DEFAULT_PAYMENT_SETTINGS);
    addToast('Payment Settings Reset', 'Default UPI configuration restored.', 'info');
  };

  // Process Online / Simulated Payment
  const processPayment = async (projectId: string, method: PaymentMethod, details?: any): Promise<boolean> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;

    const invoiceNum = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const gatewayRef =
      method === 'upi'
        ? `UPI/${Date.now()}/${details?.vpa || 'OKAXIS'}`
        : method === 'card'
        ? `CARD_AUTH_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
        : `NETBANK_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const newTxn: Transaction = {
      id: 'txn_' + Date.now().toString(36),
      projectId: project.id,
      projectTitle: project.requirement.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      amount: project.assessment.totalFinalPrice,
      paymentMethod: method,
      status: 'confirmed',
      transactionDate: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      gatewayRef,
      upiIdOrCardEnding: details?.vpa || details?.cardEnding || 'UPI / Online'
    };

    // Update project state
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            paymentStatus: 'confirmed',
            status: 'in_progress',
            progress: 25,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    setTransactions(prev => [newTxn, ...prev]);

    addNotification({
      userId: currentUser.id,
      title: 'Payment Successful',
      message: `Payment of ₹${project.assessment.totalFinalPrice} confirmed for Order ${project.orderNumber}. Invoice ${invoiceNum} generated.`,
      type: 'payment',
      read: false
    });

    addToast('Payment Confirmed!', `Payment of ₹${project.assessment.totalFinalPrice} verified. Your project is now In Progress.`, 'success');

    return true;
  };

  // Submit Manual UPI Payment with Screenshot & UTR
  const submitManualPayment = (projectId: string, utrNumber: string, paymentProofUrl?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const invoiceNum = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newTxn: Transaction = {
      id: 'txn_' + Date.now().toString(36),
      projectId: project.id,
      projectTitle: project.requirement.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      amount: project.assessment.totalFinalPrice,
      paymentMethod: 'manual_upi',
      status: 'verification_pending',
      transactionDate: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      gatewayRef: `UTR-${utrNumber || 'MANUAL-PENDING'}`,
      upiIdOrCardEnding: paymentSettings.upiId,
      utrNumber,
      paymentProofUrl
    };

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            paymentStatus: 'verification_pending',
            status: 'verification_pending',
            utrNumber,
            paymentProofUrl,
            paymentSubmittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    setTransactions(prev => [newTxn, ...prev]);

    addNotification({
      userId: currentUser.id,
      title: 'Payment Submitted for Verification',
      message: `Your payment of ₹${project.assessment.totalFinalPrice} (UTR: ${utrNumber}) has been submitted. Our team will verify it shortly.`,
      type: 'payment',
      read: false
    });

    addToast('Payment Submitted for Verification', `UTR: ${utrNumber}. Admin verification pending.`, 'info');
  };

  // Admin Payment Verification (Approve or Reject)
  const verifyPayment = (projectId: string, approved: boolean, reason?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            paymentStatus: approved ? 'confirmed' : 'rejected',
            status: approved ? 'in_progress' : 'payment_pending',
            progress: approved ? (p.progress < 20 ? 20 : p.progress) : p.progress,
            paymentVerifiedAt: approved ? new Date().toISOString() : undefined,
            paymentRejectedReason: !approved ? reason : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    setTransactions(prev =>
      prev.map(t => {
        if (t.projectId === projectId) {
          return {
            ...t,
            status: approved ? 'confirmed' : 'rejected'
          };
        }
        return t;
      })
    );

    if (approved) {
      addNotification({
        userId: project.studentId,
        title: 'Payment Verified! 🟢',
        message: `Your payment of ₹${project.assessment.totalFinalPrice} for Order ${project.orderNumber} has been verified. Project is now In Progress!`,
        type: 'payment',
        read: false
      });
      addToast('Payment Approved', `Order ${project.orderNumber} verified and moved to In Progress.`, 'success');
    } else {
      addNotification({
        userId: project.studentId,
        title: 'Payment Verification Requires Attention 🔴',
        message: `Your payment for Order ${project.orderNumber} could not be verified. Reason: ${reason || 'Invalid UTR or screenshot mismatch.'}`,
        type: 'payment',
        read: false
      });
      addToast('Payment Rejected', `Order ${project.orderNumber} marked as rejected. Student notified.`, 'error');
    }
  };

  // Refund Simulation
  const processRefund = (transactionId: string, reason: string) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return {
            ...t,
            status: 'refunded',
            refundReason: reason
          };
        }
        return t;
      })
    );

    const txn = transactions.find(t => t.id === transactionId);
    if (txn) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id === txn.projectId) {
            return {
              ...p,
              paymentStatus: 'refunded',
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        })
      );

      addNotification({
        userId: txn.studentId,
        title: 'Refund Processed',
        message: `Your refund of ₹${txn.amount} for "${txn.projectTitle}" has been initiated to your original payment method.`,
        type: 'payment',
        read: false
      });

      addToast('Refund Processed', `Refund of ₹${txn.amount} completed for ${txn.invoiceNumber}.`, 'info');
    }
  };

  // Reviews Engine
  const addReview = (projectId: string, rating: number, comment: string, whatWentWell: string, suggestions: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newRev: PlatformReview = {
      id: 'rev_' + Date.now().toString(36),
      studentName: currentUser.name,
      studentCollege: currentUser.college || 'University Student',
      projectTitle: project.requirement.title,
      category: project.requirement.category,
      rating,
      review: comment,
      whatWentWell,
      suggestions,
      verified: true,
      date: new Date().toISOString()
    };

    setReviews(prev => [newRev, ...prev]);

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            rating,
            reviewComment: comment,
            reviewedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    addToast('Review Submitted', 'Thank you for your feedback!', 'success');
  };

  // Notifications Engine
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All notifications marked as read', 'info');
  };

  const addNotification = (n: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...n,
      id: 'notif_' + Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Support Tickets
  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, messageText: string) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: 'TICK-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'tm_1',
          sender: currentUser.name,
          senderRole: currentUser.role,
          text: messageText,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    addToast('Ticket Created', `Support ticket #${newTicket.id} logged.`, 'success');
  };

  const addTicketReply = (ticketId: string, text: string) => {
    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newMsg = {
            id: 'tm_' + Date.now().toString(36),
            sender: currentUser.name,
            senderRole: currentUser.role,
            text,
            timestamp: new Date().toISOString()
          };
          return {
            ...t,
            messages: [...t.messages, newMsg],
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
    addToast('Reply Sent', 'Your message has been added to the ticket.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        loginAsDemoUser,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        activeView,
        setActiveView,
        selectedProjectId,
        setSelectedProjectId,
        legalTab,
        setLegalTab,
        projects,
        draftSubmission,
        setDraftSubmission,
        pendingCheckoutProject,
        setPendingCheckoutProject,
        submitNewProject,
        updateProjectStatus,
        assignExpertToProject,
        uploadProjectDeliverable,
        requestRevision,
        messages,
        sendMessage,
        getProjectMessages,
        pricingConfig,
        updatePricingConfig,
        resetPricingConfig,
        paymentSettings,
        updatePaymentSettings,
        resetPaymentSettings,
        transactions,
        processPayment,
        submitManualPayment,
        verifyPayment,
        processRefund,
        reviews,
        addReview,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        supportTickets,
        createSupportTicket,
        addTicketReply,
        toasts,
        addToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        activeInvoiceProject,
        setActiveInvoiceProject
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
