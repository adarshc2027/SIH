/**
 * Document Classification Service Abstraction
 * Identifies document types (Caste Certificate, Income Certificate, Marks Card, Admission Offer, Passport)
 */
class DocumentClassifier {
  /**
   * Classify document based on text content and filename heuristics
   * @param {string} rawText 
   * @param {string} fileName 
   * @returns {Promise<{ detectedType: string, label: string, confidence: number, matchScore: number }>}
   */
  async classify(rawText = '', fileName = '') {
    const text = (rawText + ' ' + fileName).toLowerCase();

    if (text.includes('caste') || text.includes('scheduled tribe') || text.includes('st cert') || text.includes('community')) {
      return {
        detectedType: 'CASTE_CERT',
        label: 'Scheduled Tribe (ST) Certificate',
        confidence: 0.96,
        matchScore: 0.98
      };
    }

    if (text.includes('income') || text.includes('annual income') || text.includes('revenue') || text.includes('tahsildar')) {
      return {
        detectedType: 'INCOME_CERT',
        label: 'Family Annual Income Certificate',
        confidence: 0.92,
        matchScore: 0.91
      };
    }

    if (text.includes('marksheet') || text.includes('transcript') || text.includes('cgpa') || text.includes('grade card') || text.includes('degree')) {
      return {
        detectedType: 'MARKSHEET',
        label: 'Qualifying Examination Marks Card',
        confidence: 0.94,
        matchScore: 0.95
      };
    }

    if (text.includes('admission') || text.includes('offer letter') || text.includes('enrolment') || text.includes('registration')) {
      return {
        detectedType: 'ADMISSION_LETTER',
        label: 'University Admission / Registration Letter',
        confidence: 0.91,
        matchScore: 0.89
      };
    }

    if (text.includes('passbook') || text.includes('bank') || text.includes('ifsc') || text.includes('account number')) {
      return {
        detectedType: 'BANK_PASSBOOK',
        label: 'Aadhaar-Seeded Bank Passbook / Statement',
        confidence: 0.93,
        matchScore: 0.92
      };
    }

    return {
      detectedType: 'OTHER_SUPPORTING_DOC',
      label: 'Supporting Identity Document',
      confidence: 0.85,
      matchScore: 0.80
    };
  }
}

export const documentClassifier = new DocumentClassifier();
export default documentClassifier;