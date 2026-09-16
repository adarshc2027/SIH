import React, { forwardRef } from 'react';

/**
 * Official Government Form Input Component
 */
export const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || name || `gov-input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          {label}
          {required && <span className="text-red-600 ml-1" title="Required field">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-hidden focus:border-[#0c2340] focus:ring-1 focus:ring-[#0c2340] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            LeftIcon ? 'pl-9' : ''
          } ${RightIcon ? 'pr-9' : ''} ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 text-slate-400 pointer-events-none">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
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

Input.displayName = 'Input';
export default Input;
