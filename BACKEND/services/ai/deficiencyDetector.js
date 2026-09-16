/**
 * Deficiency Detector Service Abstraction
 * Detects potential document or application deficiencies and generates non-binding recommendations for scrutiny officers
 */
class DeficiencyDetector {
  /**
   * Analyze consistency check results and flag potential deficiencies
   * @param {Object} consistencyResult 
   * @param {string} documentType 
   * @returns {{ potentialDeficiencies: Array, recommendation: string, confidence: number }}
   */
  detectDeficiencies(consistencyResult = {}, documentType = 'CASTE_CERT') {
    const potentialDeficiencies = [];

    const mismatches = consistencyResult.mismatches || [];
    for (const item of mismatches) {
      if (item.field === 'Candidate Name') {
        potentialDeficiencies.push({
          category: 'Name Discrepancy',
          description: `Applicant name on portal ("${item.appValue}") does not match certificate text ("${item.docValue}").`,
          suggestedAction: 'Request candidate to upload official Gazette notification or affidavit clarifying name variation.',
          severity: 'MEDIUM'
        });
      }

      if (item.field === 'Certificate Number') {
        potentialDeficiencies.push({
          category: 'Certificate Identification Mismatch',
          description: `Portal certificate number ("${item.appValue}") differs from certificate document ("${item.docValue}").`,
          suggestedAction: 'Request clear re-upload of e-District digital certificate.',
          severity: 'HIGH'
        });
      }

      if (item.field === 'Statutory Category') {
        potentialDeficiencies.push({
          category: 'Ineligible Category Certificate',
          description: 'Document does not verify Scheduled Tribe (ST) status.',
          suggestedAction: 'Refer to Senior Verification Officer for statutory scrutiny.',
          severity: 'CRITICAL'
        });
      }
    }

    let recommendation = 'Document Verified';
    if (potentialDeficiencies.some((d) => d.severity === 'CRITICAL')) {
      recommendation = 'Manual Review Required (High Discrepancy)';
    } else if (potentialDeficiencies.length > 0) {
      recommendation = 'Manual Review';
    }

    return {
      potentialDeficiencies,
      recommendation,
      confidence: 0.94,
      disclaimer: 'AI-assisted analysis. Final verification remains with the authorized officer.'
    };
  }
}

export const deficiencyDetector = new DeficiencyDetector();
export default deficiencyDetector;