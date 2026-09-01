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
  needsProject?: boolean;
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
  const service = params.serviceType || 'college-project';
  const textCorpus = `${params.descriptionText || ''} ${params.problemStatement || ''}`.toLowerCase();
  const techCount = params.technologies?.length || 0;

  // 1. AI Automatic Complexity Analysis
  let resolvedComplexity: 'small' | 'medium' | 'large' = 'small';
  let estimatedDeliveryText = '~25 minutes';
  let estimatedMinutes = 25;
  let complexityReasoning = 'Standard single-module task with automated generation.';

  if (service === 'ppt-presentation') {
    resolvedComplexity = 'small';
    estimatedDeliveryText = '~20 minutes';
    estimatedMinutes = 20;
    complexityReasoning = 'Presentation generation and visual layout structuring.';
  } else if (service === 'project-review') {
    resolvedComplexity = 'small';
    estimatedDeliveryText = '~30 minutes';
    estimatedMinutes = 30;
    complexityReasoning = 'Algorithmic review, logic verification, and rubric evaluation.';
  } else {
    // Check for Large / Complex Project criteria
    const hasComplexKeywords = /full[- ]?stack|deep learning|neural network|microservices?|distributed|multi[- ]?tier|blockchain|transformer|bert|llm|cloud deployment|ansys|solidworks|finite element|capstone|large dataset|multi[- ]?module/i.test(textCorpus);
    const hasMultipleComponents = params.needsProject && params.needsDocumentation && params.needsVivaPrep;
    
    if (params.projectLevel === 'major' || hasComplexKeywords || (techCount >= 4 && hasMultipleComponents)) {
      resolvedComplexity = 'large';
      estimatedDeliveryText = '~6 hours';
      estimatedMinutes = 360;
      complexityReasoning = 'Full-scope multi-tier architecture with extensive processing, documentation, and testing.';
    } else if (params.projectLevel === 'mini' || techCount >= 2 || /machine learning|data analysis|react|node|spring|database|mini project|classification|opencv|yolo|api integration|dashboard|embedded/i.test(textCorpus)) {
      resolvedComplexity = 'medium';
      estimatedDeliveryText = '~2.5 hours';
      estimatedMinutes = 150;
      complexityReasoning = 'Modular software/engineering project with data processing and structured implementation.';
    } else {
      resolvedComplexity = 'small';
      estimatedDeliveryText = '~25 minutes';
      estimatedMinutes = 25;
      complexityReasoning = 'Basic college assignment / simple topic with focused single-module scope.';
    }
  }

  // 2. Base Amount Resolution
  if (service === 'ppt-presentation') {
    const slideTier = params.pptSlideCount || '8_10_slides';
    baseAmount = config.pptRates[slideTier] !== undefined ? config.pptRates[slideTier] : 0;
    const isFree = baseAmount === 0;
    const slideLabel = slideTier === '5_7_slides' ? 'College PPT (5–7 Slides)' : slideTier === '11_15_slides' ? 'College PPT (11–15 Slides)' : 'College PPT (8–10 Slides)';
    
    breakdownItems.push({
      label: isFree ? `${slideLabel} — FREE` : slideLabel,
      amount: baseAmount
    });
  } else if (service === 'project-review') {
    const revTier = params.reviewType || 'basic';
    baseAmount = config.reviewRates[revTier] || 30;
    const revLabel = revTier === 'technical' ? 'Technical Code Review' : revTier === 'final' ? 'Final Comprehensive Review' : 'Basic Project Review';
    breakdownItems.push({ label: revLabel, amount: baseAmount });
  } else {
    if (resolvedComplexity === 'small') {
      baseAmount = config.basePrices.basicCollege || 50;
      breakdownItems.push({ label: 'Basic College Project / Task', amount: baseAmount });
    } else if (resolvedComplexity === 'large') {
      baseAmount = config.basePrices.majorProject || 100;
      breakdownItems.push({ label: 'Major Project / Comprehensive Task', amount: baseAmount });
    } else {
      baseAmount = config.basePrices.miniProject || 80;
      breakdownItems.push({ label: 'College Mini Project / Standard Task', amount: baseAmount });
    }

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

  // Sum total without urgency markup
  const unconstrainedTotal = breakdownItems.reduce((s, i) => s + i.amount, 0);

  const isFreePptService = service === 'ppt-presentation' && (params.pptSlideCount === '5_7_slides' || params.pptSlideCount === '8_10_slides' || !params.pptSlideCount);
  const minFloor = isFreePptService && unconstrainedTotal === 0 ? 0 : 30;

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
    estimatedEffortHours: resolvedComplexity === 'small' ? 1 : resolvedComplexity === 'medium' ? 3 : 8,
    recommendedTimelineDays: 1,
    estimatedPrice: totalFinalPrice,
    basePrice: baseAmount,
    complexityFee: 0,
    techFee: 0,
    urgencyFee: 0,
    addOnsTotal: Math.max(0, unconstrainedTotal - baseAmount),
    taxAmount: 0,
    totalFinalPrice,
    assignedExpertTier: 'AI Automated Engine',
    deliverablesList: deliverables,
    revisionsAllowed: 3,
    rationale: complexityReasoning,
    breakdownItems,
    estimatedDeliveryText,
    estimatedMinutes,
    complexityReasoning
  };
}

export function getDeadlineComparisonPrices(params: Omit<EvaluateProjectParams, 'urgency'>) {
  const assessment = evaluateProjectRequirements({ ...params, urgency: 'standard' });
  return {
    sameDayPrice: assessment.totalFinalPrice,
    urgentPrice: assessment.totalFinalPrice,
    priorityPrice: assessment.totalFinalPrice,
    standardPrice: assessment.totalFinalPrice,
    savingsWithStandard: 0
  };
}
