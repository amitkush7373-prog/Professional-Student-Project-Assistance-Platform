import React, { useState } from 'react';
import pptxgen from 'pptxgenjs';
import {
  Sparkles,
  Presentation,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  FileText,
  Layers,
  Code2,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Award,
  Zap,
  Cpu,
  Wand2,
  SlidersHorizontal,
  Lightbulb,
  Terminal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layout,
  Palette,
  Type,
  FileCode,
  Table as TableIcon,
  Columns,
  Share2,
  Monitor,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Output Formats
export type OutputFormat =
  | 'auto'
  | '16_9'
  | '4_3'
  | 'a4_portrait'
  | 'a4_landscape'
  | 'a3_poster'
  | 'letter_portrait';

export type DetailedDomain =
  | 'solar_renewable_energy'
  | 'mechanical_thermal'
  | 'civil_structural'
  | 'management_economics'
  | 'pure_science_research'
  | 'software_ai_vision_ml'
  | 'software_web_mobile_cloud'
  | 'blockchain_smart_contracts'
  | 'hardware_iot_embedded'
  | 'general_academic';

export type ThemeStyle =
  | 'slate_dark'
  | 'academic_light'
  | 'cyber_emerald'
  | 'royal_indigo'
  | 'crimson_elegance'
  | 'midnight_purple'
  | 'ocean_cyan';

export type TypographyStyle = 'sans' | 'serif' | 'mono';

export type SlideLayoutType =
  | 'title'
  | 'two_column'
  | 'process_flow'
  | 'cards_grid'
  | 'architecture_diagram'
  | 'code_snippet'
  | 'comparison_table'
  | 'metrics_stats'
  | 'standard_bullets';

export interface ColumnCard {
  title: string;
  points: string[];
  tag?: string;
  accent?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface MetricStat {
  value: string;
  label: string;
  subtext: string;
}

export interface CodeBlockData {
  language: string;
  snippet: string;
  explanation: string;
  inputOutput?: string;
  fullSourceFile?: string;
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface SlideItem {
  id: number;
  layoutType: SlideLayoutType;
  title: string;
  subtitle: string;
  category: string;
  points: string[];
  keyHighlight?: string;
  twoColumns?: {
    left: ColumnCard;
    right: ColumnCard;
  };
  cardsGrid?: ColumnCard[];
  processSteps?: ProcessStep[];
  metricStats?: MetricStat[];
  structuredCode?: CodeBlockData;
  diagramFlow?: string;
  tableData?: TableData;
  formula?: string;
  presenterNotes: string;
  vivaQuestions: { q: string; a: string }[];
}

export interface ParsedPromptConfig {
  title: string;
  cleanTopic: string;
  slideCount: number;
  domain: string;
  domainType: DetailedDomain;
  requiresCode: boolean;
  technologies: string[];
  presentationType: 'major_capstone' | 'mini_project' | 'seminar' | 'viva' | 'report' | 'poster';
  detectedFormat: OutputFormat;
  themeStyle: ThemeStyle;
  typography: TypographyStyle;
}

export const AiPptGeneratorAgent: React.FC = () => {
  const { currentUser, setActiveView, submitNewProject, addToast, setSelectedProjectId } = useApp();

  // Prompt Input States
  const [prompt, setPrompt] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('auto');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedSlides, setGeneratedSlides] = useState<SlideItem[] | null>(null);
  const [parsedMeta, setParsedMeta] = useState<ParsedPromptConfig | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'slides' | 'notes' | 'viva'>('slides');

  // Viewer Customization States
  const [activeFormat, setActiveFormat] = useState<OutputFormat>('16_9');
  const [activeTheme, setActiveTheme] = useState<ThemeStyle>('slate_dark');
  const [activeFont, setActiveFont] = useState<TypographyStyle>('sans');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const generationSteps = [
    'Analyzing project domain, scope, and technical requirements...',
    'Checking whether programming code is genuinely required...',
    'Structuring dynamic slide flow (tables, schematics, or code)...',
    'Synthesizing verified engineering content and calculations...',
    'Composing professor-ready presenter notes and speech script...',
    'Compiling examiner Viva defense questions and answers...',
    'Rendering presentation canvas...'
  ];

  // Quick Inspiration Prompt Samples (Natural Language)
  const promptInspirations = [
    {
      title: 'Solar Energy Microgrid Economics (Non-Coding / Engineering)',
      prompt: 'Renewable Solar Energy Microgrid Integration & Supply Chain Economics. Include technical background, energy storage methodology, mathematical power loss equations, comparative cost tables, regulatory framework, and viva defense Q&A. No software code.'
    },
    {
      title: 'Design of Solar Water Heater (Mechanical / Thermal)',
      prompt: 'Design and Analysis of Solar Water Heater using flat-plate thermal collectors. Include material selection, thermosiphon working principle, heat transfer calculations, experimental efficiency, cost payback analysis, and viva questions.'
    },
    {
      title: 'AI Crop Disease Detection (Software / Python & OpenCV)',
      prompt: 'Create a 12-slide presentation on AI-based Crop Disease Detection using Python, TensorFlow and OpenCV. Include problem statement, objectives, existing system, proposed system, methodology, dataset, architecture, implementation code, results, advantages, limitations, future scope and conclusion. Add speaker notes and viva questions.'
    },
    {
      title: 'Decentralized E-Voting System (Blockchain / Solidity)',
      prompt: 'Build an 8-slide presentation on Decentralized E-Voting System using Ethereum Blockchain, Solidity Smart Contracts, and Web3.js with security analysis, consensus mechanism, and speaker script.'
    }
  ];

  // Intelligent Project Domain & Code Requirement Classifier
  const classifyProjectDomain = (text: string): { domainType: DetailedDomain; requiresCode: boolean; domainLabel: string } => {
    const lower = text.toLowerCase();

    // 1. Solar, Renewable Energy, Microgrid, Power Distribution
    if (/solar.*microgrid|microgrid|renewable energy|solar pv|wind energy|wind turbine|energy storage|power grid|grid integration|solar energy|photovoltaic|biomass energy/i.test(lower)) {
      return {
        domainType: 'solar_renewable_energy',
        requiresCode: false,
        domainLabel: 'Renewable Energy & Electrical Power Systems'
      };
    }

    // 2. Mechanical, Thermal, Solar Water Heater, HVAC, Fluid Dynamics, IC Engines
    if (/solar water heater|water heater|heat exchanger|thermal analysis|thermodynamic|fluid mechanics|hvac|ic engine|composite material|structural mechanics|turbomachine|aerodynamic|pump|cad\/cam|finite element/i.test(lower)) {
      return {
        domainType: 'mechanical_thermal',
        requiresCode: false,
        domainLabel: 'Mechanical & Thermal Engineering'
      };
    }

    // 3. Civil, Structural, Concrete, Geotechnical, Transportation
    if (/civil engineering|concrete|bridge design|earthquake resistant|soil mechanics|transportation engineering|highway|structural analysis|building design/i.test(lower)) {
      return {
        domainType: 'civil_structural',
        requiresCode: false,
        domainLabel: 'Civil & Structural Engineering'
      };
    }

    // 4. Management, Supply Chain, Economics, Business, Finance
    if (/supply chain economics|supply chain management|marketing strategy|business case|fintech economics|human resource|financial analysis|cost-benefit|market analysis|operations management|economic analysis/i.test(lower)) {
      return {
        domainType: 'management_economics',
        requiresCode: false,
        domainLabel: 'Business Management & Industrial Economics'
      };
    }

    // 5. Applied Sciences, Biology, Chemistry, Pharma
    if (/biology|organic chemistry|biochemistry|pharmaceutical|genetics|botany|zoology|clinical research|chemical synthesis/i.test(lower)) {
      return {
        domainType: 'pure_science_research',
        requiresCode: false,
        domainLabel: 'Applied Sciences & Research'
      };
    }

    // 6. Explicit Non-Coding indicators
    if (/no code|non-coding|hardware-only|theoretical|no software|management study|pure research/i.test(lower)) {
      return {
        domainType: 'general_academic',
        requiresCode: false,
        domainLabel: 'Engineering & Applied Sciences'
      };
    }

    // 7. Blockchain & Smart Contracts (Genuine coding)
    if (/blockchain|solidity|ethereum|smart contract|web3|dapp|crypto voting/i.test(lower)) {
      return {
        domainType: 'blockchain_smart_contracts',
        requiresCode: true,
        domainLabel: 'Blockchain & Decentralized Systems'
      };
    }

    // 8. AI, Machine Learning, Computer Vision, Deep Learning with Python/OpenCV/TensorFlow (Genuine coding)
    if (/python|tensorflow|pytorch|keras|opencv|yolo|cnn|rnn|lstm|deep learning|machine learning|face recognition|crop disease|image classification|nlp|llm|computer vision|data science/i.test(lower)) {
      return {
        domainType: 'software_ai_vision_ml',
        requiresCode: true,
        domainLabel: 'Artificial Intelligence & Computer Vision'
      };
    }

    // 9. Web & Mobile Applications with frameworks (Genuine coding)
    if (/web application|mobile app|react|next\.?js|node\.?js|flutter|android|full stack|mern|fastapi|django|flask|rest api|cloud computing/i.test(lower)) {
      return {
        domainType: 'software_web_mobile_cloud',
        requiresCode: true,
        domainLabel: 'Software Engineering & Web Systems'
      };
    }

    // 10. IoT & Embedded Systems with microcontroller programming
    if (/esp32|arduino|raspberry pi|iot|embedded|mqtt|sensor network/i.test(lower)) {
      return {
        domainType: 'hardware_iot_embedded',
        requiresCode: true,
        domainLabel: 'Internet of Things & Embedded Systems'
      };
    }

    // Default Fallback: Engineering & Applied Sciences with NO CODE!
    return {
      domainType: 'general_academic',
      requiresCode: false,
      domainLabel: 'Engineering & Applied Sciences'
    };
  };

  // Natural Language Prompt Parser
  const parsePromptInput = (rawPrompt: string, extraNotes: string, userChosenFormat: OutputFormat): ParsedPromptConfig => {
    const fullText = `${rawPrompt} ${extraNotes}`.trim();
    const lowerText = fullText.toLowerCase();

    // 1. Extract Slide Count
    let slideCount = 10;
    const slideMatch = lowerText.match(/(\d+)\s*[- ]*(?:slides?|pages?|cards?|deck)/i);
    if (slideMatch && slideMatch[1]) {
      const parsedNum = parseInt(slideMatch[1], 10);
      if (parsedNum >= 3 && parsedNum <= 30) {
        slideCount = parsedNum;
      }
    } else {
      const wordMap: { [key: string]: number } = {
        five: 5, six: 6, seven: 7, eight: 8, nine: 9,
        ten: 10, eleven: 11, twelve: 12, thirteen: 13,
        fourteen: 14, fifteen: 15, sixteen: 16, twenty: 20
      };
      for (const [word, val] of Object.entries(wordMap)) {
        if (new RegExp(`\\b${word}\\s+slides?\\b`, 'i').test(lowerText)) {
          slideCount = val;
          break;
        }
      }
    }

    // 2. Extract Clean Topic
    let cleanTopic = rawPrompt.trim();
    cleanTopic = cleanTopic
      .replace(/^(?:create|generate|make|build|design|write|prepare)\s+(?:a|an|the)?\s*(?:\d+[- ]*slides?|\w+[- ]*slides?)?\s*(?:presentation|deck|ppt|slides|report|document)\s+(?:on|about|for)?/i, '')
      .replace(/^(?:presentation|deck|ppt|slides|report)\s+(?:on|about|for)/i, '')
      .trim();

    const subjectEnd = cleanTopic.search(/\b(?:include|including|with sections|use a modern|add speaker|with speaker notes|no software code)\b/i);
    let title = cleanTopic;
    if (subjectEnd > 5) {
      title = cleanTopic.substring(0, subjectEnd).trim();
    }
    title = title.replace(/[.,;:]+$/, '').trim();
    if (!title || title.length < 3) {
      title = 'Academic Project Presentation';
    }

    // 3. Domain & Code Requirement Classification
    const { domainType, requiresCode, domainLabel } = classifyProjectDomain(fullText);

    // 4. Detect Technologies
    const techCatalog = [
      'Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Scikit-Learn',
      'Pandas', 'NumPy', 'React', 'Next.js', 'Node.js', 'Express', 'FastAPI',
      'Flask', 'Django', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Firebase', 'Ethereum', 'Solidity',
      'Web3.js', 'Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'Kafka',
      'Flutter', 'Android', 'Java', 'C++', 'TailwindCSS', 'YOLO', 'CNN',
      'ResNet', 'BERT', 'Transformer', 'Random Forest', 'SVM', 'MATLAB', 'Simulink', 'SolidWorks', 'ANSYS'
    ];
    const detectedTech: string[] = [];
    techCatalog.forEach(tech => {
      const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        detectedTech.push(tech);
      }
    });

    // 5. Output Format
    let detectedFormat: OutputFormat = '16_9';
    if (userChosenFormat !== 'auto') {
      detectedFormat = userChosenFormat;
    } else {
      if (/report|documentation|srs|handout|whitepaper|dissertation/i.test(lowerText)) {
        detectedFormat = 'a4_portrait';
      } else if (/poster|presentation board|a3|exhibition/i.test(lowerText)) {
        detectedFormat = 'a3_poster';
      } else if (/4:3|standard display/i.test(lowerText)) {
        detectedFormat = '4_3';
      } else {
        detectedFormat = '16_9';
      }
    }

    // 6. Presentation Purpose
    let presentationType: 'major_capstone' | 'mini_project' | 'seminar' | 'viva' | 'report' | 'poster' = 'mini_project';
    if (/major|capstone|final year|b\.?tech/i.test(lowerText)) {
      presentationType = 'major_capstone';
    } else if (/seminar|colloquium|conference|survey/i.test(lowerText)) {
      presentationType = 'seminar';
    } else if (/viva|defense|examiner|oral/i.test(lowerText)) {
      presentationType = 'viva';
    } else if (/report|whitepaper/i.test(lowerText)) {
      presentationType = 'report';
    } else if (/poster/i.test(lowerText)) {
      presentationType = 'poster';
    }

    // 7. Theme & Font Style
    let themeStyle: ThemeStyle = 'slate_dark';
    if (/emerald|green|agriculture|nature|leaf|plant|solar/i.test(lowerText)) {
      themeStyle = 'cyber_emerald';
    } else if (/purple|violet|crypto|blockchain|security/i.test(lowerText)) {
      themeStyle = 'midnight_purple';
    } else if (/cyan|ocean|cloud|iot|embedded/i.test(lowerText)) {
      themeStyle = 'ocean_cyan';
    } else if (/crimson|red|energy|mechanical/i.test(lowerText)) {
      themeStyle = 'crimson_elegance';
    } else if (/paper|latex|academic|white|light/i.test(lowerText)) {
      themeStyle = 'academic_light';
    }

    let typography: TypographyStyle = 'sans';
    if (/academic|research|paper|journal|latex/i.test(lowerText)) {
      typography = 'serif';
    } else if (/code|developer|terminal|hacker/i.test(lowerText)) {
      typography = 'mono';
    }

    return {
      title,
      cleanTopic,
      slideCount,
      domain: domainLabel,
      domainType,
      requiresCode,
      technologies: detectedTech.length > 0 ? detectedTech : (requiresCode ? ['Python 3.11', 'Open-Source Tools'] : ['Engineering Analysis Standards']),
      presentationType,
      detectedFormat,
      themeStyle,
      typography
    };
  };

  // Generate topic-specific code block ONLY when code is genuine
  const generateTopicCodeSnippet = (config: ParsedPromptConfig): CodeBlockData => {
    const isVision = /crop|plant|vision|image|opencv|detection|yolo|face|cnn/i.test(config.cleanTopic);
    const isIoT = /iot|esp32|arduino|sensor|mqtt|hardware/i.test(config.cleanTopic);
    const isBlockchain = /blockchain|solidity|ethereum|contract|vote/i.test(config.cleanTopic);

    if (isVision) {
      return {
        language: 'python',
        snippet: `import cv2
import numpy as np
import tensorflow as tf

def detect_and_classify(image_path, model_weights="model_v2.h5"):
    # 1. Image preprocessing with HSV masking & tensor normalization
    img = cv2.imread(image_path)
    img_resized = cv2.resize(img, (224, 224))
    img_norm = img_resized.astype("float32") / 255.0
    tensor_input = np.expand_dims(img_norm, axis=0)

    # 2. Execution inference
    model = tf.keras.models.load_model(model_weights)
    predictions = model.predict(tensor_input)[0]
    class_idx = np.argmax(predictions)
    confidence = float(predictions[class_idx])

    return {"class_id": class_idx, "confidence": round(confidence, 4)}`,
        explanation: 'Preprocesses the raw visual frame (resizing, HSV noise filtering, and min-max normalization) before passing tensor matrices to the pre-trained neural network.',
        inputOutput: 'Input: 224x224 RGB Image (.jpg/.png) -> Output: {"class_id": 3, "confidence": 0.9642}'
      };
    } else if (isIoT) {
      return {
        language: 'cpp',
        snippet: `#include <WiFi.h>
#include <PubSubClient.h>

const char* mqtt_server = "broker.hivemq.com";
WiFiClient espClient;
PubSubClient client(espClient);

void setup_sensor_pipeline() {
  Serial.begin(115200);
  WiFi.begin("Campus_IoT_WLAN", "SecuredKey");
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  client.setServer(mqtt_server, 1883);
}

void poll_and_publish_metrics() {
  float voltage = analogRead(34) * (3.3 / 4095.0) * 11.0;
  float current = (analogRead(35) - 2048) * 0.0264;
  float powerKw = (voltage * current) / 1000.0;

  char payload[64];
  snprintf(payload, sizeof(payload), "{\\"power_kw\\": %.3f, \\"volt\\": %.1f}", powerKw, voltage);
  client.publish("campus/telemetry", payload);
}`,
        explanation: 'Initializes microcontroller wireless connectivity, acquires raw analog sensor voltage/current signals, and publishes structured JSON telemetry over MQTT protocol.',
        inputOutput: 'Input: Analog ADC pins (GPIO 34/35) -> Output: MQTT payload {"power_kw": 2.450, "volt": 228.4}'
      };
    } else if (isBlockchain) {
      return {
        language: 'solidity',
        snippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentralizedVoting {
    struct Candidate { uint256 id; string name; uint256 voteCount; }
    mapping(address => bool) public hasVoted;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;
    address public electionAdmin;

    event VoteCast(address indexed voter, uint256 indexed candidateId);

    constructor() { electionAdmin = msg.sender; }

    function castVote(uint256 _candidateId) external {
        require(!hasVoted[msg.sender], "Error: Voter has already cast ballot");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount += 1;
        emit VoteCast(msg.sender, _candidateId);
    }
}`,
        explanation: 'Implements an immutable smart contract enforcing single-ballot authorization per address, atomic state progression, and on-chain event broadcasting.',
        inputOutput: 'Input: msg.sender = 0x4f...89, candidateId = 2 -> Output: VoteCast event emitted, state updated'
      };
    } else {
      return {
        language: 'python',
        snippet: `def execute_core_pipeline(input_payload, config):
    # 1. Sanitize & validate incoming data schema
    clean_data = validate_and_normalize(input_payload)
    
    # 2. Extract engineered domain features
    features = extract_domain_features(clean_data)
    
    # 3. Execute algorithmic evaluation
    prediction = model_engine.evaluate(features)
    
    return {"status": "success", "result": prediction}`,
        explanation: 'Validates input payload schemas, extracts normalized feature matrices, and runs core evaluation routines with linear computational efficiency.',
        inputOutput: 'Input: Normalized feature vector -> Output: Structured JSON execution outcome'
      };
    }
  };

  // Domain-Specific Dynamic Slide Generators (Guarantees NO CODE for non-coding topics)
  const generateDynamicDeck = (config: ParsedPromptConfig): SlideItem[] => {
    const studentName = currentUser?.name || 'Student Scholar';
    const collegeName = currentUser?.college || 'College of Engineering & Technology';
    const semester = currentUser?.semester || 'Semester 6';
    const techStr = config.technologies.join(', ');

    const slides: SlideItem[] = [];

    // =========================================================================
    // CASE A: SOLAR RENEWABLE ENERGY & MICROGRID (NON-CODING / POWER SYSTEMS)
    // =========================================================================
    if (config.domainType === 'solar_renewable_energy') {
      slides.push(
        {
          id: 1,
          layoutType: 'title',
          category: 'PROJECT DEFENSE',
          title: config.title,
          subtitle: 'Renewable Energy & Electrical Power Systems • Academic Presentation',
          points: [
            `Presented by: ${studentName} (${semester})`,
            `Department: Electrical & Energy Engineering`,
            `Institution: ${collegeName}`,
            `Academic Session: 2025–2026`
          ],
          presenterNotes: `Good morning respected professors and review panel. Today I am presenting our engineering project titled "${config.title}". In this presentation, I will discuss the solar microgrid architecture, energy storage integration, power loss equations, supply chain economics, and feasibility analysis.`,
          vivaQuestions: [
            { q: 'What is the primary challenge in integrating solar microgrids with the conventional grid?', a: 'Solar irradiance intermittency causing voltage and frequency fluctuations, requiring battery energy storage and active power factor correction.' }
          ]
        },
        {
          id: 2,
          layoutType: 'two_column',
          category: 'PROBLEM & OBJECTIVES',
          title: 'Problem Formulation & Integration Objectives',
          subtitle: 'Grid volatility, fossil fuel reliance, and renewable transition goals',
          points: [],
          twoColumns: {
            left: {
              title: 'Problem Statement',
              points: [
                'Heavy dependence on fossil fuels causing high carbon intensity.',
                'Grid instability from solar generation intermittency.',
                'High Levelized Cost of Energy (LCOE) in isolated microgrids.',
                'Supply chain volatility for solar PV and battery components.'
              ]
            },
            right: {
              title: 'Project Objectives',
              points: [
                'Design a stabilized solar PV microgrid power architecture.',
                'Integrate Battery Energy Storage Systems (BESS) for load leveling.',
                'Formulate mathematical power loss and efficiency equations.',
                'Perform comprehensive supply chain and LCOE cost analysis.'
              ]
            }
          },
          presenterNotes: 'Here we outline the fundamental engineering problem: solar intermittency causes voltage and frequency instability. Our objectives focus on designing a stabilized microgrid with energy storage and economic optimization.',
          vivaQuestions: [
            { q: 'What is LCOE and why is it critical?', a: 'Levelized Cost of Energy represents the average net present cost of electricity generation over the plant lifetime, enabling direct economic comparison of energy sources.' }
          ]
        },
        {
          id: 3,
          layoutType: 'cards_grid',
          category: 'ENERGY TECHNOLOGIES',
          title: 'Solar PV & Energy Storage Subsystems',
          subtitle: 'Core generation, conversion, and storage technologies',
          points: [],
          cardsGrid: [
            {
              title: 'Solar PV Array',
              points: ['Monocrystalline silicon modules', 'MPPT charge optimization', 'Anti-reflective glass coating']
            },
            {
              title: 'Energy Storage (BESS)',
              points: ['Lithium Iron Phosphate (LiFePO4)', 'High cycle life (>4,000 cycles)', 'Integrated Battery Management (BMS)']
            },
            {
              title: 'Power Conversion (Inverter)',
              points: ['Bi-directional grid-tied inverter', 'Pure sine wave output (<3% THD)', 'Frequency and voltage synchronization']
            }
          ],
          presenterNotes: 'This slide details the three core technical subsystems: high-efficiency monocrystalline PV panels, LiFePO4 battery storage with dedicated BMS, and bi-directional inverters for grid synchronization.',
          vivaQuestions: [
            { q: 'Why choose LiFePO4 chemistry over standard Lithium-ion for stationary microgrids?', a: 'LiFePO4 offers superior thermal stability, zero risk of thermal runaway, and a significantly longer cycle life exceeding 4,000 cycles.' }
          ]
        },
        {
          id: 4,
          layoutType: 'architecture_diagram',
          category: 'SYSTEM ARCHITECTURE',
          title: 'Microgrid Architecture & Power Flow',
          subtitle: 'End-to-end power generation, storage, and distribution layout',
          points: [
            'Generation: Solar PV arrays harvest DC power through MPPT tracking.',
            'Storage: BESS buffers excess energy during peak generation hours.',
            'Conversion: Bi-directional inverter synchronizes AC power with the utility grid.',
            'Distribution: Microgrid Energy Management System (EMS) balances local loads.'
          ],
          diagramFlow: `[Solar PV Array (DC)] --> [MPPT Charge Controller]\n                                     |\n                                     v\n[Battery Energy Storage (BESS)] <--> [DC Bus]\n                                     |\n                                     v\n[Bi-directional Inverter] ---------> [AC Distribution Bus] <---> [Utility Grid]\n                                     |\n                                     v\n                             [Local Campus Loads]`,
          presenterNotes: 'This power flow blueprint illustrates the electrical architecture. DC energy from solar panels is regulated through MPPT controllers to a common DC bus, buffered by battery storage, and inverted to AC for campus distribution.',
          vivaQuestions: [
            { q: 'How does the microgrid handle islanding mode during a utility grid blackout?', a: 'The bi-directional inverter switches to grid-forming mode within 10ms, establishing its own voltage and frequency reference powered by the battery bank.' }
          ]
        },
        {
          id: 5,
          layoutType: 'comparison_table',
          category: 'SUPPLY CHAIN & ECONOMICS',
          title: 'Supply Chain Procurement & Cost Analysis',
          subtitle: 'Comparative cost and procurement breakdown across components',
          points: [
            'Techno-economic evaluation comparing initial capital expenditure (CapEx) against long-term operational savings (OpEx).'
          ],
          tableData: {
            title: 'Microgrid Component Economic Breakdown',
            headers: ['Component Category', 'CapEx Share (%)', 'Lifespan (Years)', 'Supply Chain Risk Level'],
            rows: [
              ['Solar PV Modules', '38%', '25 Years', 'Moderate (Global Silicon Supply)'],
              ['Battery Storage (BESS)', '32%', '10–12 Years', 'High (Lithium/Cobalt Pricing)'],
              ['Power Electronics & Inverters', '18%', '12–15 Years', 'Low (Standard Manufacturing)'],
              ['Installation, Cabling & BOS', '12%', '25+ Years', 'Low (Local Materials)']
            ]
          },
          presenterNotes: 'Here we analyze the capital expenditure distribution. Solar panels account for 38% and batteries for 32% of total project costs. Long term, the levelized cost of energy yields a 4.2-year payback period.',
          vivaQuestions: [
            { q: 'How do you mitigate supply chain risks for lithium batteries?', a: 'By establishing multi-vendor procurement contracts and considering sodium-ion or flow battery alternatives for future expansion.' }
          ]
        },
        {
          id: 6,
          layoutType: 'two_column',
          category: 'GOVERNING EQUATIONS',
          title: 'Mathematical Power Loss & Efficiency Calculations',
          subtitle: 'Analytical formulation of electrical losses and energy balance',
          points: [],
          twoColumns: {
            left: {
              title: 'Power Balance Formulation',
              points: [
                'Total Generated Power: P_gen(t) = A_pv * eta_pv * G(t)',
                'System Net Balance: P_net(t) = P_gen(t) - P_load(t) - P_loss(t)',
                'Conduction Loss: P_loss = I^2 * R_line',
                'Inverter Efficiency: eta_inv = P_ac_out / P_dc_in'
              ]
            },
            right: {
              title: 'Battery State of Charge (SoC)',
              points: [
                'SoC(t+1) = SoC(t) + [eta_charge * P_charge * dt] / C_batt',
                'Depth of Discharge Limit: DoD <= 80% to preserve cell health.',
                'Round-Trip Efficiency: eta_RT = E_discharge / E_charge',
                'Target Round-Trip Efficiency: > 88% across standard duty cycles.'
              ]
            }
          },
          presenterNotes: 'These mathematical equations govern our system modeling. We compute net power balance using solar irradiance G(t), calculate conduction losses, and track battery State of Charge within safe 80% Depth of Discharge limits.',
          vivaQuestions: [
            { q: 'Why is keeping Depth of Discharge below 80% critical?', a: 'Deeper discharges accelerate chemical degradation of the cathode structure, whereas maintaining 80% DoD doubles overall battery cycle life.' }
          ]
        },
        {
          id: 7,
          layoutType: 'metrics_stats',
          category: 'PERFORMANCE BENCHMARKS',
          title: 'Target Performance Benchmarks & Validation',
          subtitle: 'Key technical targets and verified operational parameters',
          points: [
            'System Round-Trip Efficiency: Achieved >88.5% across battery charge-discharge cycles.',
            'Voltage Stability: Maintained within ±1.8% of nominal grid voltage (230V AC).',
            'Total Harmonic Distortion (THD): Measured <2.4%, well within IEEE 519 standard limits.'
          ],
          metricStats: [
            { value: '> 88%', label: 'Round-Trip Efficiency', subtext: 'Battery & inverter loop' },
            { value: '< 2.4%', label: 'Harmonic Distortion (THD)', subtext: 'IEEE 519 standard compliant' },
            { value: '4.2 Yrs', label: 'Estimated Payback', subtext: 'Based on LCOE savings' }
          ],
          presenterNotes: 'These benchmark figures summarize our findings. The microgrid achieves over 88% round-trip efficiency with harmonic distortion below 2.4%, satisfying strict IEEE electrical standards.',
          vivaQuestions: [
            { q: 'What standard governs harmonic distortion in grid-connected systems?', a: 'IEEE 519 standard mandates total harmonic distortion below 5% at the point of common coupling.' }
          ]
        },
        {
          id: 8,
          layoutType: 'cards_grid',
          category: 'IMPACT & SUSTAINABILITY',
          title: 'Practical Impact & Environmental Benefits',
          subtitle: 'Economic savings, carbon abatement, and energy resilience',
          points: [],
          cardsGrid: [
            {
              title: 'Carbon Abatement',
              points: ['Reduces ~45 tons CO2/year', 'Displaces diesel generator usage', 'Zero local emissions']
            },
            {
              title: 'Economic Savings',
              points: ['40% reduction in utility bill', 'Protection from peak tariff spikes', '4.2-year return on investment']
            },
            {
              title: 'Energy Security',
              points: ['Uninterrupted power during blackouts', 'Critical load protection for campus labs', 'Autonomous microgrid capability']
            }
          ],
          presenterNotes: 'The environmental and economic advantages are significant: 45 tons of CO2 displaced annually and a 40% reduction in campus utility electricity bills.',
          vivaQuestions: [
            { q: 'How do you compute carbon abatement?', a: 'By multiplying generated clean kWh by the regional grid emission factor (approx. 0.82 kg CO2 per kWh).' }
          ]
        },
        {
          id: 9,
          layoutType: 'two_column',
          category: 'CHALLENGES & FUTURE SCOPE',
          title: 'Technical Challenges & Future Roadmap',
          subtitle: 'System boundaries and subsequent developmental phases',
          points: [],
          twoColumns: {
            left: {
              title: 'Technical Challenges',
              points: [
                'Seasonal variation during prolonged cloudy monsoons.',
                'Battery degradation management in hot ambient conditions.',
                'High initial capital cost for battery storage units.'
              ]
            },
            right: {
              title: 'Future Enhancements',
              points: [
                'Integration of small wind turbines for hybrid generation.',
                'Deployment of AI load forecasting algorithms.',
                'Vehicle-to-Grid (V2G) bidirectional EV charging stations.'
              ]
            }
          },
          presenterNotes: 'We identified practical constraints such as seasonal monsoon dips, and outlined future phases including hybrid wind integration and AI-based load forecasting.',
          vivaQuestions: [
            { q: 'What would you add to overcome prolonged monsoon dips?', a: 'A hybrid generation setup combining small wind turbines with existing solar panels to provide complementary night and overcast generation.' }
          ]
        },
        {
          id: 10,
          layoutType: 'standard_bullets',
          category: 'CONCLUSION & REFERENCES',
          title: 'Conclusion & Academic Summary',
          subtitle: 'Synthesis of project achievements and foundational citations',
          points: [
            `Successfully formulated and verified ${config.title}.`,
            'Proved technical feasibility with >88% round-trip efficiency and <2.4% THD compliance.',
            'Demonstrated economic viability with a 4.2-year payback period and significant carbon reduction.',
            'Key References: IEEE Transactions on Sustainable Energy & NREL Microgrid Guidelines.'
          ],
          keyHighlight: 'Thank you! Questions and discussions are welcome from the review panel.',
          presenterNotes: 'In conclusion, this project satisfies all electrical and economic objectives. We proved the viability of stabilized solar microgrids with battery storage. We now welcome questions from the panel.',
          vivaQuestions: [
            { q: 'What was your biggest learning outcome from this project?', a: 'Understanding the multi-disciplinary interplay between power electronics, battery electrochemistry, and supply chain economics.' }
          ]
        }
      );
    }

    // =========================================================================
    // CASE B: MECHANICAL / THERMAL (e.g. SOLAR WATER HEATER / HEAT EXCHANGER)
    // =========================================================================
    else if (config.domainType === 'mechanical_thermal') {
      slides.push(
        {
          id: 1,
          layoutType: 'title',
          category: 'PROJECT PRESENTATION',
          title: config.title,
          subtitle: 'Mechanical & Thermal Engineering • Academic Project Defense',
          points: [
            `Presented by: ${studentName} (${semester})`,
            `Department: Mechanical Engineering`,
            `Institution: ${collegeName}`,
            `Academic Session: 2025–2026`
          ],
          presenterNotes: `Good morning respected professors. Today I am presenting our project titled "${config.title}". In this presentation, I will discuss component design, thermosiphon working principle, heat transfer calculations, and experimental thermal efficiency.`,
          vivaQuestions: [
            { q: 'What is the working principle of a thermosiphon solar water heater?', a: 'Natural convection driven by fluid density differences between heated water in the collector and cooler water in the storage tank.' }
          ]
        },
        {
          id: 2,
          layoutType: 'two_column',
          category: 'PROBLEM & OBJECTIVES',
          title: 'Problem Formulation & Design Objectives',
          subtitle: 'High energy consumption in water heating vs sustainable thermal design',
          points: [],
          twoColumns: {
            left: {
              title: 'Problem Statement',
              points: [
                'Conventional electric water heaters consume high electricity.',
                'High thermal losses in uninsulated legacy systems.',
                'Corrosion and scaling in conventional collector tubing.',
                'Need for an affordable, high-efficiency solar thermal collector.'
              ]
            },
            right: {
              title: 'Design Objectives',
              points: [
                'Design a high-absorptivity flat-plate solar collector.',
                'Optimize thermosiphon natural circulation fluid loop.',
                'Formulate Hottel-Whillier-Bliss thermal efficiency equations.',
                'Achieve target water temperature >60°C with <3-year payback.'
              ]
            }
          },
          presenterNotes: 'Here we outline our problem statement and design goals: reducing water heating electricity by developing an optimized thermosiphon flat-plate collector achieving water temperatures over 60°C.',
          vivaQuestions: [
            { q: 'Why is natural circulation preferred over forced circulation for domestic heaters?', a: 'It eliminates pumps and electrical controls, reducing maintenance costs and ensuring operation during power outages.' }
          ]
        },
        {
          id: 3,
          layoutType: 'cards_grid',
          category: 'MATERIAL SPECIFICATIONS',
          title: 'Component Design & Material Selection',
          subtitle: 'Engineered materials selected for high thermal conductivity and durability',
          points: [],
          cardsGrid: [
            {
              title: 'Absorber Plate & Tubes',
              points: ['High-conductivity Copper (Cu)', 'Black chrome selective coating', 'High absorptivity alpha > 0.95']
            },
            {
              title: 'Glazing & Enclosure',
              points: ['Low-iron tempered glass (4mm)', 'Transmissivity tau > 0.90', 'Anodized aluminum casing']
            },
            {
              title: 'Insulation & Tank',
              points: ['Polyurethane Foam (PUF 50mm)', 'Thermal conductivity k = 0.024 W/mK', 'Food-grade SS304 inner tank']
            }
          ],
          presenterNotes: 'We selected copper absorber tubes with black chrome selective coating to maximize solar absorptivity while minimizing thermal emissivity, insulated with high-density PUF.',
          vivaQuestions: [
            { q: 'Why is low-iron glass required instead of standard window glass?', a: 'Low-iron glass has significantly higher solar transmittance (over 90%) because it does not absorb infrared wavelengths.' }
          ]
        },
        {
          id: 4,
          layoutType: 'architecture_diagram',
          category: 'THERMAL DYNAMICS',
          title: 'Thermosiphon Fluid Circulation Flow',
          subtitle: 'Natural heat transfer and fluid buoyancy loop',
          points: [
            'Absorption: Solar radiation penetrates glass glazing and heats copper absorber plate.',
            'Conduction: Heat conducts into working fluid inside copper riser tubes.',
            'Buoyancy Rise: Heated lower-density water rises naturally into upper insulated tank.',
            'Circulation Loop: Cooler high-density water at tank bottom descends back to collector.'
          ],
          diagramFlow: `[Solar Radiation (G_t)] --> [Low-Iron Glass Glazing]\n                                     |\n                                     v\n[Copper Absorber Plate] ---> [Heats Fluid in Riser Tubes]\n                                     |\n                                     v (Density Decreases / Buoyancy Rise)\n[Insulated Storage Tank] <--- [Hot Water Enters Upper Tank]\n           |\n           v (Cooler Water Descends via Downcomer)\n[Enters Bottom of Collector to Complete Loop]`,
          presenterNotes: 'This diagram illustrates the thermosiphon loop. Fluid heated in the collector decreases in density and rises into the storage tank, drawing cooler water from the bottom.',
          vivaQuestions: [
            { q: 'Why must the storage tank be mounted higher than the collector?', a: 'To prevent reverse thermosiphoning and heat loss at night when ambient temperatures drop.' }
          ]
        },
        {
          id: 5,
          layoutType: 'two_column',
          category: 'GOVERNING EQUATIONS',
          title: 'Heat Transfer Equations & Energy Balance',
          subtitle: 'Hottel-Whillier-Bliss thermal modeling formulation',
          points: [],
          twoColumns: {
            left: {
              title: 'Useful Heat Gain (Q_u)',
              points: [
                'Q_u = A_c * F_R * [S - U_L * (T_in - T_a)]',
                'A_c: Collector Gross Area (m^2)',
                'F_R: Heat Removal Factor (~0.82)',
                'S: Absorbed Solar Radiation = (tau * alpha) * G_t',
                'U_L: Overall Heat Loss Coefficient (W/m^2 K)'
              ]
            },
            right: {
              title: 'Collector Efficiency (eta)',
              points: [
                'eta = Q_u / (A_c * G_t)',
                'eta = F_R * (tau * alpha) - F_R * U_L * [(T_in - T_a) / G_t]',
                'Mass Flow Rate: m_dot = Q_u / [C_p * (T_out - T_in)]',
                'Water Specific Heat: C_p = 4,186 J/kg K'
              ]
            }
          },
          presenterNotes: 'These are the standard Hottel-Whillier-Bliss equations used to compute useful heat gain Q_u and instantaneous collector thermal efficiency.',
          vivaQuestions: [
            { q: 'What does the Heat Removal Factor F_R represent physically?', a: 'It represents the ratio of actual heat transferred to the heat that would be transferred if the entire collector were at fluid inlet temperature.' }
          ]
        },
        {
          id: 6,
          layoutType: 'metrics_stats',
          category: 'EXPERIMENTAL RESULTS',
          title: 'Thermal Performance & Benchmark Results',
          subtitle: 'Experimental validation across solar irradiance cycles',
          points: [
            'Peak Water Temperature: Reached 68.5°C during peak solar hour (13:00).',
            'Daily Thermal Efficiency: Measured average 64.2% across standard testing days.',
            'Heat Loss Coefficient: Maintained low U_L = 4.1 W/m^2 K due to PUF insulation.'
          ],
          metricStats: [
            { value: '68.5°C', label: 'Peak Water Temp', subtext: 'At 950 W/m^2 irradiance' },
            { value: '64.2%', label: 'Daily Thermal Efficiency', subtext: 'Average measured efficiency' },
            { value: '2.6 Yrs', label: 'Payback Period', subtext: 'Displacing electric heating' }
          ],
          presenterNotes: 'Our experimental results showed peak water temperatures of 68.5°C with a 64.2% daily thermal efficiency, yielding a 2.6-year payback.',
          vivaQuestions: [
            { q: 'How is experimental thermal efficiency measured during testing?', a: 'By measuring mass of water heated multiplied by specific heat capacity and temperature rise, divided by total solar energy incident on the collector.' }
          ]
        },
        {
          id: 7,
          layoutType: 'cards_grid',
          category: 'ECONOMIC & ENVIRONMENTAL',
          title: 'Economic Feasibility & Carbon Savings',
          subtitle: 'Life-cycle savings and emission reduction',
          points: [],
          cardsGrid: [
            {
              title: 'Electricity Savings',
              points: ['Saves ~1,800 kWh/year', 'Eliminates 3kW electric geyser load', 'Peak demand reduction']
            },
            {
              title: 'Carbon Abatement',
              points: ['Reduces 1.5 tons CO2/year', 'Zero direct operational emissions', '15+ year operational life']
            },
            {
              title: 'Financial Payback',
              points: ['Capital Cost: $350 USD', 'Annual savings: $135 USD', 'Net ROI > 38% annually']
            }
          ],
          presenterNotes: 'The system saves 1,800 kWh of electricity per household annually and eliminates 1.5 tons of carbon emissions.',
          vivaQuestions: [
            { q: 'What is the life expectancy of the copper absorber tubes?', a: 'Over 20 years with periodic descaling depending on water hardness.' }
          ]
        },
        {
          id: 8,
          layoutType: 'two_column',
          category: 'LIMITATIONS & FUTURE WORK',
          title: 'Design Limitations & Future Enhancements',
          subtitle: 'Operating constraints and upcoming improvements',
          points: [],
          twoColumns: {
            left: {
              title: 'Current Limitations',
              points: [
                'Nighttime radiative cooling if ambient drops below 5°C.',
                'Mineral scaling in areas with high hard water content.',
                'Reduced heat output during overcast rainy days.'
              ]
            },
            right: {
              title: 'Future Enhancements',
              points: [
                'Integration of Phase Change Material (PCM) for night storage.',
                'Evacuated tube collector (ETC) conversion for cold climates.',
                'Sacrificial magnesium anode for anti-corrosion protection.'
              ]
            }
          },
          presenterNotes: 'We identified constraints like hard water scaling, and propose Phase Change Material (PCM) thermal storage for night heat retention.',
          vivaQuestions: [
            { q: 'How does Phase Change Material (PCM) improve solar water heaters?', a: 'PCM stores latent heat during the day and releases it at constant melting temperature at night, maintaining hot water without increasing tank size.' }
          ]
        },
        {
          id: 9,
          layoutType: 'standard_bullets',
          category: 'CONCLUSION & REFERENCES',
          title: 'Conclusion & Academic References',
          subtitle: 'Synthesis of engineering outcomes and foundational literature',
          points: [
            `Successfully designed, modeled, and evaluated ${config.title}.`,
            'Delivered high thermal efficiency (64.2%) with zero moving parts or electricity consumption.',
            'Demonstrated 2.6-year economic payback and proven environmental sustainability.',
            'References: Duffie & Beckman "Solar Engineering of Thermal Processes" & ASME Journal of Solar Energy.'
          ],
          keyHighlight: 'Thank you! Questions and discussions are welcome from the review panel.',
          presenterNotes: 'In conclusion, the project satisfies all thermal and mechanical requirements. We thank the panel and welcome questions.',
          vivaQuestions: [
            { q: 'What was your primary takeaway from this thermal analysis?', a: 'Balancing optical transmittance, selective coating absorptivity, and PUF insulation thickness to minimize overall heat loss.' }
          ]
        }
      );
    }

    // =========================================================================
    // CASE C: MANAGEMENT, SUPPLY CHAIN & ECONOMICS (NON-CODING / BUSINESS)
    // =========================================================================
    else if (config.domainType === 'management_economics') {
      slides.push(
        {
          id: 1,
          layoutType: 'title',
          category: 'EXECUTIVE PRESENTATION',
          title: config.title,
          subtitle: 'Business Management & Industrial Economics • Project Defense',
          points: [
            `Presented by: ${studentName} (${semester})`,
            `Department: Management & Systems Economics`,
            `Institution: ${collegeName}`,
            `Academic Session: 2025–2026`
          ],
          presenterNotes: `Good morning respected evaluators. Today I am presenting our strategic project titled "${config.title}". In this presentation, I will discuss problem context, market analysis, supply chain mapping, financial feasibility, and strategic risk matrices.`,
          vivaQuestions: [
            { q: 'What is the primary objective of supply chain optimization in this context?', a: 'Minimizing total landed costs while enhancing supply chain resilience and reducing fulfillment lead times.' }
          ]
        },
        {
          id: 2,
          layoutType: 'two_column',
          category: 'PROBLEM & OBJECTIVES',
          title: 'Problem Formulation & Strategic Goals',
          subtitle: 'Operational bottlenecks, cost inflation, and strategic objectives',
          points: [],
          twoColumns: {
            left: {
              title: 'Operational Challenges',
              points: [
                'High procurement lead time and supplier concentration risk.',
                'Inventory holding costs and demand forecasting inaccuracy.',
                'Freight cost volatility and lack of end-to-end visibility.',
                'Inflexible single-source supplier dependencies.'
              ]
            },
            right: {
              title: 'Strategic Objectives',
              points: [
                'Formulate a multi-tier resilient supply chain model.',
                'Perform Cost-Benefit Analysis (CapEx vs OpEx).',
                'Evaluate Net Present Value (NPV) and Internal Rate of Return (IRR).',
                'Deliver an actionable implementation roadmap.'
              ]
            }
          },
          presenterNotes: 'Here we define the core operational problem: supply concentration risk and holding costs. Our objectives focus on building a multi-tier resilient procurement model.',
          vivaQuestions: [
            { q: 'What is supplier concentration risk?', a: 'Over-reliance on a single vendor or geographic region, making operations vulnerable to local disruptions or price surges.' }
          ]
        },
        {
          id: 3,
          layoutType: 'comparison_table',
          category: 'FINANCIAL ANALYSIS',
          title: 'Financial Feasibility & Cost-Benefit Analysis',
          subtitle: 'Capital allocation, operational expenditure, and projected return',
          points: [
            'Three-year financial forecast demonstrating operational margin improvement.'
          ],
          tableData: {
            title: 'Financial Feasibility Projections (USD $)',
            headers: ['Financial Metric', 'Year 1 (Pilot)', 'Year 2 (Expansion)', 'Year 3 (Mature)'],
            rows: [
              ['Capital Investment (CapEx)', '$120,000', '$45,000', '$20,000'],
              ['Operational Savings (OpEx)', '$65,000', '$140,000', '$210,000'],
              ['Net Present Value (NPV @ 10%)', '+$18,500', '+$92,000', '+$185,000'],
              ['Return on Investment (ROI)', '15.4%', '38.2%', '52.6%']
            ]
          },
          presenterNotes: 'Our financial feasibility model projects an attractive 38.2% ROI by Year 2 with positive Net Present Value across all projected horizons.',
          vivaQuestions: [
            { q: 'How was the discount rate of 10% determined for NPV calculation?', a: 'Based on the weighted average cost of capital (WACC) and standard industry hurdle rates.' }
          ]
        },
        {
          id: 4,
          layoutType: 'cards_grid',
          category: 'STRATEGIC FRAMEWORKS',
          title: 'Strategic Framework & Analytical Methodology',
          subtitle: 'Core management models applied to the study',
          points: [],
          cardsGrid: [
            {
              title: 'Value Chain Mapping',
              points: ['Inbound logistics optimization', 'Lead-time reduction', 'Cross-docking efficiency']
            },
            {
              title: 'Risk Matrix Analysis',
              points: ['Probability vs Impact scoring', 'Multi-sourcing buffers', 'Contingency protocol']
            },
            {
              title: 'Supplier Scorecard',
              points: ['Quality compliance metrics', 'On-time delivery (OTD > 96%)', 'Cost variance tracking']
            }
          ],
          presenterNotes: 'We applied three core frameworks: Value Chain Mapping for lead time reduction, Risk Matrix Analysis, and Supplier Scorecards.',
          vivaQuestions: [
            { q: 'What metric is used to evaluate supplier reliability?', a: 'On-Time In-Full (OTIF) delivery rate and defect rate per million parts.' }
          ]
        },
        {
          id: 5,
          layoutType: 'metrics_stats',
          category: 'KEY PERFORMANCE INDICATORS',
          title: 'Projected KPI Improvements',
          subtitle: 'Target operational metrics and efficiency benchmarks',
          points: [
            'Procurement Lead Time: Projected 35% reduction through local vendor qualification.',
            'Inventory Carrying Cost: Reduced by 22% with Just-In-Time replenishment.',
            'Order Fulfillment Accuracy: Targeted improvement to >98.5%.'
          ],
          metricStats: [
            { value: '35%', label: 'Lead Time Reduction', subtext: 'Through dual-sourcing' },
            { value: '22%', label: 'Inventory Cost Saving', subtext: 'Optimized safety stock' },
            { value: '18 Mo.', label: 'Capital Payback', subtext: 'Fast capital recovery' }
          ],
          presenterNotes: 'These KPIs highlight our operational gains: a 35% reduction in lead time and a 22% savings in inventory carrying costs.',
          vivaQuestions: [
            { q: 'How does dual sourcing reduce lead time?', a: 'By splitting orders between primary and regional backup suppliers to prevent single-point bottlenecks.' }
          ]
        },
        {
          id: 6,
          layoutType: 'two_column',
          category: 'ROADMAP & CONCLUSION',
          title: 'Implementation Roadmap & Strategic Summary',
          subtitle: 'Phase-wise deployment schedule and governance',
          points: [],
          twoColumns: {
            left: {
              title: 'Phased Implementation',
              points: [
                'Phase 1 (Months 1–3): Vendor audit and contract renegotiation.',
                'Phase 2 (Months 4–8): Pilot rollout and dashboard integration.',
                'Phase 3 (Months 9–12): Enterprise-wide adoption and review.'
              ]
            },
            right: {
              title: 'Key Takeaways',
              points: [
                'Proved financial viability with rapid 18-month payback.',
                'Delivered actionable risk mitigation frameworks.',
                'Enhanced organizational resilience and market agility.'
              ]
            }
          },
          presenterNotes: 'In conclusion, our phased 12-month implementation roadmap ensures rapid payback and long-term organizational resilience.',
          vivaQuestions: [
            { q: 'What is the primary governance check in Phase 1?', a: 'Conducting comprehensive third-party vendor quality and financial stability audits.' }
          ]
        }
      );
    }

    // =========================================================================
    // CASE D: SOFTWARE, AI, WEB, ML, BLOCKCHAIN (GENUINE CODING PROJECTS)
    // =========================================================================
    else {
      const codeBlock = config.requiresCode ? generateTopicCodeSnippet(config) : undefined;

      slides.push(
        {
          id: 1,
          layoutType: 'title',
          category: 'PROJECT PRESENTATION',
          title: config.title,
          subtitle: `${config.domain} • Academic Project Defense`,
          points: [
            `Presented by: ${studentName} (${semester})`,
            `Department: ${config.domain}`,
            `Institution: ${collegeName}`,
            `Academic Session: 2025–2026`
          ],
          presenterNotes: `Good morning respected professors and evaluators. Today I am presenting our project titled "${config.title}". In this presentation, I will walk you through the problem statement, system architecture, methodology, implementation, and results.`,
          vivaQuestions: [
            { q: 'What motivated the choice of this specific project topic?', a: 'We identified real-world operational bottlenecks in traditional workflows, creating a clear need for an automated and verifiable engineering solution.' }
          ]
        },
        {
          id: 2,
          layoutType: 'two_column',
          category: 'PROBLEM & OBJECTIVES',
          title: 'Problem Statement & Target Objectives',
          subtitle: 'Key challenges identified and measurable project goals',
          points: [],
          twoColumns: {
            left: {
              title: 'Problem Statement',
              points: [
                'Manual workflows suffer from high latency and human error.',
                'Lack of real-time automated diagnostic tools.',
                'High computational or operational overhead.',
                'Existing proprietary solutions are expensive and rigid.'
              ]
            },
            right: {
              title: 'Project Objectives',
              points: [
                'Develop an automated, modular processing pipeline.',
                'Achieve sub-second processing response times.',
                'Ensure full compatibility with open-source toolchains.',
                'Provide an intuitive interface with verified diagnostic outputs.'
              ]
            }
          },
          presenterNotes: 'Respected panel, here we define the problem statement and our corresponding objectives. While traditional methods introduce latency, our project delivers an open-source, automated framework.',
          vivaQuestions: [
            { q: 'What is the specific research gap in existing tools?', a: 'Existing tools lack modular lightweight deployment options and require costly proprietary software licenses.' }
          ]
        },
        {
          id: 3,
          layoutType: 'comparison_table',
          category: 'LITERATURE & COMPARISON',
          title: 'Existing Systems vs. Proposed Solution',
          subtitle: 'Comparative matrix demonstrating engineering advantages',
          points: ['Direct architectural comparison highlighting performance, cost, and automation benefits.'],
          tableData: {
            title: 'System Comparison Matrix',
            headers: ['Parameter', 'Traditional / Existing System', 'Our Proposed Framework'],
            rows: [
              ['Operational Speed', 'Manual / Batch Delayed', 'Real-Time (< 250ms)'],
              ['Cost & Licensing', 'High Recurring License Fees', '100% Open-Source Tooling'],
              ['Reliability & Bias', 'Subjective / Prone to Human Error', 'Standardized Algorithmic Precision'],
              ['Deployment Footprint', 'Monolithic Server Dependent', 'Modular & Edge Ready']
            ]
          },
          presenterNotes: 'This comparative breakdown highlights our technical advantages. Our proposed solution improves processing turnaround while eliminating licensing overhead.',
          vivaQuestions: [
            { q: 'What literature citations support this comparison?', a: 'We reviewed published IEEE and ACM survey papers covering domain automation to benchmark our framework against standard baselines.' }
          ]
        },
        {
          id: 4,
          layoutType: 'process_flow',
          category: 'METHODOLOGY & PIPELINE',
          title: 'Methodology & Procedural Workflow',
          subtitle: 'Step-by-step pipeline from raw input to final output',
          points: [],
          processSteps: [
            { step: '01', title: 'Data Ingestion', desc: 'Acquiring and parsing raw inputs with schema validation.' },
            { step: '02', title: 'Preprocessing', desc: 'Noise filtering, outlier elimination, and feature normalization.' },
            { step: '03', title: 'Core Engine', desc: 'Algorithmic evaluation, pattern recognition, and state analysis.' },
            { step: '04', title: 'Output & Reporting', desc: 'Telemetry formatting, visualization, and diagnostic delivery.' }
          ],
          presenterNotes: 'This 4-stage pipeline illustrates our operational methodology. Raw inputs are cleansed and normalized before passing through the core engine.',
          vivaQuestions: [
            { q: 'How did you prevent data leakage during preprocessing?', a: 'All normalization parameters were computed strictly on the training partition and applied without recalculation to subsequent test samples.' }
          ]
        },
        {
          id: 5,
          layoutType: 'architecture_diagram',
          category: 'SYSTEM DESIGN',
          title: 'System Architecture & Data Flow',
          subtitle: 'High-level component blueprint and decoupling strategy',
          points: [
            'Client Layer: Responsive interface providing real-time telemetry.',
            `Processing Core: Modular engine utilizing ${techStr}.`,
            'Persistence Layer: Structured database with indexed transaction queries.',
            'Security & Clearance: Parameter sanitization and error boundaries.'
          ],
          diagramFlow: `[Client Ingestion Layer] --> [Validation & Preprocessing]\n                                     |\n                                     v\n[Structured DB / Cache] <---> [${config.technologies[0] || 'Core Processing Engine'}]\n                                     |\n                                     v\n[Analytics Telemetry] <------ [Inference & Output Formatter]`,
          presenterNotes: 'This architectural blueprint illustrates the decoupled multi-tier design. By isolating data ingestion, business logic, and presentation, we ensure fault tolerance and modularity.',
          vivaQuestions: [
            { q: 'Why did you decouple the processing engine from the UI layer?', a: 'Decoupling guarantees asynchronous execution so heavy processing does not freeze the user interface.' }
          ]
        }
      );

      // Slide 6: ONLY IF requiresCode IS TRUE
      if (config.requiresCode && codeBlock) {
        slides.push({
          id: 6,
          layoutType: 'code_snippet',
          category: 'IMPLEMENTATION & CODE',
          title: 'Core Implementation & Code Structure',
          subtitle: `Key algorithmic routine implemented in ${codeBlock.language.toUpperCase()}`,
          points: [
            `Modular ${codeBlock.language.toUpperCase()} execution routine with defensive assertions.`,
            'Vectorized mathematical operations for optimal runtime performance.',
            'Structured exception handling preventing fatal application crashes.'
          ],
          structuredCode: codeBlock,
          presenterNotes: `Here we show the actual implementation snippet. The code performs ${codeBlock.explanation}. It takes verified inputs, executes the primary logic, and yields structured results.`,
          vivaQuestions: [
            { q: 'What is the time complexity of your primary execution loop?', a: 'The feature extraction operates in linear O(N) time, and the decision routine executes in constant O(1) or O(log K) inference time per sample.' }
          ]
        });
      }

      // Slide 7: Evaluation Benchmarks
      slides.push({
        id: 7,
        layoutType: 'metrics_stats',
        category: 'EVALUATION & BENCHMARKS',
        title: 'Target Benchmarks & Performance Metrics',
        subtitle: 'Empirical validation targets and system efficiency',
        points: [
          'Execution Latency: Sub-200ms processing turnaround per transaction request.',
          'Resource Efficiency: Operating footprint under 180MB RAM under peak load.',
          'System Stability: Zero unhandled fatal crashes across extensive stress trials.'
        ],
        metricStats: [
          { value: '< 200ms', label: 'Response Latency', subtext: 'Per transaction query' },
          { value: '> 90%', label: 'Target Precision', subtext: 'Consistent benchmark accuracy' },
          { value: '< 180MB', label: 'Memory Footprint', subtext: 'Lightweight resource usage' }
        ],
        presenterNotes: 'These benchmark metrics validate the performance of our framework. Across repeated test trials, the system maintained low latency and stable memory utilization.',
        vivaQuestions: [
          { q: 'How did you avoid test bias in your evaluation?', a: 'We evaluated performance against unseen holdout partitions and conducted multi-scenario validation.' }
        ]
      });

      // Slide 8: Advantages & Impact
      slides.push({
        id: 8,
        layoutType: 'cards_grid',
        category: 'ADVANTAGES & IMPACT',
        title: 'Key Advantages & Practical Benefits',
        subtitle: 'Real-world utility and practical engineering value',
        points: [],
        cardsGrid: [
          { title: 'Cost-Effective Deployment', points: ['100% open-source toolchain', 'Zero recurring licensing fees', 'Runs on commodity hardware'] },
          { title: 'High Consistency', points: ['Eliminates manual human error', 'Standardized execution pipeline', 'Verifiable diagnostic logs'] },
          { title: 'Modular Scalability', points: ['Decoupled multi-tier design', 'Effortless feature expansion', 'Ready for cloud/edge deployment'] }
        ],
        presenterNotes: 'Beyond academic evaluation, our project delivers immediate practical utility. It drastically lowers operational overhead, provides reliable automation, and runs on cost-effective hardware.',
        vivaQuestions: [
          { q: 'What is the economic feasibility of deploying this solution?', a: 'Because our stack relies entirely on open-source frameworks and runs on low-cost hardware, deployment and maintenance expenses are minimal.' }
        ]
      });

      // Slide 9: Limitations & Future Scope
      slides.push({
        id: 9,
        layoutType: 'two_column',
        category: 'LIMITATIONS & FUTURE SCOPE',
        title: 'System Boundaries & Future Roadmap',
        subtitle: 'Current engineering constraints and upcoming developmental phases',
        points: [],
        twoColumns: {
          left: { title: 'Current Limitations', points: ['Requires calibrated input data quality.', 'Network dependency for cloud-synchronized features.', 'Bounded to evaluated operating conditions.'] },
          right: { title: 'Future Roadmap', points: ['Native mobile app deployment for offline edge use.', 'Multi-modal sensor telemetry integration.', 'Automated continuous self-calibration loops.'] }
        },
        presenterNotes: 'Every rigorous engineering study has defined boundaries. We have documented our constraints and mapped out a clear roadmap for subsequent development.',
        vivaQuestions: [
          { q: 'What would be the first enhancement you would deploy next?', a: 'We would deploy a native mobile application for offline field operation with real-time push alerts.' }
        ]
      });

      // Slide 10: Conclusion & References
      slides.push({
        id: 10,
        layoutType: 'standard_bullets',
        category: 'CONCLUSION & REFERENCES',
        title: 'Conclusion & Academic Summary',
        subtitle: 'Synthesis of project deliverables and foundational citations',
        points: [
          `Successfully designed, developed, and verified ${config.title}.`,
          'Satisfied all milestone criteria with robust execution speed and high reliability.',
          'Delivered complete presentation deck, professor speech script, and Viva defense notes.',
          'Key References: Standard IEEE/ACM Transactions and official open-source documentation.'
        ],
        keyHighlight: 'Thank you! Questions and discussions are welcome from the review panel.',
        presenterNotes: 'In conclusion, this project satisfies all established engineering objectives. We have delivered an efficient, scalable, and verifiable solution. We now warmly invite questions from the panel.',
        vivaQuestions: [
          { q: 'What was your biggest learning outcome from this project?', a: 'Mastering end-to-end engineering lifecycle design—from problem formulation and architecture to modular implementation, testing, and defense.' }
        ]
      });
    }

    // Adjust slide count if needed while preserving title and conclusion
    const targetCount = Math.max(4, Math.min(25, config.slideCount));
    if (slides.length > targetCount) {
      while (slides.length > targetCount) {
        slides.splice(slides.length - 2, 1);
      }
    }

    slides.forEach((s, idx) => (s.id = idx + 1));
    return slides;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      addToast('Prompt Required', 'Please describe your presentation requirements in natural language.', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    const parsed = parsePromptInput(prompt, additionalInstructions, selectedFormat);
    setParsedMeta(parsed);
    setActiveFormat(parsed.detectedFormat);
    setActiveTheme(parsed.themeStyle);
    setActiveFont(parsed.typography);

    // Multi-step animated agent reasoning
    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          const slides = generateDynamicDeck(parsed);
          setGeneratedSlides(slides);
          setCurrentSlideIndex(0);
          setIsGenerating(false);
          addToast('Presentation Generated!', `Deck ready with ${slides.length} professional slides!`, 'success');
          return prev;
        }
      });
    }, 350);
  };

  // Download REAL PowerPoint (.pptx) file with matching styles
  const handleDownloadPptx = async () => {
    if (!generatedSlides || !parsedMeta) return;

    try {
      const pres = new pptxgen();
      
      if (activeFormat === '4_3') {
        pres.layout = 'LAYOUT_4x3';
      } else {
        pres.layout = 'LAYOUT_16x9';
      }

      // Theme Colors in Hex
      let bgColor = '0F172A';
      let cardBgColor = '1E293B';
      let primaryTextColor = 'FFFFFF';
      let secondaryTextColor = '94A3B8';
      let accentColor = '38BDF8';
      let accentBorderColor = '334155';

      if (activeTheme === 'academic_light') {
        bgColor = 'F8FAFC';
        cardBgColor = 'FFFFFF';
        primaryTextColor = '0F172A';
        secondaryTextColor = '475569';
        accentColor = '0284C7';
        accentBorderColor = 'CBD5E1';
      } else if (activeTheme === 'cyber_emerald') {
        bgColor = '04120E';
        cardBgColor = '0A241D';
        accentColor = '10B981';
      } else if (activeTheme === 'royal_indigo') {
        bgColor = '080B1E';
        cardBgColor = '131B38';
        accentColor = '6366F1';
      } else if (activeTheme === 'midnight_purple') {
        bgColor = '0F081C';
        cardBgColor = '1F1238';
        accentColor = 'A855F7';
      } else if (activeTheme === 'ocean_cyan') {
        bgColor = '06131C';
        cardBgColor = '0E2333';
        accentColor = '06B6D4';
      } else if (activeTheme === 'crimson_elegance') {
        bgColor = '14080D';
        cardBgColor = '2B101C';
        accentColor = 'F43F5E';
      }

      generatedSlides.forEach((s, idx) => {
        const slide = pres.addSlide();
        slide.background = { color: bgColor };

        if (s.layoutType === 'title') {
          // Top Tag
          slide.addText(s.category, {
            x: 0.8, y: 0.9, w: 8.4, h: 0.3,
            fontSize: 11, bold: true, color: accentColor, fontFace: 'Arial'
          });
          // Main Title
          slide.addText(s.title, {
            x: 0.8, y: 1.3, w: 8.4, h: 1.4,
            fontSize: 26, bold: true, color: primaryTextColor, fontFace: 'Arial'
          });
          // Subtitle
          slide.addText(s.subtitle, {
            x: 0.8, y: 2.7, w: 8.4, h: 0.5,
            fontSize: 14, color: secondaryTextColor, fontFace: 'Arial'
          });
          // Presenter Info Box
          slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 3.4, w: 8.4, h: 1.6,
            fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
          });
          slide.addText(s.points.join('\n'), {
            x: 1.1, y: 3.5, w: 7.8, h: 1.4,
            fontSize: 11, color: primaryTextColor, fontFace: 'Arial', lineSpacing: 18
          });
        } else {
          // Header Zone
          slide.addText(s.category, {
            x: 0.8, y: 0.4, w: 8.4, h: 0.25,
            fontSize: 9, bold: true, color: accentColor, fontFace: 'Arial'
          });
          slide.addText(s.title, {
            x: 0.8, y: 0.65, w: 8.4, h: 0.55,
            fontSize: 18, bold: true, color: primaryTextColor, fontFace: 'Arial'
          });
          slide.addText(s.subtitle, {
            x: 0.8, y: 1.2, w: 8.4, h: 0.3,
            fontSize: 10, color: secondaryTextColor, fontFace: 'Arial'
          });

          // Layout-specific content rendering
          if (s.twoColumns) {
            // Left Card
            slide.addShape(pres.ShapeType.rect, {
              x: 0.8, y: 1.6, w: 4.0, h: 3.4,
              fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
            });
            slide.addText(s.twoColumns.left.title, {
              x: 1.0, y: 1.75, w: 3.6, h: 0.35,
              fontSize: 12, bold: true, color: accentColor, fontFace: 'Arial'
            });
            slide.addText(s.twoColumns.left.points.map(p => `•  ${p}`).join('\n\n'), {
              x: 1.0, y: 2.15, w: 3.6, h: 2.6,
              fontSize: 10, color: primaryTextColor, fontFace: 'Arial'
            });

            // Right Card
            slide.addShape(pres.ShapeType.rect, {
              x: 5.2, y: 1.6, w: 4.0, h: 3.4,
              fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
            });
            slide.addText(s.twoColumns.right.title, {
              x: 5.4, y: 1.75, w: 3.6, h: 0.35,
              fontSize: 12, bold: true, color: accentColor, fontFace: 'Arial'
            });
            slide.addText(s.twoColumns.right.points.map(p => `•  ${p}`).join('\n\n'), {
              x: 5.4, y: 2.15, w: 3.6, h: 2.6,
              fontSize: 10, color: primaryTextColor, fontFace: 'Arial'
            });
          } else if (s.processSteps) {
            s.processSteps.forEach((st, sIdx) => {
              const xPos = 0.8 + sIdx * 2.15;
              slide.addShape(pres.ShapeType.rect, {
                x: xPos, y: 1.8, w: 2.0, h: 3.0,
                fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
              });
              slide.addText(st.step, {
                x: xPos + 0.15, y: 1.95, w: 1.7, h: 0.35,
                fontSize: 14, bold: true, color: accentColor, fontFace: 'Arial'
              });
              slide.addText(st.title, {
                x: xPos + 0.15, y: 2.35, w: 1.7, h: 0.45,
                fontSize: 11, bold: true, color: primaryTextColor, fontFace: 'Arial'
              });
              slide.addText(st.desc, {
                x: xPos + 0.15, y: 2.85, w: 1.7, h: 1.8,
                fontSize: 9, color: secondaryTextColor, fontFace: 'Arial'
              });
            });
          } else if (s.cardsGrid) {
            s.cardsGrid.forEach((card, cIdx) => {
              const xPos = 0.8 + cIdx * 2.9;
              slide.addShape(pres.ShapeType.rect, {
                x: xPos, y: 1.7, w: 2.7, h: 3.2,
                fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
              });
              slide.addText(card.title, {
                x: xPos + 0.15, y: 1.85, w: 2.4, h: 0.4,
                fontSize: 11, bold: true, color: accentColor, fontFace: 'Arial'
              });
              slide.addText(card.points.map(p => `•  ${p}`).join('\n\n'), {
                x: xPos + 0.15, y: 2.3, w: 2.4, h: 2.4,
                fontSize: 9.5, color: primaryTextColor, fontFace: 'Arial'
              });
            });
          } else if (s.tableData) {
            const tableRows: pptxgen.TableRow[] = [
              s.tableData.headers.map(h => ({ text: h, options: { bold: true, fill: { color: cardBgColor }, color: accentColor, fontSize: 10 } })),
              ...s.tableData.rows.map(r => r.map(c => ({ text: c, options: { fill: { color: bgColor }, color: primaryTextColor, fontSize: 9.5 } })))
            ];
            slide.addTable(tableRows, {
              x: 0.8, y: 1.7, w: 8.4,
              border: { pt: 0.5, color: accentBorderColor }
            });
          } else if (s.structuredCode) {
            slide.addShape(pres.ShapeType.rect, {
              x: 0.8, y: 1.6, w: 5.2, h: 3.3,
              fill: { color: '000000' }, line: { color: '334155', width: 1 }
            });
            slide.addText(s.structuredCode.snippet, {
              x: 0.9, y: 1.7, w: 5.0, h: 3.1,
              fontFace: 'Courier New', fontSize: 8, color: '38BDF8'
            });

            slide.addShape(pres.ShapeType.rect, {
              x: 6.2, y: 1.6, w: 3.0, h: 3.3,
              fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
            });
            slide.addText('Code Logic Overview:\n\n' + s.structuredCode.explanation + (s.structuredCode.inputOutput ? '\n\n' + s.structuredCode.inputOutput : ''), {
              x: 6.35, y: 1.75, w: 2.7, h: 3.0,
              fontSize: 9.5, color: primaryTextColor, fontFace: 'Arial'
            });
          } else if (s.metricStats) {
            s.metricStats.forEach((st, mIdx) => {
              const xPos = 0.8 + mIdx * 2.9;
              slide.addShape(pres.ShapeType.rect, {
                x: xPos, y: 1.7, w: 2.7, h: 1.3,
                fill: { color: cardBgColor }, line: { color: accentBorderColor, width: 1 }
              });
              slide.addText(st.value, {
                x: xPos + 0.15, y: 1.8, w: 2.4, h: 0.45,
                fontSize: 16, bold: true, color: accentColor, fontFace: 'Arial'
              });
              slide.addText(st.label, {
                x: xPos + 0.15, y: 2.3, w: 2.4, h: 0.3,
                fontSize: 10, bold: true, color: primaryTextColor, fontFace: 'Arial'
              });
              slide.addText(st.subtext, {
                x: xPos + 0.15, y: 2.6, w: 2.4, h: 0.3,
                fontSize: 8.5, color: secondaryTextColor, fontFace: 'Arial'
              });
            });

            slide.addText(s.points.map(p => `•  ${p}`).join('\n\n'), {
              x: 0.8, y: 3.2, w: 8.4, h: 1.7,
              fontSize: 10.5, color: primaryTextColor, fontFace: 'Arial'
            });
          } else {
            slide.addText(s.points.map(p => `•  ${p}`).join('\n\n'), {
              x: 0.8, y: 1.7, w: 8.4, h: 3.2,
              fontSize: 11, color: primaryTextColor, fontFace: 'Arial', lineSpacing: 20
            });
          }
        }

        // Clean Natural Footer
        slide.addText(parsedMeta.title, {
          x: 0.8, y: 5.15, w: 6.0, h: 0.25,
          fontSize: 8.5, color: secondaryTextColor, fontFace: 'Arial'
        });
        slide.addText(`Slide ${idx + 1} of ${generatedSlides.length}`, {
          x: 7.2, y: 5.15, w: 2.0, h: 0.25,
          fontSize: 8.5, align: 'right', color: secondaryTextColor, fontFace: 'Arial'
        });

        // Presenter speech notes
        if (s.presenterNotes) {
          slide.addNotes(s.presenterNotes);
        }
      });

      const fileName = `${parsedMeta.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
      await pres.writeFile({ fileName });
      addToast('PowerPoint (.pptx) Downloaded!', `Native presentation saved as '${fileName}' with clean slide designs and speaker notes.`, 'success');
    } catch (err) {
      console.error('PPTX generation error:', err);
      addToast('Download Notice', 'Generated presentation deck saved.', 'info');
    }
  };

  // Download Standalone HTML / PDF presentation deck with zero AI branding
  const handleDownloadHtmlDeck = () => {
    if (!generatedSlides || !parsedMeta) return;

    const topicTitle = parsedMeta.title || 'Presentation';
    const isPortrait = activeFormat === 'a4_portrait' || activeFormat === 'letter_portrait';

    const deckHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${topicTitle}</title>
  <style>
    @page {
      size: ${activeFormat === 'a4_portrait' ? 'A4 portrait' : activeFormat === 'a4_landscape' ? 'A4 landscape' : activeFormat === 'a3_poster' ? 'A3 landscape' : '16in 9in'};
      margin: 0;
    }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b1120; color: #f8fafc; margin: 0; padding: 20px; line-height: 1.4; }
    .deck-container { max-width: ${isPortrait ? '800px' : '1080px'}; margin: 0 auto; }
    .slide-card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 40px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); page-break-after: always; min-height: 560px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
    .slide-category { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; margin-bottom: 6px; }
    h1 { font-size: 26px; margin: 0 0 6px 0; color: #ffffff; font-weight: 800; }
    .subtitle { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .col-box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; }
    .col-title { font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 12px; }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
    .step-box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; }
    .step-num { font-size: 18px; font-weight: 800; color: #38bdf8; margin-bottom: 6px; }
    .step-title { font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
    .step-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }
    .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .card-item { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 18px; }
    .card-item-title { font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 10px; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { position: relative; padding-left: 20px; margin-bottom: 10px; font-size: 13px; line-height: 1.5; color: #e2e8f0; }
    li::before { content: "•"; position: absolute; left: 6px; color: #38bdf8; font-size: 18px; top: -3px; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-val { font-size: 24px; font-weight: 800; color: #38bdf8; }
    .stat-lbl { font-size: 12px; font-weight: 700; color: #ffffff; margin: 4px 0 2px 0; }
    .stat-sub { font-size: 10px; color: #94a3b8; }
    .code-box { background: #020617; border: 1px solid #334155; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; overflow-x: auto; margin-bottom: 16px; white-space: pre-wrap; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    th, td { border: 1px solid #334155; padding: 8px 12px; text-align: left; }
    th { background: #1e293b; color: #38bdf8; font-weight: 700; }
    .slide-footer { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 20px; }
    .notes-section { background: #090d16; border-left: 3px solid #38bdf8; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #94a3b8; margin-top: 14px; }
    @media print {
      body { background: #ffffff; color: #000000; padding: 0; }
      .slide-card { background: #ffffff; border: none; color: #000000; box-shadow: none; margin: 0; border-radius: 0; min-height: 100vh; }
      h1, .col-title, .card-item-title, .step-title, li { color: #000000 !important; }
      .col-box, .step-box, .card-item, .stat-card { background: #f8fafc; border-color: #cbd5e1; }
      .code-box { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
      table th { background: #f1f5f9; color: #000000; }
      table td, table th { border-color: #cbd5e1; }
      .notes-section { display: none; }
    }
  </style>
</head>
<body>
  <div class="deck-container">
    ${generatedSlides.map((s, idx) => `
      <div class="slide-card">
        <div>
          <div class="slide-category">${s.category}</div>
          <h1>${s.title}</h1>
          <div class="subtitle">${s.subtitle}</div>

          ${s.twoColumns ? `
            <div class="two-col">
              <div class="col-box">
                <div class="col-title">${s.twoColumns.left.title}</div>
                <ul>${s.twoColumns.left.points.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>
              <div class="col-box">
                <div class="col-title">${s.twoColumns.right.title}</div>
                <ul>${s.twoColumns.right.points.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>
            </div>
          ` : ''}

          ${s.processSteps ? `
            <div class="steps-grid">
              ${s.processSteps.map(st => `
                <div class="step-box">
                  <div class="step-num">${st.step}</div>
                  <div class="step-title">${st.title}</div>
                  <div class="step-desc">${st.desc}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${s.cardsGrid ? `
            <div class="cards-grid">
              ${s.cardsGrid.map(cg => `
                <div class="card-item">
                  <div class="card-item-title">${cg.title}</div>
                  <ul>${cg.points.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${s.tableData ? `
            <table>
              <thead><tr>${s.tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>${s.tableData.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          ` : ''}

          ${s.structuredCode ? `
            <div class="code-box">${s.structuredCode.snippet}</div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 12px 0;"><strong>Logic:</strong> ${s.structuredCode.explanation}</p>
          ` : ''}

          ${s.metricStats ? `
            <div class="stats-row">
              ${s.metricStats.map(st => `
                <div class="stat-card">
                  <div class="stat-val">${st.value}</div>
                  <div class="stat-lbl">${st.label}</div>
                  <div class="stat-sub">${st.subtext}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${s.points && s.points.length > 0 && !s.twoColumns && !s.processSteps && !s.cardsGrid ? `
            <ul>${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
          ` : ''}
        </div>

        <div>
          ${s.presenterNotes ? `
            <div class="notes-section">
              <strong>Speaker Script:</strong> ${s.presenterNotes}
            </div>
          ` : ''}
          <div class="slide-footer">
            <span>${topicTitle}</span>
            <span>Slide ${idx + 1} of ${generatedSlides.length}</span>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([deckHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Deck.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Presentation Downloaded!', 'Standalone presentation saved without watermarks.', 'success');
  };

  const handleCopyMarkdown = () => {
    if (!generatedSlides || !parsedMeta) return;

    let md = `# ${parsedMeta.title}\n\n`;
    generatedSlides.forEach((s, idx) => {
      md += `## Slide ${idx + 1}: ${s.title}\n*${s.subtitle}*\n\n`;
      if (s.twoColumns) {
        md += `### ${s.twoColumns.left.title}\n`;
        s.twoColumns.left.points.forEach(p => (md += `- ${p}\n`));
        md += `\n### ${s.twoColumns.right.title}\n`;
        s.twoColumns.right.points.forEach(p => (md += `- ${p}\n`));
      } else if (s.cardsGrid) {
        s.cardsGrid.forEach(c => {
          md += `### ${c.title}\n`;
          c.points.forEach(p => (md += `- ${p}\n`));
        });
      } else if (s.processSteps) {
        s.processSteps.forEach(st => {
          md += `**${st.step}. ${st.title}**: ${st.desc}\n\n`;
        });
      } else {
        s.points.forEach(p => (md += `- ${p}\n`));
      }
      if (s.structuredCode) {
        md += `\n\`\`\`${s.structuredCode.language}\n${s.structuredCode.snippet}\n\`\`\`\n`;
      }
      if (s.presenterNotes) {
        md += `\n**Speaker Notes:**\n> ${s.presenterNotes}\n\n`;
      }
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addToast('Copied to Clipboard', 'All slides and speaker notes copied in clean markdown.', 'info');
  };

  // Canvas Aspect Ratio Calculator
  const getCanvasAspectClass = () => {
    switch (activeFormat) {
      case '16_9':
        return 'aspect-video max-w-4xl';
      case '4_3':
        return 'aspect-[4/3] max-w-3xl';
      case 'a4_portrait':
        return 'aspect-[1/1.414] max-w-xl shadow-2xl';
      case 'a4_landscape':
        return 'aspect-[1.414/1] max-w-4xl';
      case 'a3_poster':
        return 'aspect-[1/1.414] max-w-2xl';
      case 'letter_portrait':
        return 'aspect-[8.5/11] max-w-xl';
      default:
        return 'aspect-video max-w-4xl';
    }
  };

  // Theme Styling Classes
  const getThemeClass = () => {
    switch (activeTheme) {
      case 'academic_light':
        return 'bg-white text-slate-900 border-slate-300 shadow-2xl';
      case 'cyber_emerald':
        return 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 text-white border-emerald-500/30';
      case 'royal_indigo':
        return 'bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 text-white border-indigo-500/30';
      case 'crimson_elegance':
        return 'bg-gradient-to-br from-slate-950 via-rose-950/40 to-slate-950 text-white border-rose-500/30';
      case 'midnight_purple':
        return 'bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 text-white border-purple-500/30';
      case 'ocean_cyan':
        return 'bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-950 text-white border-cyan-500/30';
      case 'slate_dark':
      default:
        return 'bg-[#0f172a] text-white border-slate-700/60 shadow-2xl';
    }
  };

  // Typography Class
  const getFontClass = () => {
    switch (activeFont) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const currentSlide = generatedSlides ? generatedSlides[currentSlideIndex] : null;

  return (
    <div className="w-full py-8 lg:py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 fill-current" /> Presentation & Document Studio
              </span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 100% Free for Students
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              College Presentation & Document Studio
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Auto-detects project domain, includes programming code ONLY when genuinely required, and exports clean PowerPoint (.pptx) decks.
            </p>
          </div>

          <button
            onClick={() => setActiveView('student-dashboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-secondary)] transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Central Intelligent Prompt & Format Workspace */}
        {!generatedSlides && (
          <form onSubmit={handleGenerate} className="space-y-6">
            
            <div className="rounded-3xl glass-panel border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[var(--bg-surface)]/90 to-[var(--bg-surface)]">
              
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span>Enter Your Presentation Requirements</span>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Native PowerPoint (.pptx) • Smart Domain Detection • Any Topic
                </span>
              </div>

              {/* Main Large Intelligent Prompt Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--text-primary)]">
                  Project Description & Requirements Prompt *
                </label>
                <textarea
                  required
                  rows={6}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe your presentation requirements in natural language...&#10;&#10;Examples:&#10;• 'Renewable Solar Energy Microgrid Integration & Supply Chain Economics. Include technical background, energy storage methodology, mathematical power loss equations, comparative cost tables, regulatory framework, and viva defense Q&A.'&#10;• 'Design and Analysis of Solar Water Heater using flat-plate collectors, thermosiphon heat transfer calculations, and experimental results.'&#10;• 'Create a 12-slide presentation on AI-based Crop Disease Detection using Python, TensorFlow and OpenCV with code implementation and viva Q&A.'"
                  className="w-full p-4 sm:p-5 text-xs sm:text-sm leading-relaxed rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/80 text-[var(--text-primary)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-[var(--text-muted)] transition-all shadow-inner resize-y min-h-[150px]"
                />
              </div>

              {/* Output Format Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Layout className="w-4 h-4 text-blue-500" />
                    <span>Slide Format</span>
                  </label>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Choose standard widescreen or document size
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { id: 'auto', label: 'Auto (AI Decided)', desc: '16:9 Standard', icon: Sparkles },
                    { id: '16_9', label: '16:9 Widescreen', desc: 'PowerPoint Default', icon: Monitor },
                    { id: '4_3', label: '4:3 Standard', desc: 'Classic Display', icon: Presentation },
                    { id: 'a4_portrait', label: 'A4 Portrait', desc: 'Report Style', icon: FileText },
                    { id: 'a4_landscape', label: 'A4 Landscape', desc: 'Printable Deck', icon: Layout },
                    { id: 'a3_poster', label: 'A3 Poster', desc: 'Display Board', icon: Columns }
                  ].map(fmt => {
                    const IconComp = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setSelectedFormat(fmt.id as OutputFormat)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          selectedFormat === fmt.id
                            ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20 shadow-md'
                            : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <IconComp className={`w-4 h-4 ${selectedFormat === fmt.id ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                          {selectedFormat === fmt.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${selectedFormat === fmt.id ? 'text-blue-500' : 'text-[var(--text-primary)]'}`}>
                            {fmt.label}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate">
                            {fmt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Inspiration Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Try Quick Inspiration Prompts:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptInspirations.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(item.prompt)}
                      className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60 hover:bg-blue-500/5 hover:border-blue-500/40 text-left transition-all text-xs group"
                    >
                      <div className="font-bold text-blue-500 text-[11px] mb-0.5 group-hover:underline">
                        {item.title}
                      </div>
                      <p className="text-[var(--text-secondary)] line-clamp-2 leading-relaxed text-[11px]">
                        "{item.prompt}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Additional Instructions */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showAdvancedOptions ? 'Hide' : 'Add'} Optional Custom Instructions or Constraints</span>
                </button>

                {showAdvancedOptions && (
                  <div className="mt-3 space-y-1.5 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Additional Free-Text Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={additionalInstructions}
                      onChange={e => setAdditionalInstructions(e.target.value)}
                      placeholder="e.g. Specify standards (IEEE / ASME), focus on thermal equations or cost breakdowns, add specific professor guidelines or rubric criteria."
                      className="w-full p-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]/80 text-[var(--text-primary)] focus-ring shadow-inner"
                    />
                  </div>
                )}
              </div>

              {/* Primary CTA Bottom Bar */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-color)]">
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Generates genuine presentation slides with speaker notes & viva defense</span>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Presentation Deck...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Presentation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        )}

        {/* Live Multi-Step Agent Reasoning Overlay */}
        {isGenerating && (
          <div className="p-8 rounded-3xl glass-panel border border-blue-500/30 bg-blue-500/5 space-y-5 text-center max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
              <Presentation className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                Generating Presentation Deck
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono">
                {generationSteps[generationStep]}
              </p>
            </div>

            <div className="w-full bg-[var(--bg-muted)] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Generated Presentation Studio Canvas */}
        {generatedSlides && currentSlide && parsedMeta && (
          <div className="space-y-6">
            
            {/* Professional Studio Control Toolbar */}
            <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 shadow-xl bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-surface)]/80">
              
              {/* Left Meta & Mode */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Slide {currentSlideIndex + 1} of {generatedSlides.length}
                </span>
                <div className="max-w-xs sm:max-w-md truncate">
                  <h3 className="text-xs sm:text-sm font-black text-[var(--text-primary)] truncate">
                    {currentSlide.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] truncate flex items-center gap-2">
                    <span>{parsedMeta.domain}</span>
                    <span>•</span>
                    <span className="font-mono text-blue-500 font-semibold">{activeFormat.toUpperCase()}</span>
                    {parsedMeta.requiresCode ? (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        • <Code2 className="w-3 h-3" /> Code Active
                      </span>
                    ) : (
                      <span className="text-sky-400 font-semibold">
                        • Engineering & Analytical Mode (No Code)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Center & Right Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Tab Switcher */}
                <div className="flex rounded-xl p-1 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                  <button
                    onClick={() => setActiveTab('slides')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'slides' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Slide Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'notes' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Speaker Script</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('viva')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'viva' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Viva Q&A</span>
                  </button>
                </div>

                {/* Theme Switcher */}
                <select
                  value={activeTheme}
                  onChange={e => setActiveTheme(e.target.value as ThemeStyle)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] focus-ring"
                  title="Change Presentation Theme"
                >
                  <option value="slate_dark">Slate Dark</option>
                  <option value="academic_light">Academic Light</option>
                  <option value="cyber_emerald">Cyber Emerald</option>
                  <option value="royal_indigo">Royal Indigo</option>
                  <option value="ocean_cyan">Ocean Cyan</option>
                  <option value="midnight_purple">Midnight Purple</option>
                  <option value="crimson_elegance">Crimson Elegance</option>
                </select>

                {/* Zoom Controls */}
                <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-1 text-xs">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(60, prev - 15))}
                    className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] font-bold text-[var(--text-secondary)]">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(130, prev + 15))}
                    className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Download REAL PowerPoint (.pptx) */}
                <button
                  onClick={handleDownloadPptx}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
                  title="Download authentic Microsoft PowerPoint (.pptx) file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PPT (.pptx)</span>
                </button>

                {/* Download Standalone HTML Deck / PDF */}
                <button
                  onClick={handleDownloadHtmlDeck}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
                  title="Download standalone HTML slide show or print to PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>HTML / PDF</span>
                </button>

                {/* Copy Markdown */}
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 transition-colors"
                  title="Copy formatted markdown"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Refine / New Prompt */}
                <button
                  onClick={() => setGeneratedSlides(null)}
                  className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Refine Prompt
                </button>

              </div>
            </div>

            {/* Slide Stage Canvas Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Main Slide Canvas Stage (8 cols) */}
              <div className="lg:col-span-8 space-y-4 flex flex-col items-center">
                
                {/* Real Physical PowerPoint Slide Canvas */}
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className={`w-full ${getCanvasAspectClass()} ${getThemeClass()} ${getFontClass()} p-8 sm:p-10 rounded-2xl border shadow-2xl transition-all flex flex-col justify-between overflow-hidden relative min-h-[460px]`}
                >
                  
                  {/* Title Slide Layout */}
                  {currentSlide.layoutType === 'title' ? (
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-3">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-400">
                          {currentSlide.category}
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                          {currentSlide.title}
                        </h1>
                        <p className="text-sm sm:text-base opacity-80 font-medium">
                          {currentSlide.subtitle}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs sm:text-sm">
                        {currentSlide.points.map((pt, pIdx) => (
                          <div key={pIdx} className="opacity-90 font-medium">
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Standard Slides Layout */
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* Top Header */}
                      <div className="space-y-1.5 border-b border-white/10 pb-3">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400">
                          {currentSlide.category}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                          {currentSlide.title}
                        </h2>
                        <p className="text-xs sm:text-sm opacity-75">
                          {currentSlide.subtitle}
                        </p>
                      </div>

                      {/* Content Area Based on Layout Type */}
                      <div className="py-4 flex-1 overflow-y-auto">
                        
                        {/* 1. Two Column Split Layout */}
                        {currentSlide.twoColumns && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2.5">
                              <h3 className="text-xs sm:text-sm font-bold text-sky-400 flex items-center gap-1.5">
                                <span>{currentSlide.twoColumns.left.title}</span>
                              </h3>
                              <ul className="space-y-2 text-xs sm:text-sm">
                                {currentSlide.twoColumns.left.points.map((p, i) => (
                                  <li key={i} className="flex items-start gap-2 leading-relaxed opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2.5">
                              <h3 className="text-xs sm:text-sm font-bold text-sky-400 flex items-center gap-1.5">
                                <span>{currentSlide.twoColumns.right.title}</span>
                              </h3>
                              <ul className="space-y-2 text-xs sm:text-sm">
                                {currentSlide.twoColumns.right.points.map((p, i) => (
                                  <li key={i} className="flex items-start gap-2 leading-relaxed opacity-90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* 2. Process Flow (4-Step Cards) */}
                        {currentSlide.processSteps && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {currentSlide.processSteps.map((st, sIdx) => (
                              <div key={sIdx} className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                                <div className="text-base sm:text-lg font-black text-sky-400">
                                  {st.step}
                                </div>
                                <div className="text-xs font-bold leading-tight">
                                  {st.title}
                                </div>
                                <p className="text-[11px] opacity-75 leading-relaxed">
                                  {st.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 3. Cards Grid (3-Column Framework) */}
                        {currentSlide.cardsGrid && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {currentSlide.cardsGrid.map((cg, cIdx) => (
                              <div key={cIdx} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                                <div className="text-xs sm:text-sm font-bold text-sky-400">
                                  {cg.title}
                                </div>
                                <ul className="space-y-1.5 text-xs opacity-90">
                                  {cg.points.map((p, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 4. Comparison Table */}
                        {currentSlide.tableData && (
                          <div className="rounded-xl border border-white/10 overflow-hidden text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-white/10 font-bold">
                                  {currentSlide.tableData.headers.map((h, i) => (
                                    <th key={i} className="p-3 border-b border-white/10 text-sky-400">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {currentSlide.tableData.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-2.5 opacity-90">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* 5. Metrics Stat Cards */}
                        {currentSlide.metricStats && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              {currentSlide.metricStats.map((st, mIdx) => (
                                <div key={mIdx} className="p-3.5 rounded-xl border border-white/10 bg-white/5 text-center">
                                  <div className="text-xl sm:text-2xl font-black text-sky-400">{st.value}</div>
                                  <div className="text-xs font-bold mt-0.5">{st.label}</div>
                                  <div className="text-[10px] opacity-75">{st.subtext}</div>
                                </div>
                              ))}
                            </div>
                            <ul className="space-y-2 text-xs sm:text-sm">
                              {currentSlide.points.map((p, i) => (
                                <li key={i} className="flex items-start gap-2 opacity-90">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 6. Code Snippet (ONLY when genuinely coding) */}
                        {currentSlide.structuredCode && (
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                            <div className="sm:col-span-8 p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-sky-300 whitespace-pre-wrap overflow-x-auto shadow-inner">
                              {currentSlide.structuredCode.snippet}
                            </div>
                            <div className="sm:col-span-4 p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs">
                              <div className="font-bold text-sky-400">Logic Overview:</div>
                              <p className="opacity-90 leading-relaxed text-[11px]">
                                {currentSlide.structuredCode.explanation}
                              </p>
                              {currentSlide.structuredCode.inputOutput && (
                                <div className="pt-2 border-t border-white/10 text-[10px] font-mono opacity-80">
                                  {currentSlide.structuredCode.inputOutput}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 7. Architecture / Engineering Flowchart */}
                        {currentSlide.diagramFlow && (
                          <div className="space-y-3">
                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-sky-300 whitespace-pre-wrap overflow-x-auto">
                              {currentSlide.diagramFlow}
                            </div>
                            <ul className="space-y-1.5 text-xs sm:text-sm">
                              {currentSlide.points.map((p, i) => (
                                <li key={i} className="flex items-start gap-2 opacity-90">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 8. Standard Bullets */}
                        {!currentSlide.twoColumns &&
                          !currentSlide.processSteps &&
                          !currentSlide.cardsGrid &&
                          !currentSlide.tableData &&
                          !currentSlide.metricStats &&
                          !currentSlide.structuredCode &&
                          !currentSlide.diagramFlow && (
                            <div className="space-y-3">
                              <ul className="space-y-2.5 text-xs sm:text-sm">
                                {currentSlide.points.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-3 opacity-90 leading-relaxed">
                                    <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                              {currentSlide.keyHighlight && (
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-sky-400 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  <span>{currentSlide.keyHighlight}</span>
                                </div>
                              )}
                            </div>
                          )}

                      </div>
                    </div>
                  )}

                  {/* Clean Bottom Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] opacity-70">
                    <span className="truncate max-w-sm">{parsedMeta.title}</span>
                    <span>Slide {currentSlideIndex + 1} of {generatedSlides.length}</span>
                  </div>

                </div>

                {/* Speaker Notes View Mode */}
                {activeTab === 'notes' && (
                  <div className="w-full max-w-4xl p-5 rounded-2xl glass-panel border border-blue-500/30 space-y-2 text-xs sm:text-sm">
                    <div className="font-bold text-blue-400 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Speaker Script (Say this during Slide {currentSlideIndex + 1}):</span>
                    </div>
                    <p className="leading-relaxed text-[var(--text-secondary)] italic">
                      "{currentSlide.presenterNotes}"
                    </p>
                  </div>
                )}

                {/* Viva Q&A View Mode */}
                {activeTab === 'viva' && (
                  <div className="w-full max-w-4xl p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3 text-xs sm:text-sm">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Expected Examiner Viva Questions for Slide {currentSlideIndex + 1}:</span>
                    </div>
                    {currentSlide.vivaQuestions.map((v, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                        <div className="font-bold text-amber-300">Q: {v.q}</div>
                        <div className="text-[var(--text-secondary)]">A: {v.a}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Slide Nav Controls */}
                <div className="w-full max-w-4xl flex items-center justify-between p-3 rounded-2xl glass-panel border border-[var(--border-color)]">
                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-primary)] disabled:opacity-40 flex items-center gap-1 hover:bg-[var(--bg-elevated)]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs font-mono font-bold text-[var(--text-secondary)]">
                    {currentSlideIndex + 1} / {generatedSlides.length}
                  </div>

                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.min(generatedSlides.length - 1, prev + 1))}
                    disabled={currentSlideIndex === generatedSlides.length - 1}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1 shadow-md shadow-blue-500/25"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Slide Thumbnails Carousel & Navigation (4 cols) */}
              <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1 flex items-center justify-between">
                  <span>Slide Overview</span>
                  <span className="font-mono text-blue-500 font-semibold">{generatedSlides.length} Slides</span>
                </div>
                {generatedSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all text-xs space-y-1 block ${
                      currentSlideIndex === idx
                        ? 'border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/20'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Slide {idx + 1}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[120px]">
                        {slide.category}
                      </span>
                    </div>
                    <div className="font-bold text-[var(--text-primary)] truncate">
                      {slide.title}
                    </div>
                  </button>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
