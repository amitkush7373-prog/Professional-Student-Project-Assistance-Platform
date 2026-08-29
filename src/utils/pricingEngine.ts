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
    basicCollege: 50, // Small task / 1st Year (₹30–₹50)
    miniProject: 80,  // Medium task / Mini project (₹70–₹80)
    majorProject: 100 // Complex task / Capstone (₹100 MAX)
  },
  urgencyAdders: {
    standard: 0,     // 7+ days: ₹0 (best price)
    priority: 10,    // 4-6 days: +₹10
    urgent: 20,      // 2-3 days: +₹20
    'same-day': 30   // 1 day (tomorrow): +₹30
  },
  pptRates: {
    '5_7_slides': 0,    // COMPLETELY FREE (₹0)
    '8_10_slides': 0,   // COMPLETELY FREE (₹0)
    '11_15_slides': 30  // Extended slides (+₹30)
  },
  reviewRates: {
    basic: 30,
    technical: 50,
    presentation: 30,
    final: 70
  },
  documentationRates: {
    formatting: 30,
    fullDocs: 50
  },
  debuggingRates: {
    minorBug: 30,
    multipleBugs: 50
  },
  addonRates: {
    documentation: 30,
    presentation: 0,    // FREE
    deployment: 30,
    walkthrough: 30,
    extra_revisions: 10
  },
  maxPriceLimit: 100, // ABSOLUTE MAXIMUM CEILING (₹100)
  minPriceLimit: 0    // MINIMUM RATE (₹0 for Free PPT, ₹30 for paid tasks)
};

