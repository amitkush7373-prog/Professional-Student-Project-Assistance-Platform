import {
  ComplexityLevel,
  UrgencyLevel,
  ProjectCategory,
  CollegeServiceType,
  CollegeProjectLevel,
  PPTTier,
  ReviewTier,
  PricingConfig,
  ProjectAddon,
  ProjectAssessment
} from '../types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  basePrices: {
    basicCollege: 200,
    miniProject: 300,
    majorProject: 400
  },
  urgencyAdders: {
    standard: 0,     // 7+ days: no extra charge (best price)
    priority: 50,    // 4-6 days: +₹50
    urgent: 150,     // 2-3 days: +₹150
    'same-day': 250  // 1 day (tomorrow): +₹250
  },
  pptRates: {
    '5_7_slides': 100,
    '8_10_slides': 150,
    '11_15_slides': 200
  },
  reviewRates: {
    basic: 100,
    technical: 150,
    presentation: 100,
    final: 200
  },
  documentationRates: {
    formatting: 100,
    fullDocs: 150
  },
  debuggingRates: {
    minorBug: 100,
    multipleBugs: 200
  },
  addonRates: {
    documentation: 100,
    presentation: 100,
    deployment: 100,
    walkthrough: 100,
    extra_revisions: 50
  },
  maxPriceLimit: 700, // ABSOLUTE MAXIMUM CEILING (₹700)
  minPriceLimit: 100  // MINIMUM BASE RATE (₹100)
};

export const AVAILABLE_ADDONS: ProjectAddon[] = [
  {
    id: 'presentation',
    title: 'College Presentation PPT (8-10 Slides)',
    description: 'Clean formatted PowerPoint deck with key points and diagrams.',
    price: 100,
    isSelected: false,
    iconName: 'Presentation'
  },
  {
    id: 'documentation',
    title: 'Project Report / Documentation',
    description: 'Formatted project documentation report with structure & summaries.',
    price: 100,
    isSelected: false,
    iconName: 'FileText'
  },
  {
    id: 'review',
    title: 'Project Review & Error Audit',
    description: 'Review for logical bugs, layout consistency, and missing sections.',
    price: 100,
    isSelected: false,
    iconName: 'CheckCircle2'
  },
  {
    id: 'walkthrough',
    title: 'Viva Preparation & Code Explanation',
    description: 'Explanation of code flow and anticipated examiner viva questions.',
    price: 100,
    isSelected: false,
    iconName: 'Video'
  },
  {
    id: 'deployment',
    title: 'Live Deployment Link',
    description: 'Deploy project online with live accessible demo URL.',
    price: 100,
    isSelected: false,
    iconName: 'CloudUpload'
  }
];

export interface EvaluateProjectParams {
  serviceType?: CollegeServiceType;
  projectLevel?: CollegeProjectLevel;
  category?: ProjectCategory;
  complexity?: ComplexityLevel;
  urgency: UrgencyLevel;
  technologies?: string[];
  featuresCount?: number;
  descriptionText?: string;
  problemStatement?: string;
  addons?: ProjectAddon[];
  pptSlideCount?: PPTTier;
  reviewType?: ReviewTier;
  needsPPT?: boolean;
  needsDocumentation?: boolean;
  needsReview?: boolean;
  needsVivaPrep?: boolean;
  needsCodingHelp?: boolean;
  pricingConfig?: PricingConfig;
}

/**
 * Intelligent College Student Pricing Engine
 * Strictly enforces that all calculated orders remain within the ₹100 – ₹700 range.
 */
