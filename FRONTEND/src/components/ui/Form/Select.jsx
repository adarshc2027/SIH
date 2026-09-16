import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Official Government Form Select Component
 */
export const Select = forwardRef(({
  label,
  name,
  options = [],
  placeholder = '-- Select an Option --',
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || name || `gov-select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          {label}
          {required && <span className="text-red-600 ml-1" title="Required field">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full appearance-none rounded border bg-white px-3 py-2 pr-9 text-sm text-slate-900 transition-colors focus:outline-hidden focus:border-[#0c2340] focus:ring-1 focus:ring-[#0c2340] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => {
                const optValue = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={optValue} value={optValue}>
                    {optLabel}
                  </option>
                );
              })
            : children}
        </select>

        <div className="absolute right-3 text-slate-500 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 leading-tight">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-slate-500 leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
