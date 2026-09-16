import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard Government Loading State
 */
export const LoadingState = ({
  message = 'कृपया प्रतीक्षा करें / Please wait...',
  subtext = 'Fetching information from Ministry servers',
  size = 'md',
  className = ''
}) => {
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-3 ${className}`}>
      <Loader2 className={`${spinnerSizes[size] || spinnerSizes.md} animate-spin text-[#113f67]`} />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
      </div>
    </div>
  );
};

/**
 * Table Skeleton Loader for clean initial loading experience
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full border border-slate-300 rounded overflow-hidden animate-pulse">
      {/* Table Header Placeholder */}
      <div className="bg-slate-100 border-b border-slate-300 p-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-300 rounded flex-1"></div>
        ))}
      </div>
      {/* Table Rows Placeholder */}
      <div className="divide-y divide-slate-200 bg-white">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-3.5 flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-3.5 bg-slate-200 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Card Skeleton Loader
 */
export const CardSkeleton = () => {
  return (
    <div className="border border-slate-300 rounded p-5 bg-white space-y-3 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
      <div className="pt-2 flex gap-2">
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default LoadingState;
