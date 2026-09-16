import ocrService from './ocrService.js';
import documentClassifier from './documentClassifier.js';
import dataExtraction from './dataExtraction.js';
import consistencyChecker from './consistencyChecker.js';
import deficiencyDetector from './deficiencyDetector.js';

export {
  ocrService,
  documentClassifier,
  dataExtraction,
  consistencyChecker,
  deficiencyDetector
};

/**
 * Orchestrated Assistive AI Analysis Pipeline for a document against an application
 */
export const runAssistiveDocumentAnalysis = async (document, application, filePath = '') => {
  // 1. Run OCR
  const ocrResult = await ocrService.extractText(filePath, document?.mimeType);

  // 2. Classify Document
  const classification = await documentClassifier.classify(ocrResult.rawText, document?.fileName);

  // 3. Extract Key Entities
  const extraction = await dataExtraction.extractEntities(ocrResult.rawText, classification.detectedType);

  // 4. Run Consistency Check against Application Form Fields
  const consistency = consistencyChecker.checkConsistency(application, extraction.extractedData, classification.detectedType);

  // 5. Detect Potential Deficiencies & Generate Advisory Recommendation
  const deficiencyAnalysis = deficiencyDetector.detectDeficiencies(consistency, classification.detectedType);

  return {
    documentName: document?.documentName || 'Certificate Document',
    documentType: document?.documentType || classification.detectedType,
    fileName: document?.fileName || 'document.pdf',
    confidenceScore: Math.round(((ocrResult.confidence + extraction.confidence + deficiencyAnalysis.confidence) / 3) * 100),
    ocrSummary: {
      rawTextSnippet: ocrResult.rawText.slice(0, 160) + '...',
      confidence: `${Math.round(ocrResult.confidence * 100)}%`
    },
    classification: {
      detectedType: classification.detectedType,
      label: classification.label,
      confidence: `${Math.round(classification.confidence * 100)}%`
    },
    extractedEntities: extraction.extractedData,
    consistencyCheck: {
      isConsistent: consistency.isConsistent,
      matches: consistency.matches,
      mismatches: consistency.mismatches
    },
    deficiencyDetection: {
      potentialDeficiencies: deficiencyAnalysis.potentialDeficiencies,
      recommendation: deficiencyAnalysis.recommendation
    },
    disclaimer: 'AI-assisted analysis. Final verification remains with the authorized officer.'
  };
};

export default runAssistiveDocumentAnalysis;