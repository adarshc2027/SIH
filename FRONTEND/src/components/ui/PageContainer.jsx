import React from 'react';
import { Breadcrumb } from '../common/Breadcrumb';

/**
 * Standard Government Portal Page Container
 * Provides consistent maximum widths, padding, and metadata headers.
 */
export const PageContainer = ({
  title,
  hindiTitle,
  description,
  breadcrumbs = [],
  action,
  maxWidth = 'max-w-7xl',
  children,
  className = ''
}) => {
  return (
    <div className={`w-full min-h-[calc(100vh-250px)] ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6`}>
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}

        {/* Page Title Header */}
        {(title || action) && (
          <div className="bg-white border border-slate-300 rounded p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340] tracking-tight">
                  {title}
                </h1>
                {hindiTitle && (
                  <span className="text-sm font-normal text-slate-500">
                    / {hindiTitle}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {action && (
              <div className="shrink-0 flex items-center gap-2">
                {action}
              </div>
            )}
          </div>
        )}

        {/* Page Content Body */}
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
