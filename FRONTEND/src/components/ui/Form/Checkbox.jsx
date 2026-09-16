import React, { forwardRef } from 'react';

/**
 * Official Government Form Checkbox Component
 */
export const Checkbox = forwardRef(({
  label,
  description,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  required = false,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || name || `gov-checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0c2340] focus:ring-[#0c2340] cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <div className="text-xs">
          <label
            htmlFor={checkboxId}
            className="font-medium text-slate-800 cursor-pointer select-none"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 ml-6">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
