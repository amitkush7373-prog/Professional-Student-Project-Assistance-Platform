import React, { useState } from 'react';
import {
  Globe,
  Terminal,
  Cpu,
  BarChart3,
  Brain,
  Sparkles,
  Smartphone,
  Database,
  Palette,
  Bug,
  FileText,
  Cloud,
  GraduationCap,
  Presentation,
  ArrowRight,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ServiceItem {
  id: ProjectCategory;
  title: string;
  categoryTag: string;
  icon: React.ElementType;
  description: string;
  keyFeatures: string[];
  startingPrice: number;
  popularTech: string[];
  color: string;
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    categoryTag: 'Frontend & Backend',
    icon: Globe,
    description: 'Modern, production-grade web applications built with clean architecture, responsive UI, authentication, and RESTful APIs.',
    keyFeatures: ['React 18 / Next.js 14', 'Node.js / Express / NestJS', 'PostgreSQL / MongoDB', 'Clean MVC Architecture'],
    startingPrice: 380,
    popularTech: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    color: 'from-blue-500/20 to-indigo-500/10 text-blue-500'
  },
  {
    id: 'python',
    title: 'Python Projects & Automation',
    categoryTag: 'Scripting & Backend',
    icon: Terminal,
    description: 'Specialized Python development from async FastAPI microservices and web scraping to complex algorithm simulations.',
    keyFeatures: ['FastAPI / Django / Flask', 'Web Automation & Scraping', 'Data Pipelines & ETL', 'Modular Object-Oriented Code'],
    startingPrice: 320,
    popularTech: ['Python', 'FastAPI', 'Django', 'Selenium'],
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500'
  },
  {
    id: 'java',
    title: 'Java & Spring Boot Systems',
    categoryTag: 'Enterprise Architecture',
    icon: Cpu,
    description: 'Enterprise-grade Java systems, Spring Boot microservices, Hibernate ORM, and secure RESTful backend architectures.',
    keyFeatures: ['Spring Boot 3 & Security', 'Microservices & JWT Auth', 'JPA Hibernate & MySQL', 'JUnit Test Suites'],
    startingPrice: 380,
    popularTech: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    color: 'from-amber-500/20 to-orange-500/10 text-amber-500'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics & BI Dashboards',
    categoryTag: 'Business Intelligence',
    icon: BarChart3,
    description: 'End-to-end data analysis pipelines, exploratory data analysis (EDA), interactive Power BI dashboards, and statistical tests.',
    keyFeatures: ['Pandas, NumPy, Seaborn', 'Interactive Power BI / Tableau', 'Statistical Hypothesis Testing', 'Automated Executive Reports'],
    startingPrice: 350,
    popularTech: ['Pandas', 'Power BI', 'SQL', 'NumPy'],
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-500'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Models',
    categoryTag: 'Predictive Modeling',
    icon: Brain,
    description: 'Custom ML pipelines from data preprocessing and feature engineering to model training, hyperparameter tuning, and ROC evaluation.',
    keyFeatures: ['Scikit-learn, XGBoost, LightGBM', 'Classification & Regression', 'Time-Series Forecasting', 'Model Evaluation Metrics'],
    startingPrice: 450,
    popularTech: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas'],
    color: 'from-purple-500/20 to-pink-500/10 text-purple-500'
  },
  {
    id: 'ai-nlp-cv',
    title: 'AI, NLP & Computer Vision',
    categoryTag: 'Deep Learning',
    icon: Sparkles,
    description: 'Cutting-edge deep learning systems: YOLOv8 object detection, U-Net image segmentation, LLMs, LangChain, and PyTorch.',
    keyFeatures: ['PyTorch & TensorFlow', 'YOLOv8 & OpenCV Vision', 'Transformers, BERT & LLMs', 'FastAPI Real-Time Inference'],
    startingPrice: 550,
    popularTech: ['PyTorch', 'TensorFlow', 'OpenCV', 'LangChain'],
    color: 'from-rose-500/20 to-red-500/10 text-rose-500'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Applications (Cross-Platform)',
    categoryTag: 'iOS & Android',
    icon: Smartphone,
    description: 'Native-feel mobile apps built with Flutter or React Native, complete with state management, offline storage, and push notifications.',
    keyFeatures: ['Flutter / React Native', 'Firebase & REST API Sync', 'Camera, GPS & BLE Sensor Sync', 'Installable APK & IPA Builds'],
    startingPrice: 480,
    popularTech: ['Flutter', 'React Native', 'Firebase', 'SQLite'],
    color: 'from-indigo-500/20 to-blue-500/10 text-indigo-500'
  },
  {
    id: 'database-systems',
    title: 'Database Design & Optimization',
    categoryTag: 'Data Modeling',
    icon: Database,
    description: 'Architecting normalized relational schemas (PostgreSQL, MySQL), complex query indexing, performance tuning, and NoSQL stores.',
    keyFeatures: ['Normalized 3NF Relational Schemas', 'ER Diagrams & Data Dictionaries', 'Complex Query Optimization', 'Transactions & Triggers'],
    startingPrice: 300,
    popularTech: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    color: 'from-emerald-500/20 to-green-500/10 text-emerald-500'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design & Prototyping',
    categoryTag: 'Figma & Design Systems',
    icon: Palette,
    description: 'Pixel-perfect UI design systems, responsive web & mobile mockups in Figma, design tokens, wireframes, and clickable interactive prototypes.',
    keyFeatures: ['Figma Component Libraries', 'Mobile & Web Wireframes', 'Interactive Clickable Prototypes', 'Tailwind CSS Export Specs'],
    startingPrice: 320,
    popularTech: ['Figma', 'Tailwind CSS', 'Design Systems'],
    color: 'from-pink-500/20 to-purple-500/10 text-pink-500'
  },
  {
    id: 'debugging-fixing',
    title: 'Debugging & Error Fixing',
    categoryTag: 'Troubleshooting',
    icon: Bug,
    description: 'Urgent resolution of critical build errors, runtime crashes, CUDA memory leaks, dependency hell, and logical bugs with detailed explanations.',
    keyFeatures: ['Root-Cause Analysis', 'Crashes & Exceptions Fixed', 'Performance Optimization', 'Clean Refactored Patch'],
    startingPrice: 299,
    popularTech: ['Python', 'JavaScript', 'Java', 'C++'],
    color: 'from-red-500/20 to-orange-500/10 text-red-500'
  },
  {
    id: 'documentation-srs',
    title: 'SRS & Academic Documentation',
    categoryTag: 'IEEE Format Reports',
    icon: FileText,
    description: 'Professional 30-60 page academic thesis reports, Software Requirements Specification (SRS), UML diagrams, and references formatted to university guidelines.',
    keyFeatures: ['IEEE Format Compliance', 'UML, Sequence & ER Diagrams', 'Literature Survey & Results', 'Plagiarism-Free Original Writing'],
    startingPrice: 300,
    popularTech: ['IEEE Standard', 'LaTeX', 'UML Diagrams', 'MS Word'],
    color: 'from-blue-500/20 to-cyan-500/10 text-blue-500'
  },
  {
    id: 'deployment-cloud',
    title: 'Cloud Hosting & CI/CD Deployment',
    categoryTag: 'DevOps & Cloud',
    icon: Cloud,
    description: 'Public deployment on AWS, Vercel, Render, or GCP with custom domains, SSL certificates, containerized Dockerfiles, and CI/CD pipelines.',
    keyFeatures: ['Docker & Docker Compose', 'AWS EC2 / S3 / RDS Setup', 'Vercel / Render Live URLs', 'Production SSL & Environment Config'],
    startingPrice: 300,
    popularTech: ['Docker', 'AWS', 'Vercel', 'Render', 'Nginx'],
    color: 'from-teal-500/20 to-emerald-500/10 text-teal-500'
  },
  {
    id: 'technical-guidance',
    title: 'Technical 1-on-1 Guidance',
    categoryTag: 'Live Mentorship',
    icon: GraduationCap,
    description: 'Dedicated screen-share sessions with senior engineers to walk through code logic, algorithms, architecture decisions, and viva questions.',
    keyFeatures: ['Live 1-on-1 Code Walkthrough', 'Architecture Q&A Sessions', 'Concept Clarification', 'Recorded Mentoring Videos'],
    startingPrice: 299,
    popularTech: ['Screen Share', 'Code Review', 'Pair Programming'],
    color: 'from-amber-500/20 to-yellow-500/10 text-amber-500'
  },
  {
    id: 'viva-preparation',
    title: 'Viva & Presentation Preparation',
    categoryTag: 'Defense Prep',
    icon: Presentation,
    description: 'High-impact 15-20 slide PowerPoint presentation decks, speaker talking points script, demo video recording, and anticipated examiner Q&A cheat-sheets.',
    keyFeatures: ['15-Slide Master Defense Deck', 'Speaker Talking Script', 'Anticipated Examiner Q&A Guide', 'Demo Video Walkthrough Script'],
    startingPrice: 299,
    popularTech: ['PowerPoint', 'Keynote', 'Viva Q&A Notes'],
    color: 'from-indigo-500/20 to-purple-500/10 text-indigo-500'
  }
];

