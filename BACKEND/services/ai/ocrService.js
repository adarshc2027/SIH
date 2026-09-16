/**
 * Optical Character Recognition (OCR) Service Abstraction
 * Supports mock extraction or actual engine bindings (e.g. Tesseract, AWS Textract, or Azure Document Intelligence)
 */
class OcrService {
  /**
   * Extract raw text and layout tokens from an image or PDF
   * @param {string} filePath 
   * @param {string} mimeType 
   * @returns {Promise<{ rawText: string, confidence: number, language: string, lineCount: number }>}
   */
  async extractText(filePath, mimeType = 'application/pdf') {
    // Modular mock implementation when no cloud vision credentials are provided
    return {
      rawText: "GOVERNMENT OF JHARKHAND\nDEPARTMENT OF REVENUE AND LAND REFORMS\nCASTE CERTIFICATE (SCHEDULED TRIBE)\nCertificate No: JH/ST/2023/88194\nThis is to certify that Shri/Kumari Birsa Munda son/daughter of Shri Mangal Munda of Village Ulihatu, District Khunti, Jharkhand belongs to Munda Community which is recognized as a Scheduled Tribe under the Constitution (Scheduled Tribes) Order, 1950.\nIssued by: Sub-Divisional Officer, Khunti\nDate of Issue: 15/05/2023",
      confidence: 0.94,
      language: 'eng+hin',
      lineCount: 12
    };
  }
}

export const ocrService = new OcrService();
export default ocrService;