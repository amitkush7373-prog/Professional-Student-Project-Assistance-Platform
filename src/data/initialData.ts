import {
  User,
  Project,
  Message,
  PlatformReview,
  SupportTicket,
  Transaction,
  ProjectCategory
} from '../types';
import { AVAILABLE_ADDONS } from '../utils/pricingEngine';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    phone: '+91 98765 43210',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'Delhi Technological University (DTU)',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 4',
    year: '2nd_year',
    bio: '2nd-year CS undergrad working on semester mini projects, data science pipelines, and college presentations.',
    activeProjectsCount: 2,
    completedProjectsCount: 1,
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'user_expert_1',
    name: 'Dr. Vikram Sethi',
    email: 'vikram.sethi@apexproject.io',
    phone: '+91 91234 56780',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'Senior Academic Engineering Mentor',
    branch: 'Computer Science & Data Systems',
    bio: '10+ years mentoring engineering students across Python, AI/ML mini projects, Java, and college PPT presentations.',
    skills: ['Python', 'Data Science', 'Machine Learning', 'FastAPI', 'Java', 'PPT Design'],
    rating: 4.98,
    activeProjectsCount: 3,
    completedProjectsCount: 142,
    isAvailable: true,
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'user_expert_2',
    name: 'Pooja Malhotra',
    email: 'pooja.m@apexproject.io',
    phone: '+91 98111 22334',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    college: 'Full-Stack & Web Mentor',
    branch: 'Software Engineering',
    bio: 'Specialist in React, JavaScript, HTML/CSS, college project reports, and viva explanation sessions.',
    skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Documentation', 'Viva Prep'],
    rating: 4.95,
    activeProjectsCount: 2,
    completedProjectsCount: 98,
    isAvailable: true,
    createdAt: '2025-03-20T10:00:00Z'
  },
  {
    id: 'user_expert_3',
    name: 'Rohan Verma',
    email: 'rohan.v@apexproject.io',
    phone: '+91 97777 88888',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'Data Analytics & Review Specialist',
    branch: 'Data Science',
    bio: 'Expert in Data Cleaning, Pandas, Power BI, college project reviews, and error troubleshooting.',
    skills: ['Python', 'Pandas', 'Power BI', 'SQL', 'Project Review', 'Debugging'],
    rating: 4.92,
    activeProjectsCount: 2,
    completedProjectsCount: 84,
    isAvailable: true,
    createdAt: '2025-04-12T10:00:00Z'
  },
  {
    id: 'user_admin_1',
    name: 'Super Admin',
    email: 'admin@apexproject.io',
    phone: '+91 80000 11111',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    college: 'ApexProject Operations Command',
    bio: 'Platform Administrator managing payment QR settings, payment verification approvals, and expert assignments.',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
}

