import React from 'react';

/**
 * Official Government Status Badge Component
 * Clean, high contrast, muted government tones.
 */
export const StatusBadge = ({
  status = 'draft',
  label,
  size = 'md',
  className = ''
}) => {
  const normalized = String(status).toLowerCase().replace(/\s+/g, '_');

  const configs = {
    draft: {
      defaultLabel: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      dot: 'bg-slate-500'
    },
    submitted: {
      defaultLabel: 'Submitted',
      bg: 'bg-blue-50',
      text: 'text-[#0c2340]',
      border: 'border-blue-300',
      dot: 'bg-[#113f67]'
    },
    under_scrutiny: {
      defaultLabel: 'Under Scrutiny',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-600'
    },
    scrutiny: {
      defaultLabel: 'Under Scrutiny',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-600'
    },
    verified: {
      defaultLabel: 'Verified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      dot: 'bg-emerald-600'
    },
    recommended: {
      defaultLabel: 'Recommended for Sanction',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      dot: 'bg-emerald-600'
    },
    deficient: {
      defaultLabel: 'Deficiency Raised',
      bg: 'bg-orange-50',
      text: 'text-orange-950',
      border: 'border-orange-300',
      dot: 'bg-orange-600'
    },
    deficiency: {
      defaultLabel: 'Deficiency Raised',
      bg: 'bg-orange-50',
      text: 'text-orange-950',
      border: 'border-orange-300',
      dot: 'bg-orange-600'
    },
    sanctioned: {
      defaultLabel: 'Sanctioned / Approved',
      bg: 'bg-green-100',
      text: 'text-green-950',
      border: 'border-green-400',
      dot: 'bg-green-700'
    },
    rejected: {
      defaultLabel: 'Rejected',
      bg: 'bg-red-50',
      text: 'text-red-950',
      border: 'border-red-300',
      dot: 'bg-red-600'
    },
    missing: {
      defaultLabel: 'Missing',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-300',
      dot: 'bg-rose-600'
    },
    uploaded: {
      defaultLabel: 'Uploaded',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-300',
      dot: 'bg-blue-600'
    },
    resubmitted: {
      defaultLabel: 'Resubmitted',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-300',
      dot: 'bg-purple-600'
    },
    pending: {
      defaultLabel: 'Pending Review',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-500'
    }
  };

  const current = configs[normalized] || configs.draft;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded select-none ${current.bg} ${current.text} ${current.border} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}></span>
      <span>{label || current.defaultLabel}</span>
    </span>
  );
};

export default StatusBadge;