export const AVAILABLE_ADDONS: ProjectAddon[] = [
  {
    id: 'presentation',
    title: 'College Presentation PPT (5–10 Slides)',
    description: 'Clean formatted PowerPoint deck with key points — 100% FREE for students.',
    price: 0,
    isSelected: false,
    iconName: 'Presentation'
  },
  {
    id: 'documentation',
    title: 'Project Report / Documentation',
    description: 'Formatted project documentation report with structure & summaries.',
    price: 30,
    isSelected: false,
    iconName: 'FileText'
  },
  {
    id: 'review',
    title: 'Project Review & Error Audit',
    description: 'Review for logical bugs, layout consistency, and missing sections.',
    price: 30,
    isSelected: false,
    iconName: 'CheckCircle2'
  },
  {
    id: 'walkthrough',
    title: 'Viva Preparation & Code Explanation',
    description: 'Explanation of code flow and anticipated examiner viva questions.',
    price: 30,
    isSelected: false,
    iconName: 'Video'
  },
  {
    id: 'deployment',
    title: 'Live Deployment Link',
    description: 'Deploy project online with live accessible demo URL.',
    price: 30,
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
 * Super Affordable Student Pricing Engine (₹30, ₹50, ₹80, ₹100 MAXIMUM)
 * - 5-10 slide College PPT: 100% FREE (₹0)
 * - Very small task / bug fix: ₹30 – ₹50
 * - Medium task / mini project: ₹70 – ₹80
 * - More involved task: ₹100 MAX
 */
export function evaluateProjectRequirements(params: EvaluateProjectParams): ProjectAssessment {
  const config = params.pricingConfig || DEFAULT_PRICING_CONFIG;
  const maxCap = config.maxPriceLimit || 100;

  const breakdownItems: { label: string; amount: number }[] = [];
  let baseAmount = 50;
  let resolvedComplexity: 'small' | 'medium' | 'large' = 'small';
  let rationale = '';

  const service = params.serviceType || 'college-project';

  // 1. PPT Only Service Flow (5-10 slides is FREE ₹0!)
  if (service === 'ppt-presentation') {
    const slideTier = params.pptSlideCount || '8_10_slides';
    baseAmount = config.pptRates[slideTier] !== undefined ? config.pptRates[slideTier] : 0;
    const isFree = baseAmount === 0;
    const slideLabel = slideTier === '5_7_slides' ? 'College PPT (5–7 Slides)' : slideTier === '11_15_slides' ? 'College PPT (11–15 Slides)' : 'College PPT (8–10 Slides)';
    
    breakdownItems.push({
      label: isFree ? `${slideLabel} — FREE` : slideLabel,
      amount: baseAmount
    });
    resolvedComplexity = 'small';
    rationale = isFree
      ? 'College presentation slides (5–10 slides) provided 100% FREE for college students.'
      : `Extended college presentation deck (${slideLabel.toLowerCase()}).`;
  }
  // 2. Project Review Only Service Flow (₹30–₹70)
  else if (service === 'project-review') {
    const revTier = params.reviewType || 'basic';
    baseAmount = config.reviewRates[revTier] || 30;
    const revLabel = revTier === 'technical' ? 'Technical Code Review' : revTier === 'final' ? 'Final Comprehensive Review' : 'Basic Project Review';
    breakdownItems.push({ label: revLabel, amount: baseAmount });
    resolvedComplexity = 'small';
    rationale = `${revLabel} checking logic, syntax, formatting, and submission rubric.`;
  }
  // 3. College Project & Technical Help Flows (₹30, ₹50, ₹80, ₹100 MAX)
  else {
    const level = params.projectLevel || 'basic';
    if (level === 'basic' || params.complexity === 'small') {
      baseAmount = config.basePrices.basicCollege || 50;
      resolvedComplexity = 'small';
      breakdownItems.push({ label: 'Basic College Project / Task', amount: baseAmount });
      rationale = 'Small task / 1st-year college assignment assistance.';
    } else if (level === 'major' || params.complexity === 'large') {
      baseAmount = config.basePrices.majorProject || 100;
      resolvedComplexity = 'large';
      breakdownItems.push({ label: 'Major Project / Comprehensive Task', amount: baseAmount });
      rationale = 'More involved final-year / complex project assistance.';
    } else {
      baseAmount = config.basePrices.miniProject || 80;
      resolvedComplexity = 'medium';
      breakdownItems.push({ label: 'College Mini Project / Standard Task', amount: baseAmount });
      rationale = 'Standard college mini project (Web / Python / Data Science / ML).';
    }

    // Direct checkbox additions
    if (params.needsPPT) {
      breakdownItems.push({ label: 'College PPT (5–10 Slides) — FREE', amount: 0 });
    }
    if (params.needsDocumentation) {
      breakdownItems.push({ label: 'Project Documentation Report', amount: 30 });
    }
    if (params.needsReview) {
      breakdownItems.push({ label: 'Project Review & Feedback', amount: 30 });
    }
    if (params.needsVivaPrep) {
      breakdownItems.push({ label: 'Viva & Concept Explanation', amount: 30 });
    }
  }

  // Add-ons selected in list
  if (params.addons && params.addons.length > 0) {
    params.addons.filter(a => a.isSelected).forEach(a => {
      if (!breakdownItems.some(b => b.label.toLowerCase().includes(a.title.toLowerCase()))) {
        breakdownItems.push({ label: a.title, amount: a.price });
      }
    });
  }

  // Urgency Fee (₹0, ₹10, ₹20, ₹30)
  const urgencyAdder = config.urgencyAdders[params.urgency] || 0;
  if (urgencyAdder > 0) {
    const urgencyLabel = params.urgency === 'same-day' ? '1 Day Priority' : params.urgency === 'urgent' ? '2–3 Days Priority' : '4–6 Days Priority';
    breakdownItems.push({ label: urgencyLabel, amount: urgencyAdder });
  }

  // Sum total
  const unconstrainedTotal = breakdownItems.reduce((s, i) => s + i.amount, 0);

  // If service is basic free PPT with no paid extras, total is strictly 0
  const isFreePptService = service === 'ppt-presentation' && (params.pptSlideCount === '5_7_slides' || params.pptSlideCount === '8_10_slides' || !params.pptSlideCount);
  const minFloor = isFreePptService && unconstrainedTotal === 0 ? 0 : 30;

  // Enforce Hard Student Limit: strictly ₹30, ₹50, ₹80, ₹100 MAXIMUM (or ₹0 for Free PPT)
  const totalFinalPrice = isFreePptService && unconstrainedTotal === 0
    ? 0
    : Math.min(maxCap, Math.max(minFloor, unconstrainedTotal));

  // Build deliverables list
  const deliverables: string[] = [];
  if (service === 'ppt-presentation' || params.needsPPT) {
    deliverables.push('College PowerPoint presentation (5–10 slides formatted in 16:9 HD) — FREE');
  }
  if (service === 'project-review' || params.needsReview) {
    deliverables.push('Comprehensive error audit & examiner rubric review report');
  }
  if (service !== 'ppt-presentation' && service !== 'project-review') {
    deliverables.push('Fully functional verified source code & structured folders');
    deliverables.push('Step-by-step execution guide (README) for running locally');
  }
  if (params.needsDocumentation) {
    deliverables.push('Structured college project report / synopsis (.pdf & .docx)');
  }
  if (params.needsVivaPrep) {
    deliverables.push('Viva preparation cheat-sheet with anticipated examiner Q&A');
  }

  return {
    estimatedComplexity: resolvedComplexity,
    estimatedEffortHours: resolvedComplexity === 'small' ? 4 : resolvedComplexity === 'medium' ? 8 : 16,
    recommendedTimelineDays: params.urgency === 'same-day' ? 1 : params.urgency === 'urgent' ? 2 : params.urgency === 'priority' ? 4 : 7,
    estimatedPrice: totalFinalPrice,
    basePrice: baseAmount,
    complexityFee: 0,
    techFee: 0,
    urgencyFee: urgencyAdder,
    addOnsTotal: Math.max(0, unconstrainedTotal - baseAmount - urgencyAdder),
    taxAmount: 0,
    totalFinalPrice,
    assignedExpertTier: 'Verified Engineering Project Specialist',
    deliverablesList: deliverables,
    revisionsAllowed: 3,
    rationale,
    breakdownItems
  };
}

/**
 * Calculates deadline pricing comparison for student savings UX (up to ₹100 MAX)
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
