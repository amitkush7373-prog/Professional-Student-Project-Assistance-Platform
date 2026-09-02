export type UserRole = 'student' | 'expert' | 'admin';

export type CollegeServiceType = 
  | 'college-project'
  | 'technical-help'
  | 'data-science'
  | 'ai-ml'
  | 'ppt-presentation'
  | 'project-review'
  | 'other';

export type StudyYear = '1st_year' | '2nd_year' | '3rd_year' | 'final_year';

export type CollegeProjectLevel = 
  | 'basic'
  | 'mini'
  | 'major'
  | 'ppt_only'
  | 'review_only'
  | 'project_ppt_review'
  | 'custom';

export type PPTTier = '5_7_slides' | '8_10_slides' | '11_15_slides';

export type ReviewTier = 'basic' | 'technical' | 'presentation' | 'final';

export type ProjectCategory = 
  | 'college-project'
  | 'web-dev'
  | 'python'
  | 'java'
  | 'data-science'
  | 'data-analytics'
  | 'ai-ml'
  | 'machine-learning'
  | 'ai-nlp-cv'
  | 'ppt-presentation'
  | 'project-review'
  | 'debugging'
  | 'debugging-fixing'
  | 'documentation'
  | 'documentation-srs'
  | 'viva-prep'
  | 'viva-preparation'
  | 'deployment'
  | 'deployment-cloud'
  | 'mobile-apps'
  | 'database-systems'
  | 'ui-ux-design'
  | 'technical-guidance'
  | 'other';

export type ComplexityLevel = 'small' | 'medium' | 'large' | 'evaluate-for-me';

export type UrgencyLevel = 'standard' | 'priority' | 'urgent' | 'same-day';

export type ProjectStatus = 
  | 'submitted'
  | 'under_review'
  | 'quotation_ready'
  | 'payment_pending'
  | 'verification_pending'
  | 'in_progress'
  | 'review'
  | 'revision_requested'
  | 'completed'
  | 'download_available'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verification_pending' | 'verified' | 'confirmed' | 'rejected' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'manual_upi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  college?: string;
  branch?: string;
  semester?: string;
  year?: StudyYear;
  bio?: string;
  skills?: string[];
  rating?: number;
  activeProjectsCount?: number;
  completedProjectsCount?: number;
  isAvailable?: boolean;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  sizeFormatted: string;
  uploadDate: string;
  category: 'requirement' | 'dataset' | 'screenshot' | 'existing_code' | 'payment_proof' | 'reference';
  url: string;
  previewUrl?: string;
}

export interface ProjectAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  isSelected: boolean;
  iconName?: string;
}

export interface ProjectRequirement {
  title: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  courseBranch: string;
  year?: StudyYear;
  semester: string;
  serviceType: CollegeServiceType;
  projectLevel?: CollegeProjectLevel;
  category: ProjectCategory;
  technologies: string[];
  description: string;
  problemStatement?: string;
  requiredFeatures: string[];
  existingWork?: string;
  expectedOutput?: string;
  specialInstructions?: string;
  
  // Specific college service fields
  pptSlideCount?: PPTTier;
  pptDesignLevel?: 'basic' | 'enhanced' | 'premium';
  reviewType?: ReviewTier;
  needsPPT?: boolean;
  needsDocumentation?: boolean;
  needsReview?: boolean;
  needsVivaPrep?: boolean;
  needsCodingHelp?: boolean;
}

export interface ProjectAssessment {
  estimatedComplexity: 'small' | 'medium' | 'large';
  estimatedEffortHours: number;
  recommendedTimelineDays: number;
  estimatedPrice: number;
  basePrice: number;
  complexityFee: number;
  techFee: number;
  urgencyFee: number;
  addOnsTotal: number;
  taxAmount: number;
  totalFinalPrice: number; // Strictly <= 100
  assignedExpertTier: string;
  deliverablesList: string[];
  revisionsAllowed: number;
  rationale: string;
  breakdownItems?: { label: string; amount: number }[];
  estimatedDeliveryText?: string;
  estimatedMinutes?: number;
  complexityReasoning?: string;
}