export const ServicesGrid: React.FC = () => {
  const { currency, setActiveView, setDraftSubmission } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Services (14)' },
    { id: 'development', label: 'Development & AI' },
    { id: 'data', label: 'Data & Analytics' },
    { id: 'academic', label: 'Reports, Viva & Mentorship' }
  ];

  const filteredServices = SERVICES_LIST.filter(s => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'development') {
      return ['web-dev', 'python', 'java', 'mobile-apps', 'machine-learning', 'ai-nlp-cv', 'debugging-fixing', 'deployment-cloud'].includes(s.id);
    }
    if (selectedFilter === 'data') {
      return ['data-analytics', 'machine-learning', 'database-systems'].includes(s.id);
    }
    if (selectedFilter === 'academic') {
      return ['documentation-srs', 'technical-guidance', 'viva-preparation', 'ui-ux-design'].includes(s.id);
    }
    return true;
  });

  const handleSelectService = (category: ProjectCategory) => {
    setDraftSubmission({
      category,
      complexity: 'medium',
      urgency: 'priority'
    });
    setActiveView('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-16 lg:py-24 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Tag className="w-3.5 h-3.5" />
            <span>Comprehensive Assistance Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Specialized Services Tailored for Every Academic Level
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            From minor semester projects to multi-modal final-year capstone theses, get verified engineering support at transparent prices.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="interactive-card rounded-2xl p-6 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Bar: Icon & Category Tag */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center border border-[var(--border-color)]`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {service.categoryTag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Key Deliverables Bullet Points */}
                  <div className="space-y-1.5 mb-4">
                    {service.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.popularTech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Bottom Footer: Starting Price & CTA */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Starting from</span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      {formatCurrency(service.startingPrice, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectService(service.id)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
