import React from 'react';

/**
 * Official Government Section Heading
 * Has standard left accent border (government blue or saffron) and bilingual support.
 */
export const SectionHeading = ({
  title,
  hindiTitle,
  subtitle,
  badge,
  action,
  accentColor = 'blue', // 'blue' | 'saffron' | 'green'
  className = ''
}) => {
  const accentBorder = {
    blue: 'border-l-[#0c2340]',
    saffron: 'border-l-[#c2410c]',
    green: 'border-l-[#15803d]'
  };

  return (
    <div
      className={`border-l-4 ${accentBorder[accentColor] || accentBorder.blue} pl-3.5 py-0.5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-bold text-[#0c2340] tracking-tight leading-snug">
            {title}
          </h3>
          {hindiTitle && (
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              ({hindiTitle})
            </span>
          )}
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-600 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
