import React, { useState } from 'react';
import { AlertCircle, RotateCcw, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { Button } from './Button';
import { APP_CONFIG } from '../../utils/constants';

/**
 * Official Government Error State Component
 */
export const ErrorState = ({
  title = 'तकनीकी त्रुटि / System Communication Error',
  message = 'Unable to complete your request due to a server or network failure. Please try again or contact the MoTA helpdesk.',
  errorDetails,
  onRetry,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`p-6 sm:p-8 bg-red-50/50 border border-red-200 border-l-4 border-l-[#b91c1c] rounded ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-100 border border-red-200 rounded text-[#b91c1c] shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-base font-bold text-red-950 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onRetry && (
              <Button
                variant="danger"
                size="sm"
                onClick={onRetry}
                leftIcon={RotateCcw}
              >
                Try Again
              </Button>
            )}
            
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <LifeBuoy className="w-3.5 h-3.5 text-slate-500" />
              Toll Free: <strong>{APP_CONFIG.HELPLINE}</strong>
            </span>

            {errorDetails && (
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 ml-auto cursor-pointer underline"
              >
                {showDetails ? 'Hide technical logs' : 'Show technical logs'}
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {errorDetails && showDetails && (
            <div className="mt-3 p-3 bg-white border border-red-200 rounded text-[11px] font-mono text-red-900 overflow-x-auto max-h-36">
              {typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
