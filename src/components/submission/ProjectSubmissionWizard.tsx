import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Laptop,
  BarChart3,
  Brain,
  Presentation,
  FileText,
  Clock,
  Zap,
  Calculator,
  ShieldCheck,
  Info,
  X,
  PiggyBank,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileManager } from './FileManager';
import {
  evaluateProjectRequirements,
  getDeadlineComparisonPrices,
  AVAILABLE_ADDONS
} from '../../utils/pricingEngine';
import {
  CollegeServiceType,
  StudyYear,
  CollegeProjectLevel,
  PPTTier,
  ReviewTier,
  ComplexityLevel,
  UrgencyLevel,
  ProjectFile,
  ProjectAddon,
  Project
} from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const ProjectSubmissionWizard: React.FC = () => {
  const {
    currentUser,
    currency,
    submitNewProject,
    setActiveView,
    setPendingCheckoutProject,
    draftSubmission,
    pricingConfig,
    addToast
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: "What are you looking for?"
  const [serviceType, setServiceType] = useState<CollegeServiceType>(draftSubmission?.serviceType || 'college-project');

  // College Student Profile & Academic Details
  const [studentName, setStudentName] = useState(currentUser.name || draftSubmission?.studentName || '');
  const [email, setEmail] = useState(currentUser.email || draftSubmission?.email || '');
  const [phone, setPhone] = useState(currentUser.phone || draftSubmission?.phone || '');
  const [college, setCollege] = useState(currentUser.college || draftSubmission?.college || 'Delhi Technological University (DTU)');
  const [courseBranch, setCourseBranch] = useState(currentUser.branch || draftSubmission?.courseBranch || 'Computer Science & Engineering');
  const [studyYear, setStudyYear] = useState<StudyYear>(currentUser.year || draftSubmission?.year || '1st_year');
  const [semester, setSemester] = useState<string>(currentUser.semester || draftSubmission?.semester || 'Semester 1');

  // College Project Level
  const [projectLevel, setProjectLevel] = useState<CollegeProjectLevel>(draftSubmission?.projectLevel || 'basic');

  // Step 2: Requirements & Specifications
  const [title, setTitle] = useState(draftSubmission?.title || '');
  const [description, setDescription] = useState(draftSubmission?.description || '');
  
  // Specific checkboxes for 1st-year / college needs
  const [needsProject, setNeedsProject] = useState(true);
  const [needsPPT, setNeedsPPT] = useState(draftSubmission?.needsPPT || false);
  const [needsReview, setNeedsReview] = useState(draftSubmission?.needsReview || false);
  const [needsDocumentation, setNeedsDocumentation] = useState(draftSubmission?.needsDocumentation || false);
  const [needsVivaPrep, setNeedsVivaPrep] = useState(draftSubmission?.needsVivaPrep || false);
  const [needsCodingHelp, setNeedsCodingHelp] = useState(draftSubmission?.needsCodingHelp || false);

  // PPT Specific
  const [pptSlideCount, setPptSlideCount] = useState<PPTTier>(draftSubmission?.pptSlideCount || '8_10_slides');
  const [pptDesignLevel, setPptDesignLevel] = useState<'basic' | 'enhanced' | 'premium'>('enhanced');

  // Review Specific
  const [reviewType, setReviewType] = useState<ReviewTier>(draftSubmission?.reviewType || 'basic');

  // Technical stack selections (for Data Science / AI / Technical flows)
  const [selectedTechs, setSelectedTechs] = useState<string[]>(draftSubmission?.technologies || ['Python']);
  const [customTechInput, setCustomTechInput] = useState('');

  // Step 3: Files (Starts completely empty, user controls files)
  const [files, setFiles] = useState<ProjectFile[]>([]);

  // Step 4: Deadline & Add-ons
  const [urgency, setUrgency] = useState<UrgencyLevel>(draftSubmission?.urgency || 'standard');
  const [addons, setAddons] = useState<ProjectAddon[]>(AVAILABLE_ADDONS);

  // Semesters list according to study year
  const getSemestersForYear = (year: StudyYear) => {
    switch (year) {
      case '1st_year':
        return ['Semester 1', 'Semester 2'];
      case '2nd_year':
        return ['Semester 3', 'Semester 4'];
      case '3rd_year':
        return ['Semester 5', 'Semester 6'];
      case 'final_year':
        return ['Semester 7', 'Semester 8'];
    }
  };

  // Handle year change and auto-adjust semester
  const handleYearChange = (year: StudyYear) => {
    setStudyYear(year);
    const sems = getSemestersForYear(year);
    setSemester(sems[0]);
    if (year === '1st_year') {
      setProjectLevel('basic');
    } else if (year === 'final_year') {
      setProjectLevel('major');
    } else {
      setProjectLevel('mini');
    }
  };

  // Calculate live dynamic assessment
  const assessment = evaluateProjectRequirements({
    serviceType,
    projectLevel,
    urgency,
    technologies: selectedTechs,
    descriptionText: description,
    problemStatement: description,
    pptSlideCount,
    reviewType,
    needsPPT: serviceType === 'ppt-presentation' || needsPPT,
    needsDocumentation,
    needsReview: serviceType === 'project-review' || needsReview,
    needsVivaPrep,
    needsCodingHelp,
    addons,
    pricingConfig
  });

  // Calculate deadline savings comparison
  const deadlineComparison = getDeadlineComparisonPrices({
    serviceType,
    projectLevel,
    technologies: selectedTechs,
    descriptionText: description,
    problemStatement: description,
    pptSlideCount,
    reviewType,
    needsPPT: serviceType === 'ppt-presentation' || needsPPT,
    needsDocumentation,
    needsReview: serviceType === 'project-review' || needsReview,
    needsVivaPrep,
    needsCodingHelp,
    addons,
    pricingConfig
  });

  const toggleTechnology = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(prev => prev.filter(t => t !== tech));
    } else {
      setSelectedTechs(prev => [...prev, tech]);
    }
  };

  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTechInput.trim() && !selectedTechs.includes(customTechInput.trim())) {
      setSelectedTechs(prev => [...prev, customTechInput.trim()]);
      setCustomTechInput('');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!studentName || !college) {
        addToast('Missing Details', 'Please provide your name and college.', 'warning');
        return;
      }
    }
    if (currentStep === 2) {
      if (!title) {
        addToast('Project Title Missing', 'Please enter a project title or topic.', 'warning');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      // Proceed to Assessment / Pre-Checkout Screen
      const deadlineDays = urgency === 'same-day' ? 1 : urgency === 'urgent' ? 2 : urgency === 'priority' ? 4 : 7;
      const targetDeadlineDate = new Date(Date.now() + deadlineDays * 86400000).toISOString();

      const candidateProject: Partial<Project> = {
        studentId: currentUser.id,
        requirement: {
          title,
          studentName,
          email,
          phone,
          college,
          courseBranch,
          year: studyYear,
          semester,
          serviceType,
          projectLevel,
          category: serviceType === 'data-science' ? 'data-science' : serviceType === 'ai-ml' ? 'ai-ml' : serviceType === 'ppt-presentation' ? 'ppt-presentation' : serviceType === 'project-review' ? 'project-review' : 'college-project',
          technologies: selectedTechs,
          description,
          problemStatement: description,
          requiredFeatures: assessment.deliverablesList,
          pptSlideCount,
          pptDesignLevel,
          reviewType,
          needsPPT,
          needsDocumentation,
          needsReview,
          needsVivaPrep,
          needsCodingHelp
        },
        files,
        complexity: assessment.estimatedComplexity,
        selectedUrgency: urgency,
        selectedAddons: addons,
        assessment,
        deadlineDate: targetDeadlineDate
      };

      setPendingCheckoutProject(candidateProject as Project);
      setActiveView('assessment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Service & Academic Details' },
    { num: 2, label: 'Project Requirements' },
    { num: 3, label: 'Project Materials' },
    { num: 4, label: 'AI Complexity & Delivery' }
  ];

  return (
    <div className="w-full py-10 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Automated Academic Project Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            College Project Assistance & Submission
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            AI automatically evaluates project complexity, computes exact delivery time, and synthesizes deliverables.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {stepsHeader.map(step => (
              <div
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                  currentStep === step.num
                    ? 'bg-blue-600/10 border border-blue-500 text-blue-600 dark:text-blue-400'
                    : currentStep > step.num
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] opacity-60'
                }`}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 font-mono border">
                  {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-[11px] font-semibold hidden sm:inline-block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Form (Left) & Live Cost Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* STEP 1: What Are You Looking For & College Year */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">What are you looking for?</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Choose the type of help you need to get customized simple questions.</p>
                  </div>

                  {/* 6 Category Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'college-project' as CollegeServiceType, title: 'College Project', desc: '1st, 2nd, 3rd & final-year projects', icon: GraduationCap, color: 'text-blue-500' },
                      { id: 'ppt-presentation' as CollegeServiceType, title: 'PPT / Presentation', desc: '5-15 slides deck (FREE)', icon: Presentation, color: 'text-pink-500' },
                      { id: 'project-review' as CollegeServiceType, title: 'Project Review', desc: 'Structure, code & error audit', icon: CheckCircle2, color: 'text-emerald-500' },
                      { id: 'data-science' as CollegeServiceType, title: 'Data Science', desc: 'Data cleaning, EDA & pandas projects', icon: BarChart3, color: 'text-cyan-500' },
                      { id: 'ai-ml' as CollegeServiceType, title: 'AI / Machine Learning', desc: 'ML models, vision & NLP assistance', icon: Brain, color: 'text-purple-500' },
                      { id: 'technical-help' as CollegeServiceType, title: 'Technical Help', desc: 'Coding, debugging & web assistance', icon: Laptop, color: 'text-amber-500' }
                    ].map(card => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.id}
                          onClick={() => setServiceType(card.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                            serviceType === card.id
                              ? 'border-blue-600 bg-blue-500/10 shadow-md ring-1 ring-blue-500/30'
                              : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-5 h-5 ${card.color}`} />
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              serviceType === card.id ? 'border-blue-600 bg-blue-600' : 'border-[var(--border-color)]'
                            }`}>
                              {serviceType === card.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--text-primary)]">{card.title}</div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">{card.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Profile (Year & Semester) */}
                  <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Student Academic Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Year of Study</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { id: '1st_year' as StudyYear, label: '1st Year' },
                            { id: '2nd_year' as StudyYear, label: '2nd Year' },
                            { id: '3rd_year' as StudyYear, label: '3rd Year' },
                            { id: 'final_year' as StudyYear, label: 'Final Year' }
                          ].map(y => (
                            <button
                              key={y.id}
                              type="button"
                              onClick={() => handleYearChange(y.id)}
                              className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                                studyYear === y.id
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                              }`}
                            >
                              {y.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Current Semester</label>
                        <select
                          value={semester}
                          onChange={e => setSemester(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                        >
                          {getSemestersForYear(studyYear).map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Your College / University</label>
                        <input
                          type="text"
                          value={college}
                          onChange={e => setCollege(e.target.value)}
                          placeholder="e.g. DTU, VIT, SRM, IIT, NIT, Mumbai Univ..."
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Branch / Department</label>
                        <input
                          type="text"
                          value={courseBranch}
                          onChange={e => setCourseBranch(e.target.value)}
                          placeholder="e.g. Computer Science, Mechanical, Civil..."
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: Project Requirements & Topic Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">Project Title & Requirements</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Provide the topic or problem statement given by your professor.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Project Topic / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. AI-based Crop Disease Detection / Solar Water Heater Design / Smart Attendance System..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring font-medium"
                    />
                  </div>

                  {/* CASE A: PPT Specific Service */}
                  {serviceType === 'ppt-presentation' && (
                    <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Select Slide Count
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: '5_7_slides' as PPTTier, title: '5–7 Slides', priceText: '100% FREE', desc: 'Mini seminar & class presentation' },
                          { id: '8_10_slides' as PPTTier, title: '8–10 Slides', priceText: '100% FREE', desc: 'Standard project defense deck' },
                          { id: '11_15_slides' as PPTTier, title: '11–15 Slides', priceText: '₹30', desc: 'Detailed capstone / major project' }
                        ].map(s => (
                          <div
                            key={s.id}
                            onClick={() => setPptSlideCount(s.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              pptSlideCount === s.id
                                ? 'border-blue-600 bg-blue-600/15 shadow-sm font-bold'
                                : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]'
                            }`}
                          >
                            <div className="text-xs font-bold text-[var(--text-primary)]">{s.title}</div>
                            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{s.priceText}</div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-1">{s.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CASE B: Project Review Specific Service */}
                  {serviceType === 'project-review' && (
                    <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Select Review Package
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'basic' as ReviewTier, title: 'Basic Review', price: 30, desc: 'Structure & error check' },
                          { id: 'technical' as ReviewTier, title: 'Technical Review', price: 50, desc: 'Code & logic audit' },
                          { id: 'presentation' as ReviewTier, title: 'PPT Review', price: 30, desc: 'Design & content flow' },
                          { id: 'final' as ReviewTier, title: 'Final Review', price: 70, desc: 'All-inclusive full audit' }
                        ].map(r => (
                          <div
                            key={r.id}
                            onClick={() => setReviewType(r.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              reviewType === r.id
                                ? 'border-blue-600 bg-blue-600/15 shadow-sm font-bold'
                                : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]'
                            }`}
                          >
                            <div className="text-xs font-bold text-[var(--text-primary)]">{r.title}</div>
                            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">₹{r.price}</div>
                            <div className="text-[10px] text-[var(--text-muted)] mt-1">{r.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CASE C: College Project Checklist */}
                  {serviceType !== 'ppt-presentation' && serviceType !== 'project-review' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        What deliverables do you require? (Select all that apply)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {[
                          { checked: needsProject, set: setNeedsProject, label: '✓ Project Source Code' },
                          { checked: needsPPT, set: setNeedsPPT, label: '✓ College PPT (FREE)' },
                          { checked: needsDocumentation, set: setNeedsDocumentation, label: '✓ Project Report / Docs' },
                          { checked: needsReview, set: setNeedsReview, label: '✓ Project Review' },
                          { checked: needsVivaPrep, set: setNeedsVivaPrep, label: '✓ Viva / Q&A Prep' },
                          { checked: needsCodingHelp, set: setNeedsCodingHelp, label: '✓ Basic Coding Help' }
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--bg-elevated)]">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={e => item.set(e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span className="font-semibold text-[var(--text-primary)] text-[11px]">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Short Description / Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Briefly describe what you need or what instructions your college professor provided..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus-ring"
                    />
                  </div>

                  {/* CASE D: Technical Stack Selection */}
                  {(serviceType === 'data-science' || serviceType === 'ai-ml' || serviceType === 'technical-help' || (studyYear !== '1st_year' && projectLevel !== 'basic')) && (
                    <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Relevant Technologies / Frameworks
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Python', 'Pandas', 'Scikit-learn', 'Machine Learning', 'Deep Learning',
                          'PyTorch', 'OpenCV', 'Streamlit', 'React', 'HTML/CSS/JS', 'Node.js',
                          'Java', 'Spring Boot', 'MySQL', 'SQLite', 'Power BI'
                        ].map(tech => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechnology(tech)}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                              selectedTechs.includes(tech)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 3: User Controlled File Upload */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">Upload Project Materials & Guidelines</h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Attach your problem statement, college guidelines, dataset, notes, or existing code. (Optional)
                    </p>
                  </div>

                  <FileManager
                    files={files}
                    onAddFiles={newFiles => setFiles(prev => [...prev, ...newFiles])}
                    onRemoveFile={id => setFiles(prev => prev.filter(f => f.id !== id))}
                  />
                </div>
              )}

              {/* STEP 4: AI Complexity & Estimated Completion Time */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>AI Analysis Complete</span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      Estimated Completion Time & Project Confirmation
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Delivery time is automatically computed based on project modules, dataset size, and implementation complexity.
                    </p>
                  </div>

                  {/* AI Complexity & Delivery Estimation Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-500/30 space-y-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          AI Complexity Evaluation
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                            assessment.estimatedComplexity === 'small'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : assessment.estimatedComplexity === 'medium'
                              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          }`}>
                            {assessment.estimatedComplexity === 'small' ? '⚡ Small / Simple Project' : assessment.estimatedComplexity === 'medium' ? '🔷 Medium Project' : '🚀 Large / Complex Project'}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase">
                          Estimated Completion Time
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                          {assessment.estimatedDeliveryText || '~25 minutes'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                          <strong className="text-[var(--text-primary)]">AI Analysis Reasoning:</strong> {assessment.complexityReasoning}
                        </p>
                      </div>

                      {/* Complexity Range Guide */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className={`p-3 rounded-xl border ${assessment.estimatedComplexity === 'small' ? 'border-emerald-500 bg-emerald-500/10 font-bold' : 'border-[var(--border-color)] bg-[var(--bg-surface)] opacity-70'}`}>
                          <div className="font-bold text-emerald-500">Small Project</div>
                          <div className="text-[var(--text-muted)] mt-0.5">Simple task / PPT / Analysis</div>
                          <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">Max 30 mins</div>
                        </div>
                        <div className={`p-3 rounded-xl border ${assessment.estimatedComplexity === 'medium' ? 'border-blue-500 bg-blue-500/10 font-bold' : 'border-[var(--border-color)] bg-[var(--bg-surface)] opacity-70'}`}>
                          <div className="font-bold text-blue-500">Medium Project</div>
                          <div className="text-[var(--text-muted)] mt-0.5">Multi-module / Data / ML</div>
                          <div className="font-mono text-blue-600 dark:text-blue-400 font-bold mt-1">2–4 hours</div>
                        </div>
                        <div className={`p-3 rounded-xl border ${assessment.estimatedComplexity === 'large' ? 'border-purple-500 bg-purple-500/10 font-bold' : 'border-[var(--border-color)] bg-[var(--bg-surface)] opacity-70'}`}>
                          <div className="font-bold text-purple-500">Large Project</div>
                          <div className="text-[var(--text-muted)] mt-0.5">Full stack / Capstone / AI</div>
                          <div className="font-mono text-purple-600 dark:text-purple-400 font-bold mt-1">Max 12 hours</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transparent Price / Deliverables Summary */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center justify-between">
                      <span>Order Summary & Deliverables</span>
                      <span className="font-mono text-blue-500">{assessment.totalFinalPrice === 0 ? '100% FREE' : formatCurrency(assessment.totalFinalPrice, currency)}</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {assessment.breakdownItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[var(--text-secondary)]">
                          <span>{item.label}</span>
                          <span className="font-mono font-bold text-[var(--text-primary)]">{formatCurrency(item.amount, currency)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-sm text-[var(--text-primary)] border-t border-[var(--border-color)] pt-2">
                        <span>Total:</span>
                        <span className="font-mono font-black text-blue-600 dark:text-blue-400">
                          {assessment.totalFinalPrice === 0 ? 'FREE (₹0)' : formatCurrency(assessment.totalFinalPrice, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <span>{currentStep === 4 ? (assessment.totalFinalPrice === 0 ? 'Submit Free Request (₹0)' : 'Confirm & Proceed') : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Live Dynamic Cost Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Estimated Delivery
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase">
                  {assessment.estimatedComplexity} Complexity
                </span>
              </div>

              {/* Delivery Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 border border-blue-500/30 text-center space-y-1">
                <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">AI Turnaround Time</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {assessment.estimatedDeliveryText || '~25 minutes'}
                </div>
                <div className="text-[10px] text-emerald-500 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automatically analyzed complexity</span>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Deliverables Included:
                </div>
                <ul className="space-y-1.5">
                  {assessment.deliverablesList.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-[var(--text-primary)]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-[var(--border-color)] space-y-1.5 text-[11px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Academic Rubric & Verification Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Delivery within 12 hours maximum</span>
                </div>
              </div>

            </div>

            {/* AI Assistant Callout */}
            <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>“AI-powered project assistance designed for college academic excellence. Fast, modular, and verified.”</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
