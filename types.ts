
export interface FailureStep {
  step: number;
  description: string;
  trigger: string;
}

export type FailureType = 'Model-Intrinsic' | 'Systemic-Arch' | 'Human-Process' | 'Infra-External';
export type EffortLevel = '1h' | '1d' | '1w' | '1m+';
export type CostLevel = 'Low' | 'Medium' | 'High';
export type UserRole = 'Engineer' | 'Admin' | 'Auditor';

export interface ComplianceMapping {
  framework: 'HIPAA' | 'GDPR' | 'SOC2' | 'PCI-DSS' | 'NIST-AI';
  status: 'Critical' | 'Warning' | 'Pass';
  requirement: string;
  actionRequired: string;
}

export interface ProbabilisticMetric {
  p50: number;
  p95: number;
  confidenceInterval: string;
}

export interface ObservabilitySignal {
  type: 'Metric' | 'Log' | 'Trace';
  signalName: string;
  detectionGapMinutes: number;
  isCoveredBySLO: boolean;
}

export interface FailureScenario {
  id: string;
  title: string;
  probability: number; // Probabilistic P95
  expectedDowntimeHours: number;
  revenueImpactRange: string;
  errorBudgetImpactPercent: number;
  mttrMinutes: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectability: 'High' | 'Medium' | 'Low';
  timeToImpact: string;
  blastRadius: string; // e.g., "45% Region, 12% Total Revenue"
  rootCause: string;
  failureType: FailureType;
  causalChain: FailureStep[];
  observabilitySignals: ObservabilitySignal[];
  impact: string;
  plainEnglishExplanation: {
    where: string;
    why: string;
    howToFix: string;
  };
  minimalPreventiveChange: {
    action: string;
    likelihood: number;
    effort: EffortLevel;
    cost: CostLevel;
  };
  prevention: string[];
  complianceImpact: ComplianceMapping[];
  explainability: {
    reasoningPath: string;
    sourceAttribution: string;
    confidenceInterval: string;
    counterfactual: string;
  };
  authoritativeLookup?: {
    source: 'RxNorm' | 'OpenFDA' | 'NIST';
    found: boolean;
    reference: string;
  };
}

export interface CalibrationMetrics {
  prior: string;
  evidenceRank: 'Scientific' | 'Heuristic' | 'Speculative';
  uncertaintyBuffer: number;
  decayWindow: string;
}

export interface HeatmapPoint {
  probability: number; // 1-5
  impact: number; // 1-5
  count: number;
  label: string;
}

export interface ExecutiveMetrics {
  riskTrend: { month: string; score: number; baseline: number }[];
  slaImpact: number; // % reduction in availability if unmitigated
  costToHarden: number; // estimated USD
  costOfInaction: string; // Monetary estimate
  riskTolerance: number; // 0-100 threshold
  topSystemicRisks: string[];
  riskVsCost: { name: string; cost: number; riskReduction: number; size: number }[];
  decisionStatus: 'GO' | 'NO-GO' | 'CAUTION';
  readinessScore: number; // 0-100
  heatmap: HeatmapPoint[];
}

export interface PreMortemAnalysis {
  forensicVerdict: string;
  scenarios: FailureScenario[];
  overallRiskScore: number;
  simulationConfidence: number;
  calibration: CalibrationMetrics;
  failureTimeline: string;
  stackVulnerabilities: string[];
  riskDistribution: {
    logic: number;
    infrastructure: number;
    process: number;
  };
  executiveMetrics: ExecutiveMetrics;
  modelCard: {
    version: string;
    datasetLineage: string;
    privacyBudget: string;
  };
}

export type AdversarialModel = 'Standard' | 'Adversarial' | 'Systemic-Collapse';
