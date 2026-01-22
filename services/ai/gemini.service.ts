
import { GoogleGenAI, Type } from "@google/genai";
import { PreMortemAnalysis, AdversarialModel, FailureScenario } from "../../types/forensic.types";
import { validateScenario, authoritativeLookup } from "../enforcement/enforcement.rules";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    forensicVerdict: { type: Type.STRING },
    overallRiskScore: { type: Type.NUMBER },
    simulationConfidence: { type: Type.NUMBER },
    calibration: {
      type: Type.OBJECT,
      properties: {
        prior: { type: Type.STRING },
        evidenceRank: { type: Type.STRING },
        uncertaintyBuffer: { type: Type.NUMBER },
        decayWindow: { type: Type.STRING }
      },
      required: ["prior", "evidenceRank", "uncertaintyBuffer", "decayWindow"]
    },
    executiveMetrics: {
      type: Type.OBJECT,
      properties: {
        riskTrend: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING },
              score: { type: Type.NUMBER },
              baseline: { type: Type.NUMBER }
            },
            required: ["month", "score", "baseline"]
          }
        },
        slaImpact: { type: Type.NUMBER },
        costToHarden: { type: Type.NUMBER },
        costOfInaction: { type: Type.STRING },
        riskTolerance: { type: Type.NUMBER },
        decisionStatus: { type: Type.STRING },
        readinessScore: { type: Type.NUMBER },
        heatmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              probability: { type: Type.NUMBER },
              impact: { type: Type.NUMBER },
              count: { type: Type.NUMBER },
              label: { type: Type.STRING }
            },
            required: ["probability", "impact", "count", "label"]
          }
        },
        topSystemicRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        riskVsCost: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { 
              name: { type: Type.STRING },
              cost: { type: Type.NUMBER }, 
              riskReduction: { type: Type.NUMBER },
              size: { type: Type.NUMBER }
            },
            required: ["name", "cost", "riskReduction", "size"]
          }
        }
      },
      required: ["riskTrend", "slaImpact", "costToHarden", "costOfInaction", "riskTolerance", "topSystemicRisks", "riskVsCost", "decisionStatus", "readinessScore", "heatmap"]
    },
    scenarios: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          expectedDowntimeHours: { type: Type.NUMBER },
          revenueImpactRange: { type: Type.STRING },
          errorBudgetImpactPercent: { type: Type.NUMBER },
          mttrMinutes: { type: Type.NUMBER },
          severity: { type: Type.STRING },
          detectability: { type: Type.STRING },
          timeToImpact: { type: Type.STRING },
          blastRadius: { type: Type.STRING },
          failureType: { type: Type.STRING },
          rootCause: { type: Type.STRING },
          impact: { type: Type.STRING },
          observabilitySignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                signalName: { type: Type.STRING },
                detectionGapMinutes: { type: Type.NUMBER },
                isCoveredBySLO: { type: Type.BOOLEAN }
              },
              required: ["type", "signalName", "detectionGapMinutes", "isCoveredBySLO"]
            }
          },
          plainEnglishExplanation: {
            type: Type.OBJECT,
            properties: {
              where: { type: Type.STRING },
              why: { type: Type.STRING },
              howToFix: { type: Type.STRING }
            },
            required: ["where", "why", "howToFix"]
          },
          causalChain: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                description: { type: Type.STRING },
                trigger: { type: Type.STRING }
              },
              required: ["step", "description", "trigger"]
            }
          },
          minimalPreventiveChange: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              likelihood: { type: Type.NUMBER },
              effort: { type: Type.STRING },
              cost: { type: Type.STRING }
            },
            required: ["action", "likelihood", "effort", "cost"]
          },
          prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
          complianceImpact: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                framework: { type: Type.STRING },
                status: { type: Type.STRING },
                requirement: { type: Type.STRING },
                actionRequired: { type: Type.STRING }
              },
              required: ["framework", "status", "requirement", "actionRequired"]
            }
          },
          explainability: {
            type: Type.OBJECT,
            properties: {
              reasoningPath: { type: Type.STRING },
              sourceAttribution: { type: Type.STRING },
              confidenceInterval: { type: Type.STRING },
              counterfactual: { type: Type.STRING }
            },
            required: ["reasoningPath", "sourceAttribution", "confidenceInterval", "counterfactual"]
          }
        },
        required: ["id", "title", "probability", "severity", "detectability", "timeToImpact", "blastRadius", "failureType", "rootCause", "causalChain", "minimalPreventiveChange", "impact", "prevention", "complianceImpact", "explainability", "plainEnglishExplanation", "expectedDowntimeHours", "revenueImpactRange", "errorBudgetImpactPercent", "mttrMinutes", "observabilitySignals"]
      }
    },
    modelCard: {
      type: Type.OBJECT,
      properties: {
        version: { type: Type.STRING },
        datasetLineage: { type: Type.STRING },
        privacyBudget: { type: Type.STRING }
      },
      required: ["version", "datasetLineage", "privacyBudget"]
    },
    riskDistribution: {
        type: Type.OBJECT,
        properties: { logic: { type: Type.NUMBER }, infrastructure: { type: Type.NUMBER }, process: { type: Type.NUMBER } },
        required: ["logic", "infrastructure", "process"]
    },
    failureTimeline: { type: Type.STRING },
    stackVulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["forensicVerdict", "overallRiskScore", "simulationConfidence", "calibration", "scenarios", "executiveMetrics", "modelCard", "riskDistribution", "failureTimeline", "stackVulnerabilities"]
};

export async function explainFailureDeeply(scenario: FailureScenario, stack: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform a Deep Forensic Briefing for the following failure scenario:
  TITLE: ${scenario.title}
  ROOT CAUSE: ${scenario.rootCause}
  SYSTEM STACK: ${stack}
  IMPACT: ${scenario.impact}
  Provide 1. Anatomy 2. Causality 3. Trigger Vectors 4. Prevention roadmap. Markdown format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: { systemInstruction: "Principal SRE tone." }
  });
  return response.text || "Briefing failed.";
}

export async function runPreMortem(
  description: string, 
  stack: string,
  modelMode: AdversarialModel,
  title: string,
  mission?: string,
  tier: 'FLASH' | 'PRO' = 'PRO'
): Promise<PreMortemAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = tier === 'PRO' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const prompt = `PROJECT_ID: ${title} | MISSION: ${mission} | ARCH_SPEC: ${description} | TECH_STACK: ${stack} | SIM_MODE: ${modelMode}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "Principal SRE simulation logic. Output decision-grade CTO analysis in JSON format.",
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
      // Optimized thinking budget for faster response times without losing reasoning quality
      ...(tier === 'PRO' ? { thinkingConfig: { thinkingBudget: 8192 } } : {})
    }
  });

  const rawData: PreMortemAnalysis = JSON.parse(response.text || "{}");
  for (const scenario of rawData.scenarios) {
    scenario.authoritativeLookup = await authoritativeLookup(scenario.title + ' ' + scenario.rootCause) as any;
    if (!validateScenario(scenario).valid) {
      scenario.severity = 'Critical';
      scenario.title = `[ENFORCEMENT_VETO] ${scenario.title}`;
    }
  }
  return rawData;
}