export function evaluateProjectRequirements(params: EvaluateProjectParams): ProjectAssessment {
  const config = params.pricingConfig || DEFAULT_PRICING_CONFIG;
  const maxCap = config.maxPriceLimit || 700;
  const minFloor = config.minPriceLimit || 100;

  const breakdownItems: { label: string; amount: number }[] = [];
  let baseAmount = 200;
  let resolvedComplexity: 'small' | 'medium' | 'large' = 'small';
  let rationale = '';

  const service = params.serviceType || 'college-project';

  // 1. PPT Only Service Flow
  if (service === 'ppt-presentation') {
    const slideTier = params.pptSlideCount || '8_10_slides';
    baseAmount = config.pptRates[slideTier] || 150;
    const slideLabel = slideTier === '5_7_slides' ? 'PPT (5–7 Slides)' : slideTier === '11_15_slides' ? 'PPT (11–15 Slides)' : 'PPT (8–10 Slides)';
    breakdownItems.push({ label: slideLabel, amount: baseAmount });
    resolvedComplexity = 'small';
    rationale = `College presentation slides (${slideLabel.toLowerCase()}) designed for academic submission.`;
  }
  // 2. Project Review Only Service Flow
  else if (service === 'project-review') {
    const revTier = params.reviewType || 'basic';
    baseAmount = config.reviewRates[revTier] || 100;
    const revLabel = revTier === 'technical' ? 'Technical Code Review' : revTier === 'final' ? 'Final Comprehensive Review' : 'Basic Project Review';
    breakdownItems.push({ label: revLabel, amount: baseAmount });
    resolvedComplexity = 'small';
    rationale = `${revLabel} checking structure, presentation flow, and potential errors.`;
  }
  // 3. College Project & Technical Help Flows
  else {
    const level = params.projectLevel || 'basic';
    if (level === 'basic' || params.complexity === 'small') {
      baseAmount = config.basePrices.basicCollege || 200;
      resolvedComplexity = 'small';
      breakdownItems.push({ label: 'Basic College Project Assistance', amount: baseAmount });
      rationale = 'Simple college assignment / 1st-year project assistance.';
    } else if (level === 'major' || params.complexity === 'large') {
      baseAmount = config.basePrices.majorProject || 400;
      resolvedComplexity = 'large';
      breakdownItems.push({ label: 'Major Project / Capstone Assistance', amount: baseAmount });
      rationale = 'Larger final-year project assistance with multi-module development.';
    } else {
      baseAmount = config.basePrices.miniProject || 300;
      resolvedComplexity = 'medium';
      breakdownItems.push({ label: 'College Mini Project Assistance', amount: baseAmount });
      rationale = 'Standard college mini project (Web / Data Science / Python / ML).';
    }

    // Direct checkbox additions (PPT, Docs, Review)
    if (params.needsPPT) {
      const pptCost = 100;
      breakdownItems.push({ label: 'Project PPT Presentation', amount: pptCost });
    }
    if (params.needsDocumentation) {
      const docCost = 100;
      breakdownItems.push({ label: 'Project Documentation Report', amount: docCost });
    }
    if (params.needsReview) {
      const revCost = 100;
      breakdownItems.push({ label: 'Project Review & Feedback', amount: revCost });
    }
    if (params.needsVivaPrep) {
      const vivaCost = 100;
      breakdownItems.push({ label: 'Viva & Concept Explanation', amount: vivaCost });
    }
  }

  // Add-ons selected in list
  if (params.addons && params.addons.length > 0) {
    params.addons.filter(a => a.isSelected).forEach(a => {
      // Avoid duplicate charging if already added via checkboxes
      if (!breakdownItems.some(b => b.label.toLowerCase().includes(a.title.toLowerCase()))) {
        breakdownItems.push({ label: a.title, amount: a.price });
      }
    });
  }

  // Urgency Fee
  const urgencyAdder = config.urgencyAdders[params.urgency] || 0;
  if (urgencyAdder > 0) {
    const urgencyLabel = params.urgency === 'same-day' ? '1 Day Express Urgency' : params.urgency === 'urgent' ? '2–3 Days Urgency' : '4–6 Days Priority';
    breakdownItems.push({ label: urgencyLabel, amount: urgencyAdder });
  }

  // Sum total
  const unconstrainedTotal = breakdownItems.reduce((s, i) => s + i.amount, 0);

  // Enforce Hard Student Limit: MIN ₹100, MAX ₹700
  const totalFinalPrice = Math.min(maxCap, Math.max(minFloor, unconstrainedTotal));

  // Build deliverables list
  const deliverables: string[] = [];
  if (service === 'ppt-presentation' || params.needsPPT) {
    deliverables.push('Clean, professional college PowerPoint presentation (.pptx)');
  }
  if (service === 'project-review' || params.needsReview) {
    deliverables.push('Comprehensive project review notes & error audit report');
  }
  if (service !== 'ppt-presentation' && service !== 'project-review') {
    deliverables.push('Fully functional source code & clean folder structure');
    deliverables.push('Simple execution guide (README) for running locally');
  }
  if (params.needsDocumentation) {
    deliverables.push('Structured college project report / documentation (.pdf & .docx)');
  }
  if (params.needsVivaPrep) {
    deliverables.push('Viva preparation cheat-sheet with anticipated examiner Q&A');
  }

  return {
    estimatedComplexity: resolvedComplexity,
    estimatedEffortHours: resolvedComplexity === 'small' ? 6 : resolvedComplexity === 'medium' ? 14 : 24,
    recommendedTimelineDays: params.urgency === 'same-day' ? 1 : params.urgency === 'urgent' ? 2 : params.urgency === 'priority' ? 4 : 7,
    estimatedPrice: totalFinalPrice,
    basePrice: baseAmount,
    complexityFee: 0,
    techFee: 0,
    urgencyFee: urgencyAdder,
    addOnsTotal: Math.max(0, unconstrainedTotal - baseAmount - urgencyAdder),
    taxAmount: 0,
    totalFinalPrice,
    assignedExpertTier: 'Verified Academic Engineering Mentor',
    deliverablesList: deliverables,
    revisionsAllowed: 3,
    rationale,
    breakdownItems
  };
}

/**
 * Calculates deadline pricing comparison for the student savings UX
 * Example output:
 * 1 Day (Tomorrow): ₹450 – ₹650
 * 2-3 Days: ₹350 – ₹550
 * 4-6 Days: ₹250 – ₹450
 * 7+ Days (Best Savings): ₹200 – ₹350
 */
export function getDeadlineComparisonPrices(params: Omit<EvaluateProjectParams, 'urgency'>) {
  const sameDayPrice = evaluateProjectRequirements({ ...params, urgency: 'same-day' }).totalFinalPrice;
  const urgentPrice = evaluateProjectRequirements({ ...params, urgency: 'urgent' }).totalFinalPrice;
  const priorityPrice = evaluateProjectRequirements({ ...params, urgency: 'priority' }).totalFinalPrice;
  const standardPrice = evaluateProjectRequirements({ ...params, urgency: 'standard' }).totalFinalPrice;

  return {
    sameDayPrice,
    urgentPrice,
    priorityPrice,
    standardPrice,
    savingsWithStandard: Math.max(0, urgentPrice - standardPrice)
  };
}
