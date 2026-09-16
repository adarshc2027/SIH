import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Info } from 'lucide-react';
import { Alert } from './Alert';

/**
 * Official Government Eligibility Check Result Component
 * 
 * Complies with MoTA accessibility & design guidelines:
 * - Clear text labels in addition to colors
 * - Assistive nature explicitly communicated to user/officials
 * - Zero glowing AI effects or futuristic animations
 * - Displays:
 *   ✓ Requirement satisfied (passed)
 *   ⚠ Manual verification required (manual_review)
 *   ✕ Requirement not satisfied (failed)
 *   - Not applicable (not_applicable)
 */
export const EligibilityCheck = ({
  assessment,
  loading = false,
  title = 'Application Eligibility Assessment',
  hindiTitle = 'पात्रता सत्यापन परिणाम',
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`border border-slate-300 rounded p-5 bg-white space-y-3 ${className}`}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm sm:text-base font-bold text-[#0c2340]">
            {title}
          </h3>
          <span className="text-xs text-slate-500 font-mono">Evaluating Rules...</span>
        </div>
        <p className="text-xs text-slate-500 italic">
          Evaluating application parameters against configured scheme rules...
        </p>
      </div>
    );
  }

  if (!assessment || !assessment.rules) {
    return null;
  }

  const { eligible, overallStatus, rules, evaluatedAt } = assessment;

  // Status configuration mapping with high-contrast government tokens
  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>✓ Requirement satisfied</span>
          </span>
        );
      case 'manual_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-950 border border-amber-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>⚠ Manual verification required</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-950 border border-rose-300 text-xs font-semibold">
            <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>✕ Requirement not satisfied</span>
          </span>
        );
      case 'not_applicable':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold">
            <MinusCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>— Not Applicable</span>
          </span>
        );
    }
  };

  return (
    <div className={`border border-slate-300 rounded bg-white shadow-2xs space-y-4 p-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#0c2340]">
              {title}
            </h3>
            {hindiTitle && (
              <span className="text-xs text-slate-500 hidden sm:inline">
                ({hindiTitle})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Automated compliance evaluation against scheme guidelines
          </p>
        </div>

        {/* Overall Status Banner */}
        <div className="text-right">
          {overallStatus === 'passed' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>ELIGIBLE (ALL REQUIREMENTS SATISFIED)</span>
            </div>
          )}
          {overallStatus === 'manual_review' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-100 text-amber-950 border border-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>PROVISIONALLY ELIGIBLE (MANUAL SCRUTINY REQUIRED)</span>
            </div>
          )}
          {overallStatus === 'failed' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-100 text-rose-950 border border-rose-400 font-bold text-xs">
              <XCircle className="w-4 h-4 text-rose-700" />
              <span>INELIGIBLE (CRITICAL REQUIREMENTS NOT MET)</span>
            </div>
          )}
        </div>
      </div>

      {/* Assistive Tool Mandatory Regulatory Note */}
      <Alert variant="info" title="Statutory Verification Notice">
        Eligibility automation serves strictly as an ASSISTIVE tool to accelerate processing. Final verification, deficiency requests, or sanction recommendations remain the sole prerogative of appointed Ministry Scrutiny Officers.
      </Alert>

      {/* Detailed Rules Table */}
      <div className="overflow-x-auto border border-slate-300 rounded">
        <table className="gov-table w-full text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-left">
              <th className="p-3 w-1/3">Eligibility Parameter</th>
              <th className="p-3 w-1/4">Evaluation Status</th>
              <th className="p-3 w-5/12">Findings & Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rules.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 align-top font-semibold text-[#0c2340]">
                  {item.rule}
                  {item.critical && (
                    <span className="block text-[10px] text-red-700 font-normal">
                      * Mandatory Condition
                    </span>
                  )}
                </td>
                <td className="p-3 align-top whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="p-3 align-top text-slate-700 leading-relaxed">
                  {item.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {evaluatedAt && (
        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
          <span>Rules loaded dynamically from Scheme Master Record</span>
          <span className="font-mono">Evaluated on: {new Date(evaluatedAt).toLocaleString('en-GB')}</span>
        </div>
      )}
    </div>
  );
};

export default EligibilityCheck;