export interface DeliverableItem {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  uploadedAt: string;
  isReady: boolean;
  category: 'source_code' | 'documentation' | 'presentation' | 'deployment_guide' | 'video_walkthrough' | 'review_notes';
}

export interface Project {
  id: string;
  orderNumber: string;
  studentId: string;
  assignedExpertId?: string;
  assignedExpertName?: string;
  complexity: ComplexityLevel;
  selectedUrgency: UrgencyLevel;
  selectedAddons: ProjectAddon[];
  deadlineDate: string;
  status: ProjectStatus;
  paymentStatus: PaymentStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  requirement: ProjectRequirement;
  files: ProjectFile[];
  assessment: ProjectAssessment;
  deliverables?: DeliverableItem[];
  revisionNotes?: string;
  rating?: number;
  reviewComment?: string;
  reviewedAt?: string;
  
  // Manual UPI Verification fields
  paymentProofUrl?: string;
  utrNumber?: string;
  paymentSubmittedAt?: string;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  paymentRejectedAt?: string;
  paymentRejectedBy?: string;
  paymentRejectedReason?: string;
  paymentRecordId?: string;
}

export interface PaymentVerificationRecord {
  payment_id: string;
  order_id: string;
  project_id: string;
  user_id: string;
  studentName: string;
  studentEmail: string;
  studentCollege?: string;
  studentPhone?: string;
  projectTitle: string;
  category?: ProjectCategory;
  serviceType?: CollegeServiceType;
  projectLevel?: CollegeProjectLevel;
  amount: number;
  utr_number: string;
  payment_screenshot?: string;
  payment_status: PaymentStatus;
  submitted_at: string;
  verified_at?: string;
  verified_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  payment_method: PaymentMethod;
  invoice_number?: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
  read: boolean;
}

export interface PricingConfig {
  basePrices: {
    basicCollege: number; // Small/Basic (₹30 - ₹50)
    miniProject: number;  // Medium (₹70 - ₹80)
    majorProject: number; // Complex (₹100 MAX)
  };
  urgencyAdders: {
    standard: number;
    priority: number;
    urgent: number;
    'same-day': number;
  };
  pptRates: {
    '5_7_slides': number;   // ₹0 (FREE)
    '8_10_slides': number;  // ₹0 (FREE)
    '11_15_slides': number; // ₹30
  };
  reviewRates: {
    basic: number;       // ₹30
    technical: number;   // ₹50
    presentation: number;// ₹30
    final: number;       // ₹70
  };
  documentationRates: {
    formatting: number;  // ₹30
    fullDocs: number;    // ₹50
  };
  debuggingRates: {
    minorBug: number;    // ₹30
    multipleBugs: number;// ₹50
  };
  addonRates: {
    documentation: number; // ₹30
    presentation: number;  // ₹0 (FREE)
    deployment: number;    // ₹30
    walkthrough: number;   // ₹30
    extra_revisions: number; // ₹10
  };
  maxPriceLimit: number; // STRICTLY 100 MAXIMUM
  minPriceLimit: number; // 0 (Free PPT) or 30 minimum
}

export interface PaymentSettings {
  qrCodeUrl: string;
  upiId: string;
  merchantName: string;
  instructions: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Billing' | 'Project Technical' | 'Expert Communication' | 'Delivery Issue' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: string;
    senderRole: UserRole;
    text: string;
    timestamp: string;
  }[];
}

export interface PlatformReview {
  id: string;
  studentName: string;
  studentCollege: string;
  projectTitle: string;
  category: ProjectCategory;
  rating: number;
  review: string;
  whatWentWell: string;
  suggestions?: string;
  verified: boolean;
  date: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'project_update' | 'message' | 'payment' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionDate: string;
  invoiceNumber: string;
  gatewayRef: string;
  upiIdOrCardEnding: string;
  utrNumber?: string;
  paymentProofUrl?: string;
  refundReason?: string;
}
