
import { FailureScenario } from '../types';

/**
 * Deterministic Validator
 * Acts as a circuit breaker before LLM content is returned.
 */
export const validateScenario = (scenario: FailureScenario): { valid: boolean; overrideReason?: string } => {
  // Rule: If medical/drug data is involved, verify it has authoritative lookup
  const medicalKeywords = ['drug', 'dosage', 'prescription', 'medication', 'patient', 'clinical'];
  const content = (scenario.title + scenario.rootCause + scenario.impact).toLowerCase();
  
  const isMedicalContext = medicalKeywords.some(k => content.includes(k));
  
  if (isMedicalContext && !scenario.authoritativeLookup?.found) {
    return {
      valid: false,
      overrideReason: 'DETERMINISTIC_REJECTION: Medical context detected without validated RxNorm/OpenFDA lookup.'
    };
  }

  // Rule: High severity must have minimal preventive change defined
  if (scenario.severity === 'Critical' && (!scenario.minimalPreventiveChange || scenario.minimalPreventiveChange.likelihood < 0.5)) {
    return {
      valid: false,
      overrideReason: 'VETO: Critical risk requires >50% effective mitigation strategy.'
    };
  }

  return { valid: true };
};

/**
 * Mock authoritative knowledge base lookup
 * Return type is explicitly defined to align with scenario interface.
 */
export const authoritativeLookup = async (query: string): Promise<{ source: 'RxNorm' | 'OpenFDA' | 'NIST'; found: boolean; reference: string; }> => {
  // In real life, fetch from OpenFDA/RxNorm
  const medicalEntities = ['fentanyl', 'insulin', 'epinephrine', 'dosage', 'interaction'];
  const hasMedical = medicalEntities.some(e => query.toLowerCase().includes(e));
  
  if (hasMedical) {
    return {
      source: 'OpenFDA',
      found: true,
      reference: 'FDA-CFR-21-PARTS-200-299'
    };
  }
  return { source: 'NIST', found: true, reference: 'NIST-SP-800-53-R5' };
};
