import React, { useState } from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

/**
 * Government Portal Alert Component
 * High-contrast, clean 4px left-border, accessible colors, no neon.
 */
export const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const configs = {
    info: {
      container: 'bg-blue-50 border-slate-300 border-l-[#113f67] text-slate-800',
      iconColor: 'text-[#113f67]',
      titleColor: 'text-[#0c2340]',
      Icon: Info
    },
    success: {
      container: 'bg-emerald-50 border-slate-300 border-l-[#15803d] text-emerald-950',
      iconColor: 'text-[#15803d]',
      titleColor: 'text-emerald-900',
      Icon: CheckCircle2
    },
    warning: {
      container: 'bg-amber-50 border-slate-300 border-l-[#b45309] text-amber-950',
      iconColor: 'text-[#b45309]',
      titleColor: 'text-amber-900',
      Icon: AlertTriangle
    },
    error: {
      container: 'bg-red-50 border-slate-300 border-l-[#b91c1c] text-red-950',
      iconColor: 'text-[#b91c1c]',
      titleColor: 'text-red-900',
      Icon: XCircle
    }
  };

  const current = configs[variant] || configs.info;
  const { Icon } = current;

  return (
    <div
      role="alert"
      className={`border border-l-4 p-4 rounded-r text-xs sm:text-sm flex items-start justify-between gap-3 ${current.container} ${className}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${current.iconColor}`} />
        <div className="space-y-1 flex-1">
          {title && (
            <h4 className={`font-bold text-sm tracking-tight leading-snug ${current.titleColor}`}>
              {title}
            </h4>
          )}
          <div className="leading-relaxed text-slate-700">{children}</div>
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-500 hover:text-slate-800 p-1 rounded transition cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