function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_apex_01',
    orderNumber: 'APX-2026-9041',
    studentId: 'user_student_1',
    assignedExpertId: 'user_expert_1',
    assignedExpertName: 'Dr. Vikram Sethi',
    complexity: 'medium',
    selectedUrgency: 'priority',
    selectedAddons: [
      { ...AVAILABLE_ADDONS[0], isSelected: true },
      { ...AVAILABLE_ADDONS[1], isSelected: true }
    ],
    deadlineDate: getFutureDate(3),
    status: 'in_progress',
    paymentStatus: 'confirmed',
    progress: 65,
    createdAt: getPastDate(2),
    updatedAt: getPastDate(0),
    requirement: {
      title: 'Customer Churn Analysis & ML Mini Project with Dashboard',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@iitd.ac.in',
      phone: '+91 98765 43210',
      college: 'Delhi Technological University (DTU)',
      courseBranch: 'Computer Science',
      year: '2nd_year',
      semester: 'Semester 4',
      serviceType: 'data-science',
      projectLevel: 'mini',
      category: 'data-science',
      technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Streamlit'],
      description: 'A college data science mini project analyzing customer churn telecom dataset using random forest classifier, exploratory data analysis, and an interactive Streamlit UI.',
      problemStatement: 'Telecom providers face recurring customer attrition. We built a predictive model to classify high-risk churn customers and output feature importance charts.',
      requiredFeatures: [
        'Exploratory Data Analysis (EDA) with seaborn correlation heatmaps',
        'Data cleaning, missing value imputation and one-hot encoding',
        'Random Forest and Logistic Regression model comparison',
        'Interactive Streamlit web dashboard for live prediction',
        'Clean PPT slides (8-10 slides) for presentation'
      ],
      existingWork: 'Dataset downloaded from Kaggle (Telco-Customer-Churn.csv)',
      expectedOutput: 'Clean Python notebook (.ipynb), Streamlit app, PPT deck, and brief project report.',
      needsPPT: true,
      needsDocumentation: true,
      needsReview: true
    },
    files: [],
    assessment: {
      estimatedComplexity: 'medium',
      estimatedEffortHours: 14,
      recommendedTimelineDays: 4,
      estimatedPrice: 550,
      basePrice: 300,
      complexityFee: 0,
      techFee: 0,
      urgencyFee: 50,
      addOnsTotal: 200,
      taxAmount: 0,
      totalFinalPrice: 550,
      assignedExpertTier: 'Verified Academic Engineering Mentor',
      deliverablesList: [
        'Clean Python Jupyter Notebook & Streamlit App source code',
        'Professional 8-10 Slide College PPT Presentation (.pptx)',
        'Project Report & Documentation (.pdf)',
        'Viva Explanation Guide & Anticipated Q&A'
      ],
      revisionsAllowed: 3,
      rationale: 'College data science mini project + PPT presentation + Documentation report.',
      breakdownItems: [
        { label: 'Data Science Mini Project', amount: 300 },
        { label: 'College PPT (8–10 Slides)', amount: 150 },
        { label: 'Project Report / Documentation', amount: 100 }
      ]
    },
    deliverables: [
      {
        id: 'deliv_1',
        title: 'Customer Churn ML Model & Streamlit App',
        description: 'Clean Python notebook with EDA, random forest model, and runnable Streamlit dashboard.',
        fileType: 'ZIP Archive',
        fileSize: '8.4 MB',
        downloadUrl: '#',
        uploadedAt: getPastDate(0),
        isReady: true,
        category: 'source_code'
      },
      {
        id: 'deliv_2',
        title: '10-Slide College Presentation Deck',
        description: 'Formatted PowerPoint deck with problem statement, methodology, confusion matrix, and findings.',
        fileType: 'PPTX Presentation',
        fileSize: '3.8 MB',
        downloadUrl: '#',
        uploadedAt: getPastDate(0),
        isReady: true,
        category: 'presentation'
      }
    ]
  },
  {
    id: 'proj_apex_02',
    orderNumber: 'APX-2026-8812',
    studentId: 'user_student_1',
    assignedExpertId: 'user_expert_2',
    assignedExpertName: 'Pooja Malhotra',
    complexity: 'small',
    selectedUrgency: 'standard',
    selectedAddons: [
      { ...AVAILABLE_ADDONS[0], isSelected: true }
    ],
    deadlineDate: getPastDate(1),
    status: 'download_available',
    paymentStatus: 'confirmed',
    progress: 100,
    createdAt: getPastDate(8),
    updatedAt: getPastDate(1),
    rating: 5,
    reviewComment: 'Amazing work! Pooja delivered a clean responsive portfolio website and a neat 8-slide PPT. Scored full marks in my college review!',
    reviewedAt: getPastDate(1),
    requirement: {
      title: 'Student Portfolio Website & Project Presentation PPT',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@iitd.ac.in',
      phone: '+91 98765 43210',
      college: 'Delhi Technological University (DTU)',
      courseBranch: 'Computer Science',
      year: '1st_year',
      semester: 'Semester 2',
      serviceType: 'college-project',
      projectLevel: 'basic',
      category: 'web-dev',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      description: 'A 1st-year web development basic project showcasing skills, contact form, and project cards with interactive modal popup.',
      requiredFeatures: [
        'Responsive layout (Desktop & Mobile)',
        'Interactive project gallery',
        'Contact form validation in JavaScript',
        '8-slide PPT explaining HTML5 semantics'
      ],
      expectedOutput: 'HTML/CSS/JS files and PPT presentation.',
      needsPPT: true
    },
    files: [],
    assessment: {
      estimatedComplexity: 'small',
      estimatedEffortHours: 6,
      recommendedTimelineDays: 7,
      estimatedPrice: 350,
      basePrice: 200,
      complexityFee: 0,
      techFee: 0,
      urgencyFee: 0,
      addOnsTotal: 150,
      taxAmount: 0,
      totalFinalPrice: 350,
      assignedExpertTier: 'Verified Academic Engineering Mentor',
      deliverablesList: [
        'Complete HTML/CSS/JS source code folder',
        '8-Slide College PPT Presentation (.pptx)',
        'Execution guide (README)'
      ],
      revisionsAllowed: 3,
      rationale: 'Basic 1st year web project + 8-slide PPT presentation.',
      breakdownItems: [
        { label: 'Basic College Project Assistance', amount: 200 },
        { label: 'College PPT (8–10 Slides)', amount: 150 }
      ]
    },
    deliverables: [
      {
        id: 'deliv_cc_1',
        title: 'Full Source Code & Assets',
        description: 'Clean responsive HTML/CSS/JS codebase with formatted styles.',
        fileType: 'ZIP Archive',
        fileSize: '2.1 MB',
        downloadUrl: '#',
        uploadedAt: getPastDate(1),
        isReady: true,
        category: 'source_code'
      },
      {
        id: 'deliv_cc_2',
        title: '8-Slide PPT Presentation',
        description: 'PowerPoint presentation for college semester viva.',
        fileType: 'PPTX Presentation',
        fileSize: '1.9 MB',
        downloadUrl: '#',
        uploadedAt: getPastDate(1),
        isReady: true,
        category: 'presentation'
      }
    ]
  },
  {
    id: 'proj_apex_03',
    orderNumber: 'APX-2026-7734',
    studentId: 'user_student_1',
    assignedExpertId: 'user_expert_3',
    assignedExpertName: 'Rohan Verma',
    complexity: 'medium',
    selectedUrgency: 'priority',
    selectedAddons: [],
    deadlineDate: getFutureDate(2),
    status: 'review',
    paymentStatus: 'confirmed',
    progress: 90,
    createdAt: getPastDate(3),
    updatedAt: getPastDate(0),
    requirement: {
      title: 'Python Inventory Management System with SQLite Database',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@iitd.ac.in',
      phone: '+91 98765 43210',
      college: 'Delhi Technological University (DTU)',
      courseBranch: 'Computer Science',
      year: '2nd_year',
      semester: 'Semester 3',
      serviceType: 'college-project',
      projectLevel: 'mini',
      category: 'python',
      technologies: ['Python', 'SQLite', 'Tkinter'],
      description: 'A desktop GUI application in Python Tkinter to manage product stock, billing, supplier records, and generate invoice receipts.',
      requiredFeatures: [
        'Tkinter graphical user interface',
        'CRUD database operations in SQLite',
        'Search & filter inventory items',
        'PDF receipt generator'
      ],
      expectedOutput: 'Python script, SQLite database file, and run instructions.',
      needsReview: true
    },
    files: [],
    assessment: {
      estimatedComplexity: 'medium',
      estimatedEffortHours: 10,
      recommendedTimelineDays: 4,
      estimatedPrice: 450,
      basePrice: 300,
      complexityFee: 0,
      techFee: 0,
      urgencyFee: 50,
      addOnsTotal: 100,
      taxAmount: 0,
      totalFinalPrice: 450,
      assignedExpertTier: 'Verified Academic Engineering Mentor',
      deliverablesList: [
        'Complete Python Tkinter source code and SQLite db',
        'Project Review & Code Audit Report'
      ],
      revisionsAllowed: 3,
      rationale: 'Python mini project + project review.',
      breakdownItems: [
        { label: 'College Mini Project Assistance', amount: 300 },
        { label: 'Project Review & Code Audit', amount: 100 },
        { label: '4–6 Days Priority', amount: 50 }
      ]
    },
    deliverables: [
      {
        id: 'deliv_py_1',
        title: 'Inventory App Source Code & SQLite DB',
        description: 'Clean executable Python script with Tkinter GUI and database schema.',
        fileType: 'ZIP Archive',
        fileSize: '4.2 MB',
        downloadUrl: '#',
        uploadedAt: getPastDate(0),
        isReady: true,
        category: 'source_code'
      }
    ]
  },
  {
    id: 'proj_apex_04',
    orderNumber: 'APX-2026-6621',
    studentId: 'user_student_1',
    assignedExpertId: 'user_expert_1',
    assignedExpertName: 'Dr. Vikram Sethi',
    complexity: 'small',
    selectedUrgency: 'standard',
    selectedAddons: [],
    deadlineDate: getFutureDate(6),
    status: 'verification_pending',
    paymentStatus: 'verification_pending',
    progress: 10,
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
    utrNumber: '202608291041',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    paymentSubmittedAt: getPastDate(0),
    requirement: {
      title: 'College Presentation PPT on Cloud Computing (8 Slides)',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@iitd.ac.in',
      phone: '+91 98765 43210',
      college: 'Delhi Technological University (DTU)',
      courseBranch: 'Computer Science',
      year: '1st_year',
      semester: 'Semester 2',
      serviceType: 'ppt-presentation',
      category: 'ppt-presentation',
      technologies: ['PowerPoint', 'Cloud Computing'],
      description: 'Need a crisp, clean 8-slide presentation explaining IaaS, PaaS, SaaS, and private vs public clouds for 1st-year computer science seminar.',
      pptSlideCount: '8_10_slides',
      requiredFeatures: [
        'Title & Agenda slide',
        'Evolution of Cloud Computing',
        'IaaS vs PaaS vs SaaS comparison table',
        'Key Benefits & Real-world case studies',
        'Summary & References slide'
      ],
      expectedOutput: 'Clean PPTX file.'
    },
    files: [],
    assessment: {
      estimatedComplexity: 'small',
      estimatedEffortHours: 4,
      recommendedTimelineDays: 7,
      estimatedPrice: 250,
      basePrice: 150,
      complexityFee: 0,
      techFee: 0,
      urgencyFee: 0,
      addOnsTotal: 100,
      taxAmount: 0,
      totalFinalPrice: 250,
      assignedExpertTier: 'Verified Academic Presentation Mentor',
      deliverablesList: [
        '8-Slide College PPT Presentation (.pptx)',
        'Speaker talking points summary'
      ],
      revisionsAllowed: 3,
      rationale: '8-slide presentation deck on Cloud Computing fundamentals + speaker notes.',
      breakdownItems: [
        { label: 'PPT (8–10 Slides)', amount: 150 },
        { label: 'Speaker Notes / Viva Cheat-sheet', amount: 100 }
      ]
    },
    deliverables: []
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_01',
    projectId: 'proj_apex_01',
    senderId: 'user_expert_1',
    senderName: 'Dr. Vikram Sethi',
    senderRole: 'expert',
    content: 'Hi Aarav! I have completed your customer churn data cleaning pipeline and trained the random forest model. Our accuracy is 82.4% with clear ROC curves. I am now building your 8-slide PPT deck.',
    timestamp: getPastDate(1),
    read: true
  },
  {
    id: 'msg_02',
    projectId: 'proj_apex_01',
    senderId: 'user_student_1',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    content: 'Thank you Dr. Vikram! Could you please ensure the PPT has a clear slide comparing Logistic Regression vs Random Forest? My professor specifically mentioned that in the review rubric.',
    timestamp: getPastDate(1),
    read: true
  },
  {
    id: 'msg_03',
    projectId: 'proj_apex_01',
    senderId: 'user_expert_1',
    senderName: 'Dr. Vikram Sethi',
    senderRole: 'expert',
    content: 'Yes, definitely! Slide 6 is dedicated to model comparison with precision, recall, and F1-score tables. Here is a preview of the evaluation metrics:',
    codeSnippet: {
      language: 'python',
      code: `# Model Evaluation Metrics Comparison
from sklearn.metrics import classification_report

print("--- Random Forest Classifier ---")
print(classification_report(y_test, y_pred_rf))
# Accuracy: 0.824 | Precision: 0.81 | Recall: 0.79`
    },
    timestamp: getPastDate(0),
    read: true
  },
  {
    id: 'msg_04',
    projectId: 'proj_apex_01',
    senderId: 'user_student_1',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    content: 'That is super clear and perfect for my viva. Thank you so much!',
    timestamp: getPastDate(0),
    read: true
  }
];

