/**
 * Consistency Checker Service Abstraction
 * Compares extracted OCR entities against application form inputs to spot discrepancies
 */
class ConsistencyChecker {
  /**
   * Check consistency between application form fields and document extracted entities
   * @param {Object} application 
   * @param {Object} extractedData 
   * @param {string} documentType 
   * @returns {{ matches: Array, mismatches: Array, isConsistent: boolean, overallScore: number }}
   */
  checkConsistency(application = {}, extractedData = {}, documentType = 'CASTE_CERT') {
    const matches = [];
    const mismatches = [];

    const appName = (application.personalDetails?.fullName || '').trim().toLowerCase();
    const docName = (extractedData.extractedName || '').trim().toLowerCase();

    // 1. Name Consistency Check
    if (appName && docName) {
      if (appName === docName || appName.includes(docName) || docName.includes(appName)) {
        matches.push({
          field: 'Candidate Name',
          appValue: application.personalDetails?.fullName,
          docValue: extractedData.extractedName,
          status: 'match',
          confidence: 0.98
        });
      } else {
        mismatches.push({
          field: 'Candidate Name',
          appValue: application.personalDetails?.fullName,
          docValue: extractedData.extractedName,
          status: 'mismatch',
          severity: 'HIGH',
          observation: 'Spelling or middle name variation observed between application form and certificate.'
        });
      }
    }

    // 2. Certificate Number Consistency Check
    const appCertNum = (application.personalDetails?.casteCertificateNumber || '').trim().toUpperCase();
    const docCertNum = (extractedData.certificateNumber || '').trim().toUpperCase();

    if (appCertNum && docCertNum) {
      if (appCertNum === docCertNum) {
        matches.push({
          field: 'Certificate Number',
          appValue: appCertNum,
          docValue: docCertNum,
          status: 'match',
          confidence: 0.99
        });
      } else {
        mismatches.push({
          field: 'Certificate Number',
          appValue: appCertNum,
          docValue: docCertNum,
          status: 'mismatch',
          severity: 'HIGH',
          observation: 'Certificate number entered on application differs from OCR extracted document number.'
        });
      }
    }

    // 3. Category / Community Consistency Check
    if (extractedData.category) {
      if (extractedData.category === 'ST') {
        matches.push({
          field: 'Statutory Category',
          appValue: 'Scheduled Tribe (ST)',
          docValue: extractedData.category,
          status: 'match',
          confidence: 0.97
        });
      } else {
        mismatches.push({
          field: 'Statutory Category',
          appValue: 'Scheduled Tribe (ST)',
          docValue: extractedData.category,
          status: 'mismatch',
          severity: 'CRITICAL',
          observation: 'Extracted document indicates category other than Scheduled Tribe (ST).'
        });
      }
    }

    const isConsistent = mismatches.length === 0;
    const overallScore = isConsistent ? 0.96 : Math.max(0.65, 1 - mismatches.length * 0.15);

    return {
      matches,
      mismatches,
      isConsistent,
      overallScore
    };
  }
}

export const consistencyChecker = new ConsistencyChecker();
export default consistencyChecker;