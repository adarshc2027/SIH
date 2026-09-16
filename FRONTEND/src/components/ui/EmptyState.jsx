import React from 'react';
import { FileQuestion, FolderOpen } from 'lucide-react';
import { Button } from './Button';

/**
 * Government Portal Empty State Component
 */
export const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'कोई अभिलेख नहीं मिला / No Records Found',
  description = 'There are no active entries matching your current selection or filters.',
  actionLabel,
  onAction,
  actionIcon,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-slate-300 rounded ${className}`}>
      <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 mb-3.5">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="sm"
            onClick={onAction}
            leftIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