export const INITIAL_REVIEWS: PlatformReview[] = [
  {
    id: 'rev_01',
    studentName: 'Aarav Sharma',
    studentCollege: 'Delhi Technological University (DTU)',
    projectTitle: 'Student Portfolio Website & 8-Slide PPT',
    category: 'web-dev',
    rating: 5,
    review: 'Priced at just ₹350 for full source code and a clean presentation! Pooja explained the code in simple words so I could answer all my viva questions effortlessly.',
    whatWentWell: 'Super affordable student pricing, fast delivery, and neat slides.',
    suggestions: 'Keep this pocket-friendly pricing forever!',
    verified: true,
    date: getPastDate(2)
  },
  {
    id: 'rev_02',
    studentName: 'Sneha Kulkarni',
    studentCollege: 'BITS Pilani',
    projectTitle: 'College PPT on Cyber Security (10 Slides)',
    category: 'ppt-presentation',
    rating: 5,
    review: 'Got a 10-slide PPT done for ₹150 within 24 hours. The visual layout and diagram quality blew my college panel away. 10/10 recommendation!',
    whatWentWell: 'Very cheap rate and high quality design.',
    suggestions: 'None, fantastic experience.',
    verified: true,
    date: getPastDate(5)
  },
  {
    id: 'rev_03',
    studentName: 'Karthik Raja',
    studentCollege: 'NIT Trichy',
    projectTitle: 'Python Data Cleaning & Analysis Mini Project',
    category: 'data-science',
    rating: 5,
    review: 'Total cost was ₹450 with project review included. The mentor was patient and resolved all my dataset bugs. Zero hidden charges!',
    whatWentWell: 'Transparent pricing, no surprises, genuine guidance.',
    suggestions: 'More sample PPT templates would be great.',
    verified: true,
    date: getPastDate(9)
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_9041',
    projectId: 'proj_apex_01',
    projectTitle: 'Customer Churn Analysis & ML Mini Project with Dashboard',
    studentId: 'user_student_1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@iitd.ac.in',
    amount: 550,
    paymentMethod: 'upi',
    status: 'confirmed',
    transactionDate: getPastDate(2),
    invoiceNumber: 'INV-2026-9041',
    gatewayRef: 'UPI/20260827110941/OKAXIS',
    upiIdOrCardEnding: 'aarav@okaxis'
  },
  {
    id: 'txn_8812',
    projectId: 'proj_apex_02',
    projectTitle: 'Student Portfolio Website & Project Presentation PPT',
    studentId: 'user_student_1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@iitd.ac.in',
    amount: 350,
    paymentMethod: 'card',
    status: 'confirmed',
    transactionDate: getPastDate(8),
    invoiceNumber: 'INV-2026-8812',
    gatewayRef: 'CARD_TXN_8812_STRIPE',
    upiIdOrCardEnding: 'Visa •••• 4242'
  },
  {
    id: 'txn_7734',
    projectId: 'proj_apex_03',
    projectTitle: 'Python Inventory Management System with SQLite Database',
    studentId: 'user_student_1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@iitd.ac.in',
    amount: 450,
    paymentMethod: 'netbanking',
    status: 'confirmed',
    transactionDate: getPastDate(3),
    invoiceNumber: 'INV-2026-7734',
    gatewayRef: 'HDFC_NET_773419',
    upiIdOrCardEnding: 'HDFC Corporate Banking'
  },
  {
    id: 'txn_6621',
    projectId: 'proj_apex_04',
    projectTitle: 'College Presentation PPT on Cloud Computing (8 Slides)',
    studentId: 'user_student_1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@iitd.ac.in',
    amount: 250,
    paymentMethod: 'manual_upi',
    status: 'verification_pending',
    transactionDate: getPastDate(0),
    invoiceNumber: 'INV-2026-6621',
    gatewayRef: 'UTR-202608291041',
    upiIdOrCardEnding: 'apexproject@upi',
    utrNumber: '202608291041',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-8021',
    userId: 'user_student_1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@iitd.ac.in',
    subject: 'Request for 8-slide PPT presentation format check',
    category: 'Project Technical',
    priority: 'medium',
    status: 'resolved',
    createdAt: getPastDate(3),
    updatedAt: getPastDate(2),
    messages: [
      {
        id: 'tm_1',
        sender: 'Aarav Sharma',
        senderRole: 'student',
        text: 'Hi Team, could you verify that my PPT slides use 16:9 widescreen format compatible with college projectors?',
        timestamp: getPastDate(3)
      },
      {
        id: 'tm_2',
        sender: 'Apex Support Desk',
        senderRole: 'admin',
        text: 'Hello Aarav, your mentor Dr. Vikram confirmed all slides are formatted in 16:9 HD widescreen with standard college presentation layouts.',
        timestamp: getPastDate(2)
      }
    ]
  }
];
