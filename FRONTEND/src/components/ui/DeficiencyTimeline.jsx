import React from 'react';
import {
  AlertCircle,
  MessageSquare,
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';

/**
 * DeficiencyTimeline
 * Displays the 5-step official audit timeline:
 * Deficiency Raised -> Applicant Responded -> Document Resubmitted -> Officer Reviewed -> Resolved
 */
export const DeficiencyTimeline = ({ deficiency }) => {
  if (!deficiency) return null;

  // Stages definition
  const stages = [
    {
      id: 'raised',
      label: 'Deficiency Raised',
      sublabel: deficiency.raisedByName || 'Scrutiny Officer',
      icon: AlertCircle,
      date: deficiency.raisedAt
    },
    {
      id: 'responded',
      label: 'Applicant Responded',
      sublabel: deficiency.applicantRemarks ? 'Explanation provided' : 'Pending response',
      icon: MessageSquare,
      date: deficiency.respondedAt
    },
    {
      id: 'resubmitted',
      label: 'Document Resubmitted',
      sublabel: deficiency.resubmittedDocument ? 'Corrected copy uploaded' : 'Not resubmitted',
      icon: FileCheck,
      date: deficiency.respondedAt && deficiency.resubmittedDocument ? deficiency.respondedAt : null
    },
    {
      id: 'reviewed',
      label: 'Officer Reviewed',
      sublabel:
        deficiency.status === 'resolved' || deficiency.timeline?.some((t) => t.stage === 'reviewed')
          ? 'Scrutiny completed'
          : 'Pending scrutiny',
      icon: Search,
      date: deficiency.resolvedAt || (deficiency.timeline?.find((t) => t.stage === 'reviewed')?.timestamp)
    },
    {
      id: 'resolved',
      label: 'Resolved',
      sublabel: deficiency.status === 'resolved' ? 'Cleared & approved' : 'Open',
      icon: CheckCircle2,
      date: deficiency.status === 'resolved' ? deficiency.resolvedAt : null
    }
  ];

  // Determine stage completion status
  const getStageStatus = (stageId, index) => {
    if (deficiency.status === 'resolved') return 'completed';

    if (stageId === 'raised') return 'completed';

    if (stageId === 'responded') {
      return deficiency.status === 'responded' || deficiency.applicantRemarks ? 'completed' : 'current';
    }

    if (stageId === 'resubmitted') {
      if (deficiency.resubmittedDocument) return 'completed';
      if (deficiency.status === 'responded') return 'current';
      return 'pending';
    }

    if (stageId === 'reviewed') {
      if (deficiency.timeline?.some((t) => t.stage === 'reviewed')) return 'completed';
      if (deficiency.status === 'responded') return 'current';
      return 'pending';
    }

    if (stageId === 'resolved') {
      return deficiency.status === 'resolved' ? 'completed' : 'pending';
    }

    return 'pending';
  };

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h4 className="font-bold text-[#0c2340] text-xs uppercase tracking-wider">
          Deficiency Progression & Audit Trail
        </h4>
        <span className="text-[11px] font-mono text-slate-500">
          Ref: DEF-{deficiency._id ? deficiency._id.slice(-6).toUpperCase() : 'MOTA'}
        </span>
      </div>

      {/* Horizontal / Wrapped Step Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
        {stages.map((stage, idx) => {
          const status = getStageStatus(stage.id, idx);
          const Icon = stage.icon;

          let badgeBg = 'bg-slate-100 text-slate-500 border-slate-300';
          let lineBg = 'bg-slate-200';

          if (status === 'completed') {
            badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-400 font-semibold';
            lineBg = 'bg-emerald-500';
          } else if (status === 'current') {
            badgeBg = 'bg-amber-100 text-amber-900 border-amber-400 font-semibold animate-pulse';
            lineBg = 'bg-amber-400';
          }

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded border text-xs flex flex-col justify-between space-y-1 transition-all ${
                status === 'completed'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : status === 'current'
                  ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-white border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] border shrink-0 ${badgeBg}`}
                >
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-900 text-[11px] leading-tight">
                  {stage.label}
                </span>
              </div>

              <div className="pl-7 text-[10px] space-y-0.5">
                <p className="text-slate-600 truncate">{stage.sublabel}</p>
                {stage.date && (
                  <p className="font-mono text-slate-400">
                    {new Date(stage.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Timeline Audit Log Entries if present */}
      {deficiency.timeline && deficiency.timeline.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <h5 className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">
            Statutory Log Events:
          </h5>
          <div className="space-y-1 text-[11px]">
            {deficiency.timeline.map((entry, index) => (
              <div
                key={index}
                className="flex items-start justify-between bg-white border border-slate-200 rounded px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 capitalize">
                    {entry.stage.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{entry.remarks}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0 pl-2">
                  {entry.actorName && `${entry.actorName} • `}
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeficiencyTimeline;