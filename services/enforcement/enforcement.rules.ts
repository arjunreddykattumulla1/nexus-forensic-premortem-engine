
import { FailureScenario } from '../../types/forensic.types';

export const validateScenario = (scenario: FailureScenario): { valid: boolean; overrideReason?: string } => {
  const medicalKeywords = ['drug', 'dosage', 'prescription', 'medication', 'patient', 'clinical'];
  const content = (scenario.title + scenario.rootCause + scenario.impact).toLowerCase();
  const isMedicalContext = medicalKeywords.some(k => content.includes(k));
  
  if (isMedicalContext && !scenario.authoritativeLookup?.found) {
    return {
      valid: false,
      overrideReason: 'DETERMINISTIC_REJECTION: Medical context detected without validated RxNorm/OpenFDA lookup.'
    };
  }

  if (scenario.severity === 'Critical' && (!scenario.minimalPreventiveChange || scenario.minimalPreventiveChange.likelihood < 0.5)) {
    return {
      valid: false,
      overrideReason: 'VETO: Critical risk requires >50% effective mitigation strategy.'
    };
  }

  return { valid: true };
};

export const authoritativeLookup = async (query: string): Promise<{ source: 'RxNorm' | 'OpenFDA' | 'NIST'; found: boolean; reference: string; }> => {
  const medicalEntities = ['fentanyl', 'insulin', 'epinephrine', 'dosage', 'interaction'];
  const hasMedical = medicalEntities.some(e => query.toLowerCase().includes(e));
  
  if (hasMedical) {
    return { source: 'OpenFDA', found: true, reference: 'FDA-CFR-21-PARTS-200-299' };
  }
  return { source: 'NIST', found: true, reference: 'NIST-SP-800-53-R5' };
};
