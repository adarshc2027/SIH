import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';
import { StatusBadge, Alert } from './';

/**
 * Official Government-Style Assistive AI Analysis Panel
 * Strictly administrative and non-binding:
 * NO glowing icons, NO gradients, NO futuristic AI particles.
 */
export const AssistiveAiReport = ({
  analysis,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-300 rounded space-y-2 ${className}`}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-xs uppercase text-[#0c2340]">
            Assistive OCR & Consistency Analysis
          </span>
          <span className="text-[11px] font-mono text-slate-500">Processing OCR stream...</span>
        </div>
        <p className="text-xs text-slate-500 italic">
          Running document classification, text extraction, and application consistency verification...
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  const {
    documentName = 'Document',
    confidenceScore = 94,
    classification = {},
    extractedEntities = {},
    consistencyCheck = {},
    deficiencyDetection = {},
    disclaimer = 'AI-assisted analysis. Final verification remains with the authorized officer.'
  } = analysis;

  const hasMismatches = consistencyCheck.mismatches && consistencyCheck.mismatches.length > 0;

  return (
    <div className={`bg-white border border-slate-300 rounded shadow-2xs p-4 space-y-4 ${className}`}>
      
      {/* Official Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-xs sm:text-sm text-[#0c2340] uppercase tracking-wider">
              Assistive Document Intelligence Summary
            </h4>
            <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-300">
              Confidence: {confidenceScore}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Document: <strong>{documentName}</strong> ({classification.label || classification.detectedType || 'Identity Record'})
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded border ${
              deficiencyDetection.recommendation === 'Document Verified'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : 'bg-amber-50 text-amber-950 border-amber-300'
            }`}
          >
            {deficiencyDetection.recommendation === 'Document Verified' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            )}
            <span>Advisory Recommendation: {deficiencyDetection.recommendation}</span>
          </span>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-slate-50 border-l-4 border-l-[#113f67] border-y border-r border-slate-200 p-2.5 text-xs text-slate-700 leading-relaxed">
        <strong>Statutory Officer Directive:</strong> {disclaimer}
      </div>

      {/* 2-Column Extracted vs Application Field Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Column 1: OCR Extracted Entities */}
        <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Extracted Document Entities (OCR Engine)
          </span>

          <div className="space-y-1.5">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 text-[11px]">Extracted Name:</span>
              <strong className="text-slate-900 font-mono">
                {extractedEntities.extractedName || '—'}
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 text-[11px]">Certificate Number:</span>
              <strong className="text-slate-900 font-mono">
                {extractedEntities.certificateNumber || '—'}
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500 text-[11px]">Community Category:</span>
              <span className="font-semibold text-[#0c2340]">
                {extractedEntities.category || 'ST'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 text-[11px]">Issuing Authority:</span>
              <span className="text-slate-700 text-right truncate max-w-[160px]">
                {extractedEntities.issuingAuthority || 'Revenue SDO'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Consistency Verification Matrix */}
        <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Application Cross-Check Findings
          </span>

          <div className="space-y-1.5">
            {consistencyCheck.matches && consistencyCheck.matches.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-700">{item.field}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Matches Form</span>
                </span>
              </div>
            ))}

            {hasMismatches ? (
              consistencyCheck.mismatches.map((item, idx) => (
                <div key={idx} className="bg-amber-50 border border-amber-200 rounded p-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-950">{item.field} Variation:</span>
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Attention</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Form: "{item.appValue}" vs Document: "{item.docValue}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-[11px] text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                ✓ No field discrepancies detected across name and identification numbers.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Potential Deficiencies List if detected */}
      {deficiencyDetection.potentialDeficiencies && deficiencyDetection.potentialDeficiencies.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
            Potential Discrepancies Flagged for Officer Inspection:
          </h5>
          <div className="space-y-1 text-xs">
            {deficiencyDetection.potentialDeficiencies.map((d, i) => (
              <div key={i} className="p-2.5 rounded bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-amber-950 text-[11px]">{d.category}:</strong>
                  <p className="text-slate-700 text-[11px]">{d.description}</p>
                  <span className="text-[10px] text-slate-500 block">
                    Suggested action: {d.suggestedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AssistiveAiReport;